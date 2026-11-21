import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconTrash,
  IconSend,
} from "@tabler/icons-react"
import { cn } from "cn"

export interface VoiceRecorderProps extends React.HTMLAttributes<HTMLDivElement> {
  isRecording: boolean
  isPaused: boolean
  recordingSeconds: number
  liveFrequencies: number[]
  onPause: () => void
  onResume: () => void
  onCancel: () => void
  onSend: () => void
}

export function VoiceRecorder({
  isRecording,
  isPaused,
  recordingSeconds,
  liveFrequencies,
  onPause,
  onResume,
  onCancel,
  onSend,
  className,
  ...props
}: VoiceRecorderProps) {
  if (!isRecording) return null

  const minutes = Math.floor(recordingSeconds / 60)
  const seconds = recordingSeconds % 60
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds

  return (
    <div
      className={cn(
        "flex items-center gap-3 w-full bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 rounded-2xl px-4 py-2.5 animate-in fade-in-0 duration-150",
        className
      )}
      {...props}
    >
      {/* Pulsing recording indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex size-3">
          {!isPaused && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full size-3",
              isPaused ? "bg-starred" : "bg-destructive"
            )}
          />
        </span>
        <span className="text-xs font-semibold tabular-nums text-destructive min-w-[36px]">
          {minutes}:{formattedSeconds}
        </span>
        {isPaused && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-starred bg-starred/15 px-1.5 py-0.5 rounded-sm">
            Paused
          </span>
        )}
      </div>

      {/* Real-time audio waveform reacting dynamically to user's mic voice */}
      <div className="flex flex-1 items-center justify-center gap-1 h-6 overflow-hidden px-2">
        {liveFrequencies.map((pct, i) => (
          <span
            key={i}
            style={{
              height: `${isPaused ? 8 : pct}%`,
            }}
            className={cn(
              "w-1 rounded-full transition-all duration-75",
              isPaused
                ? "bg-muted-foreground/30"
                : "bg-destructive/75 hover:bg-destructive"
            )}
          />
        ))}
      </div>

      {/* Pause / Resume button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={isPaused ? onResume : onPause}
        className="size-8 rounded-full text-foreground hover:bg-destructive/15 cursor-pointer shrink-0"
        title={isPaused ? "Resume recording" : "Pause recording"}
      >
        {isPaused ? (
          <IconPlayerPlayFilled className="size-4 text-online" />
        ) : (
          <IconPlayerPauseFilled className="size-4 text-destructive" />
        )}
      </Button>

      {/* Cancel recording button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onCancel}
        className="size-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/15 cursor-pointer shrink-0"
        title="Cancel recording"
      >
        <IconTrash className="size-4" />
      </Button>

      {/* Send / Stop recording button */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={onSend}
        className="shrink-0"
        title="Send voice note"
      >
        <IconSend className="size-4" />
      </Button>
    </div>
  )
}

export default VoiceRecorder
