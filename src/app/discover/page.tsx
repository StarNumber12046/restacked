import { VoteBox } from "~/components/Vote";
import {
  Initializer,
  StackComponents,
  StackHeader,
  Tags,
} from "../../components/StackCard";
import { Card, CardContent } from "~/components/ui/card";
import { getPublicStacks } from "~/server/query";
import React, { Suspense } from "react";
import { PlaceholderStacks } from "~/components/Stack";


async function Stacks({}) {

  const publicStacks = await getPublicStacks();
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {publicStacks.map(async (stack) => (
        <Card key={stack.id} className="flex w-64 flex-grow flex-col">
          <StackHeader stack={stack} />
          <CardContent className="flex flex-1 flex-grow flex-col justify-between">
            <div>
              <Tags stack={stack} />
              <h2 className="text-xl font-semibold">Components</h2>
              <StackComponents stack={stack} />
            </div>
            <div />
            <div className="">
              <Initializer stack={stack} />
              <VoteBox stack={stack} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



export default async function DiscoverPage() {
  return (
    <main className="justify-top flex h-[calc(100vh-4rem)] w-screen flex-col items-center gap-2 bg-background text-white">
      <h1 className="mt-4 text-4xl font-bold">Discover</h1>
      <Suspense fallback={<PlaceholderStacks />}>
        <Stacks />
      </Suspense>
      <div></div> {/* To keep spacing below */}
    </main>
  );
}
