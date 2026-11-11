import * as React from "react"
import { IconDownload } from "@tabler/icons-react"

export interface PhotoAttachmentBubbleProps {
  thumbnailUrl?: string
  fileName?: string
  fileSize?: string
  timestamp?: string
  onDownload?: () => void
}

export function PhotoAttachmentBubble({
  thumbnailUrl,
  fileName = "mountains.jpg",
  fileSize = "2.4 MB",
  timestamp = "9:12 am",
  onDownload,
}: PhotoAttachmentBubbleProps) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-border/40 bg-muted/30 shadow-xs max-w-[280px]">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={fileName}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-muted-foreground">
            🖼️
          </div>
        )}
        <button
          type="button"
          onClick={onDownload}
          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80 transition-colors cursor-pointer"
          aria-label="Download image"
        >
          <IconDownload className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between p-2.5 text-xs">
        <div>
          <p className="font-semibold text-foreground truncate leading-tight">
            {fileName}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {fileSize} • JPG
          </p>
        </div>
        <span className="text-[10px] text-muted-foreground">{timestamp}</span>
      </div>
    </div>
  )
}

export default PhotoAttachmentBubble

