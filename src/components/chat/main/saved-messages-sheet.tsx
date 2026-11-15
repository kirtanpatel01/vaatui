import * as React from "react"
import { type ChatMessage } from "@/data/mock-messages"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  IconStar,
  IconPin,
  IconSearch,
  IconX,
  IconArrowRight,
  IconCalendar,
  IconCheck,
  IconTrash,
  IconShare,
  IconChecks,
} from "@tabler/icons-react"
import { toast } from "@/components/ui/toast"
import { cn } from "cn"

export interface SavedMessagesSheetProps {
  type: "starred" | "pinned"
  messages: ChatMessage[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onJumpToMessage: (messageId: string) => void
  onToggleStatus: (messageId: string) => void
  onBulkUnset?: (messageIds: string[]) => void
  onBulkDelete?: (messageIds: string[]) => void
  onBulkForward?: (messages: ChatMessage[]) => void
}

const BATCH_SIZE = 25

export function SavedMessagesSheet({
  type,
  messages,
  open,
  onOpenChange,
  onJumpToMessage,
  onToggleStatus,
  onBulkUnset,
  onBulkDelete,
  onBulkForward,
}: SavedMessagesSheetProps) {
  const [filterQuery, setFilterQuery] = React.useState("")
  const [visibleCount, setVisibleCount] = React.useState(BATCH_SIZE)
  const [isSelectMode, setIsSelectMode] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const isStarred = type === "starred"
  const title = isStarred ? "Starred messages" : "Pinned messages"

  // Reset state when opened or type changes
  React.useEffect(() => {
    if (open) {
      setFilterQuery("")
      setVisibleCount(BATCH_SIZE)
      setIsSelectMode(false)
      setSelectedIds(new Set())
    }
  }, [open, type])

  // Filter messages by text or sender
  const filteredMessages = React.useMemo(() => {
    const q = filterQuery.trim().toLowerCase()
    if (!q) return messages
    return messages.filter((m) => {
      const matchText = m.text?.toLowerCase().includes(q)
      const matchSender = m.senderName?.toLowerCase().includes(q)
      return matchText || matchSender
    })
  }, [messages, filterQuery])

  // Slice for progressive rendering
  const renderedMessages = React.useMemo(() => {
    return filteredMessages.slice(0, visibleCount)
  }, [filteredMessages, visibleCount])

  // Progressive infinite scroll loader
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 150) {
      if (visibleCount < filteredMessages.length) {
        setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredMessages.length))
      }
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMessages.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredMessages.map((m) => m.id)))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleBulkUnset = () => {
    if (selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    if (onBulkUnset) {
      onBulkUnset(ids)
    } else {
      ids.forEach((id) => onToggleStatus(id))
    }
    toast.add({
      title: isStarred
        ? `Unstarred ${ids.length} messages`
        : `Unpinned ${ids.length} messages`,
      type: "success",
    })
    setSelectedIds(new Set())
    setIsSelectMode(false)
  }

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    onBulkDelete?.(ids)
    toast.add({
      title: `Deleted ${ids.length} messages`,
      type: "success",
    })
    setSelectedIds(new Set())
    setIsSelectMode(false)
  }

  const handleBulkForward = () => {
    if (selectedIds.size === 0) return
    const selectedMsgs = messages.filter((m) => selectedIds.has(m.id))
    onBulkForward?.(selectedMsgs)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isStarred ? (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-starred/10 text-starred">
                  <IconStar className="size-4.5 fill-starred" />
                </div>
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <IconPin className="size-4.5" />
                </div>
              )}
              <div>
                <SheetTitle className="text-sm font-semibold">{title}</SheetTitle>
                <p className="text-[11px] text-muted-foreground">
                  {messages.length} {messages.length === 1 ? "message" : "messages"}
                </p>
              </div>
            </div>

            {/* Select Toggle Button */}
            {messages.length > 0 && (
              <Button
                variant={isSelectMode ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setIsSelectMode(!isSelectMode)
                  setSelectedIds(new Set())
                }}
                className="text-xs h-7 px-2.5 cursor-pointer mr-6"
              >
                {isSelectMode ? "Cancel" : "Select"}
              </Button>
            )}
          </div>

          {/* Quick Search Bar for Large Archives */}
          {messages.length > 5 && !isSelectMode && (
            <div className="relative mt-2">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => {
                  setFilterQuery(e.target.value)
                  setVisibleCount(BATCH_SIZE)
                }}
                placeholder={`Search ${isStarred ? "starred" : "pinned"} messages...`}
                className="h-8 w-full rounded-lg bg-background border border-border/70 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary/60 transition-colors"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <IconX className="size-3" />
                </button>
              )}
            </div>
          )}

          {/* Selection Bar when in select mode */}
          {isSelectMode && (
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-muted-foreground font-medium">
                {selectedIds.size} of {filteredMessages.length} selected
              </span>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <IconChecks className="size-3.5" />
                {selectedIds.size === filteredMessages.length ? "Deselect all" : "Select all"}
              </button>
            </div>
          )}
        </SheetHeader>

        {/* Scrollable Message List */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar"
        >
          {filteredMessages.length === 0 ? (
            <div className="py-20 text-center text-xs text-muted-foreground">
              {filterQuery
                ? "No matching messages found."
                : `No ${isStarred ? "starred" : "pinned"} messages in this conversation.`}
            </div>
          ) : (
            renderedMessages.map((msg) => {
              const isSelected = selectedIds.has(msg.id)

              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    if (isSelectMode) {
                      toggleSelectOne(msg.id)
                    } else {
                      onJumpToMessage(msg.id)
                      onOpenChange(false)
                    }
                  }}
                  className={cn(
                    "group relative flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none",
                    isSelected
                      ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30"
                      : "border-border/70 bg-card hover:bg-accent/40 hover:border-border"
                  )}
                >
                  {/* Select Checkbox Indicator */}
                  {isSelectMode && (
                    <div
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-md border mt-0.5 transition-colors",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/40 bg-background"
                      )}
                    >
                      {isSelected && <IconCheck className="size-3.5 stroke-[2.5]" />}
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground truncate">
                        {msg.isSentByMe ? "You" : msg.senderName}
                      </span>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] shrink-0">
                        <IconCalendar className="size-3" />
                        <span>{msg.date}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {msg.text || (msg.attachment ? `[${msg.attachment.type}]` : "")}
                    </p>

                    {!isSelectMode && (
                      <div className="flex items-center justify-between pt-1 mt-1 border-t border-border/40 text-[11px]">
                        <span className="text-primary group-hover:underline inline-flex items-center gap-1 font-medium">
                          Jump to message
                          <IconArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleStatus(msg.id)
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors text-[11px] cursor-pointer"
                        >
                          {isStarred ? "Unstar" : "Unpin"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Progressive batch indicator if more items remain */}
          {visibleCount < filteredMessages.length && (
            <div className="py-2 text-center text-[11px] text-muted-foreground">
              Showing {visibleCount} of {filteredMessages.length} messages...
            </div>
          )}
        </div>

        {/* Bulk Action Footer in Select Mode */}
        {isSelectMode && (
          <div className="p-3 border-t bg-muted/30 flex items-center justify-between gap-2 shrink-0 animate-in slide-in-from-bottom-2 duration-150">
            <span className="text-xs font-medium text-foreground ml-1">
              {selectedIds.size} selected
            </span>

            <div className="flex items-center gap-1.5">
              {/* Bulk Forward */}
              <Button
                variant="outline"
                size="sm"
                disabled={selectedIds.size === 0}
                onClick={handleBulkForward}
                className="text-xs h-8 gap-1.5 cursor-pointer"
              >
                <IconShare className="size-3.5" />
                <span>Forward</span>
              </Button>

              {/* Bulk Unstar / Unpin */}
              <Button
                variant="outline"
                size="sm"
                disabled={selectedIds.size === 0}
                onClick={handleBulkUnset}
                className="text-xs h-8 gap-1.5 cursor-pointer"
              >
                {isStarred ? <IconStar className="size-3.5" /> : <IconPin className="size-3.5" />}
                <span>{isStarred ? "Unstar" : "Unpin"}</span>
              </Button>

              {/* Bulk Delete */}
              <Button
                variant="destructive"
                size="sm"
                disabled={selectedIds.size === 0}
                onClick={handleBulkDelete}
                className="text-xs h-8 gap-1.5 cursor-pointer"
              >
                <IconTrash className="size-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default SavedMessagesSheet
