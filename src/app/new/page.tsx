import { auth } from "@clerk/nextjs/server";
import { getComponents, getTags } from "~/server/query";
import { RedirectToSignIn } from "@clerk/nextjs";
import CreateForm from "./_components/form";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return <RedirectToSignIn />;
  } 
  
  const components = (await getComponents()).map(component => ({ value: String(component.id), label: component.name }));
  const tags = (await getTags()).map(tag => ({ value: String(tag.id), label: tag.name }));
  
  return (
    <main className="flex h-[calc(100vh-4rem)] w-screen flex-col items-center justify-center bg-background text-white">
      <h1 className="mb-4 text-4xl font-semibold">Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-sky-400 to-violet-500"> new stack</span></h1>
        <CreateForm components={components} tags={tags} />
    </main>
  );
}
