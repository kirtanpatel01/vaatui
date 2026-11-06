import { cn } from "cn"
import SidebarHeader from "./header/sidebar-header"
import SidebarMain from "./sidebar-main"
import SidebarFooter from "./sidebar-footer"

interface ChatSidebarProps {
  className?: string
}

function ChatSidebar({ className }: ChatSidebarProps) {
  return (
    <aside className={cn("h-full w-full min-w-0 rounded-xl border", className)}>
      <SidebarHeader />
      <SidebarMain />
      <SidebarFooter />
    </aside>
  )
}

export default ChatSidebar
