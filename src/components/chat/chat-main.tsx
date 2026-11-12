import * as React from "react"
import { useChat } from "@/components/chat/chat-provider"
import ChatHeader from "./main/chat-header"
import MessageFeed from "./main/message-feed"
import ChatInputBar from "./main/chat-input-bar"
import ForwardMessageDialog from "./main/forward-message-dialog"
import PinnedMessageBar from "./main/pinned-message-bar"
import { type ChatMessage } from "@/data/mock-messages"
import { toast } from "@/components/ui/toast"
import { cn } from "cn"

export interface ChatMainProps {
  className?: string
  showScrollbar?: boolean
}

export function ChatMain({ className, showScrollbar = false }: ChatMainProps) {
  const {
    activeContact,
    messages,
    sendMessage,
    toggleReaction,
    forwardMessage,
    toggleStar,
    togglePin,
    deleteMessage,
    setChatDetailsOpen,
  } = useChat()
  const [replyingTo, setReplyingTo] = React.useState<ChatMessage | null>(null)
  const [forwardingMessage, setForwardingMessage] = React.useState<ChatMessage | null>(null)
  const [forwardDialogOpen, setForwardDialogOpen] = React.useState(false)

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message)
  }

  const handleForward = (message: ChatMessage) => {
    setForwardingMessage(message)
    setForwardDialogOpen(true)
  }

  const handleForwardConfirm = (targetChatIds: string[], message: ChatMessage) => {
    forwardMessage(targetChatIds, message)
    setForwardingMessage(null)
  }

  const handleStar = (message: ChatMessage) => {
    toggleStar(message.id)
    toast.add({
      title: message.isStarred ? "Message unstarred" : "Message starred",
      type: "success",
    })
  }

  const handlePin = (message: ChatMessage) => {
    togglePin(message.id)
    toast.add({
      title: message.isPinned ? "Message unpinned" : "Message pinned",
      type: "success",
    })
  }

  const handleJumpToMessage = (messageId: string) => {
    const el = document.getElementById(`message-${messageId}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      // Brief highlight flash effect
      el.classList.add("ring-2", "ring-primary", "rounded-2xl", "transition-all")
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-primary")
      }, 1500)
    }
  }

  const pinnedMessages = React.useMemo(() => {
    return messages.filter((m) => m.isPinned)
  }, [messages])

  const handleDelete = (messageId: string) => {
    deleteMessage(messageId)
    toast.add({
      title: "Message deleted",
      type: "success",
    })
  }

  const handleSendMessage = (text: string) => {
    const replyPayload = replyingTo
      ? {
          id: replyingTo.id,
          senderName: replyingTo.senderName,
          text: replyingTo.text || (replyingTo.attachment ? `[${replyingTo.attachment.type}]` : ""),
        }
      : null

    sendMessage(text, replyPayload)
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

      {/* Pinned Messages Header Strip */}
      <PinnedMessageBar
        pinnedMessages={pinnedMessages}
        onJumpToMessage={handleJumpToMessage}
        onUnpin={togglePin}
      />

      {/* 2. Message Feed */}
      <MessageFeed
        contact={activeContact}
        messages={messages}
        showScrollbar={showScrollbar}
        onReply={handleReply}
        onForward={handleForward}
        onStar={handleStar}
        onPin={handlePin}
        onDeleteMessage={handleDelete}
        onReact={toggleReaction}
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

      {/* Forward Message Modal Dialog */}
      <ForwardMessageDialog
        message={forwardingMessage}
        open={forwardDialogOpen}
        onOpenChange={setForwardDialogOpen}
        onForwardConfirm={handleForwardConfirm}
      />
    </main>
  )
}

export default ChatMain
