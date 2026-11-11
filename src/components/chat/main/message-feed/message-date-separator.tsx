import * as React from "react"
import { cn } from "cn"

export interface MessageDateSeparatorProps {
  date: string
  className?: string
}

export function MessageDateSeparator({
  date,
  className,
}: MessageDateSeparatorProps) {
  return (
    <div className={cn("flex items-center justify-center my-1 select-none", className)}>
      <span className="rounded-full bg-secondary/80 backdrop-blur-xs px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs">
        {date}
      </span>
    </div>
  )
}

export default MessageDateSeparator

