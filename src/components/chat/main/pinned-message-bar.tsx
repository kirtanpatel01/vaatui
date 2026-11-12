import * as React from "react"
import { type ChatMessage } from "@/data/mock-messages"
import { IconPin, IconX, IconChevronRight, IconPhoto, IconMicrophone, IconFile } from "@tabler/icons-react"
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
    if (msg.attachment?.type === "photo") return "Photo attachment"
    if (msg.attachment?.type === "audio") return "Voice note"
    if (msg.attachment?.type === "file") return msg.attachment.fileName || "File document"
    return "Pinned message"
  }

  return (
    <div
      onClick={() => onJumpToMessage(currentMsg.id)}
      className={cn(
        "relative z-20 flex h-11 w-full items-center justify-between border-b border-border/50 bg-background/90 px-4 text-xs backdrop-blur-md transition-all cursor-pointer select-none hover:bg-muted/40",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Left vertical indicator line (multi-pin indicator if > 1) */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <div className="h-4 w-1 rounded-full bg-primary" />
        </div>

        {/* Pin icon */}
        <IconPin className="size-4 shrink-0 text-primary rotate-45" />

        {/* Content info */}
        <div className="min-w-0 flex-1 flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[11px] text-primary truncate">
              Pinned Message
            </span>
            {totalCount > 1 && (
              <span className="text-[10px] font-medium text-muted-foreground">
                ({currentIndex + 1} of {totalCount})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground truncate text-[11px] mt-0.5">
            <span className="font-medium text-foreground/80 truncate shrink-0 max-w-[80px]">
              {currentMsg.senderName}:
            </span>
            <span className="truncate">{getPreviewText(currentMsg)}</span>
          </div>
        </div>
      </div>

      {/* Right controls: Cycle through pins if >1, and Unpin close button */}
      <div className="flex items-center gap-1 shrink-0 ml-2">
        {totalCount > 1 && (
          <button
            type="button"
            onClick={handleNextPin}
            className="flex size-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
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
            className="flex size-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            title="Unpin message"
          >
            <IconX className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default PinnedMessageBar

