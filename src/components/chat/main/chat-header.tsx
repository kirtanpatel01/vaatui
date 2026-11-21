import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  IconInfoCircle,
  IconBellOff,
} from "@tabler/icons-react"
import { type UserProfile } from "@/data/mock-contacts"
import { type ChatMessage } from "@/data/mock-messages"
import { useChat } from "@/components/chat/chat-provider"
import { ChatHeaderOptionsMenu } from "./chat-header-options-menu"
import { ChatHeaderSearch } from "./chat-header-search"
import { ChatAvatar } from "@/components/chat/ui/chat-avatar"
import { TypingIndicator } from "@/components/chat/ui/typing-indicator"
import { cn } from "cn"

export interface ChatHeaderProps extends React.ComponentProps<"div"> {
  contact?: UserProfile
  messages?: ChatMessage[]
  searchQuery?: string
  onSearchQueryChange?: (query: string) => void
  isSearchOpen?: boolean
  onToggleSearch?: (open: boolean) => void
  searchMatchCount?: number
  searchMatchIndex?: number
  onNextMatch?: () => void
  onPrevMatch?: () => void
  onToggleDetails?: () => void
  onOpenStarredModal?: () => void
  onOpenPinnedModal?: () => void
}

export function ChatHeader({
  contact,
  messages = [],
  className,
  searchQuery = "",
  onSearchQueryChange,
  isSearchOpen = false,
  onToggleSearch,
  searchMatchCount = 0,
  searchMatchIndex = 0,
  onNextMatch,
  onPrevMatch,
  onToggleDetails,
  onOpenStarredModal,
  onOpenPinnedModal,
  ...props
}: ChatHeaderProps) {
  const {
    chatDetailsOpen,
    setChatDetailsOpen,
    isMuted,
    toggleMute,
    isBlocked,
    toggleBlock,
    clearMessages,
  } = useChat()

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
        "relative flex h-16 w-full items-center justify-between border-b px-5 shrink-0 bg-background/80 backdrop-blur-xs select-none overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Left: Contact Avatar & Info */}
      <div
        onClick={handleToggle}
        className="flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <ChatAvatar contact={contact} size="default" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold text-foreground truncate leading-tight">
              {contact.name}
            </h2>
            {isMuted && (
              <IconBellOff className="size-3.5 text-muted-foreground/70 shrink-0" title="Muted" />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {contact.lastMessage.isTyping ? (
              <TypingIndicator variant="full" />
            ) : (
              <>
                {contact.isOnline && (
                  <span className="size-2 rounded-full bg-online inline-block shrink-0" />
                )}
                <p className="text-xs text-muted-foreground truncate leading-none">
                  {contact.isOnline ? "Online" : "Last seen recently"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions & Expanding Motion Search Bar */}
      <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
        <ChatHeaderSearch
          isSearchOpen={isSearchOpen}
          onToggleSearch={onToggleSearch}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          searchMatchCount={searchMatchCount}
          searchMatchIndex={searchMatchIndex}
          onNextMatch={onNextMatch}
          onPrevMatch={onPrevMatch}
        />

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

        {/* Conversation Options Dropdown Menu */}
        <ChatHeaderOptionsMenu
          contact={contact}
          messages={messages}
          isMuted={isMuted}
          isBlocked={isBlocked}
          starredCount={messages.filter((m) => m.isStarred).length}
          pinnedCount={messages.filter((m) => m.isPinned).length}
          onToggleMute={toggleMute}
          onToggleBlock={toggleBlock}
          onClearMessages={clearMessages}
          onOpenStarredModal={() => onOpenStarredModal?.()}
          onOpenPinnedModal={() => onOpenPinnedModal?.()}
        />
      </div>
    </header>
  )
}

export default ChatHeader
