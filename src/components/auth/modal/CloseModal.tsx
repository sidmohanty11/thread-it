'use client'
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

const CloseModalButton = () => {
  const navigation = useRouter()
  return (
    <Button
      aria-label="Close modal"
      variant={'subtle'}
      className="h-6 w-6 text-zinc-900 hover:text-zinc-800"
      onClick={() => navigation.back()}
    >
      X
    </Button>
  )
}

export default CloseModalButton
