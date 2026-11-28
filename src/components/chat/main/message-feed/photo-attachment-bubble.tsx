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
    <div
      className={`flex flex-col max-w-[280px] rounded-2xl p-1 shadow-xs ${
        isSentByMe
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {/* 1. Media Preview Card */}
      <div className="group/photo relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted select-none">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={fileName}
            className="size-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-muted-foreground text-2xl">
            🖼️
          </div>
        )}

        {/* Gradient Overlay & Download Button */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-2 bg-gradient-to-t from-background/90 via-background/40 to-transparent text-foreground opacity-90 transition-opacity">
          <span className="text-[10px] tabular-nums font-medium opacity-90 backdrop-blur-xs px-1.5 py-0.5 rounded-md bg-background/60">
            {fileSize}
          </span>
          <button
            type="button"
            onClick={onDownload}
            className="flex size-6.5 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md hover:bg-background border border-border/40 transition-colors cursor-pointer"
            aria-label="Download image"
          >
            <IconDownload className="size-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Message Caption beneath the image inside the same bubble */}
      {caption ? (
        <div className="flex items-end justify-between gap-2 px-2 pt-1.5 pb-1 text-xs select-text">
          <p className="whitespace-pre-wrap break-words leading-relaxed font-normal flex-1 min-w-0">
            {caption}
          </p>
          <div
            className={`flex items-center gap-1 shrink-0 select-none ${
              isSentByMe ? "text-primary-foreground/75" : "text-muted-foreground"
            }`}
          >
            <span className="text-[10px] tabular-nums leading-none tracking-tight">{timestamp}</span>
            {isSentByMe && <DeliveryStatusIcon status={status} className="size-3" />}
          </div>
        </div>
      ) : (
        <div
          className={`flex items-center justify-end gap-1 px-2 pt-1 pb-0.5 select-none ${
            isSentByMe ? "text-primary-foreground/75" : "text-muted-foreground"
          }`}
        >
          <span className="text-[10px] tabular-nums leading-none">{timestamp}</span>
          {isSentByMe && <DeliveryStatusIcon status={status} className="size-3" />}
        </div>
      )}
    </div>
  )
}

export default PhotoAttachmentBubble

