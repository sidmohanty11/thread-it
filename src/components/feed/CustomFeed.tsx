import { INFINITE_SCROLLING_PAGE_SIZE } from "@/lib/config"
import { db } from "@/lib/db"
import PostFeed from "../post/PostFeed"
import { getAuthSession } from "@/lib/auth"

const CustomFeed = async () => {
  const session = await getAuthSession()

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user?.id
    },
    include: {
      subreddit: true
    }
  })
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map(({ subreddit }) => subreddit.id)
        }
      }
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

export default CustomFeed
