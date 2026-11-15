import * as React from "react"
import {
  type UserProfile,
  type MessageDeliveryStatus,
  type MessageContentType,
} from "@/data/mock-contacts"
import { formatChatTimestamp } from "@/lib/format-date"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  IconAlertCircle,
  IconArchive,
  IconAt,
  IconBell,
  IconBellOff,
  IconCheck,
  IconChecks,
  IconClock,
  IconEdit,
  IconFileText,
  IconMail,
  IconMailOpened,
  IconMicrophone,
  IconPhoto,
  IconPin,
  IconPinnedOff,
  IconSpeakerphone,
  IconTrash,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

export const sidebarMainItemVariants = cva(
  "group relative flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors select-none outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/60 active:bg-muted",
        active: "bg-secondary",
        ghost: "hover:bg-transparent",
      },
      size: {
        default: "p-2.5 gap-3",
        compact: "p-2 gap-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SidebarMainItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMainItemVariants> {
  contact: UserProfile
  isActive?: boolean
  isMenuOpen?: boolean
  onMenuOpenChange?: (open: boolean) => void
  onUpdateContact?: (updated: UserProfile) => void
  onDeleteChat?: (contactId: string) => void
}

function DeliveryStatusIcon({ status }: { status?: MessageDeliveryStatus }) {
  if (!status) return null

  switch (status) {
    case "sending":
      return <IconClock className="size-3.5 shrink-0 text-muted-foreground stroke-[2]" />
    case "sent":
      return <IconCheck className="size-3.5 shrink-0 text-muted-foreground stroke-[2]" />
    case "delivered":
      return <IconChecks className="size-3.5 shrink-0 text-muted-foreground stroke-[2]" />
    case "read":
      return <IconChecks className="size-3.5 shrink-0 text-read stroke-[2.2]" />
    case "failed":
      return <IconAlertCircle className="size-3.5 shrink-0 text-destructive stroke-[2.2]" />
    default:
      return null
  }
}

function MediaIcon({ type }: { type?: MessageContentType }) {
  if (!type || type === "text") return null

  switch (type) {
    case "photo":
      return <IconPhoto className="size-3.5 shrink-0 text-muted-foreground" />
    case "video":
      return <IconVideo className="size-3.5 shrink-0 text-muted-foreground" />
    case "audio":
      return <IconMicrophone className="size-3.5 shrink-0 text-muted-foreground" />
    case "file":
      return <IconFileText className="size-3.5 shrink-0 text-muted-foreground" />
    default:
      return null
  }
}

