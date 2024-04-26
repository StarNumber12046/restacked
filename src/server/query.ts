import "server-only"
import { db } from "./db"
import type { Stack } from "@prisma/client"
import { clerkClient } from "@clerk/nextjs/server"

type StackWithComponents = Stack & { components: { id: string, name: string, icon: string }[] } & { tags: { name: string, id: string }[] }

export async function getPublicStacks() {
    const items: Stack[] = await db.stack.findMany({
        where: {
            visiblity: "PUBLIC",
        },
        include: {
            components: true,
            tags:       true,
        }
    })

    return items as unknown as StackWithComponents[]
}

export async function getUserAvatar(userId:string) {

    const user = await clerkClient.users.getUser(userId)
    return user.imageUrl
}