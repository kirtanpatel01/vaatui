import { cn } from "cn"
import ChatSidebar from "./sidebar/chat-sidebar"
import ChatMain from "./chat-main"
import ChatDetails from "./chat-details"
import { useChat } from "./chat-provider"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface ChatLayoutProps {
  className?: string
}

function ChatLayout({ className }: ChatLayoutProps) {
  const { chatDetailsOpen, setActiveContact } = useChat()

  return (
    <div className={cn("flex h-full min-h-0 w-full", className)}>
      <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
        <ResizablePanel
          defaultSize="20%"
          minSize="12%"
          maxSize="35%"
          className="min-h-0 min-w-0"
        >
          <ChatSidebar onSelectContact={setActiveContact} />
        </ResizablePanel>

        <ResizableHandle className="relative z-10 -mx-1 w-2 cursor-col-resize bg-transparent after:hidden hover:bg-transparent focus-visible:ring-0 focus-visible:outline-hidden" />

        <ResizablePanel defaultSize="80%" className="min-h-0 min-w-0">
          <div className="flex h-full min-h-0 w-full min-w-0 gap-3 pl-3">
            <div className="min-h-0 min-w-0 flex-1">
              <ChatMain />
            </div>

            {chatDetailsOpen && (
              <div className="min-h-0 w-[320px] 2xl:w-[350px] shrink-0">
                <ChatDetails />
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default ChatLayout
