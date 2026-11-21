import * as React from "react"
import { cn } from "cn"

export interface TypingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dots" | "text" | "full"
  text?: string
}

export function TypingIndicator({
  variant = "dots",
  text = "Typing...",
  className,
  ...props
}: TypingIndicatorProps) {
  if (variant === "text") {
    return (
      <span className={cn("text-xs text-online font-medium animate-pulse", className)}>
        {text}
      </span>
    )
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1 py-0.5", className)}
      role="status"
      aria-label={text}
      {...props}
    >
      <span className="flex items-center gap-1 px-1">
        <span className="size-1.5 rounded-full bg-online animate-bounce [animation-delay:-0.3s]" />
        <span className="size-1.5 rounded-full bg-online animate-bounce [animation-delay:-0.15s]" />
        <span className="size-1.5 rounded-full bg-online animate-bounce" />
      </span>
      {variant === "full" && (
        <span className="text-xs text-online font-medium ml-1">{text}</span>
      )}
    </div>
  )
}

export default TypingIndicator
