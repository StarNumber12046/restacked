import { Badge } from "~/components/ui/badge";
import { CardHeader, CardTitle } from "~/components/ui/card";
import { type StackWithComponents, getUserAvatar } from "~/server/query";
import Image from "next/image";
import { CopyButton } from "~/components/Buttons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

export async function StackHeader({ stack }: { stack: StackWithComponents }) {
  return (
    <CardHeader>
      <CardTitle className="inline-flex gap-2">
        <Image
          src={(await getUserAvatar(stack.ownerId)) || ""}
          alt="User Avatar"
          width={32}
          height={32}
          style={{ objectFit: "contain" }}
        />
        <span className="w-40 break-words text-3xl font-bold">
          {stack.name}
        </span>
      </CardTitle>
    </CardHeader>
  );
}

export function Tags({ stack }: { stack: StackWithComponents }) {
  console.log(stack.tags);
  return (
    <>
      <h2 className="text-xl font-semibold">Tags</h2>
      <div className="flex flex-wrap gap-1">
        {stack.tags.map((tag) => (
          <Badge key={tag.id}>{tag.name}</Badge>
        ))}
      </div>
    </>
  );
}

export function StackComponents({ stack }: { stack: StackWithComponents }) {
  return (
    <div className="flex flex-grow flex-wrap gap-2 items-center">
      {stack.components.map((component) => (
        <HoverCard key={component.id} >
          <HoverCardTrigger>
            <Image
              key={component.id}
              src={component.icon}
              alt={component.name}
              className="hover:cursor-pointer hover:opacity-75"
              width={32}
              height={32}
              style={{
                objectFit: "contain",
              }}
            />
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-lg font-semibold">{component.name}</p>
            <p className="text-sm">{component.description}</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}

export function Initializer({ stack }: { stack: StackWithComponents }) {
  if (!stack.initializer) return null;
  return (
    <div className="my-2 mb-auto justify-self-end">
      <code className="relative flex flex-row flex-nowrap break-all rounded bg-neutral-900 px-4 py-2 text-gray-200 transition hover:bg-neutral-800">
        {stack.initializer}
        <CopyButton text={stack.initializer} />
      </code>
    </div>
  );
}
