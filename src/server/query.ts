"use server";
import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { db } from "./db";
import type { Stack, Vote } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Option } from "~/components/ui/multiselect";
import type { VoteType } from "@prisma/client";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export type StackWithComponents = Stack & {
  components: { id: string; name: string; icon: string, description: string }[];
} & { tags: { name: string; id: string }[] } & { votes: Vote[] };

export async function getPublicStacks() {
  const { userId } = auth();
  const { success } = await ratelimit.limit("getPublicStacks-"+userId);
  if (!success) {
    throw new Error("Too many requests");
  }
  const items: Stack[] = await db.stack.findMany({
    where: {
      visiblity: "PUBLIC",
    },
    include: {
      components: true,
      tags: true,
      votes: true,
    },
  });

  return items as unknown as StackWithComponents[];
}

export async function getMyStacks() {
  const { userId } = auth();
  const { success } = await ratelimit.limit("getMyStacks-"+userId);
  if (!success) {
    throw new Error("Too many requests");
  }
  const items: Stack[] = await db.stack.findMany({
    where: {
      ownerId: userId ?? "",
    },
    include: {
      components: true,
      tags: true,
    },
  });

  return items as unknown as StackWithComponents[];
}

export async function getUserAvatar(userId: string) {
  const user = await clerkClient.users.getUser(userId);
  return user.imageUrl;
}

export async function getComponents() {
  
  const components = await db.component.findMany();
  return components;
}

export async function getTags() {
  
  const tags = await db.tag.findMany();
  return tags;
}

export async function createStack(
  name: string,
  components: Option[],
  tags: Option[],
  ownerId: string,
  initializer?: string,
) {
  const { userId } = auth();
  const { success } = await ratelimit.limit("createStack-"+userId);
  if (!success) {
    throw new Error("Too many requests");
  }
  const existing_tags_data = await db.tag.findMany({
    where: {
      id: {
        in: tags.map((tag) => Number(tag.value)).filter((tag) => !isNaN(tag)),
      },
    },
  });

  const tag_names = tags.map((tag) => tag.label);
  const existing_tags = existing_tags_data.map((tag) => tag.id);
  const new_tags = tags.filter(
    (tag) => !existing_tags.includes(Number(tag.value)),
  );

  await db.tag.createMany({
    data: new_tags.map((tag) => ({ name: tag.label })),
  });
  const actual_tags = (await db.tag.findMany()).filter((tag) =>
    tag_names.includes(tag.name),
  );

  await db.stack.create({
    data: {
      name: name,
      initializer: initializer,
      ownerId: ownerId,
      visiblity: "PUBLIC",
      components: {
        connect: components.map((component) => ({
          id: Number(component.value),
        })),
      },
      tags: {
        connect: actual_tags.map((tag) => ({ id: tag.id })),
      },
    },
  });
}

export async function deleteStack(id: number) {
  const { userId } = auth();
  const { success } = await ratelimit.limit("deleteStack-"+userId);
  if (!success) {
    throw new Error("Too many requests");
  }
  const stack = await db.stack.findUnique({
    where: {
      id: id,
    },
  })

  if (stack?.ownerId !== userId) {
    throw new Error("Not authorized");
  }
  await db.stack.delete({
    where: {
      id: id,
    },
  });
}

export async function getStack(id: string) {
  const stack = await db.stack.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      components: true,
      tags: true,
    },
  });
  return stack as unknown as StackWithComponents;
}

export async function updateStack(
  id: string,
  name: string,
  components: Option[],
  tags: Option[],
  ownerId: string,
  initializer?: string,
) {
  const { userId } = auth();
  if (!userId) {
    return "Unauthorized"
  }
  const { success } = await ratelimit.limit("updateStack-"+userId);
  if (!success) {
    throw new Error("Too many requests");
  }
  const existing_tags_data = await db.tag.findMany({
    where: {
      id: {
        in: tags.map((tag) => Number(tag.value)).filter((tag) => !isNaN(tag)),
      },
    },
  });

  const tag_names = tags.map((tag) => tag.label);
  const existing_tags = existing_tags_data.map((tag) => tag.id);
  const new_tags = tags.filter(
    (tag) => !existing_tags.includes(Number(tag.value)),
  );

  await db.tag.createMany({
    data: new_tags.map((tag) => ({ name: tag.label })),
  });
  const actual_tags = (await db.tag.findMany()).filter((tag) =>
    tag_names.includes(tag.name),
  );

  await db.stack.update({
    where: {
      id: Number(id),
      ownerId: userId ?? "",
    },
    data: {
      name: name,
      initializer: initializer,
      ownerId: ownerId,
      visiblity: "PUBLIC",
      components: {
        connect: components.map((component) => ({
          id: Number(component.value),
        })),
      },
      tags: {
        connect: actual_tags.map((tag) => ({ id: tag.id })),
      },
    },
  });
}


export async function updateVote(stackId: number, type?: VoteType) {
  const { userId } = auth();
  const { success } = await ratelimit.limit("getMyStacks-"+userId);
  if (!success) {
    throw new Error("Too many requests");
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (!type) {
    await db.vote.deleteMany(
      {
        where: {
            stackId: stackId,
            userId: userId,
          },
      }
    )
    return;
  }
  // Check if the user has already voted on this stack
  const existingVote = await db.vote.findFirst({
    where: {
      stackId: stackId,
      userId: userId,
    },
  });

  if (existingVote) {
    // Update existing vote
    await db.vote.update({
      where: {
        id: existingVote.id,
      },
      data: {
        type: type,
      },
    });
  } else {
    // Create new vote
    await db.vote.create({
      data: {
        type: type,
        userId: userId,
        stackId: stackId,
      },
    });
  }
}