export function SidebarMainItem({
  contact,
  isActive = false,
  isMenuOpen: controlledMenuOpen,
  onMenuOpenChange,
  variant,
  size,
  className,
  onClick,
  onUpdateContact,
  onDeleteChat,
  ...props
}: SidebarMainItemProps) {
  const { lastMessage } = contact
  const effectiveVariant = isActive ? "active" : (variant ?? "default")
  const [internalPopoverOpen, setInternalPopoverOpen] = React.useState(false)

  const isMenuOpen = controlledMenuOpen !== undefined ? controlledMenuOpen : internalPopoverOpen
  const setMenuOpen = (open: boolean, eventDetails?: any) => {
    // PopoverTrigger internally triggers on normal left-click ('trigger-press')
    // We strictly block opening via standard click! It must ONLY open via context-menu (right click / two-finger tap) or long-press.
    if (open && eventDetails?.reason === "trigger-press") {
      return
    }

    if (controlledMenuOpen === undefined) {
      setInternalPopoverOpen(open)
    }
    onMenuOpenChange?.(open)
  }

  // Long press detection for mobile devices (500ms hold)
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const isLongPressRef = React.useRef(false)

  const handleTouchStart = () => {
    isLongPressRef.current = false
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true
      setMenuOpen(true)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(true)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If long press just triggered, suppress standard click
    if (isLongPressRef.current) {
      isLongPressRef.current = false
      return
    }
    onClick?.(e)
  }

  // Action handlers
  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    onUpdateContact?.({
      ...contact,
      isPinned: !contact.isPinned,
    })
  }

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    onUpdateContact?.({
      ...contact,
      isMuted: !contact.isMuted,
    })
  }

  const handleToggleUnread = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    const isCurrentlyUnread = Boolean(contact.unreadCount && contact.unreadCount > 0)
    onUpdateContact?.({
      ...contact,
      unreadCount: isCurrentlyUnread ? 0 : 1,
    })
  }

  const handleToggleArchive = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    const isArchived = contact.tabs.includes("archived")
    const newTabs = isArchived
      ? contact.tabs.filter((t) => t !== "archived")
      : [...contact.tabs, "archived"]
    onUpdateContact?.({
      ...contact,
      tabs: newTabs,
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    onDeleteChat?.(contact.id)
  }

  const isArchived = contact.tabs.includes("archived")
  const isUnread = Boolean(contact.unreadCount && contact.unreadCount > 0)

  return (
    <Popover open={isMenuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <button
            type="button"
            className={cn(
              sidebarMainItemVariants({ variant: effectiveVariant, size, className })
            )}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            {...props}
          />
        }
      >
        {/* Avatar Container */}
        <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-muted/80 text-foreground font-semibold text-sm">
          {contact.type === "group" ? (
            <IconUsers className="size-5 text-muted-foreground stroke-[1.75]" />
          ) : contact.type === "announcement" ? (
            <IconSpeakerphone className="size-5 text-muted-foreground stroke-[1.75]" />
          ) : (
            <span>{contact.name[0]}</span>
          )}

          {/* Online Indicator Badge */}
          {contact.isOnline && (
            <span
              aria-label="Online"
              className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-online ring-2 ring-background"
            />
          )}
        </div>

        {/* Main Details */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Contact Name + Timestamp */}
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm font-semibold text-foreground truncate leading-tight">
              {contact.name}
            </h4>
            <span
              className={cn(
                "text-xs shrink-0 font-normal",
                contact.unreadCount && contact.unreadCount > 0
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              {formatChatTimestamp(lastMessage.time)}
            </span>
          </div>

          {/* Row 2: Message preview + Badges / Pin / Mute */}
          <div className="flex items-center justify-between gap-1.5 mt-1">
            {/* Left: Delivery tick / Media Icon / Message text */}
            <div className="flex items-center gap-1 min-w-0 text-xs">
              {/* Outbound delivery status (sent, delivered, read, sending, failed) */}
              {lastMessage.isSentByMe && (
                <DeliveryStatusIcon status={lastMessage.status ?? "sent"} />
              )}

              {/* Inbound: Typing animation or Draft */}
              {lastMessage.isTyping ? (
                <span className="text-online font-medium truncate flex items-center gap-1">
                  <span className="inline-block size-1.5 rounded-full bg-online animate-pulse" />
                  Typing...
                </span>
              ) : lastMessage.isDraft ? (
                <span className="text-starred font-medium truncate flex items-center gap-1">
                  <IconEdit className="size-3 shrink-0" />
                  Draft: <span className="text-muted-foreground font-normal">{lastMessage.text}</span>
                </span>
              ) : (
                <span className="text-muted-foreground truncate flex items-center gap-1">
                  {/* Media Icon if photo/video/audio/file */}
                  <MediaIcon type={lastMessage.contentType} />

                  {/* Emoji prefix if any */}
                  {lastMessage.emoji ? `${lastMessage.emoji} ` : ""}

                  {/* Author prefix for group chats */}
                  {lastMessage.authorPrefix ? (
                    <span className="font-normal text-muted-foreground">
                      {lastMessage.authorPrefix}
                    </span>
                  ) : null}

                  <span className="truncate">{lastMessage.text}</span>
                </span>
              )}
            </div>

            {/* Right: Badges, Muted Icon, Pin Icon */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Mention badge '@' */}
              {contact.hasMention && (
                <span
                  title="Mentioned"
                  className="flex size-4 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold"
                >
                  <IconAt className="size-2.5 stroke-[3]" />
                </span>
              )}

              {/* Muted Bell Icon */}
              {contact.isMuted && (
                <IconBellOff className="size-3.5 text-muted-foreground/70" />
              )}

              {/* Pin Icon */}
              {contact.isPinned && (
                <IconPin className="size-3.5 text-muted-foreground/80 rotate-45" />
              )}

              {/* Unread Message Count Badge */}
              {contact.unreadCount && contact.unreadCount > 0 ? (
                <span
                  className={cn(
                    "flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[10px] font-bold leading-none select-none",
                    contact.isMuted
                      ? "bg-muted-foreground/30 text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </PopoverTrigger>

      {/* Popover Menu with Quick Actions */}
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-56 p-1.5 gap-1"
      >
        <div className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border/40 truncate">
          {contact.name}
        </div>

        <div className="flex flex-col gap-0.5 text-xs font-medium pt-1">
          {/* Pin / Unpin */}
          <button
            type="button"
            onClick={handleTogglePin}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
          >
            {contact.isPinned ? (
              <>
                <IconPinnedOff className="size-4 text-muted-foreground" />
                <span>Unpin chat</span>
              </>
            ) : (
              <>
                <IconPin className="size-4 text-muted-foreground rotate-45" />
                <span>Pin chat</span>
              </>
            )}
          </button>

          {/* Mute / Unmute */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
          >
            {contact.isMuted ? (
              <>
                <IconBell className="size-4 text-muted-foreground" />
                <span>Unmute notifications</span>
              </>
            ) : (
              <>
                <IconBellOff className="size-4 text-muted-foreground" />
                <span>Mute notifications</span>
              </>
            )}
          </button>

          {/* Mark as read / Mark as unread */}
          <button
            type="button"
            onClick={handleToggleUnread}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
          >
            {isUnread ? (
              <>
                <IconMailOpened className="size-4 text-muted-foreground" />
                <span>Mark as read</span>
              </>
            ) : (
              <>
                <IconMail className="size-4 text-muted-foreground" />
                <span>Mark as unread</span>
              </>
            )}
          </button>

          {/* Archive / Unarchive */}
          <button
            type="button"
            onClick={handleToggleArchive}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
          >
            <IconArchive className="size-4 text-muted-foreground" />
            <span>{isArchived ? "Unarchive chat" : "Archive chat"}</span>
          </button>

          {/* Divider */}
          <div className="my-1 h-px bg-border/50" />

          {/* Delete chat */}
          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-destructive hover:bg-destructive/10 transition-colors cursor-pointer select-none"
          >
            <IconTrash className="size-4 text-destructive" />
            <span>Delete chat</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SidebarMainItem
