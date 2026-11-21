import * as React from "react"
import { useChatStore, useActiveContact, useActiveMessages } from "@/stores/chat-store"
import ChatHeader from "./main/chat-header"
import MessageFeed from "./main/message-feed"
import ChatInputBar from "./main/chat-input-bar"
import ForwardMessageDialog from "./main/forward-message-dialog"
import PinnedMessageBar from "./main/pinned-message-bar"
import SavedMessagesSheet from "./main/saved-messages-sheet"
import { type ChatMessage } from "@/data/mock-messages"
import { toast } from "@/components/ui/toast"
import { cn } from "cn"

export interface ChatMainProps {
  className?: string
  showScrollbar?: boolean
}

export function ChatMain({ className, showScrollbar = false }: ChatMainProps) {
  const activeContact = useActiveContact()
  const messages = useActiveMessages()
  const sendMessage = useChatStore((s) => s.sendMessage)
  const toggleReaction = useChatStore((s) => s.toggleReaction)
  const votePoll = useChatStore((s) => s.votePoll)
  const forwardMessage = useChatStore((s) => s.forwardMessage)
  const toggleStar = useChatStore((s) => s.toggleStar)
  const togglePin = useChatStore((s) => s.togglePin)
  const deleteMessage = useChatStore((s) => s.deleteMessage)
  const toggleChatDetails = useChatStore((s) => s.toggleChatDetails)

  const [replyingTo, setReplyingTo] = React.useState<ChatMessage | null>(null)
  const [forwardingMessage, setForwardingMessage] = React.useState<ChatMessage | null>(null)
  const [forwardDialogOpen, setForwardDialogOpen] = React.useState(false)

  // Starred & Pinned Messages Modal state
  const [savedModalType, setSavedModalType] = React.useState<"starred" | "pinned" | null>(null)

  // Search state
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentMatchIndex, setCurrentMatchIndex] = React.useState(0)

  // Matching messages across conversation
  const matchingMessages = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return messages.filter((m) => m.text?.toLowerCase().includes(q))
  }, [messages, searchQuery])

  // Reset match index when query changes
  React.useEffect(() => {
    setCurrentMatchIndex(0)
  }, [searchQuery])

  // Scroll to active match when currentMatchIndex or matchingMessages change
  React.useEffect(() => {
    if (matchingMessages.length > 0 && currentMatchIndex < matchingMessages.length) {
      const activeMatch = matchingMessages[currentMatchIndex]
      const el = document.getElementById(`message-${activeMatch.id}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [matchingMessages, currentMatchIndex])

  const handleNextMatch = () => {
    if (matchingMessages.length === 0) return
    setCurrentMatchIndex((prev) => (prev + 1) % matchingMessages.length)
  }

  const handlePrevMatch = () => {
    if (matchingMessages.length === 0) return
    setCurrentMatchIndex((prev) => (prev - 1 + matchingMessages.length) % matchingMessages.length)
  }

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

  const handleSendMessage = (text: string, attachment?: any) => {
    const replyPayload = replyingTo
      ? {
          id: replyingTo.id,
          senderName: replyingTo.senderName,
          text: replyingTo.text || (replyingTo.attachment ? `[${replyingTo.attachment.type}]` : ""),
        }
      : null

    sendMessage(text, replyPayload, attachment)
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
        messages={messages}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        onToggleSearch={(open) => {
          setIsSearchOpen(open)
          if (!open) setSearchQuery("")
        }}
        searchMatchCount={matchingMessages.length}
        searchMatchIndex={currentMatchIndex}
        onNextMatch={handleNextMatch}
        onPrevMatch={handlePrevMatch}
        onToggleDetails={toggleChatDetails}
        onOpenStarredModal={() => setSavedModalType("starred")}
        onOpenPinnedModal={() => setSavedModalType("pinned")}
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
        searchQuery={searchQuery}
        activeSearchMessageId={matchingMessages[currentMatchIndex]?.id}
        onReply={handleReply}
        onForward={handleForward}
        onStar={handleStar}
        onPin={handlePin}
        onDeleteMessage={handleDelete}
        onReact={toggleReaction}
        onVotePoll={votePoll}
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

      {/* Starred / Pinned Messages Browser Sheet */}
      <SavedMessagesSheet
        type={savedModalType ?? "starred"}
        open={savedModalType !== null}
        onOpenChange={(open) => {
          if (!open) setSavedModalType(null)
        }}
        messages={
          savedModalType === "starred"
            ? messages.filter((m) => m.isStarred)
            : messages.filter((m) => m.isPinned)
        }
        onJumpToMessage={handleJumpToMessage}
        onToggleStatus={(id) => {
          if (savedModalType === "starred") {
            toggleStar(id)
          } else {
            togglePin(id)
          }
        }}
        onBulkUnset={(ids) => {
          ids.forEach((id) => {
            if (savedModalType === "starred") {
              toggleStar(id)
            } else {
              togglePin(id)
            }
          })
        }}
        onBulkDelete={(ids) => {
          ids.forEach((id) => deleteMessage(id))
        }}
        onBulkForward={(msgs) => {
          if (msgs.length > 0) {
            setForwardingMessage(msgs[0])
            setForwardDialogOpen(true)
          }
        }}
      />
    </main>
  )
}

export default ChatMain
