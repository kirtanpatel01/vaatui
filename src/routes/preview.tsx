import { createFileRoute } from "@tanstack/react-router"
import ChatLayout from "@/components/chat/chat-layout"

export const Route = createFileRoute("/preview")({ component: PreviewPage })

function PreviewPage() {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] w-full overflow-hidden p-4">
      <ChatLayout />
    </div>
  )
}
