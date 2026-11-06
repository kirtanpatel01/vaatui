import React from "react"
import { cn } from "cn"

interface ChatMainProps {
  className?: string
}

function ChatMain({ className }: ChatMainProps) {
  return (
    <main className={cn("h-full w-full min-w-0 border rounded-xl", className)}>
      Main
    </main>
  )
}

export default ChatMain