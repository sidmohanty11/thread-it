import { getAuthSession } from "@/lib/auth"
import Link from "next/link"
import { Icons } from "../icons/Icons"
import { buttonVariants } from "../ui/Button"
import UserAccountNav from "../user/UserAccountNav"
import SearchBar from "../search/SearchBar"

const Navbar = async () => {
  const session = await getAuthSession()
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="w-8 h-8 text-zinc-700" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Thread_It.
          </p>
        </Link>
        <SearchBar />
        {session?.user ?
          <UserAccountNav user={session.user} />
          :
          <Link href={'/sign-in'} className={buttonVariants()}>
            Sign In
          </Link>
        }
      </div>
    </div>
  )
}

export default Navbar
