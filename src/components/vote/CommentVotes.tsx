'use client'

import { FC, useState } from "react"
import { CommentVote, VoteType } from "@prisma/client"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { usePrevious } from "@mantine/hooks"
import { cn } from "@/lib/utils"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import { Button } from "../ui/Button"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { CommentVoteRequest } from "@/lib/validators/vote"


interface CommentVoteClientProps {
  commentId: string,
  initialVote?: Pick<CommentVote, 'type'>
  initialVotesAmt: number
}

const CommentVotes: FC<CommentVoteClientProps> = ({
  commentId,
  initialVote,
  initialVotesAmt
}) => {
  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        voteType: type,
        commentId: commentId,
      }

      await axios.patch('/api/subreddit/post/comment/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev + 1)

      // reset current vote
      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: 'Your vote was not registered. Please try again.',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote({ type })
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN')
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className='flex gap-1'>
      <Button
        onClick={() => vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
          })}
        />
      </Button>

      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesAmt}
      </p>

      <Button
        onClick={() => vote('DOWN')}
        size='sm'
        className={cn({
          'text-emerald-500': currentVote?.type === 'DOWN',
        })}
        variant='ghost'
        aria-label='downvote'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}

export default CommentVotes
