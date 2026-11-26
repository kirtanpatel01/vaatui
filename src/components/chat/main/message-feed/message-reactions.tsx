import * as React from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { IconMoodPlus } from "@tabler/icons-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type MessageReaction } from "@/data/mock-messages"
import { type UserProfile } from "@/data/mock-contacts"
import { cn } from "cn"

const FALLBACK_REACTORS = [
  "Aarav Mehta",
  "Priya Sharma",
  "Rohan Deshmukh",
  "Ananya Iyer",
  "Vikram Patel",
]

export interface MessageReactionsProps {
  reactions?: MessageReaction[]
  isSentByMe: boolean
  contact?: UserProfile
  className?: string
  onReactionClick?: (emoji: string) => void
}

export function MessageReactions({
  reactions,
  isSentByMe,
  contact,
  className,
  onReactionClick,
}: MessageReactionsProps) {
  const [open, setOpen] = React.useState(false)
  const [showPicker, setShowPicker] = React.useState(false)
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

  React.useEffect(() => {
    if (!open) setShowPicker(false)
  }, [open])

  if (!reactions || reactions.length === 0) return null

  const totalCount = reactions.reduce((sum, r) => sum + r.count, 0)
  const isSingle = totalCount <= 1 && reactions.length === 1

  return (
    <div
      className={cn(
        "absolute -bottom-3 z-10 flex items-center select-none",
        isSentByMe ? "right-2" : "left-2",
        className
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                "flex items-center justify-center rounded-full bg-background shadow-sm cursor-pointer hover:bg-accent transition-colors select-none",
                isSingle ? "size-6" : "h-6 px-2 gap-1"
              )}
              aria-label="View reactions"
            />
          }
        >
          <span className="flex items-center -space-x-0.5 text-xs leading-none">
            {reactions.slice(0, 3).map((r) => (
              <span key={r.emoji}>{r.emoji}</span>
            ))}
          </span>
          {totalCount > 1 && (
            <span className="text-[11px] font-medium text-muted-foreground tabular-nums leading-none">
              {totalCount}
            </span>
          )}
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align={isSentByMe ? "end" : "start"}
          sideOffset={8}
          className={cn(
            "p-0 overflow-hidden rounded-2xl select-none",
            showPicker
              ? "w-auto border-0 shadow-2xl bg-transparent"
              : "w-72 shadow-xl border border-border/60 bg-popover"
          )}
        >
          {showPicker ? (
            <div className="overflow-hidden">
              <Picker
                data={data}
                onEmojiSelect={(emoji: { native: string }) => {
                  setShowPicker(false)
                  setOpen(false)
                  if (emoji.native) onReactionClick?.(emoji.native)
                }}
                set="native"
                theme={isDark ? "dark" : "light"}
                previewPosition="none"
                skinTonePosition="none"
                perLine={8}
              />
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Header */}
              <div className="px-3.5 pt-3 pb-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {totalCount} {totalCount === 1 ? "reaction" : "reactions"}
                </p>

                {/* Top bar: Add reaction + reaction pills */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar pb-0.5">
                  <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                    aria-label="Add reaction"
                    title="Add reaction"
                  >
                    <IconMoodPlus className="size-4" />
                  </button>

                  {reactions.map((r) => (
                    <button
                      key={r.emoji}
                      type="button"
                      onClick={() => onReactionClick?.(r.emoji)}
                      className={cn(
                        "flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-medium transition-colors cursor-pointer",
                        r.hasReacted
                          ? "bg-primary/15 text-primary"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      )}
                    >
                      <span>{r.emoji}</span>
                      <span className="tabular-nums">{r.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable list of reactors */}
              <ScrollArea className="max-h-52 border-t border-border/40">
                <div className="p-1.5 space-y-0.5">
                  {reactions.flatMap((r) => {
                    const rows: React.ReactNode[] = []
                    const isDirect = contact?.type !== "group"
                    const showAsYou = r.hasReacted || (isDirect && !isSentByMe)

                    if (showAsYou) {
                      rows.push(
                        <button
                          key={`${r.emoji}-you`}
                          type="button"
                          onClick={() => onReactionClick?.(r.emoji)}
                          className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left hover:bg-muted/60 transition-colors cursor-pointer"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground leading-tight">
                              You
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                              Click to remove
                            </p>
                          </div>
                          <span className="text-base leading-none shrink-0">{r.emoji}</span>
                        </button>
                      )
                    }
                    const otherCount = Math.max(0, r.count - (showAsYou ? 1 : 0))
                    const groupNames =
                      contact?.members?.map((m) => m.name) ?? FALLBACK_REACTORS
                    for (let i = 0; i < otherCount; i++) {
                      const reactorName =
                        contact?.type === "group"
                          ? groupNames[i % groupNames.length]
                          : contact?.name ?? FALLBACK_REACTORS[i % FALLBACK_REACTORS.length]
                      rows.push(
                        <div
                          key={`${r.emoji}-other-${i}`}
                          className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left"
                        >
                          <p className="text-xs font-medium text-foreground leading-tight truncate">
                            {reactorName}
                          </p>
                          <span className="text-base leading-none shrink-0">{r.emoji}</span>
                        </div>
                      )
                    }
                    return rows
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default MessageReactions
