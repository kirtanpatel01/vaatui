import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  IconArrowBackUp,
  IconCopy,
  IconArrowForwardUp,
  IconStar,
  IconPin,
  IconTrash,
  IconDots,
} from "@tabler/icons-react"
import { cn } from "cn"

export interface MessageActionsPopoverProps {
  isSentByMe: boolean
  onReply?: () => void
  onCopy?: () => void
  onForward?: () => void
  onStar?: () => void
  onPin?: () => void
  onDelete?: () => void
}

export function MessageActionsPopover({
  isSentByMe,
  onReply,
  onCopy,
  onForward,
  onStar,
  onPin,
  onDelete,
}: MessageActionsPopoverProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex size-6 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0",
              isSentByMe
                ? "text-neutral-400 hover:text-white hover:bg-white/10"
                : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10",
              open && "opacity-100"
            )}
            aria-label="Message options"
          />
        }
      >
        <IconDots className="size-4" />
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align={isSentByMe ? "end" : "start"}
        sideOffset={6}
        className="flex items-center gap-0.5 rounded-2xl border border-border/60 bg-popover/95 p-1 px-1.5 shadow-xl backdrop-blur-md w-auto select-none"
      >
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            onReply?.()
          }}
          className="flex size-7 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Reply"
        >
          <IconArrowBackUp className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            onCopy?.()
          }}
          className="flex size-7 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Copy text"
        >
          <IconCopy className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            onForward?.()
          }}
          className="flex size-7 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Forward"
        >
          <IconArrowForwardUp className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            onStar?.()
          }}
          className="flex size-7 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Star"
        >
          <IconStar className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            onPin?.()
          }}
          className="flex size-7 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Pin"
        >
          <IconPin className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            onDelete?.()
          }}
          className="flex size-7 items-center justify-center rounded-xl text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          title="Delete"
        >
          <IconTrash className="size-4" />
        </button>
      </PopoverContent>
    </Popover>
  )
}

export default MessageActionsPopover

