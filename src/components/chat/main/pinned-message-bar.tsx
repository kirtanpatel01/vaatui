import * as React from "react"
import { type ChatMessage } from "@/data/mock-messages"
import { IconPin, IconX, IconChevronRight } from "@tabler/icons-react"
import { cn } from "cn"

export interface PinnedMessageBarProps {
  pinnedMessages: ChatMessage[]
  onJumpToMessage: (messageId: string) => void
  onUnpin?: (messageId: string) => void
  className?: string
}

export function PinnedMessageBar({
  pinnedMessages,
  onJumpToMessage,
  onUnpin,
  className,
}: PinnedMessageBarProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  // Keep index in bounds if pinned messages change
  React.useEffect(() => {
    if (currentIndex >= pinnedMessages.length) {
      setCurrentIndex(Math.max(0, pinnedMessages.length - 1))
    }
  }, [pinnedMessages.length, currentIndex])

  if (!pinnedMessages || pinnedMessages.length === 0) return null

  const currentMsg = pinnedMessages[currentIndex] || pinnedMessages[0]
  const totalCount = pinnedMessages.length

  const handleNextPin = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % totalCount)
  }

  const getPreviewText = (msg: ChatMessage) => {
    if (msg.text) return msg.text
    if (msg.attachment?.type === "photo") return "Photo"
    if (msg.attachment?.type === "audio") return "Voice note"
    if (msg.attachment?.type === "file") return msg.attachment.fileName || "File document"
    return "Message"
  }

  return (
    <div
      onClick={() => onJumpToMessage(currentMsg.id)}
      className={cn(
        "relative z-20 flex h-9 w-full items-center justify-between border-b border-border/50 bg-background/95 px-3.5 text-xs backdrop-blur-md transition-all cursor-pointer select-none hover:bg-muted/40",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Vertical Pin icon (upright, 0deg) */}
        <IconPin className="size-3.5 shrink-0 text-muted-foreground stroke-[2]" />

        {/* Only the message text/content */}
        <p className="min-w-0 flex-1 truncate text-xs text-foreground/90 font-normal">
          {getPreviewText(currentMsg)}
        </p>

        {/* Counter indicator if multiple pins */}
        {totalCount > 1 && (
          <span className="text-[10px] font-medium text-muted-foreground shrink-0 tabular-nums">
            {currentIndex + 1}/{totalCount}
          </span>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1 shrink-0 ml-2">
        {totalCount > 1 && (
          <button
            type="button"
            onClick={handleNextPin}
            className="flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            title="Next pinned message"
          >
            <IconChevronRight className="size-3.5" />
          </button>
        )}

        {onUnpin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onUnpin(currentMsg.id)
            }}
            className="flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            title="Unpin message"
          >
            <IconX className="size-3" />
          </button>
        )}
      </div>
    </div>
  )
}

export default PinnedMessageBar
