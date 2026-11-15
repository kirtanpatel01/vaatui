import * as React from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { toast } from "@/components/ui/toast"
import { MOCK_CONTACTS } from "@/data/mock-contacts"
import { type ChatMessage } from "@/data/mock-messages"
import {
  IconSearch,
  IconArrowForwardUp,
  IconCheck,
  IconUsers,
  IconSpeakerphone,
  IconPhoto,
  IconMicrophone,
  IconFile,
  IconCornerDownLeft,
} from "@tabler/icons-react"
import { cn } from "cn"

export interface ForwardMessageDialogProps {
  message: ChatMessage | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onForwardConfirm?: (selectedContactIds: string[], message: ChatMessage) => void
}

export function ForwardMessageDialog({
  message,
  open,
  onOpenChange,
  onForwardConfirm,
}: ForwardMessageDialogProps) {
  const [search, setSearch] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [activeIndex, setActiveIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Reset state when opening
  React.useEffect(() => {
    if (open) {
      setSearch("")
      setSelectedIds([])
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  if (!message) return null

  const filteredContacts = MOCK_CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim())
  )

  const toggleContact = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSendForward = (overrideIds?: string[]) => {
    const idsToSend = overrideIds && overrideIds.length > 0 ? overrideIds : selectedIds
    if (idsToSend.length === 0) return

    onForwardConfirm?.(idsToSend, message)
    onOpenChange(false)

    const recipientNames = MOCK_CONTACTS.filter((c) => idsToSend.includes(c.id))
      .map((c) => c.name)
      .slice(0, 2)
      .join(", ")

    const moreCount = idsToSend.length > 2 ? ` +${idsToSend.length - 2} more` : ""

    toast.add({
      title: "Forwarded",
      description: `Sent to ${recipientNames}${moreCount}`,
      type: "success",
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredContacts.length))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) =>
        prev <= 0 ? filteredContacts.length - 1 : prev - 1
      )
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIds.length > 0) {
        handleSendForward()
      } else if (filteredContacts[activeIndex]) {
        // Quick 1-tap forward to currently highlighted contact
        handleSendForward([filteredContacts[activeIndex].id])
      }
    }
  }

  const getPreviewText = () => {
    if (message.text) return message.text
    if (message.attachment?.type === "photo") return "Photo attachment"
    if (message.attachment?.type === "audio") return "Voice note"
    if (message.attachment?.type === "file") return message.attachment.fileName || "Document file"
    return "Message"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-0 gap-0 overflow-hidden"
      >
        {/* Spotlight Top Bar: Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
          <IconSearch className="size-4.5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search chat or contact to forward..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
          />

          {/* Quick Context Pill showing message snippet */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground max-w-[140px] truncate select-none shrink-0">
            {message.attachment?.type === "photo" ? (
              <IconPhoto className="size-3 shrink-0 text-primary" />
            ) : message.attachment?.type === "audio" ? (
              <IconMicrophone className="size-3 shrink-0 text-primary" />
            ) : message.attachment?.type === "file" ? (
              <IconFile className="size-3 shrink-0 text-primary" />
            ) : (
              <IconArrowForwardUp className="size-3 shrink-0 text-primary" />
            )}
            <span className="truncate">{getPreviewText()}</span>
          </div>
        </div>

        {/* Raycast-style List */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 no-scrollbar select-none">
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Chats ({filteredContacts.length})
          </div>

          {filteredContacts.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching chats found
            </div>
          ) : (
            filteredContacts.map((contact, index) => {
              const isSelected = selectedIds.includes(contact.id)
              const isHighlighted = activeIndex === index
              const initials = contact.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()

              return (
                <div
                  key={contact.id}
                  onClick={() => toggleContact(contact.id)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors",
                    isHighlighted ? "bg-muted/80 text-foreground" : "text-muted-foreground hover:bg-muted/50",
                    isSelected && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Minimal Avatar */}
                    <div
                      className={cn(
                        "flex size-7 items-center justify-center rounded-lg text-[11px] font-semibold shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {contact.type === "group" ? (
                        <IconUsers className="size-3.5" />
                      ) : contact.type === "announcement" ? (
                        <IconSpeakerphone className="size-3.5" />
                      ) : (
                        initials
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className={cn("block truncate font-medium text-xs", isSelected ? "text-primary" : "text-foreground")}>
                        {contact.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {contact.lastMessage?.text || contact.type}
                      </span>
                    </div>
                  </div>

                  {/* Right side selection / action indicator */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected ? (
                      <div className="flex size-4 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <IconCheck className="size-3 stroke-[3]" />
                      </div>
                    ) : isHighlighted ? (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        Select
                      </span>
                    ) : null}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Command Palette Keyboard Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 border-t border-border/60 bg-muted/20 text-[11px] text-muted-foreground select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <Kbd>Space</Kbd>
              <span>Toggle</span>
            </span>
            <span className="flex items-center gap-1">
              <Kbd className="gap-0.5">
                <IconCornerDownLeft className="size-3" />
              </Kbd>
              <span>{selectedIds.length > 0 ? `Forward (${selectedIds.length})` : "Forward"}</span>
            </span>
          </div>

          {selectedIds.length > 0 ? (
            <button
              type="button"
              onClick={() => handleSendForward()}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <span>Send</span>
              <IconArrowForwardUp className="size-3.5" />
            </button>
          ) : (
            <span className="text-[10px] text-muted-foreground">Esc to cancel</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ForwardMessageDialog
