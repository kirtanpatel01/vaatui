import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconArchive, IconArrowLeft } from "@tabler/icons-react"
import { type UserProfile } from "@/data/mock-contacts"
import SidebarMainItem from "./sidebar-main-item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "cn"

interface ArchivedChatsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contacts: UserProfile[]
  activeChatId?: string
  showScrollbar?: boolean
  onSelectContact?: (contact: UserProfile) => void
  onUpdateContact?: (updated: UserProfile) => void
  onDeleteChat?: (contactId: string) => void
}

export function ArchivedChatsSheet({
  open,
  onOpenChange,
  contacts,
  activeChatId,
  showScrollbar = false,
  onSelectContact,
  onUpdateContact,
  onDeleteChat,
}: ArchivedChatsSheetProps) {
  const [selectedId, setSelectedId] = React.useState(activeChatId)
  const [activeMenuContactId, setActiveMenuContactId] = React.useState<string | null>(null)

  const archivedContacts = contacts.filter((c) => c.tabs.includes("archived"))

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

  const handleSelect = (contact: UserProfile) => {
    setSelectedId(contact.id)
    onSelectContact?.(contact)
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "absolute inset-0 z-30 flex flex-col rounded-xl bg-background text-foreground shadow-xl transition-transform duration-200 ease-in-out",
        open
          ? "pointer-events-auto translate-x-0"
          : "pointer-events-none -translate-x-full"
      )}
    >
      {/* Header with Back button */}
      <div className="relative flex items-center justify-between border-b p-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => onOpenChange(false)}
            aria-label="Back to all chats"
          >
            <IconArrowLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-heading text-base font-semibold text-foreground leading-none">
              Archived Chats
            </h3>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground">
              {archivedContacts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Archived Chats List */}
      <div className="flex-1 min-h-0 relative flex flex-col">
        {archivedContacts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60 mb-3 text-muted-foreground">
              <IconArchive className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">No archived chats</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              Chats you archive will appear here instead of your main list.
            </p>
          </div>
        ) : showScrollbar ? (
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-2 py-1 space-y-0.5 divide-y divide-border/20">
              {archivedContacts.map((contact) => (
                <SidebarMainItem
                  key={contact.id}
                  contact={contact}
                  isActive={selectedId === contact.id}
                  isMenuOpen={activeMenuContactId === contact.id}
                  onMenuOpenChange={(openMenu) =>
                    setActiveMenuContactId(openMenu ? contact.id : null)
                  }
                  onClick={() => handleSelect(contact)}
                  onUpdateContact={onUpdateContact}
                  onDeleteChat={onDeleteChat}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar scroll-smooth">
            <div className="px-2 py-1 space-y-0.5 divide-y divide-border/20">
              {archivedContacts.map((contact) => (
                <SidebarMainItem
                  key={contact.id}
                  contact={contact}
                  isActive={selectedId === contact.id}
                  isMenuOpen={activeMenuContactId === contact.id}
                  onMenuOpenChange={(openMenu) =>
                    setActiveMenuContactId(openMenu ? contact.id : null)
                  }
                  onClick={() => handleSelect(contact)}
                  onUpdateContact={onUpdateContact}
                  onDeleteChat={onDeleteChat}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArchivedChatsSheet

