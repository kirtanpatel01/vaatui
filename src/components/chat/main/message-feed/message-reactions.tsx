import * as React from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  const [openPopoverIndex, setOpenPopoverIndex] = React.useState<number | null>(null)
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

  if (!reactions || reactions.length === 0) return null

  return (
    <div
      className={cn(
        "absolute -bottom-4 z-10 flex items-center gap-1 select-none",
        isSentByMe ? "right-2" : "left-2",
        className
      )}
    >
      {reactions.map((reaction, rIdx) => {
        const isOpen = openPopoverIndex === rIdx

        return (
          <Popover
            key={rIdx}
            open={isOpen}
            onOpenChange={(open) => setOpenPopoverIndex(open ? rIdx : null)}
          >
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center rounded-full bg-background shadow-xs cursor-pointer border-0 outline-none",
                    reaction.count > 1 ? "w-auto px-2 gap-1 rounded-full" : "size-6.5"
                  )}
                  title={`Reacted with ${reaction.emoji}`}
                />
              }
            >
              <span className="text-sm leading-none flex items-center justify-center">
                {reaction.emoji}
              </span>
              {reaction.count > 1 && (
                <span className="text-[10px] font-medium text-muted-foreground leading-none">
                  {reaction.count}
                </span>
              )}
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
                  setOpenPopoverIndex(null)
                  if (emoji.native) onReactionClick?.(emoji.native)
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
        )
      })}
    </div>
  )
}

export default MessageReactions
