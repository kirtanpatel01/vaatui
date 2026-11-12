import * as React from "react"
import { type UserProfile } from "@/data/mock-contacts"
import { ScrollArea } from "@/components/ui/scroll-area"
import SidebarMainItem from "./sidebar-main-item"
import { IconArchive, IconChevronRight } from "@tabler/icons-react"
import { cn } from "cn"

interface SidebarMainProps {
  contacts?: UserProfile[]
  activeTab?: string
  activeChatId?: string
  className?: string
  showScrollbar?: boolean
  onOpenArchived?: () => void
  onSelectContact?: (contact: UserProfile) => void
  onUpdateContact?: (updated: UserProfile) => void
  onDeleteChat?: (contactId: string) => void
}

function SidebarMain({
  contacts = [],
  activeTab = "all",
  activeChatId = "chat_2",
  className,
  showScrollbar = false,
  onOpenArchived,
  onSelectContact,
  onUpdateContact,
  onDeleteChat,
}: SidebarMainProps) {
  const [activeMenuContactId, setActiveMenuContactId] = React.useState<string | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollDown, setCanScrollDown] = React.useState(false)

  // Count how many chats are archived
  const archivedCount = contacts.filter((c) => c.tabs.includes("archived")).length

  // Filter regular contacts based on active tab:
  // - In all tabs: exclude archived chats from regular view
  // - In "unread": strictly conversations where someone sent a message to the current user and it is unread
  const filteredContacts = contacts.filter((c) => {
    // Exclude archived chats from the regular list
    if (c.tabs.includes("archived")) return false

    if (activeTab === "all") return true
    if (activeTab === "unread") {
      return (
        !c.lastMessage.isSentByMe &&
        typeof c.unreadCount === "number" &&
        c.unreadCount > 0
      )
    }
    return c.tabs.includes(activeTab)
  })

  // Check scroll position to dynamically show/hide the bottom fade-out blur
  const checkScroll = React.useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const hasMoreBelow = el.scrollHeight - el.scrollTop - el.clientHeight > 8
    setCanScrollDown(hasMoreBelow)
  }, [])

  React.useEffect(() => {
    checkScroll()
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver(() => {
      checkScroll()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [filteredContacts, checkScroll])

  const handleSelect = (contact: UserProfile) => {
    onSelectContact?.(contact)
  }

  // WhatsApp / Telegram style compact single-row entry for Archived Chats
  const renderArchivedRow = () => {
    if (archivedCount === 0) return null

    return (
      <div className="pb-1">
        <button
          type="button"
          onClick={onOpenArchived}
          className="group flex w-full items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/70 transition-colors select-none cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
              <IconArchive className="size-4" />
            </div>
            <span className="font-semibold text-sm">Archived</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {archivedCount}
            </span>
            <IconChevronRight className="size-4 text-muted-foreground/70" />
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className={cn("relative flex-1 min-h-0 flex flex-col", className)}>
      {showScrollbar ? (
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-2 py-1 space-y-0.5 divide-y divide-border/20">
            {renderArchivedRow()}

            {filteredContacts.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-xs text-muted-foreground text-center px-4">
                No conversations in this tab
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <SidebarMainItem
                  key={contact.id}
                  contact={contact}
                  isActive={activeChatId === contact.id}
                  isMenuOpen={activeMenuContactId === contact.id}
                  onMenuOpenChange={(open) =>
                    setActiveMenuContactId(open ? contact.id : null)
                  }
                  onClick={() => handleSelect(contact)}
                  onUpdateContact={onUpdateContact}
                  onDeleteChat={onDeleteChat}
                />
              ))
            )}
          </div>
        </ScrollArea>
      ) : (
        <>
          <div
            ref={containerRef}
            onScroll={checkScroll}
            className="flex-1 min-h-0 overflow-y-auto no-scrollbar scroll-smooth"
          >
            <div className="px-2 py-1 space-y-0.5 divide-y divide-border/20">
              {renderArchivedRow()}

              {filteredContacts.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-xs text-muted-foreground text-center px-4">
                  No conversations in this tab
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <SidebarMainItem
                    key={contact.id}
                    contact={contact}
                    isActive={activeChatId === contact.id}
                    isMenuOpen={activeMenuContactId === contact.id}
                    onMenuOpenChange={(open) =>
                      setActiveMenuContactId(open ? contact.id : null)
                    }
                    onClick={() => handleSelect(contact)}
                    onUpdateContact={onUpdateContact}
                    onDeleteChat={onDeleteChat}
                  />
                ))
              )}
            </div>
          </div>

          {/* Bottom progressive blur fade-out overlay when more contacts exist below */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 right-0 h-12 transition-opacity duration-300",
              canScrollDown ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Layer 1: soft blur */}
            <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)]" />
            {/* Layer 2: deep blur towards bottom */}
            <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,transparent_30%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_30%,black_100%)]" />
            {/* Layer 3: subtle background fade to blend seamlessly into footer */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/85" />
          </div>
        </>
      )}
    </div>
  )
}

export default SidebarMain
