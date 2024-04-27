"use server";
import "server-only";
import { db } from "./db";
import type { Stack } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import type { Option } from "~/components/ui/multiselect";

type StackWithComponents = Stack & {
  components: { id: string; name: string; icon: string }[];
} & { tags: { name: string; id: string }[] };

export async function getPublicStacks() {
  const items: Stack[] = await db.stack.findMany({
    where: {
      visiblity: "PUBLIC",
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
