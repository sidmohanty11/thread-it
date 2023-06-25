import { Subreddit, Vote, Post, Comment, User } from "@prisma/client"

export type ExtendedPost = Post & {
  subreddit: Subreddit,
  votes: Vote[],
  author: User,
  comments: Comment[],
}
