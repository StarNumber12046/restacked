"use client"

import { useAuth } from "@clerk/nextjs"
import { VoteType, type Stack } from "@prisma/client"
import { ArrowBigUpIcon, ArrowBigDownIcon } from "lucide-react"
import { useState } from "react"
import { StackWithComponents } from "~/server/query"

function UpvoteButton({ className, onClick }: { className?: string, onClick: () => void }) {
    return (
        <ArrowBigUpIcon className={"hover:cursor-pointer " + className} onClick={onClick} />
    )
}

function DownvoteButton({ className, onClick }: { className?: string, onClick: () => void }) {
    return (
        <ArrowBigDownIcon className={"hover:cursor-pointer " + className} onClick={onClick} />
    )
}

export function VoteBox({ stack }: { stack: StackWithComponents }) {
    const auth = useAuth();
    const upvotes = stack.votes.filter((value) => {return value.type == VoteType.UPVOTE})
    const downvotes = stack.votes.filter((value) => {return value.type == VoteType.DOWNVOTE})
    const [upvoted, setUpvoted] = useState(upvotes.filter((value) => {return value.userId == auth.userId}).length > 0)
    const [downvoted, setDownvoted] = useState(downvotes.filter((value) => {return value.userId == auth.userId}).length > 0)
    const [votes, setVotes] = useState(upvotes.length-downvotes.length)
    const handleUpvote = () => {
        
        if (upvoted) {
            setUpvoted(false)
            fetch(`/api/stack/${stack.id}/vote`, {
                method: "POST",
                body: JSON.stringify({ downvoted: false, upvoted: false }),
            }).then(() => setVotes(votes - 1)).catch(console.error)
        } else if (downvoted) {
            setUpvoted(true)
            setDownvoted(false)
            fetch(`/api/stack/${stack.id}/vote`, {
                method: "POST",
                body: JSON.stringify({ downvoted: false, upvoted: true }),
            }).then(() => setVotes(votes + 2)).catch(console.error)
        }
        else {
            setUpvoted(true)
            fetch(`/api/stack/${stack.id}/vote`, {
                method: "POST",
                body: JSON.stringify({ downvoted: false, upvoted: true }),
            }).then(() => setVotes(votes + 1)).catch(console.error)
        }
    }

    const handleDownvote = () => {
        if (downvoted) {
            setDownvoted(false)
            fetch(`/api/stack/${stack.id}/vote`, {
                method: "POST",
                body: JSON.stringify({ downvoted: false, upvoted: false }),
            }).then(() => setVotes(votes + 1)).catch(console.error)
        } else if (upvoted) {
            setDownvoted(true)
            setUpvoted(false)
            fetch(`/api/stack/${stack.id}/vote`, {
                method: "POST",
                body: JSON.stringify({ downvoted: true, upvoted: false }),
            }).then(() => setVotes(votes - 2)).catch(console.error)
        }
        else {
            setDownvoted(true)
            fetch(`/api/stack/${stack.id}/vote`, {
                method: "POST",
                body: JSON.stringify({ downvoted: true, upvoted: false }),
            }).then(() => setVotes(votes - 1)).catch(console.error)
        }
    }

    return (
        <div className="rounded-full flex flex-row px-2 py-1 border border-border mt-2 items-center w-min gap-2">
            <UpvoteButton className={upvoted ? "fill-white" : ""} onClick={handleUpvote} />
            <span className="text-lg ">{votes}</span>
            <DownvoteButton className={downvoted ? "fill-white" : ""} onClick={handleDownvote} />
        </div>
    )
}