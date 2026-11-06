import React from "react"
import { cn } from "cn"

interface ChatDetailsProps {
  className?: string
}

function ChatDetails({ className }: ChatDetailsProps) {
  return (
    <aside className={cn("h-full w-full min-w-0 border rounded-xl", className)}>
      Details
    </aside>
  )
}

export default ChatDetails