import { createFileRoute } from "@tanstack/react-router"
import ChatLayout from "@/components/chat/chat-layout"
import ChatProvider from "@/components/chat/chat-provider"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh p-4">
      <ChatProvider>
        <ChatLayout />
      </ChatProvider>
    </div>
  )
}
