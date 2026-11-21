import * as React from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IconMoodSmile } from "@tabler/icons-react"
import { cn } from "cn"

export interface EmojiPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectEmoji: (emoji: { native: string }) => void
  children?: React.ReactNode
  isDark?: boolean
}

export function EmojiPicker({
  open,
  onOpenChange,
  onSelectEmoji,
  children,
  isDark: controlledDark,
}: EmojiPickerProps) {
  const [internalDark, setInternalDark] = React.useState(false)

  React.useEffect(() => {
    if (controlledDark !== undefined) return
    const checkDark = () => {
      setInternalDark(document.documentElement.classList.contains("dark"))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [controlledDark])

  const dark = controlledDark !== undefined ? controlledDark : internalDark

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          children ? (
            (children as React.ReactElement)
          ) : (
            <button
              type="button"
              className={cn(
                "p-1 hover:text-foreground transition-colors cursor-pointer text-muted-foreground",
                open && "text-foreground"
              )}
              aria-label="Emoji picker"
            >
              <IconMoodSmile className="size-4.5" />
            </button>
          )
        }
      />

      <PopoverContent
        side="top"
        align="end"
        sideOffset={14}
        className="w-auto p-0 border-0 shadow-2xl bg-transparent overflow-hidden rounded-2xl duration-75 data-[state=open]:duration-75 data-[state=closed]:duration-50"
      >
        <Picker
          data={data}
          onEmojiSelect={onSelectEmoji}
          set="native"
          theme={dark ? "dark" : "light"}
          navPosition="top"
          previewPosition="none"
          searchPosition="sticky"
          skinTonePosition="search"
          autoFocus={false}
          emojiVersion="15.0"
          locale="en"
          perLine={9}
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
