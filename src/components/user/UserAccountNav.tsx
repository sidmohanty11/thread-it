'use client'
import { FC } from "react";
import { User } from "next-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserAccountNavProps {
  user: Pick<User, 'image' | 'name' | 'email'>;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={{
          image: user.image || null,
          name: user.name || null,
        }}
          className="w-8 h-8"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <span className="text-sm font-semibold">{user.name}</span>}
            {user.email && <span className="text-xs text-gray-500 truncate">{user.email}</span>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/'}>Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={'/r/create'}>Create community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={'/settings'}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => {
          e.preventDefault();
          signOut({
            callbackUrl: `${window.location.origin}/sign-in`
          });
        }} className="cursor-pointer">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav;
