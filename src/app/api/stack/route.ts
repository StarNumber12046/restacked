import type { Option } from "~/components/ui/multiselect"
import { createStack } from "~/server/query"
export const dynamic = 'force-dynamic' // defaults to auto

interface Stack {
    name: string
    components: Option[]
    tags: Option[]
    ownerId: string,
    initializer?: string
}

export async function PUT(request: Request) {
    console.log("PUT")
    const res: Stack = await request.json() as Stack
    await createStack(res.name, res.components, res.tags, res.ownerId, res.initializer)
    return new Response("OK", { status: 200 })
}