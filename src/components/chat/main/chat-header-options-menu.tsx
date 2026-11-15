import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  IconDotsVertical,
  IconBell,
  IconBellOff,
  IconStar,
  IconPin,
  IconDownload,
  IconFileTypeTxt,
  IconJson,
  IconMarkdown,
  IconClearAll,
  IconUserX,
  IconLogout,
} from "@tabler/icons-react"
import { type UserProfile } from "@/data/mock-contacts"
import { type ChatMessage } from "@/data/mock-messages"
import { exportChatAsText, exportChatAsJson, exportChatAsMarkdown } from "./chat-export-utils"
import { toast } from "@/components/ui/toast"

export interface ChatHeaderOptionsMenuProps {
  contact: UserProfile
  messages: ChatMessage[]
  isMuted: boolean
  isBlocked: boolean
  starredCount: number
  pinnedCount: number
  onToggleMute: () => void
  onToggleBlock: () => void
  onClearMessages: () => void
  onOpenStarredModal: () => void
  onOpenPinnedModal: () => void
}

export function ChatHeaderOptionsMenu({
  contact,
  messages,
  isMuted,
  isBlocked,
  starredCount,
  pinnedCount,
  onToggleMute,
  onToggleBlock,
  onClearMessages,
  onOpenStarredModal,
  onOpenPinnedModal,
}: ChatHeaderOptionsMenuProps) {
  const [clearAlertOpen, setClearAlertOpen] = React.useState(false)
  const [blockAlertOpen, setBlockAlertOpen] = React.useState(false)

  const isGroup = contact.type === "group"

  const handleMuteToggle = () => {
    onToggleMute()
    toast.add({
      title: isMuted ? "Notifications unmuted" : "Notifications muted",
      type: "success",
    })
  }

  const handleExportText = () => {
    exportChatAsText(contact, messages)
    toast.add({ title: "Chat exported as plain text", type: "success" })
  }

  const handleExportJson = () => {
    exportChatAsJson(contact, messages)
    toast.add({ title: "Chat exported as JSON", type: "success" })
  }

  const handleExportMarkdown = () => {
    exportChatAsMarkdown(contact, messages)
    toast.add({ title: "Chat exported as Markdown", type: "success" })
  }

  const handleConfirmClear = () => {
    onClearMessages()
    setClearAlertOpen(false)
    toast.add({ title: "All messages cleared", type: "success" })
  }

  const handleConfirmBlockOrLeave = () => {
    onToggleBlock()
    setBlockAlertOpen(false)
    toast.add({
      title: isGroup
        ? "You left the group"
        : isBlocked
          ? `${contact.name} unblocked`
          : `${contact.name} blocked`,
      type: "success",
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="More chat options"
            />
          }
        >
          <IconDotsVertical className="size-4.5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="bottom" sideOffset={6} className="w-56">
          {/* Mute notifications */}
          <DropdownMenuItem onClick={handleMuteToggle} className="cursor-pointer">
            {isMuted ? (
              <>
                <IconBell className="size-4 text-online" />
                <span>Unmute notifications</span>
              </>
            ) : (
              <>
                <IconBellOff className="size-4 text-muted-foreground" />
                <span>Mute notifications</span>
              </>
            )}
          </DropdownMenuItem>

          {/* Starred messages */}
          <DropdownMenuItem onClick={onOpenStarredModal} className="cursor-pointer">
            <IconStar className="size-4 text-starred" />
            <span className="flex-1">Starred messages</span>
            {starredCount > 0 && (
              <span className="text-[11px] tabular-nums text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                {starredCount}
              </span>
            )}
          </DropdownMenuItem>

          {/* Pinned messages */}
          <DropdownMenuItem onClick={onOpenPinnedModal} className="cursor-pointer">
            <IconPin className="size-4 text-primary" />
            <span className="flex-1">Pinned messages</span>
            {pinnedCount > 0 && (
              <span className="text-[11px] tabular-nums text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                {pinnedCount}
              </span>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Export Chat with Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <IconDownload className="size-4 text-muted-foreground" />
              <span>Export chat</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44">
              <DropdownMenuItem onClick={handleExportText} className="cursor-pointer">
                <IconFileTypeTxt className="size-4 text-muted-foreground" />
                <span>Plain text (.txt)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJson} className="cursor-pointer">
                <IconJson className="size-4 text-muted-foreground" />
                <span>JSON (.json)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportMarkdown} className="cursor-pointer">
                <IconMarkdown className="size-4 text-muted-foreground" />
                <span>Markdown (.md)</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Clear Messages */}
          <DropdownMenuItem
            onClick={() => setClearAlertOpen(true)}
            variant="destructive"
            className="cursor-pointer"
          >
            <IconClearAll className="size-4" />
            <span>Clear messages</span>
          </DropdownMenuItem>

          {/* Block contact / Leave group */}
          <DropdownMenuItem
            onClick={() => setBlockAlertOpen(true)}
            variant="destructive"
            className="cursor-pointer"
          >
            {isGroup ? (
              <>
                <IconLogout className="size-4" />
                <span>Leave group</span>
              </>
            ) : (
              <>
                <IconUserX className="size-4" />
                <span>{isBlocked ? "Unblock contact" : "Block contact"}</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Messages Alert Dialog */}
      <AlertDialog open={clearAlertOpen} onOpenChange={setClearAlertOpen}>
        <AlertDialogContent size="default">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear messages?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove all messages in this conversation for you. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmClear}
            >
              Clear messages
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Contact or Leave Group Alert Dialog */}
      <AlertDialog open={blockAlertOpen} onOpenChange={setBlockAlertOpen}>
        <AlertDialogContent size="default">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isGroup
                ? `Leave "${contact.name}"?`
                : isBlocked
                  ? `Unblock ${contact.name}?`
                  : `Block ${contact.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isGroup
                ? "You will no longer receive updates or be able to participate in this group conversation."
                : isBlocked
                  ? `${contact.name} will be able to send you messages and see your profile status.`
                  : `Blocked contacts will not be able to message or call you.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmBlockOrLeave}
            >
              {isGroup ? "Leave group" : isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ChatHeaderOptionsMenu
