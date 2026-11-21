import * as React from "react"
import { motion } from "motion/react"
import {
  IconSearch,
  IconX,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react"
import { cn } from "cn"

export interface ChatHeaderSearchProps {
  isSearchOpen: boolean
  onToggleSearch?: (open: boolean) => void
  searchQuery: string
  onSearchQueryChange?: (query: string) => void
  searchMatchCount?: number
  searchMatchIndex?: number
  onNextMatch?: () => void
  onPrevMatch?: () => void
  className?: string
}

export function ChatHeaderSearch({
  isSearchOpen,
  onToggleSearch,
  searchQuery,
  onSearchQueryChange,
  searchMatchCount = 0,
  searchMatchIndex = 0,
  onNextMatch,
  onPrevMatch,
  className,
}: ChatHeaderSearchProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isSearchOpen])

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
    <motion.div
      initial={false}
      animate={{
        width: isSearchOpen ? 240 : 36,
      }}
      transition={{ type: "spring", stiffness: 450, damping: 30 }}
      className={cn(
        "relative flex h-9 items-center overflow-hidden rounded-full border transition-colors",
        isSearchOpen
          ? "border-border bg-secondary/80 shadow-xs"
          : "border-transparent bg-transparent hover:bg-muted/60",
        className
      )}
    >
      {/* Search trigger icon button */}
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
                  className="p-0.5 hover:text-foreground transition-colors rounded-sm cursor-pointer"
                  title="Previous match (Shift+Enter)"
                >
                  <IconChevronUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onNextMatch}
                  className="p-0.5 hover:text-foreground transition-colors rounded-sm cursor-pointer"
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
          className="p-0.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm shrink-0 cursor-pointer"
          title={searchQuery ? "Clear search" : "Close search"}
        >
          <IconX className="size-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

export default ChatHeaderSearch
