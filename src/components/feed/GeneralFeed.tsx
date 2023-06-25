import { INFINITE_SCROLLING_PAGE_SIZE } from "@/lib/config"
import { db } from "@/lib/db"
import PostFeed from "../post/PostFeed"

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGE_SIZE
  })
  return (
    <PostFeed initialPosts={posts} />
  )
}

export default GeneralFeed
