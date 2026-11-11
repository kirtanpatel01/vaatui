import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  IconSearch,
  IconInfoCircle,
  IconDotsVertical,
  IconUsers,
  IconSpeakerphone,
} from "@tabler/icons-react"
import { type UserProfile } from "@/data/mock-contacts"
import { useChat } from "@/components/chat/chat-provider"
import { cn } from "cn"

export interface ChatHeaderProps extends React.ComponentProps<"div"> {
  contact?: UserProfile
  onSearchMessages?: () => void
  onToggleDetails?: () => void
}

export function ChatHeader({
  contact,
  className,
  onSearchMessages,
  onToggleDetails,
  ...props
}: ChatHeaderProps) {
  const { chatDetailsOpen, setChatDetailsOpen } = useChat()

  if (!contact) {
    return (
      <header
        className={cn(
          "flex h-16 w-full items-center justify-between border-b px-4 shrink-0 bg-background/80 backdrop-blur-xs select-none",
          className
        )}
        {...props}
      >
        <span className="text-sm text-muted-foreground">Select a conversation</span>
      </header>
    )
  }

  const handleToggle = () => {
    if (onToggleDetails) {
      onToggleDetails()
    } else {
      setChatDetailsOpen((prev) => !prev)
    }
  }

  return (
    <header
      className={cn(
        "flex h-16 w-full items-center justify-between border-b px-5 shrink-0 bg-background/80 backdrop-blur-xs select-none",
        className
      )}
      {...props}
    >
      {/* Left: Contact Avatar & Info */}
      <div
        onClick={handleToggle}
        className="flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground font-semibold text-sm">
          {contact.type === "group" ? (
            <IconUsers className="size-5 text-muted-foreground stroke-[1.75]" />
          ) : contact.type === "announcement" ? (
            <IconSpeakerphone className="size-5 text-muted-foreground stroke-[1.75]" />
          ) : (
            <span>{contact.name[0]}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground truncate leading-tight">
            {contact.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            {contact.isOnline && (
              <span className="size-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            )}
            <p className="text-xs text-muted-foreground truncate leading-none">
              {contact.lastMessage.isTyping ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Typing...
                </span>
              ) : contact.isOnline ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Online
                </span>
              ) : (
                "Last seen recently"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Action Icons */}
      <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onSearchMessages}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Search conversation messages"
        >
          <IconSearch className="size-4.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleToggle}
          className={cn(
            "hover:text-foreground transition-colors",
            chatDetailsOpen ? "text-primary bg-secondary" : "text-muted-foreground"
          )}
          aria-label="Contact information"
        >
          <IconInfoCircle className="size-4.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label="More chat options"
        >
          <IconDotsVertical className="size-4.5" />
        </Button>
      </div>
    </header>
  )
}

export default ChatHeader
