import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostComment from "../post/PostComment";
import CreateComment from "./CreateComment";

const CommentsSection = async ({
  postId
}: {
  postId: string
}) => {
  const session = await getAuthSession()

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true
        }
      }
    }
  })

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />
      <CreateComment postId={postId} />
      <div className="flex flex-col gap-y-6 mt-4">
        {comments.filter(comment => !comment.replyToId).map(topLevelComment => {
          const topLevelCmtVotesAmt = topLevelComment.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1
            if (vote.type === "DOWN") return acc - 1
            return acc
          }, 0)
          const topLevelCmtVote = topLevelComment.votes.find(vote => vote.userId === session?.user?.id) ?? null

          return <div key={topLevelComment.id} className="flex flex-col">
            <div className="mb-2">
              <PostComment
                postId={postId}
                comment={topLevelComment}
                votesAmt={topLevelCmtVotesAmt}
                currentVote={topLevelCmtVote}
              />
            </div>

            {topLevelComment.replies.sort((a, b) => {
              return b.votes.length - a.votes.length
            }).map(reply => {
              const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1
                if (vote.type === "DOWN") return acc - 1
                return acc
              }, 0)
              const replyVote = reply.votes.find(vote => vote.userId === session?.user?.id) ?? null

              return <div key={reply.id} className="ml-2 py-2 pl-4 border-l-2 border-zinc-200">
                <PostComment
                  postId={postId}
                  comment={reply}
                  votesAmt={replyVotesAmt}
                  currentVote={replyVote}
                />
              </div>
            })}
          </div>
        })}
      </div>
    </div>
  )
}

export default CommentsSection;
