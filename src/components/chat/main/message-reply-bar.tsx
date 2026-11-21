import * as React from "react"
import { IconX } from "@tabler/icons-react"
import { cn } from "cn"

export interface MessageReplyBarProps extends React.HTMLAttributes<HTMLDivElement> {
  replyingTo: {
    id?: string
    senderName: string
    text: string
  }
  onCancel?: () => void
}

export function MessageReplyBar({
  replyingTo,
  onCancel,
  className,
  ...props
}: MessageReplyBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-xl bg-secondary/80 border border-border/40 px-3 py-1.5 text-xs animate-in fade-in-0 slide-in-from-bottom-1 duration-150",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0 border-l-2 border-primary pl-2">
        <span className="font-semibold text-primary block leading-tight">
          {replyingTo.senderName}
        </span>
        <span className="text-muted-foreground truncate block text-[11px]">
          {replyingTo.text}
        </span>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="text-muted-foreground hover:text-foreground p-1 rounded-md cursor-pointer transition-colors"
        aria-label="Cancel reply"
        title="Cancel reply"
      >
        <IconX className="size-3.5" />
      </button>
    </div>
  )
}

export default MessageReplyBar
