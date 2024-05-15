import { VoteBox } from "~/components/Vote";
import { Initializer, StackComponents, StackHeader, Tags } from "../../components/StackCard";
import { Card, CardContent } from "~/components/ui/card";
import {
  getPublicStacks,
} from "~/server/query";



export default async function DiscoverPage() {
  const publicStacks = await getPublicStacks();
  return (
    <main className="justify-top flex h-[calc(100vh-4rem)] w-screen flex-col items-center gap-2 bg-background text-white">
      <h1 className="mt-4 text-4xl font-bold">Discover</h1>
      <div className="flex flex-row flex-wrap gap-4">
        {publicStacks.map(async (stack) => (
          <Card key={stack.id} className="w-64 flex-col flex-grow flex">
            <StackHeader stack={stack} />
            <CardContent className="flex flex-1 flex-col justify-between flex-grow">
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
      <div></div> {/* To keep spacing below */}
    </main>
  );
}


