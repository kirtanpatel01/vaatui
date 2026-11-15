import * as React from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  IconSearch,
  IconInfoCircle,
  IconUsers,
  IconSpeakerphone,
  IconX,
  IconChevronUp,
  IconChevronDown,
  IconBellOff,
} from "@tabler/icons-react"
import { type UserProfile } from "@/data/mock-contacts"
import { type ChatMessage } from "@/data/mock-messages"
import { useChat } from "@/components/chat/chat-provider"
import { ChatHeaderOptionsMenu } from "./chat-header-options-menu"
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
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isSearchOpen) {
      // Focus input automatically when search opens
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isSearchOpen])

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onToggleSearch?.(false)
      onSearchQueryChange?.("")
    } else if (e.key === "Enter") {
      if (e.shiftKey) {
        onPrevMatch?.()
      } else {
        onNextMatch?.()
      }
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
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold text-foreground truncate leading-tight">
              {contact.name}
            </h2>
            {isMuted && (
              <IconBellOff className="size-3.5 text-muted-foreground/70 shrink-0" title="Muted" />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {contact.isOnline && (
              <span className="size-2 rounded-full bg-online inline-block shrink-0" />
            )}
            <p className="text-xs text-muted-foreground truncate leading-none">
              {contact.lastMessage.isTyping ? (
                <span className="text-online font-medium">
                  Typing...
                </span>
              ) : contact.isOnline ? (
                <span className="text-online font-medium">
                  Online
                </span>
              ) : (
                "Last seen recently"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Actions & Expanding Motion Search Bar */}
      <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
        <motion.div
          animate={{ width: isSearchOpen ? 260 : 36 }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          className="relative flex items-center h-9 rounded-full bg-muted/60 border border-transparent overflow-hidden"
          style={{
            borderColor: isSearchOpen ? "var(--border)" : "transparent",
            backgroundColor: isSearchOpen ? "var(--muted)" : "transparent",
          }}
        >
          {/* Always positioned search icon / button */}
          <button
            type="button"
            onClick={() => {
              if (!isSearchOpen) {
                onToggleSearch?.(true)
              }
            }}
            className="flex size-9 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Search conversation messages"
          >
            <IconSearch className="size-4.5" />
          </button>

          {/* Search input field visible only when open */}
          <div
            className={cn(
              "flex flex-1 items-center min-w-0 pr-2 transition-opacity duration-150",
              isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search messages..."
              tabIndex={isSearchOpen ? 0 : -1}
              className="w-full min-w-0 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden"
            />

            {/* Match Counter & Next/Prev when there are results */}
            {searchQuery.trim().length > 0 && (
              <div className="flex items-center gap-0.5 shrink-0 mx-1 text-[11px] text-muted-foreground font-medium select-none">
                {searchMatchCount > 0 ? (
                  <>
                    <span className="tabular-nums mr-0.5">
                      {searchMatchIndex + 1}/{searchMatchCount}
                    </span>
                    <button
                      type="button"
                      onClick={onPrevMatch}
                      className="p-0.5 hover:text-foreground transition-colors rounded-sm"
                      title="Previous match (Shift+Enter)"
                    >
                      <IconChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={onNextMatch}
                      className="p-0.5 hover:text-foreground transition-colors rounded-sm"
                      title="Next match (Enter)"
                    >
                      <IconChevronDown className="size-3.5" />
                    </button>
                  </>
                ) : (
                  <span className="text-muted-foreground/80">0</span>
                )}
              </div>
            )}

            {/* Close / Clear Search Button */}
            <button
              type="button"
              onClick={() => {
                if (searchQuery) {
                  onSearchQueryChange?.("")
                } else {
                  onToggleSearch?.(false)
                }
              }}
              className="p-0.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm shrink-0"
              title={searchQuery ? "Clear search" : "Close search"}
            >
              <IconX className="size-3.5" />
            </button>
          </div>
        </motion.div>

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
