import * as React from "react"
import { type ChatMessage } from "@/data/mock-messages"
import { type UserProfile } from "@/data/mock-contacts"
import { VoiceNoteBubble } from "./voice-note-bubble"
import { PhotoAttachmentBubble } from "./photo-attachment-bubble"
import { MessageReplyPreview } from "./message-reply-preview"
import { MessageReactions } from "./message-reactions"
import { MessageActionsPopover } from "./message-actions-popover"
import { DeliveryStatusIcon } from "./delivery-status-icon"
import { cn } from "cn"

export interface MessageItemProps {
  message: ChatMessage
  contact?: UserProfile
  onReply?: (message: ChatMessage) => void
  onCopy?: (text: string) => void
  onForward?: (message: ChatMessage) => void
  onStar?: (message: ChatMessage) => void
  onPin?: (message: ChatMessage) => void
  onDeleteMessage?: (messageId: string) => void
}

export function MessageItem({
  message,
  contact,
  onReply,
  onCopy,
  onForward,
  onStar,
  onPin,
  onDeleteMessage,
}: MessageItemProps) {
  const isMe = message.isSentByMe

  return (
    <div
      className={cn(
        "group relative flex flex-col max-w-[85%] sm:max-w-[70%]",
        isMe ? "self-end items-end" : "self-start items-start"
      )}
    >
      {/* Sender Name in group chats */}
      {!isMe && contact?.type === "group" && (
        <span className="text-[11px] font-semibold text-primary ml-3 mb-0.5 select-none">
          {message.senderName}
        </span>
      )}

      {/* Voice Note Bubble */}
      {message.attachment?.type === "audio" ? (
        <div className="flex flex-col gap-1">
          <VoiceNoteBubble
            duration={message.attachment.duration}
            isSentByMe={isMe}
          />
          <div className="flex items-center justify-start gap-1 text-[10px] text-muted-foreground select-none ml-2">
            <span>{message.timestamp}</span>
          </div>
        </div>
      ) : message.attachment?.type === "photo" ? (
        /* Photo Attachment */
        <PhotoAttachmentBubble
          thumbnailUrl={message.attachment.thumbnailUrl}
          fileName={message.attachment.fileName}
          fileSize={message.attachment.fileSize}
          timestamp={message.timestamp}
        />
      ) : (
        /* Standard Text Bubble */
        <div className="relative flex flex-col">
          <div
            className={cn(
              "relative rounded-3xl px-4 py-2.5 text-sm transition-colors shadow-2xs leading-relaxed",
              isMe
                ? "bg-neutral-900 text-white dark:bg-neutral-800"
                : "bg-muted/70 text-foreground"
            )}
          >
            {/* Replying Preview quote inside the bubble */}
            {message.replyTo && (
              <MessageReplyPreview
                replyTo={message.replyTo}
                isSentByMe={isMe}
              />
            )}

            <div className="flex items-start justify-between gap-2">
              <p className="whitespace-pre-wrap break-words flex-1 leading-relaxed">
                {message.text}
              </p>

              {/* Three dots button at the end of the message bubble */}
              <MessageActionsPopover
                isSentByMe={isMe}
                onReply={() => onReply?.(message)}
                onCopy={() => {
                  if (message.text) {
                    if (onCopy) onCopy(message.text)
                    else navigator.clipboard.writeText(message.text)
                  }
                }}
                onForward={() => onForward?.(message)}
                onStar={() => onStar?.(message)}
                onPin={() => onPin?.(message)}
                onDelete={() => onDeleteMessage?.(message.id)}
              />
            </div>

            {/* Emoji Reactions Badge pinned to bottom corner of the bubble */}
            <MessageReactions
              reactions={message.reactions}
              isSentByMe={isMe}
            />
          </div>

          {/* Timestamp & Delivery status directly below bubble */}
          <div
            className={cn(
              "flex items-center gap-1 text-[10px] text-muted-foreground select-none",
              message.reactions && message.reactions.length > 0 ? "mt-3.5" : "mt-1",
              isMe ? "justify-end mr-2" : "justify-start ml-2"
            )}
          >
            <span>{message.timestamp}</span>
            {isMe && <DeliveryStatusIcon status={message.status} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageItem

