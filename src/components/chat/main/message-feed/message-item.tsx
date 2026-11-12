import * as React from "react"
import { type ChatMessage } from "@/data/mock-messages"
import { type UserProfile } from "@/data/mock-contacts"
import { VoiceNoteBubble } from "./voice-note-bubble"
import { PhotoAttachmentBubble } from "./photo-attachment-bubble"
import { FileAttachmentBubble } from "./file-attachment-bubble"
import { PollBubble } from "./poll-bubble"
import { ContactBubble } from "./contact-bubble"
import { MessageReplyPreview } from "./message-reply-preview"
import { MessageReactions } from "./message-reactions"
import { MessageActionButtons } from "./message-actions-popover"
import { DeliveryStatusIcon } from "./delivery-status-icon"
import { IconArrowForwardUp, IconStar, IconPin } from "@tabler/icons-react"
import { toast } from "@/components/ui/toast"
import { cn } from "cn"

export interface MessageItemProps {
  message: ChatMessage
  contact?: UserProfile
  searchQuery?: string
  isSearchActiveMatch?: boolean
  onReply?: (message: ChatMessage) => void
  onCopy?: (text: string) => void
  onForward?: (message: ChatMessage) => void
  onStar?: (message: ChatMessage) => void
  onPin?: (message: ChatMessage) => void
  onDeleteMessage?: (messageId: string) => void
  onReact?: (messageId: string, emoji: string) => void
  onVotePoll?: (messageId: string, optionId: string) => void
}

