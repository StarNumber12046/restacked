"use client"

import { useAuth, useClerk } from "@clerk/nextjs"
import { VoteType, type Stack } from "@prisma/client"
import { ArrowBigUpIcon, ArrowBigDownIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
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

function doUpdateVotes(id: number, upvoted: boolean, downvoted: boolean, callback: () => void, setInProcess: (value: boolean) => void) {
    if (upvoted && downvoted) {
        return new Error("Can't upote and downvote at the same time")
    }
    setInProcess(true)
    console.log("Set to true")
    fetch(`/api/stack/${id}/vote`, {
        method: "POST",
        body: JSON.stringify({ upvoted, downvoted }),
    }).then((res) => {
        if (res.ok) {
            callback()
        }
        else {
            if (res.status == 429) {
                toast.error("🚧 Too many requests! Slow down", {closeButton:true, duration:2000})
            }
        }
        setInProcess(false)
    }).catch((error) => {console.error(error); setInProcess(false)})
}

export function VoteBox({ stack }: { stack: StackWithComponents }) {
    const [inProcess, setInProcess] = useState(false)
    const auth = useAuth();
    const clerk = useClerk();
    const upvotes = stack.votes.filter((value) => {return value.type == VoteType.UPVOTE})
    const downvotes = stack.votes.filter((value) => {return value.type == VoteType.DOWNVOTE})
    const [upvoted, setUpvoted] = useState(upvotes.filter((value) => {return value.userId == auth.userId}).length > 0)
    const [downvoted, setDownvoted] = useState(downvotes.filter((value) => {return value.userId == auth.userId}).length > 0)
    const [votes, setVotes] = useState(upvotes.length-downvotes.length)
    const handleUpvote = () => {
        if (!auth.isSignedIn) {
            clerk.openSignIn();
        }
        if (upvoted) {
            setUpvoted(false)
            doUpdateVotes(stack.id, false, false, () => setVotes(votes - 1), setInProcess)
        } else if (downvoted) {
            setUpvoted(true)
            setDownvoted(false)
            doUpdateVotes(stack.id, true, false, () => setVotes(votes + 2), setInProcess)
        }
        else {
            setUpvoted(true)
            doUpdateVotes(stack.id, true, false, () => setVotes(votes + 1), setInProcess)
        }
    }

    const handleDownvote = () => {
        if (!auth.isSignedIn) {
            clerk.openSignIn();
        }
        if (downvoted) {
            setDownvoted(false)
            doUpdateVotes(stack.id, false, false, () => setVotes(votes + 1), setInProcess)
        } else if (upvoted) {
            setDownvoted(true)
            setUpvoted(false)
            doUpdateVotes(stack.id, false, true, () => setVotes(votes - 2), setInProcess)
        }
        else {
            setDownvoted(true)
            doUpdateVotes(stack.id, false, true, () => setVotes(votes - 1), setInProcess)
        }
    }

    return (
        <div className="rounded-full flex flex-row px-2 py-1 border border-border mt-2 items-center w-min gap-2">
            <UpvoteButton className={upvoted ? "fill-white" : "" + inProcess ? " hover:cursor-not-allowed, setInProcess" : ""} onClick={handleUpvote} />
            <span className="text-lg ">{votes}</span>
            <DownvoteButton className={downvoted ? "fill-white" : ""} onClick={handleDownvote} />
        </div>
    )
}