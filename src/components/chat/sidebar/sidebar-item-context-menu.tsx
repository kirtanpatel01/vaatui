import * as React from "react"
import {
  PopoverContent,
} from "@/components/ui/popover"
import {
  IconPin,
  IconPinnedOff,
  IconBell,
  IconBellOff,
  IconMail,
  IconMailOpened,
  IconArchive,
  IconTrash,
} from "@tabler/icons-react"
import { type UserProfile } from "@/data/mock-contacts"
import { cn } from "cn"

export interface SidebarItemContextMenuProps extends React.ComponentProps<typeof PopoverContent> {
  contact: UserProfile
  onTogglePin?: () => void
  onToggleMute?: () => void
  onToggleUnread?: () => void
  onToggleArchive?: () => void
  onDelete?: () => void
}

export function SidebarItemContextMenu({
  contact,
  onTogglePin,
  onToggleMute,
  onToggleUnread,
  onToggleArchive,
  onDelete,
  className,
  ...props
}: SidebarItemContextMenuProps) {
  const isUnread = (contact.unreadCount ?? 0) > 0 || contact.isMarkedUnread
  const isArchived = contact.tabs.includes("archived")

  return (
    <PopoverContent
      align="start"
      side="bottom"
      sideOffset={6}
      className={cn("w-56 p-1.5 gap-1", className)}
      {...props}
    >
      <div className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border/40 truncate">
        {contact.name}
      </div>

      <div className="flex flex-col gap-0.5 text-xs font-medium pt-1">
        {/* Pin / Unpin */}
        {onTogglePin && (
          <button
            type="button"
            onClick={onTogglePin}
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
        )}

        {/* Mute / Unmute */}
        {onToggleMute && (
          <button
            type="button"
            onClick={onToggleMute}
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
        )}

        {/* Mark as read / Mark as unread */}
        {onToggleUnread && (
          <button
            type="button"
            onClick={onToggleUnread}
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
        )}

        {/* Archive / Unarchive */}
        {onToggleArchive && (
          <button
            type="button"
            onClick={onToggleArchive}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
          >
            <IconArchive className="size-4 text-muted-foreground" />
            <span>{isArchived ? "Unarchive chat" : "Archive chat"}</span>
          </button>
        )}

        {/* Divider */}
        {onDelete && <div className="my-1 h-px bg-border/50" />}

        {/* Delete chat */}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-destructive hover:bg-destructive/10 transition-colors cursor-pointer select-none"
          >
            <IconTrash className="size-4 text-destructive" />
            <span>Delete chat</span>
          </button>
        )}
      </div>
    </PopoverContent>
  )
}

export default SidebarItemContextMenu
