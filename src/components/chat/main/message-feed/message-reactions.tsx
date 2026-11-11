import * as React from "react"
import { type MessageReaction } from "@/data/mock-messages"
import { cn } from "cn"

export interface MessageReactionsProps {
  reactions?: MessageReaction[]
  isSentByMe: boolean
  className?: string
  onReactionClick?: (emoji: string) => void
}

export function MessageReactions({
  reactions,
  isSentByMe,
  className,
  onReactionClick,
}: MessageReactionsProps) {
  if (!reactions || reactions.length === 0) return null

  return (
    <div
      className={cn(
        "absolute -bottom-3 z-10 flex items-center gap-1 select-none",
        isSentByMe ? "right-2" : "left-2",
        className
      )}
    >
      {reactions.map((reaction, rIdx) => (
        <button
          key={rIdx}
          type="button"
          onClick={() => onReactionClick?.(reaction.emoji)}
          className="flex items-center gap-1 rounded-full border border-border/60 bg-background px-2 py-0.5 text-xs shadow-sm ring-1 ring-black/5 hover:scale-105 transition-transform cursor-pointer"
        >
          <span>{reaction.emoji}</span>
          {reaction.count > 1 && (
            <span className="text-[10px] font-semibold text-muted-foreground">
              {reaction.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default MessageReactions

