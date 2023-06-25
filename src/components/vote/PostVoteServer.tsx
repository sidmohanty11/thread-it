import { getAuthSession } from "@/lib/auth"
import { VoteType, Vote, Post } from "@prisma/client"
import { notFound } from "next/navigation"
import PostVoteClient from "./PostVoteClient"

interface PostVoteServerProps {
  postId: string
  initialVote?: VoteType | null
  initialVotesAmt?: number
  getData: () => Promise<(Post & {
    votes: Vote[] | null
  })>
}

const PostVoteServer = async ({
  postId,
  initialVote,
  initialVotesAmt,
  getData
}: PostVoteServerProps) => {
  const session = await getAuthSession()

  let _votesAmt: number = 0
  let _currentVote: VoteType | null | undefined = undefined

  if (getData) {
    const post = await getData()
    if (!post) return notFound()

    _votesAmt = post.votes?.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1
      if (vote.type === "DOWN") return acc - 1
      return acc
    }, 0) || 0

    _currentVote = post.votes?.find(vote => vote.userId === session?.user.id)?.type
  } else {
    _votesAmt = initialVotesAmt!
    _currentVote = initialVote
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVote={_currentVote}
      initialVotesAmt={_votesAmt}
    />
  )
}

export default PostVoteServer
