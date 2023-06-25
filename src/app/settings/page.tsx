import UserNameForm from "@/components/user/UserNameForm"
import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Settings',
  description: 'Manage account and settings'
}

const SettingsPage = async () => {
  const session = await getAuthSession()

  if (!session?.user) redirect('/sign-in')

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl mb-4">Settings</h1>
      </div>

      <div className="grid grid-gap-10">
        <UserNameForm user={{
          id: session.user.id,
          username: session.user.username || "",
        }} />
      </div>
    </div>
  )
}

export default SettingsPage
