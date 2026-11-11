import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  IconPlus,
  IconMoodSmile,
  IconGif,
  IconAt,
  IconCode,
  IconMicrophone,
  IconSend,
  IconX,
  IconPhoto,
  IconFile,
  IconCamera,
  IconUserPlus,
  IconChartBar,
  IconSearch,
} from "@tabler/icons-react"
import { cn } from "cn"

export interface ChatInputBarProps extends React.ComponentProps<"div"> {
  placeholder?: string
  replyingTo?: {
    id: string
    senderName: string
    text: string
  } | null
  onCancelReply?: () => void
  onSendMessage?: (text: string) => void
  onAttachFile?: () => void
  onRecordVoice?: () => void
}

const EMOJI_CATEGORIES = [
  { icon: "😊", label: "Smileys" },
  { icon: "🕒", label: "Recent" },
  { icon: "🔥", label: "Trending" },
  { icon: "⚽", label: "Activities" },
  { icon: "💎", label: "Objects" },
  { icon: "💡", label: "Ideas" },
  { icon: "🚩", label: "Flags" },
]

const FREQUENT_EMOJIS = ["😂", "❤️", "👍", "🔥", "🎉", "😍", "🥹"]
const SMILEYS_PEOPLE = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂",
  "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍"
]

const ATTACHMENT_OPTIONS = [
  { icon: IconPhoto, label: "Photo or Video" },
  { icon: IconFile, label: "File" },
  { icon: IconMicrophone, label: "Audio Message" },
  { icon: IconCamera, label: "Camera" },
  { icon: IconUserPlus, label: "Contact" },
  { icon: IconChartBar, label: "Poll" },
]

export function ChatInputBar({
  placeholder = "Type a message...",
  replyingTo,
  className,
  onCancelReply,
  onSendMessage,
  onAttachFile,
  onRecordVoice,
  ...props
}: ChatInputBarProps) {
  const [text, setText] = React.useState("")
  const [emojiOpen, setEmojiOpen] = React.useState(false)
  const [attachmentOpen, setAttachmentOpen] = React.useState(false)
  const [emojiSearch, setEmojiSearch] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  React.useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [text])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSendMessage?.(trimmed)
    setText("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAddEmoji = (emoji: string) => {
    setText((prev) => prev + emoji)
    textareaRef.current?.focus()
  }

  return (
    <div
      className={cn(
        "flex flex-col border-t bg-background/90 backdrop-blur-xs p-3 px-4 shrink-0 gap-2",
        className
      )}
      {...props}
    >
      {/* Replying Preview Banner */}
      {replyingTo && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-secondary/80 border border-border/40 px-3 py-1.5 text-xs">
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
            onClick={onCancelReply}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md cursor-pointer"
            aria-label="Cancel reply"
          >
            <IconX className="size-3.5" />
          </button>
        </div>
      )}

      {/* Main Bar with Plus icon, Input, and Actions */}
      <div className="flex items-center gap-2 w-full">
        {/* Plus (+) Attachments Menu */}
        <Popover open={attachmentOpen} onOpenChange={setAttachmentOpen}>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                aria-label="More attachments"
              />
            }
          >
            <IconPlus className="size-5" />
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="start"
            sideOffset={12}
            className="w-52 p-1.5 rounded-2xl shadow-xl border border-border/60 bg-popover/95 backdrop-blur-md"
          >
            <div className="flex flex-col gap-0.5 text-xs font-medium">
              {ATTACHMENT_OPTIONS.map((item, idx) => {
                const Icon = item.icon
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAttachmentOpen(false)
                      onAttachFile?.()
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Input Textarea Container */}
        <div className="flex-1 min-w-0 flex items-center rounded-2xl bg-secondary/50 border border-border/40 px-3.5 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none max-h-32 leading-relaxed"
          />

          {/* Right inline icons: Emoji, GIF, Mention, Code */}
          <div className="flex items-center gap-1 ml-2 text-muted-foreground shrink-0 select-none">
            {/* Emoji Popover */}
            <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="p-1 hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Emoji picker"
                  />
                }
              >
                <IconMoodSmile className="size-4.5" />
              </PopoverTrigger>

              <PopoverContent
                side="top"
                align="end"
                sideOffset={12}
                className="w-72 p-3 rounded-3xl shadow-2xl border border-border/60 bg-popover/95 backdrop-blur-md"
              >
                {/* Category Navigation Icons */}
                <div className="flex items-center justify-between pb-2 border-b border-border/40 text-sm">
                  {EMOJI_CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="size-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      title={cat.label}
                    >
                      {cat.icon}
                    </button>
                  ))}
                </div>

                {/* Emoji Search Input */}
                <div className="relative mt-2.5 mb-3">
                  <IconSearch className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={emojiSearch}
                    onChange={(e) => setEmojiSearch(e.target.value)}
                    placeholder="Search emojis..."
                    className="w-full rounded-xl bg-secondary/70 border border-border/40 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>

                {/* Frequently Used */}
                <div className="mb-2">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                    Frequently Used
                  </p>
                  <div className="flex items-center justify-between">
                    {FREQUENT_EMOJIS.map((em, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddEmoji(em)}
                        className="size-7 flex items-center justify-center text-base hover:scale-120 transition-transform cursor-pointer"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smileys & People */}
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                    Smileys & People
                  </p>
                  <div className="grid grid-cols-7 gap-1">
                    {SMILEYS_PEOPLE.map((em, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddEmoji(em)}
                        className="size-7 flex items-center justify-center text-base hover:scale-120 transition-transform cursor-pointer"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <button
              type="button"
              className="p-1 hover:text-foreground transition-colors cursor-pointer"
              aria-label="Insert GIF"
            >
              <IconGif className="size-4.5" />
            </button>

            <button
              type="button"
              className="p-1 hover:text-foreground transition-colors cursor-pointer"
              aria-label="Mention contact"
            >
              <IconAt className="size-4.5" />
            </button>

            <button
              type="button"
              className="p-1 hover:text-foreground transition-colors cursor-pointer"
              aria-label="Insert code block"
            >
              <IconCode className="size-4.5" />
            </button>
          </div>
        </div>

        {/* Microphone / Voice note button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRecordVoice}
          className="size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Voice note"
        >
          <IconMicrophone className="size-5" />
        </Button>

        {/* Send message button */}
        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          className="size-9 shrink-0 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 shadow-xs cursor-pointer"
          aria-label="Send message"
        >
          <IconSend className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default ChatInputBar
