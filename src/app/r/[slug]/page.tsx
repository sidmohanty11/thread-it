import MiniCreatePost from "@/components/post/MiniCreatePost"
import { getAuthSession } from "@/lib/auth"
import { INFINITE_SCROLLING_PAGE_SIZE } from "@/lib/config"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

const CommunityPage = async ({ params }: PageProps) => {
  const { slug } = params
  const session = await getAuthSession()

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          comments: true,
          votes: true,
          subreddit: true,
        }
      },
    },
    take: INFINITE_SCROLLING_PAGE_SIZE,
  })

  if (!subreddit) {
    return notFound()
  }

  return (
    <div>
      <h1 className="font-bold text-3xl md:text=4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
    </div>
  )
}

export default CommunityPage
