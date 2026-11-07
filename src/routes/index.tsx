import { createFileRoute } from "@tanstack/react-router"
import ChatLayout from "@/components/chat/chat-layout"
import ChatProvider from "@/components/chat/chat-provider"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex h-svh w-screen overflow-hidden p-4">
      <ChatProvider className="h-full">
        <ChatLayout />
      </ChatProvider>
    </div>
  )
}
