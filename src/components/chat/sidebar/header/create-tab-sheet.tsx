import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  IconX,
  IconUsers,
  IconSpeakerphone,
  IconPlus,
} from "@tabler/icons-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { type UserProfile } from "@/data/mock-contacts"
import { cn } from "cn"

export const CreateTabButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="secondary"
      size="icon"
      className={cn("shrink-0", className)}
      aria-label="Add tab"
      {...props}
    >
      <IconPlus />
    </Button>
  )
})
CreateTabButton.displayName = "CreateTabButton"

export const CreateTabDropdownItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DropdownMenuItem>
>(({ className, children, ...props }, ref) => {
  return (
    <DropdownMenuItem ref={ref} className={className} {...props}>
      <IconPlus className="size-4" />
      {children ?? <span>Add tab</span>}
    </DropdownMenuItem>
  )
})
CreateTabDropdownItem.displayName = "CreateTabDropdownItem"

interface CreateTabSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contacts: UserProfile[]
  onCreateTab: (name: string, selectedContactIds: string[]) => void
}

export function CreateTabSheet({
  open,
  onOpenChange,
  contacts,
  onCreateTab,
}: CreateTabSheetProps) {
  const [tabName, setTabName] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  // Reset state when sheet opens
  React.useEffect(() => {
    if (open) {
      setTabName("")
      setSelectedIds(new Set())
    }
  }, [open])

  const toggleContact = (id: string) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = tabName.trim()
    if (!trimmed) return
    onCreateTab(trimmed, Array.from(selectedIds))
    onOpenChange(false)
  }

  // Handle ESC key to close
  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "absolute inset-0 z-30 flex flex-col rounded-xl bg-popover text-popover-foreground shadow-xl transition-all duration-200 ease-in-out",
        open
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-4"
      )}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between border-b p-4 pb-3 shrink-0">
        <div>
          <h3 className="font-heading text-base font-medium text-foreground leading-none">
            New Filter Tab
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Select conversations for this tab.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="shrink-0"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          <IconX />
        </Button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="tab-name-input" className="text-xs font-medium text-foreground">
                Tab Name
              </label>
              <Input
                id="tab-name-input"
                value={tabName}
                onChange={(e) => setTabName(e.target.value)}
                placeholder="e.g. Work, Family, VIPs..."
                autoFocus={open}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Include Conversations ({selectedIds.size})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIds(
                      selectedIds.size === contacts.length
                        ? new Set()
                        : new Set(contacts.map((c) => c.id))
                    )
                  }
                  className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                >
                  {selectedIds.size === contacts.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="space-y-1">
                {contacts.map((contact) => {
                  const isSelected = selectedIds.has(contact.id)
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => toggleContact(contact.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-colors select-none cursor-pointer",
                        isSelected
                          ? "bg-secondary"
                          : "hover:bg-muted/60 text-muted-foreground"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleContact(contact.id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {contact.type === "group" ? (
                          <IconUsers className="size-4 text-muted-foreground" />
                        ) : contact.type === "announcement" ? (
                          <IconSpeakerphone className="size-4 text-muted-foreground" />
                        ) : (
                          <span>{contact.name[0]}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground truncate">{contact.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {contact.lastMessage.text}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 border-t p-4 shrink-0 bg-popover">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!tabName.trim()}>
            Create Tab
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateTabSheet
