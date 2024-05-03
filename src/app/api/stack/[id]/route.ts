import { auth } from "@clerk/nextjs/server";
import type Request from "next/server";
import { getStack, updateStack } from "~/server/query";
import type { Option } from "~/components/ui/multiselect";

interface Stack {
  name: string;
  components: Option[];
  tags: Option[];
  ownerId: string;
  initializer?: string;
}
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!request.body) {
    return new Response("No body", { status: 400 });
  }

  const fields = ["name", "components", "tags", "ownerId", "initializer"];
  const res: Stack = (await request.json()) as Stack;
  for (const field of fields) {
    if (!(field in res)) {
      return new Response(`Missing field ${field}`, { status: 400 });
    }
  }
  const originalStack = await getStack(params.id);
  if (originalStack.ownerId !== auth().userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await updateStack(
    params.id,
    res.name,
    res.components,
    res.tags,
    res.ownerId,
    res.initializer,
  );
  return new Response("OK", { status: 200 });
}
