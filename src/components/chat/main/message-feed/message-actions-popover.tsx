import * as React from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  IconArrowBackUp,
  IconCopy,
  IconArrowForwardUp,
  IconStar,
  IconPin,
  IconTrash,
  IconDots,
  IconMoodSmile,
} from "@tabler/icons-react"
import { cn } from "cn"

export interface MessageActionButtonsProps {
  isSentByMe: boolean
  isStarred?: boolean
  isPinned?: boolean
  contentType?: "text" | "photo" | "audio" | "file" | "video" | "location" | string
  onReply?: () => void
  onCopy?: () => void
  onForward?: () => void
  onStar?: () => void
  onPin?: () => void
  onDelete?: () => void
  onQuickReaction?: (emoji: string) => void
  className?: string
}

export function MessageActionButtons({
  isSentByMe,
  isStarred = false,
  isPinned = false,
  contentType = "text",
  onReply,
  onCopy,
  onForward,
  onStar,
  onPin,
  onDelete,
  onQuickReaction,
  className,
}: MessageActionButtonsProps) {
  const [emojiOpen, setEmojiOpen] = React.useState(false)
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const isAnyOpen = emojiOpen || moreOpen

  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-opacity duration-150 select-none",
        "opacity-0 group-hover:opacity-100",
        isAnyOpen && "opacity-100",
        isSentByMe ? "order-first" : "order-last",
        className
      )}
    >
      {/* 1. Emoji Reaction Trigger with Full Emoji Mart Picker */}
      <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer",
                emojiOpen && "bg-muted text-foreground"
              )}
              title="Add reaction"
              aria-label="Add reaction"
            />
          }
        >
          <IconMoodSmile className="size-4" />
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align={isSentByMe ? "end" : "start"}
          sideOffset={8}
          className="w-auto p-0 border-0 shadow-2xl bg-transparent overflow-hidden rounded-2xl select-none duration-75 data-[state=open]:duration-75 data-[state=closed]:duration-50"
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji: { native: string }) => {
              setEmojiOpen(false)
              if (emoji.native) onQuickReaction?.(emoji.native)
            }}
            set="native"
            theme={isDark ? "dark" : "light"}
            navPosition="top"
            previewPosition="none"
            searchPosition="sticky"
            skinTonePosition="search"
            autoFocus={false}
            emojiVersion="15.0"
            locale="en"
            perLine={8}
          />
        </PopoverContent>
      </Popover>

      {/* 2. Three Dots More Options Menu */}
      <Popover open={moreOpen} onOpenChange={setMoreOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer",
                moreOpen && "bg-muted text-foreground"
              )}
              title="More options"
              aria-label="More options"
            />
          }
        >
          <IconDots className="size-4" />
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align={isSentByMe ? "end" : "start"}
          sideOffset={6}
          className="w-40 rounded-xl border border-border/80 bg-popover/95 p-1 shadow-xl backdrop-blur-md select-none flex flex-col gap-0.5"
        >
          <button
            type="button"
            onClick={() => {
              setMoreOpen(false)
              onReply?.()
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <IconArrowBackUp className="size-3.5 text-muted-foreground" />
            <span>Reply</span>
          </button>

          {/* Contextual Copy Button: Only show for text or photo */}
          {(contentType === "text" || contentType === "photo") && onCopy && (
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false)
                onCopy()
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <IconCopy className="size-3.5 text-muted-foreground" />
              <span>{contentType === "photo" ? "Copy image" : "Copy text"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setMoreOpen(false)
              onForward?.()
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <IconArrowForwardUp className="size-3.5 text-muted-foreground" />
            <span>Forward</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMoreOpen(false)
              onStar?.()
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <IconStar className={cn("size-3.5", isStarred ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
            <span>{isStarred ? "Unstar" : "Star"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMoreOpen(false)
              onPin?.()
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <IconPin className={cn("size-3.5", isPinned ? "text-primary fill-primary" : "text-muted-foreground")} />
            <span>{isPinned ? "Unpin" : "Pin"}</span>
          </button>

          <div className="h-px bg-border/40 my-0.5" />

          <button
            type="button"
            onClick={() => {
              setMoreOpen(false)
              onDelete?.()
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <IconTrash className="size-3.5" />
            <span>Delete</span>
          </button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { MessageActionButtons as MessageActionsPopover }
export default MessageActionButtons
