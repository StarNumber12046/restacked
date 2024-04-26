import Image from "next/image";
import { CopyButton } from "~/components/Buttons";
import { getPublicStacks, getUserAvatar } from "~/server/query";

export default async function DiscoverPage() {
  const publicStacks = await getPublicStacks();
  return (
    <main className="justify-top flex h-[calc(100vh-4rem)] w-screen flex-col items-center gap-2 bg-black text-white">
      <h1 className="mt-4 text-6xl font-bold">Discover</h1>
      <div className="flex flex-row flex-wrap">
        {publicStacks.map(async (stack) => (
          <div
            key={stack.id}
            className="flex min-h-80 w-60 flex-col gap-2 rounded-xl border border-neutral-600 p-4"
          >
            <div className="inline-flex flex-row gap-2">
              
              <Image src={await getUserAvatar(stack.ownerId) || ""} alt="User Avatar" width={32} height={32} style={{ objectFit: "contain" }}/><h1 className="text-3xl font-bold break-words w-40">{stack.name}</h1>

            </div>
            <h2 className="text-xl font-semibold">Tags</h2>
            <div className="flex flex-wrap gap-1">
              {stack.tags.map((tag) => (
                <div
                  className="rounded-full bg-white px-2 text-black"
                  key={tag.name}
                >
                  {tag.name}
                </div>
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
                <code className="relative flex rounded bg-neutral-900 px-4 py-2 text-gray-200 transition hover:bg-neutral-800 flex-row flex-nowrap break-all">
                  {stack.initializer}
                  <CopyButton text={stack.initializer} />
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
      <div></div> {/* To keep spacing below */}
    </main>
  );
}
