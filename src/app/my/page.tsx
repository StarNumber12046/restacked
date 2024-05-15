import { getMyStacks, getUserAvatar } from "~/server/query";
import Image from "next/image";
import { CopyButton } from "~/components/Buttons";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { Earth, Lock } from "lucide-react";
import { Visibility } from "@prisma/client";
import { DeleteButton, EditButton } from "~/components/Delete";
import { Initializer, StackComponents, Tags } from "~/components/StackCard";

export default async function Page() {
  const { userId } = auth();
  const stacks = await getMyStacks(userId?.toString() ?? "");
  return (
    <main className="justify-top flex h-[calc(100vh-4rem)] w-screen flex-col items-center gap-2 bg-background text-white">
      <h1 className="mt-4 text-4xl font-bold">Your stacks</h1>
      <div className="flex flex-row flex-wrap gap-4">
        {stacks.map(async (stack) => (
          <Card key={stack.id} className="group w-64">
            <div className="opacity-0 transition-opacity duration-250 ease-in-out relative mr-2 mt-2 flex flex-row justify-end gap-2 justify-self-end group-hover:opacity-100">
                <div className="fixed inline-flex gap-2">

              <EditButton stackId={stack.id} />
              <DeleteButton stackId={stack.id} />
                </div>
            </div>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <div>
                  {stack.visiblity == Visibility.PUBLIC ? <Earth /> : <Lock />}
                </div>
                <span className="w-40 break-words text-3xl font-bold">
                  {stack.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tags stack={stack} />
              <h2 className="text-xl font-semibold">Components</h2>
              <div className="flex flex-wrap gap-2">
                <StackComponents stack={stack} />
              </div>
              {stack.initializer && (
                <div className="my-2">
                  <Initializer stack={stack} />
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
