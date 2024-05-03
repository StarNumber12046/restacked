import { auth } from "@clerk/nextjs/server";
import { EditForm } from "~/components/form";
import { getComponents, getStack, getTags } from "~/server/query";

export default async function EditPage({ params }: { params: { id: string } }) {
    const stack = await getStack(params.id);
    const components = (await getComponents()).map(component => ({ value: String(component.id), label: component.name }));
    const tags = (await getTags()).map(tag => ({ value: String(tag.id), label: tag.name }));
    
    if (!stack) {
        return <div>Stack not found</div>;
    }
    if (stack.ownerId !== auth().userId) {
        return <div>Unauthorized</div>;
    }
    return (
        <main className="flex h-[calc(100vh-4rem)] w-screen flex-col items-center justify-center bg-background text-white">
      <h1 className="mb-4 text-4xl font-semibold">Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-sky-400 to-violet-500">{stack.name}</span></h1>
        <EditForm components={components} tags={tags} stack={stack} />
    </main>
    );
}