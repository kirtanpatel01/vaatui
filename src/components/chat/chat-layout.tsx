import { cn } from "cn"
import ChatSidebar from "./chat-sidebar"
import ChatMain from "./chat-main"
import ChatDetails from "./chat-details"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface ChatLayoutProps {
  className?: string
}

function ChatLayout({ className }: ChatLayoutProps) {
  return (
    <div className={cn("flex w-full h-full min-h-0", className)}>
      <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
        <ResizablePanel
          defaultSize="20%"
          minSize="12%"
          maxSize="35%"
          className="min-w-0 min-h-0"
        >
          <ChatSidebar />
        </ResizablePanel>

        <ResizableHandle className="relative z-10 w-2 -mx-1 cursor-col-resize bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:outline-hidden after:hidden" />

        <ResizablePanel defaultSize="80%" className="min-w-0 min-h-0">
          <div className="flex h-full w-full min-w-0 min-h-0 gap-3 pl-3">
            <div className="flex-1 min-w-0 min-h-0">
              <ChatMain />
            </div>

            <div className="w-[280px] shrink-0 min-h-0">
              <ChatDetails />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default ChatLayout
