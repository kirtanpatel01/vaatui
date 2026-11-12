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
import CameraModal from "./attachments/camera-modal"
import CreatePollModal from "./attachments/create-poll-modal"
import ShareContactModal from "./attachments/share-contact-modal"
import { useChat } from "@/components/chat/chat-provider"
import { type MessageAttachment } from "@/data/mock-messages"
import { type UserProfile } from "@/data/mock-contacts"
import { cn } from "cn"

export interface ChatInputBarProps extends React.ComponentProps<"div"> {
  placeholder?: string
  replyingTo?: {
    id: string
    senderName: string
    text: string
  } | null
  onCancelReply?: () => void
  onSendMessage?: (text: string, attachment?: MessageAttachment) => void
  onRecordVoice?: () => void
}

const ATTACHMENT_OPTIONS = [
  { id: "photo", icon: IconPhoto, label: "Photo or Video" },
  { id: "file", icon: IconFile, label: "File" },
  { id: "camera", icon: IconCamera, label: "Camera" },
  { id: "contact", icon: IconUserPlus, label: "Contact" },
  { id: "poll", icon: IconChartBar, label: "Poll" },
]

export function ChatInputBar({
  placeholder = "Type a message...",
  replyingTo,
  className,
  onCancelReply,
  onSendMessage,
  onRecordVoice,
  ...props
}: ChatInputBarProps) {
  const { contacts } = useChat()
  const [text, setText] = React.useState("")
  const [emojiOpen, setEmojiOpen] = React.useState(false)
  const [attachmentOpen, setAttachmentOpen] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Modals state
  const [cameraModalOpen, setCameraModalOpen] = React.useState(false)
  const [pollModalOpen, setPollModalOpen] = React.useState(false)
  const [contactModalOpen, setContactModalOpen] = React.useState(false)

  // Selected file / photo attachment pending send
  const [pendingAttachment, setPendingAttachment] = React.useState<MessageAttachment | null>(null)

  const photoFileInputRef = React.useRef<HTMLInputElement>(null)
  const docFileInputRef = React.useRef<HTMLInputElement>(null)

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
    if (!trimmed && !pendingAttachment) return
    onSendMessage?.(trimmed, pendingAttachment ?? undefined)
    setText("")
    setPendingAttachment(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    const isVid = file.type.startsWith("video")

    setPendingAttachment({
      type: isVid ? "video" : "photo",
      thumbnailUrl: objectUrl,
      url: objectUrl,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    })
    e.target.value = ""
  }

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPendingAttachment({
      type: "file",
      url: objectUrl,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    })
    e.target.value = ""
  }

  const handleCameraCapture = (dataUrl: string) => {
    setPendingAttachment({
      type: "photo",
      thumbnailUrl: dataUrl,
      url: dataUrl,
      fileName: `camera_${Date.now()}.jpg`,
      fileSize: "1.2 MB",
    })
  }

  const handleCreatePoll = (question: string, options: string[], allowMultiple: boolean) => {
    onSendMessage?.("", {
      type: "poll",
      poll: {
        question,
        allowMultiple,
        options: options.map((opt, i) => ({
          id: `opt_${Date.now()}_${i}`,
          text: opt,
          votes: [],
        })),
      },
    })
  }

  const handleShareContact = (contact: UserProfile) => {
    onSendMessage?.("", {
      type: "contact",
      contact: {
        name: contact.name,
        phone: contact.phone,
        avatar: contact.avatar,
      },
    })
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

      {/* Pending Attachment Compact Chip Preview */}
      {pendingAttachment && (
        <div className="flex items-center">
          <div className="inline-flex items-center gap-2.5 rounded-2xl bg-muted/70 border border-border/70 p-1.5 pr-2.5 text-xs shadow-xs max-w-sm animate-in fade-in-0 zoom-in-95 duration-100">
            {pendingAttachment.thumbnailUrl ? (
              <img
                src={pendingAttachment.thumbnailUrl}
                alt="Upload preview"
                className="size-9 rounded-xl object-cover ring-1 ring-border/50 shrink-0"
              />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconFile className="size-4.5" />
              </div>
            )}
            <div className="min-w-0 pr-1">
              <p className="font-semibold text-foreground text-xs truncate max-w-[180px] leading-tight">
                {pendingAttachment.fileName || "Attachment"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{pendingAttachment.fileSize}</p>
            </div>

            <button
              type="button"
              onClick={() => setPendingAttachment(null)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-background/80 transition-colors cursor-pointer shrink-0 ml-1"
              title="Remove attachment"
            >
              <IconX className="size-3.5" />
            </button>
          </div>
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
              {ATTACHMENT_OPTIONS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAttachmentOpen(false)
                      if (item.id === "photo") {
                        photoFileInputRef.current?.click()
                      } else if (item.id === "file") {
                        docFileInputRef.current?.click()
                      } else if (item.id === "camera") {
                        setCameraModalOpen(true)
                      } else if (item.id === "contact") {
                        setContactModalOpen(true)
                      } else if (item.id === "poll") {
                        setPollModalOpen(true)
                      }
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

      {/* Hidden File Inputs for Photo/Video and Document pickers */}
      <input
        ref={photoFileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handlePhotoSelect}
        className="hidden"
      />
      <input
        ref={docFileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,.*"
        onChange={handleDocSelect}
        className="hidden"
      />

      {/* Camera Live Snapshot Modal */}
      <CameraModal
        open={cameraModalOpen}
        onOpenChange={setCameraModalOpen}
        onCapture={handleCameraCapture}
      />

      {/* Create Poll Dialog */}
      <CreatePollModal
        open={pollModalOpen}
        onOpenChange={setPollModalOpen}
        onCreatePoll={handleCreatePoll}
      />

      {/* Share Contact Dialog */}
      <ShareContactModal
        contacts={contacts}
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        onShareContact={handleShareContact}
      />
    </div>
  )
}

export default ChatInputBar
