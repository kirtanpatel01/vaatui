import * as React from "react"
import { type ChatMessage } from "@/data/mock-messages"
import { type UserProfile } from "@/data/mock-contacts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageItem } from "./message-item"
import { MessageDateSeparator, type MessageDateSeparatorVariant } from "./message-date-separator"
import { cn } from "cn"

export interface MessageFeedProps
  extends Omit<React.ComponentProps<"div">, "onCopy"> {
  messages?: ChatMessage[]
  contact?: UserProfile
  showScrollbar?: boolean
  dateSeparatorVariant?: MessageDateSeparatorVariant
  stickyDateSeparator?: boolean
  searchQuery?: string
  activeSearchMessageId?: string
  onReply?: (message: ChatMessage) => void
  onCopy?: (text: string) => void
  onForward?: (message: ChatMessage) => void
  onStar?: (message: ChatMessage) => void
  onPin?: (message: ChatMessage) => void
  onDeleteMessage?: (messageId: string) => void
  onReact?: (messageId: string, emoji: string) => void
  onVotePoll?: (messageId: string, optionId: string) => void
}

export function MessageFeed({
  messages = [],
  contact,
  className,
  showScrollbar = false,
  dateSeparatorVariant = "sticky",
  stickyDateSeparator = false,
  searchQuery = "",
  activeSearchMessageId,
  onReply,
  onCopy,
  onForward,
  onStar,
  onPin,
  onDeleteMessage,
  onReact,
  onVotePoll,
  ...props
}: MessageFeedProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const prevMessagesLengthRef = React.useRef<number>(messages.length)
  const prevChatIdRef = React.useRef<string | undefined>(contact?.id)

  // Only auto-scroll to bottom when:
  // 1. Switched to a new conversation (contact id changed)
  // 2. A brand-new message was appended (messages count increased)
  // Does NOT scroll when starring, pinning, reacting, or searching.
  React.useEffect(() => {
    const isNewContact = prevChatIdRef.current !== contact?.id
    const hasNewMessageAppended = messages.length > prevMessagesLengthRef.current

    if ((isNewContact || hasNewMessageAppended) && !searchQuery.trim()) {
      bottomRef.current?.scrollIntoView({ behavior: isNewContact ? "auto" : "smooth" })
    }

    prevMessagesLengthRef.current = messages.length
    prevChatIdRef.current = contact?.id
  }, [messages.length, contact?.id, searchQuery])

  // Group messages by date
  const groupedMessages = React.useMemo(() => {
    const groups: { date: string; items: ChatMessage[] }[] = []
    messages.forEach((msg) => {
      const lastGroup = groups[groups.length - 1]
      if (lastGroup && lastGroup.date === msg.date) {
        lastGroup.items.push(msg)
      } else {
        groups.push({ date: msg.date, items: [msg] })
      }
    })
    return groups
  }, [messages])

  const renderContent = () => (
    <div className="flex flex-col gap-4 p-5 min-h-full justify-end">
      {groupedMessages.map((group, groupIdx) => (
        <div key={`${group.date}-${groupIdx}`} className="flex flex-col gap-3">
          {/* Date Separator Pill */}
          <MessageDateSeparator
            date={group.date}
            variant={dateSeparatorVariant}
            sticky={stickyDateSeparator}
          />

          {/* Messages */}
          {group.items.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              contact={contact}
              searchQuery={searchQuery}
              isSearchActiveMatch={activeSearchMessageId === message.id}
              onReply={onReply}
              onCopy={onCopy}
              onForward={onForward}
              onStar={onStar}
              onPin={onPin}
              onDeleteMessage={onDeleteMessage}
              onReact={onReact}
              onVotePoll={onVotePoll}
            />
          ))}
        </div>
      ))}

      {/* Auto-scroll target */}
      <div ref={bottomRef} />
    </div>
  )

  return (
    <div
      className={cn("relative flex-1 min-h-0 w-full overflow-hidden flex flex-col", className)}
      {...props}
    >
      {showScrollbar ? (
        <ScrollArea className="flex-1 min-h-0 size-full">
          {renderContent()}
        </ScrollArea>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar scroll-smooth">
          {renderContent()}
        </div>
      )}
    </div>
  )
}

export default MessageFeed

