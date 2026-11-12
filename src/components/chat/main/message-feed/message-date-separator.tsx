import * as React from "react"
import { cn } from "cn"

export type MessageDateSeparatorVariant =
  | "pill"
  | "divider"
  | "frosted"
  | "outline"
  | "sticky"

export interface MessageDateSeparatorProps extends React.ComponentProps<"div"> {
  date: string
  variant?: MessageDateSeparatorVariant
  sticky?: boolean
}

export function MessageDateSeparator({
  date,
  variant = "divider",
  sticky = false,
  className,
  ...props
}: MessageDateSeparatorProps) {
  const isSticky = sticky || variant === "sticky"

  const renderBadge = () => {
    switch (variant) {
      case "divider":
        return (
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="rounded-md px-2 py-0.5 text-[11px] font-medium tracking-tight text-muted-foreground select-none">
              {date}
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>
        )

      case "frosted":
        return (
          <span className="inline-flex items-center rounded-full border border-border/40 bg-background/60 px-3.5 py-1 text-[11px] font-medium text-foreground/80 shadow-xs backdrop-blur-md select-none transition-colors">
            {date}
          </span>
        )

      case "outline":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3 py-0.5 text-[11px] font-medium text-muted-foreground shadow-2xs select-none">
            <span className="size-1.5 rounded-full bg-primary/60" />
            {date}
          </span>
        )

      case "sticky":
      case "pill":
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-secondary/80 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs backdrop-blur-xs select-none transition-all hover:bg-secondary">
            {date}
          </span>
        )
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center my-2 select-none",
        isSticky && "sticky top-2 z-10",
        variant === "divider" && "w-full my-3",
        className
      )}
      {...props}
    >
      {renderBadge()}
    </div>
  )
}

export default MessageDateSeparator
