import * as React from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
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
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Track dark mode for Emoji Mart theme
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

  // Insert emoji at the exact current cursor position
  const handleSelectEmoji = (emoji: { native: string }) => {
    const emojiChar = emoji.native
    if (!emojiChar) return

    const textarea = textareaRef.current
    if (!textarea) {
      setText((prev) => prev + emojiChar)
      return
    }

    const start = textarea.selectionStart ?? text.length
    const end = textarea.selectionEnd ?? text.length
    const newText = text.substring(0, start) + emojiChar + text.substring(end)
    setText(newText)

    // Close picker after selection
    setEmojiOpen(false)

    // Restore focus and place cursor right after inserted emoji
    requestAnimationFrame(() => {
      textarea.focus()
      const newPos = start + emojiChar.length
      textarea.setSelectionRange(newPos, newPos)
    })
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-3 bg-background/95 backdrop-blur-md border-t border-border/40 w-full",
        className
      )}
      {...props}
    >
      {/* Replying Banner Preview */}
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
            {/* Emoji Mart Picker Popover matching the exact configuration from the screenshot */}
            <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "p-1 hover:text-foreground transition-colors cursor-pointer",
                      emojiOpen && "text-foreground"
                    )}
                    aria-label="Emoji picker"
                  />
                }
              >
                <IconMoodSmile className="size-4.5" />
              </PopoverTrigger>

              <PopoverContent
                side="top"
                align="end"
                sideOffset={14}
                className="w-auto p-0 border-0 shadow-2xl bg-transparent overflow-hidden rounded-2xl duration-75 data-[state=open]:duration-75 data-[state=closed]:duration-50"
              >
                <Picker
                  data={data}
                  onEmojiSelect={handleSelectEmoji}
                  set="native"
                  theme={isDark ? "dark" : "light"}
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
