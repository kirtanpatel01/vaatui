import * as React from "react"
import { IconExternalLink } from "@tabler/icons-react"
import { cn } from "cn"

export interface TextBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  searchQuery?: string
  isSearchActiveMatch?: boolean
  isSentByMe?: boolean
  onMentionClick?: (mention: string) => void
}

function renderHighlightedText(
  text: string,
  query: string,
  isSentByMe: boolean,
  isCurrentMatch: boolean
) {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  const parts = text.split(regex)

  const highlightClass = isCurrentMatch
    ? "bg-starred text-foreground font-semibold rounded-xs px-1 shadow-xs ring-1 ring-starred"
    : isSentByMe
      ? "bg-chat-bubble-sent-foreground/20 text-chat-bubble-sent-foreground rounded-xs px-0.5 font-medium underline decoration-starred decoration-2 underline-offset-2"
      : "bg-starred/25 text-foreground rounded-xs px-0.5 font-medium"

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className={cn("transition-colors duration-150 inline-block leading-tight", highlightClass)}>
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function TextBubble({
  text,
  searchQuery = "",
  isSearchActiveMatch = false,
  isSentByMe = false,
  onMentionClick,
  className,
  ...props
}: TextBubbleProps) {
  // If search query active, highlight search query
  if (searchQuery.trim()) {
    return (
      <p className={cn("whitespace-pre-wrap break-words leading-relaxed select-text", className)} {...props}>
        {renderHighlightedText(text, searchQuery, isSentByMe, isSearchActiveMatch)}
      </p>
    )
  }

  // Tokenize URLs and @mentions
  const tokenRegex = /(https?:\/\/[^\s<>"'()]+|www\.[^\s<>"'()]+|@[A-Za-z0-9_\s]+?(?=[.,!?]?(\s|$)))/gi
  const parts = text.split(tokenRegex).filter(Boolean)

  return (
    <p className={cn("whitespace-pre-wrap break-words leading-relaxed select-text", className)} {...props}>
      {parts.map((part, i) => {
        // 1. Link / URL
        if (/^(https?:\/\/|www\.)/i.test(part)) {
          const href = part.startsWith("http") ? part : `https://${part}`
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "font-medium underline underline-offset-2 break-all transition-opacity hover:opacity-80 inline-flex items-center gap-0.5 cursor-pointer",
                isSentByMe
                  ? "text-chat-bubble-sent-foreground underline decoration-chat-bubble-sent-foreground/60 hover:text-chat-bubble-sent-foreground/80"
                  : "text-primary decoration-primary/60 hover:text-primary/80"
              )}
            >
              <span>{part}</span>
              <IconExternalLink className="size-3 inline-block shrink-0 opacity-80" />
            </a>
          )
        }

        // 2. Mention (@Name)
        if (part.startsWith("@") && part.length > 1) {
          return (
            <span
              key={i}
              onClick={(e) => {
                e.stopPropagation()
                onMentionClick?.(part)
              }}
              className={cn(
                "inline-flex items-center font-semibold rounded-md px-1 py-0.2 mx-0.5 transition-colors cursor-pointer select-none",
                isSentByMe
                  ? "bg-chat-bubble-sent-foreground/20 text-chat-bubble-sent-foreground hover:bg-chat-bubble-sent-foreground/30"
                  : "bg-primary/15 text-primary hover:bg-primary/25"
              )}
            >
              {part}
            </span>
          )
        }

        // 3. Plain text
        return part
      })}
    </p>
  )
}

export default TextBubble
