'use client'

import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/Button"
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit"
import axios, { AxiosError } from "axios"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { startTransition } from "react"
import { useRouter } from "next/navigation"

const SubcribeLeaveToggle = ({
  isSubscribed,
  subredditId,
  subredditName
}: {
  isSubscribed: boolean,
  subredditId: string,
  subredditName: string,
}) => {
  const { loginToast } = useCustomToast()
  const router = useRouter()
  const { mutate: createSubscription, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post('/api/subreddit/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return loginToast()
        return toast({
          title: 'Error',
          description: 'Something went wrong, please try again later',
          variant: 'destructive'
        })
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Success',
        description: 'You have successfully subscribed to r/' + subredditName,
      })
    }
  })
  const { mutate: removeSubscription, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return loginToast()
        return toast({
          title: 'Error',
          description: 'Something went wrong, please try again later',
          variant: 'destructive'
        })
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Success',
        description: 'You have successfully unsubscribed to r/' + subredditName,
      })
    }
  })
  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4" isLoading={isUnsubLoading} onClick={() => removeSubscription()}>Leave Community</Button>
  ) : (
    <Button className="w-full mt-1 mb-4" isLoading={isSubLoading} onClick={() => createSubscription()}>Subcribe</Button>
  )
}

export default SubcribeLeaveToggle
