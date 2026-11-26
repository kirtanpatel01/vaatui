import * as React from "react"
import { cn } from "cn"

export interface TypingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dots" | "text" | "full"
  text?: string
}

export function TypingIndicator({
  text = "Typing...",
  className,
  ...props
}: TypingIndicatorProps) {
  return (
    <span
      role="status"
      aria-label={text}
      className={cn("text-xs text-online font-medium", className)}
      {...props}
    >
      {text}
    </span>
  )
}

export default TypingIndicator
