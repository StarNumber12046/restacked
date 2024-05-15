import { VoteType } from '@prisma/client';
import { updateVote } from '~/server/query'; // Assuming the path is correct

function parseBody(body: Uint8Array) {
    console.log(new TextDecoder().decode(body));
    return new TextDecoder().decode(body);
    
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } },
) {
    const res: { upvoted?: boolean, downvoted?: boolean } = await request.json() as { upvoted?: boolean, downvoted?: boolean };
    console.log(res)
    console.log("Hi!")
    // Check if upvoted or downvoted is specified
    if (res.hasOwnProperty("upvoted") || res.hasOwnProperty("downvoted")) {
        // Update votes based on upvote or downvote
        let voteAction: VoteType | undefined;
        if (res.upvoted) {
            voteAction = VoteType.UPVOTE;
        } else if (res.downvoted) {
            voteAction = VoteType.DOWNVOTE;
        }
        // Call updateVote function to handle vote update
        await updateVote(Number(params.id), voteAction);
        
        // Respond with the vote change
        return new Response(`${voteAction === VoteType.UPVOTE ? 1 : -1}`, { status: 200 });
    } else {
        // Remove votes if neither upvoted nor downvoted is specified
        await updateVote(Number(params.id), undefined); // Assuming NEUTRAL means removing votes
        
        // Respond with 0 as votes removed
        return new Response("0", { status: 200 });
    }
}