function renderHighlightedText(
  text: string,
  query: string,
  isSentByMe: boolean,
  isCurrentMatch: boolean
) {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  const parts = text.split(regex)

  // Style classes based on whether this is the active focused match, and bubble tone (sent by me vs received)
  const highlightClass = isCurrentMatch
    ? isSentByMe
      ? "bg-amber-400 text-black font-semibold rounded-xs px-1 shadow-xs ring-1 ring-amber-300"
      : "bg-amber-500 text-white dark:bg-amber-400 dark:text-black font-semibold rounded-xs px-1 shadow-xs ring-1 ring-amber-400"
    : isSentByMe
      ? "bg-neutral-700/90 text-neutral-100 rounded-xs px-0.5 font-medium underline decoration-amber-400 decoration-2 underline-offset-2"
      : "bg-amber-200/90 text-amber-950 dark:bg-amber-500/30 dark:text-amber-200 rounded-xs px-0.5 font-medium"

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className={cn("transition-colors duration-150 inline-block leading-tight", highlightClass)}>
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function MessageItem({
  message,
  contact,
  searchQuery = "",
  isSearchActiveMatch = false,
  onReply,
  onCopy,
  onForward,
  onStar,
  onPin,
  onDeleteMessage,
  onReact,
  onVotePoll,
}: MessageItemProps) {
  const isMe = message.isSentByMe
  const isGroup = contact?.type === "group"

  const senderInitials = message.senderName
    ? message.senderName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?"

  const contentType = message.attachment?.type ?? "text"

  const handleCopy = async () => {
    if (contentType === "text" && message.text) {
      if (onCopy) onCopy(message.text)
      else await navigator.clipboard?.writeText(message.text)
      toast.add({
        title: "Text copied",
        description: "Message text copied to clipboard",
        type: "success",
      })
    } else if (contentType === "photo" && message.attachment?.thumbnailUrl) {
      try {
        const response = await fetch(message.attachment.thumbnailUrl)
        const blob = await response.blob()
        await navigator.clipboard?.write([
          new ClipboardItem({ [blob.type]: blob }),
        ])
        toast.add({
          title: "Image copied",
          description: "Image copied to clipboard",
          type: "success",
        })
      } catch (err) {
        // Fallback to copying URL if clipboard write of binary image is restricted
        await navigator.clipboard?.writeText(message.attachment.thumbnailUrl)
        toast.add({
          title: "Image link copied",
          description: "Image URL copied to clipboard",
          type: "success",
        })
      }
    }
  }

  const handleRowDoubleClick = (e: React.MouseEvent) => {
    // Prevent triggering reply when double-clicking interactive buttons or popover content
    const target = e.target as HTMLElement
    if (target.closest("button") || target.closest("[role='dialog']")) return
    onReply?.(message)
  }

  return (
    <div
      id={`message-${message.id}`}
      onDoubleClick={handleRowDoubleClick}
      className={cn(
        "group relative flex w-full items-center gap-1.5 transition-all duration-150 select-none py-0.5",
        message.reactions && message.reactions.length > 0 && "mb-2.5",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {/* Received Avatar in Group chats */}
      {!isMe && isGroup && (
        <div className="flex size-7 shrink-0 items-center justify-center self-end rounded-full bg-muted border border-border/60 text-[10px] font-semibold text-foreground shadow-2xs overflow-hidden">
          {message.senderAvatar ? (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="size-full object-cover"
            />
          ) : (
            <span>{senderInitials}</span>
          )}
        </div>
      )}

      {/* External Action Controls (Outside the Bubble) */}
      <MessageActionButtons
        isSentByMe={isMe}
        isStarred={message.isStarred}
        isPinned={message.isPinned}
        contentType={contentType}
        onReply={() => onReply?.(message)}
        onCopy={handleCopy}
        onForward={() => onForward?.(message)}
        onStar={() => onStar?.(message)}
        onPin={() => onPin?.(message)}
        onDelete={() => onDeleteMessage?.(message.id)}
        onQuickReaction={(emoji) => onReact?.(message.id, emoji)}
      />

      {/* Message Card Container */}
      <div
        className={cn(
          "relative flex flex-col max-w-[85%] sm:max-w-[70%]",
          isMe ? "items-end" : "items-start"
        )}
      >
        {/* Sender Name in group chats */}
        {!isMe && isGroup && (
          <span className="text-[11px] font-semibold text-primary/90 ml-2 mb-1 select-none">
            {message.senderName}
          </span>
        )}

        {/* Forwarded Header Indicator */}
        {message.isForwarded && (
          <div
            className={cn(
              "flex items-center gap-1 text-[11px] font-medium italic select-none mb-1 px-1",
              isMe ? "text-neutral-400 justify-end" : "text-muted-foreground justify-start"
            )}
          >
            <IconArrowForwardUp className="size-3.5" />
            <span>Forwarded</span>
          </div>
        )}

        {/* Media Attachments or Card Bubble */}
        {message.attachment?.type === "audio" ? (
          <div className="flex flex-col gap-1">
            <VoiceNoteBubble
              duration={message.attachment.duration}
              isSentByMe={isMe}
            />
            <div
              className={cn(
                "flex items-center gap-1 text-[10px] text-muted-foreground select-none px-1.5",
                isMe ? "justify-end" : "justify-start"
              )}
            >
              <span>{message.timestamp}</span>
              {isMe && <DeliveryStatusIcon status={message.status} className="size-3" />}
            </div>
          </div>
        ) : message.attachment?.type === "photo" || message.attachment?.type === "video" ? (
          <div className="relative">
            <PhotoAttachmentBubble
              thumbnailUrl={message.attachment.thumbnailUrl}
              fileName={message.attachment.fileName}
              fileSize={message.attachment.fileSize}
              timestamp={message.timestamp}
              caption={message.text}
              status={message.status}
              isSentByMe={isMe}
            />
            <MessageReactions
              reactions={message.reactions}
              isSentByMe={isMe}
              onReactionClick={(emoji) => onReact?.(message.id, emoji)}
            />
          </div>
        ) : (
          /* Standard Precision Bubble Card */
          <div
            className={cn(
              "relative rounded-2xl px-3.5 py-2 text-sm transition-all duration-200 select-text leading-relaxed",
              isSearchActiveMatch && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md",
              isMe
                ? "bg-neutral-900 text-neutral-50 border border-neutral-800 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 rounded-tr-xs"
                : "bg-card text-card-foreground border border-border/80 shadow-xs hover:border-border dark:bg-card/90 rounded-tl-xs"
            )}
          >
            {/* Quoted Reply Preview */}
            {message.replyTo && (
              <div className="mb-1.5">
                <MessageReplyPreview
                  replyTo={message.replyTo}
                  isSentByMe={isMe}
                />
              </div>
            )}

            {/* Special Attachment Bubbles: Poll, Contact, File */}
            {message.attachment?.type === "poll" && message.attachment.poll && (
              <div className="mb-1.5">
                <PollBubble
                  poll={message.attachment.poll}
                  isSentByMe={isMe}
                  onVote={(optId) => onVotePoll?.(message.id, optId)}
                />
              </div>
            )}

            {message.attachment?.type === "contact" && message.attachment.contact && (
              <div className="mb-1.5">
                <ContactBubble
                  contact={message.attachment.contact}
                  isSentByMe={isMe}
                />
              </div>
            )}

            {message.attachment?.type === "file" && (
              <div className="mb-1.5">
                <FileAttachmentBubble
                  fileName={message.attachment.fileName}
                  fileSize={message.attachment.fileSize}
                  url={message.attachment.url}
                  isSentByMe={isMe}
                />
              </div>
            )}

            {/* Bubble Content & Inline Footer */}
            <div className="flex flex-wrap items-end gap-x-2 gap-y-0.5">
              {message.text && (
                <p className="whitespace-pre-wrap break-words leading-relaxed select-text">
                  {searchQuery.trim()
                    ? renderHighlightedText(message.text, searchQuery, isMe, isSearchActiveMatch)
                    : message.text}
                </p>
              )}

              {/* Integrated Inline Timestamp & Status Indicator */}
              <div
                className={cn(
                  "ml-auto inline-flex items-center gap-1 shrink-0 select-none pb-0.5",
                  isMe ? "text-neutral-400" : "text-muted-foreground"
                )}
              >
                {message.isStarred && (
                  <IconStar className="size-3 text-amber-500 fill-amber-500 shrink-0" />
                )}
                {message.isPinned && (
                  <IconPin className="size-3 text-primary shrink-0" />
                )}
                <span className="text-[10px] font-mono leading-none tracking-tight">
                  {message.timestamp}
                </span>
                {isMe && (
                  <DeliveryStatusIcon
                    status={message.status}
                    className="size-3"
                  />
                )}
              </div>
            </div>

            {/* Emoji Reactions Badge */}
            <MessageReactions
              reactions={message.reactions}
              isSentByMe={isMe}
              onReactionClick={(emoji) => onReact?.(message.id, emoji)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageItem
