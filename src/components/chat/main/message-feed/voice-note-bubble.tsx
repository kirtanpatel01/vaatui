import * as React from "react"
import { IconPlayerPlayFilled } from "@tabler/icons-react"
import { cn } from "cn"

export interface VoiceNoteBubbleProps {
  duration?: string
  isSentByMe: boolean
}

export function VoiceNoteBubble({
  duration = "0:24",
  isSentByMe,
}: VoiceNoteBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 min-w-[220px] sm:min-w-[260px] select-none",
        isSentByMe
          ? "bg-neutral-900 text-white dark:bg-neutral-800"
          : "bg-muted/70 text-foreground"
      )}
    >
      {/* Play Button */}
      <button
        type="button"
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95 cursor-pointer",
          isSentByMe
            ? "bg-white text-black hover:bg-neutral-200"
            : "bg-foreground text-background hover:opacity-90"
        )}
        aria-label="Play audio"
      >
        <IconPlayerPlayFilled className="size-3 translate-x-0.5" />
      </button>

      {/* Waveform Bars */}
      <div className="flex flex-1 items-center gap-0.75 h-5">
        {[
          40, 65, 85, 30, 95, 70, 50, 80, 100, 60, 45, 90, 75, 55, 35, 70, 85,
          60, 40, 75, 90, 50, 65, 45, 80, 55, 30,
        ].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={cn(
              "w-0.75 rounded-full transition-colors",
              i < 10
                ? isSentByMe
                  ? "bg-white"
                  : "bg-foreground"
                : isSentByMe
                  ? "bg-neutral-500"
                  : "bg-muted-foreground/40"
            )}
          />
        ))}
      </div>

      {/* Duration */}
      <span className="text-xs font-mono font-medium opacity-80">{duration}</span>

      {/* Speed badge */}
      <span className="rounded-md bg-white/10 dark:bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold">
        1x
      </span>
    </div>
  )
}

export default VoiceNoteBubble

