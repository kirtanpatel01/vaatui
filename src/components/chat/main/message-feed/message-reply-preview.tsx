import * as React from "react"
import { type MessageReply } from "@/data/mock-messages"
import { cn } from "cn"

export interface MessageReplyPreviewProps {
  replyTo: MessageReply
  isSentByMe: boolean
  onClick?: () => void
}

export function MessageReplyPreview({
  replyTo,
  isSentByMe,
  onClick,
}: MessageReplyPreviewProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "mb-2 rounded-xl p-2 text-xs border-l-2 select-none cursor-pointer transition-opacity hover:opacity-90",
        isSentByMe
          ? "bg-white/10 border-white text-white"
          : "bg-background border-primary text-foreground"
      )}
    >
      <p className="font-semibold text-[11px] opacity-90 truncate">
        {replyTo.senderName}
      </p>
      <p className="opacity-75 truncate text-[11px] mt-0.5">
        {replyTo.text}
      </p>
    </div>
  )
}

export default MessageReplyPreview

