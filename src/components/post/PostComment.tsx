'use client'

import { useRef, FC, useState } from "react";
import UserAvatar from "../user/UserAvatar";
import { CommentVote, User, Comment } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "../vote/CommentVotes";
import { MessageSquare } from "lucide-react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesAmt,
  currentVote,
  postId
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const router = useRouter()
  const { data: session } = useSession();

  const { mutate: reply, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId
      }

      const { data } = await axios.patch('/api/subreddit/post/comment', payload)
      return data
    },
    onError: (err) => {
      return toast({
        title: 'Something went wrong',
        description: "Comment wasn't posted successfully",
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      router.refresh()
      setIsReplying(false)
      setInput('')
    }
  })

  return (
    <div className="flex flex-col" ref={commentRef}>
      <div className="flex items-center">
        <UserAvatar user={{
          name: comment.author.name,
          image: comment.author.image,
        }} className="h-6 w-6" />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <time className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </time>
        </div>
      </div>

      <p className="text-sm text-gray-900 mt-2">
        {comment.text}
      </p>

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes commentId={comment.id} initialVotesAmt={votesAmt} initialVote={currentVote} />

        <Button onClick={() => {
          if (!session) return router.push('/sign-in')
          setIsReplying(true)
        }} variant="ghost" size="xs">
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>
        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment" className="text-sm font-medium text-gray-700">
              Your comment
            </Label>

            <Textarea id="comment" value={input} rows={1} placeholder='What are your thoughts?' onChange={(e) => {
              setInput(e.target.value)
            }} />
            <div className='mt-2 flex justify-end'>
              <Button tabIndex={-1} variant={'subtle'} className="mr-2" onClick={() => setIsReplying(false)}>Cancel</Button>
              <Button isLoading={isLoading} disabled={input.length === 0} onClick={() => {
                if (!input) return
                reply({
                  postId,
                  text: input,
                  replyToId: comment.replyToId ?? comment.id
                })
              }}>Post</Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default PostComment;
