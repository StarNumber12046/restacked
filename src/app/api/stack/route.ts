import type { Option } from "~/components/ui/multiselect";
import { db } from "~/server/db";
import { createStack, deleteStack } from "~/server/query";
export const dynamic = "force-dynamic"; // defaults to auto

interface Stack {
  name: string;
  components: Option[];
  tags: Option[];
  ownerId: string;
  initializer?: string;
}

interface DeleteRequestBody {
  id: number;
}

export async function PUT(request: Request) {
  console.log("PUT");
  let res: Stack;
  try {
      res = (await request.json()) as Stack;
  }
  catch (e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const fields = ["name", "components", "tags", "ownerId", "initializer"];
  for (const field of fields) {
    if (!(field in res)) {
      return new Response(`Missing field ${field}`, { status: 400 });
    }
  }

  await createStack(
    res.name,
    res.components,
    res.tags,
    res.ownerId,
    res.initializer,
  );
  return new Response("OK", { status: 200 });
}

export async function DELETE(request: Request) {
  if (!request.body) {
    return new Response("No body", { status: 400 });
  }

  const fields = ["id"];
  try {
    const res: DeleteRequestBody = (await request.json()) as DeleteRequestBody;
    for (const field of fields) {
      if (!(field in res)) {
        return new Response(`Missing field ${field}`, { status: 400 });
      }
    }
    try {
      await deleteStack(res.id);
      return new Response("OK", { status: 200 });
    } catch (e: unknown) {
      return new Response("Error", { status: 400 });
    }
  } catch (e) {
    return new Response("Invalid body", { status: 400 });
  }
}
