import * as React from "react"
import { useChat } from "@/components/chat/chat-provider"
import ChatHeader from "./main/chat-header"
import MessageFeed from "./main/message-feed"
import ChatInputBar from "./main/chat-input-bar"
import { type ChatMessage } from "@/data/mock-messages"
import { cn } from "cn"

export interface ChatMainProps {
  className?: string
  showScrollbar?: boolean
}

export function ChatMain({ className, showScrollbar = false }: ChatMainProps) {
  const { activeContact, messages, sendMessage, setChatDetailsOpen } = useChat()
  const [replyingTo, setReplyingTo] = React.useState<ChatMessage | null>(null)

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message)
  }

  const handleSendMessage = (text: string) => {
    sendMessage(text)
    setReplyingTo(null)
  }

  return (
    <main
      className={cn(
        "relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-background",
        className
      )}
    >
      {/* 1. Chat Header */}
      <ChatHeader
        contact={activeContact}
        onToggleDetails={() => setChatDetailsOpen((prev) => !prev)}
      />

      {/* 2. Message Feed */}
      <MessageFeed
        contact={activeContact}
        messages={messages}
        showScrollbar={showScrollbar}
        onReply={handleReply}
      />

      {/* 3. Input Bar */}
      <ChatInputBar
        replyingTo={
          replyingTo
            ? {
                id: replyingTo.id,
                senderName: replyingTo.senderName,
                text: replyingTo.text || "",
              }
            : null
        }
        onCancelReply={() => setReplyingTo(null)}
        onSendMessage={handleSendMessage}
      />
    </main>
  )
}

export default ChatMain
