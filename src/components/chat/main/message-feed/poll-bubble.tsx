import * as React from "react"
import { type PollData } from "@/data/mock-messages"
import { IconCheck } from "@tabler/icons-react"
import { cn } from "cn"

export interface PollBubbleProps {
  poll: PollData
  isSentByMe: boolean
  onVote?: (optionId: string) => void
}

export function PollBubble({ poll, isSentByMe, onVote }: PollBubbleProps) {
  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0)

  return (
    <div className="flex flex-col gap-2 min-w-[260px] max-w-[320px] select-none">
      <div className="flex items-center justify-between gap-2">
        <h3
          className={cn(
            "text-sm font-semibold leading-snug",
            isSentByMe ? "text-white" : "text-foreground"
          )}
        >
          {poll.question}
        </h3>
      </div>

      <p
        className={cn(
          "text-[11px]",
          isSentByMe ? "text-neutral-400" : "text-muted-foreground"
        )}
      >
        {poll.allowMultiple ? "Select one or more" : "Select one"} • {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
      </p>

      {/* Options */}
      <div className="space-y-1.5 mt-0.5">
        {poll.options.map((option) => {
          const voteCount = option.votes?.length || 0
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
          const hasVoted = Boolean(option.votes?.includes("curr_user"))

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onVote?.(option.id)}
              className={cn(
                "relative flex w-full flex-col overflow-hidden rounded-xl border p-2.5 text-left transition-all cursor-pointer group",
                hasVoted
                  ? isSentByMe
                    ? "border-primary bg-primary/25 shadow-xs"
                    : "border-primary/80 bg-primary/10 shadow-xs"
                  : isSentByMe
                    ? "border-neutral-700/80 bg-neutral-800/80 hover:bg-neutral-800 hover:border-neutral-600"
                    : "border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border"
              )}
            >
              {/* Animated Progress Bar fill */}
              <div
                className={cn(
                  "absolute inset-y-0 left-0 transition-all duration-300 pointer-events-none",
                  hasVoted
                    ? isSentByMe ? "bg-primary/35" : "bg-primary/20"
                    : isSentByMe ? "bg-white/10" : "bg-muted-foreground/10"
                )}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative z-10 flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                      hasVoted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isSentByMe
                          ? "border-neutral-500 group-hover:border-white"
                          : "border-muted-foreground/40 group-hover:border-foreground"
                    )}
                  >
                    {hasVoted && <IconCheck className="size-2.5 stroke-[3]" />}
                  </div>
                  <span
                    className={cn(
                      "truncate",
                      isSentByMe ? "text-white" : "text-foreground"
                    )}
                  >
                    {option.text}
                  </span>
                </div>

                <span
                  className={cn(
                    "text-[11px] font-mono tabular-nums ml-2 shrink-0 font-medium",
                    isSentByMe ? "text-neutral-300" : "text-muted-foreground"
                  )}
                >
                  {percentage}%
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PollBubble

