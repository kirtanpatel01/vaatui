import * as React from "react"
import { type MessageReply } from "@/data/mock-messages"
import { IconArrowBackUp } from "@tabler/icons-react"
import { cn } from "cn"

export interface MessageReplyPreviewProps {
  replyTo: MessageReply
  isSentByMe: boolean
  onClick?: () => void
  className?: string
}

export function MessageReplyPreview({
  replyTo,
  isSentByMe,
  onClick,
  className,
}: MessageReplyPreviewProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group/reply relative flex items-start gap-2 rounded-xl px-2.5 py-1.5 text-xs transition-all cursor-pointer select-none border",
        isSentByMe
          ? "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-200"
          : "bg-muted/60 border-border/70 hover:bg-muted text-foreground",
        className
      )}
    >
      {/* Subtle indicator bar & icon */}
      <div
        className={cn(
          "w-0.5 self-stretch rounded-full shrink-0",
          isSentByMe ? "bg-white/40" : "bg-primary/70"
        )}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <IconArrowBackUp
            className={cn(
              "size-3 shrink-0",
              isSentByMe ? "text-neutral-400" : "text-primary"
            )}
          />
          <span
            className={cn(
              "text-[11px] font-semibold tracking-tight truncate",
              isSentByMe ? "text-neutral-200" : "text-primary"
            )}
          >
            {replyTo.senderName}
          </span>
        </div>
        <p
          className={cn(
            "text-[11px] truncate mt-0.5 line-clamp-1",
            isSentByMe ? "text-neutral-400" : "text-muted-foreground"
          )}
        >
          {replyTo.text}
        </p>
      </div>
    </div>
  )
}

export default MessageReplyPreview
