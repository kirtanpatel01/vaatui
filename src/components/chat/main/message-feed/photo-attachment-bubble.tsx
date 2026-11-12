import * as React from "react"
import { IconDownload } from "@tabler/icons-react"
import { DeliveryStatusIcon } from "./delivery-status-icon"
import { type MessageDeliveryStatus } from "@/data/mock-contacts"

export interface PhotoAttachmentBubbleProps {
  thumbnailUrl?: string
  fileName?: string
  fileSize?: string
  timestamp?: string
  caption?: string
  status?: MessageDeliveryStatus
  isSentByMe?: boolean
  onDownload?: () => void
}

export function PhotoAttachmentBubble({
  thumbnailUrl,
  fileName = "mountains.jpg",
  fileSize = "2.4 MB",
  timestamp = "9:12 am",
  caption,
  status,
  isSentByMe,
  onDownload,
}: PhotoAttachmentBubbleProps) {
  return (
    <div className="flex flex-col gap-1 max-w-[280px]">
      {/* 1. Media Preview Card */}
      <div className="group/photo relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-xs select-none">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={fileName}
            className="size-full object-cover transition-transform duration-300 group-hover/photo:scale-102"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-muted-foreground text-2xl">
            🖼️
          </div>
        )}

        {/* Gradient Overlay & Download Button */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white opacity-90 transition-opacity">
          <span className="text-[10px] font-mono opacity-80 backdrop-blur-xs px-1.5 py-0.5 rounded-md bg-black/30">
            {fileSize}
          </span>
          <button
            type="button"
            onClick={onDownload}
            className="flex size-6.5 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/35 transition-colors cursor-pointer"
            aria-label="Download image"
          >
            <IconDownload className="size-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Message Caption Bubble beneath the image */}
      {caption ? (
        <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 bg-card/90 border border-border/60 text-xs text-foreground select-text shadow-2xs">
          <p className="whitespace-pre-wrap break-words leading-relaxed font-normal flex-1 min-w-0">
            {caption}
          </p>
          <div className="flex items-center gap-1 shrink-0 text-muted-foreground select-none pb-0.5 self-center">
            <span className="text-[10px] font-mono leading-none tracking-tight">{timestamp}</span>
            {isSentByMe && <DeliveryStatusIcon status={status} className="size-3" />}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-1 px-1 text-muted-foreground select-none">
          <span className="text-[10px] font-mono leading-none">{timestamp}</span>
          {isSentByMe && <DeliveryStatusIcon status={status} className="size-3" />}
        </div>
      )}
    </div>
  )
}

export default PhotoAttachmentBubble

