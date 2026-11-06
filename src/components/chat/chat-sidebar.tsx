import React from "react"
import { cn } from "cn"

interface ChatSidebarProps {
  className?: string
}

function ChatSidebar({ className }: ChatSidebarProps) {
  return (
    <aside className={cn("h-full w-full min-w-0 border rounded-xl", className)}>
      Sidebar
    </aside>
  )
}

export default ChatSidebar