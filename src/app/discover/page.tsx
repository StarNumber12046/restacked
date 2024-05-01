import Image from "next/image";
import { CopyButton } from "~/components/Buttons";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getPublicStacks, getUserAvatar } from "~/server/query";

export default async function DiscoverPage() {
  const publicStacks = await getPublicStacks();
  return (
    <main className="justify-top flex h-[calc(100vh-4rem)] w-screen flex-col items-center gap-2 bg-background text-white">
      <h1 className="mt-4 text-4xl font-bold">Discover</h1>
      <div className="flex flex-row flex-wrap gap-4">
        {publicStacks.map(async (stack) => (
          <Card key={stack.id} className="w-64">
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
            <CardContent>
              <h2 className="text-xl font-semibold">Tags</h2>
              <div className="flex flex-wrap gap-1">
                {stack.tags.map((tag) => (
                  <Badge
                    key={tag.name}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <h2 className="text-xl font-semibold">Components</h2>
              <div className="flex flex-wrap gap-2">
                {stack.components.map((component) => (
                  <Image
                    key={component.id}
                    src={component.icon}
                    alt={component.name}
                    width={32}
                    height={32}
                    style={{ objectFit: "contain" }}
                  />
                ))}
              </div>
              {stack.initializer && (
                <div className="my-2">
                  <code className="relative flex flex-row flex-nowrap break-all rounded bg-neutral-900 px-4 py-2 text-gray-200 transition hover:bg-neutral-800">
                    {stack.initializer}
                    <CopyButton text={stack.initializer} />
                  </code>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div></div> {/* To keep spacing below */}
    </main>
  );
}
