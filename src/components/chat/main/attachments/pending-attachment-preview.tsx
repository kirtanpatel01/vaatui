import * as React from "react"
import { IconFile, IconX } from "@tabler/icons-react"
import { type MessageAttachment } from "@/data/mock-messages"
import { cn } from "cn"

export interface PendingAttachmentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  attachment: MessageAttachment
  onRemove?: () => void
}

export function PendingAttachmentPreview({
  attachment,
  onRemove,
  className,
  ...props
}: PendingAttachmentPreviewProps) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      <div className="inline-flex items-center gap-2.5 rounded-2xl bg-muted/70 border border-border/70 p-1.5 pr-2.5 text-xs shadow-xs max-w-sm animate-in fade-in-0 zoom-in-95 duration-100">
        {attachment.thumbnailUrl ? (
          <img
            src={attachment.thumbnailUrl}
            alt="Upload preview"
            className="size-9 rounded-xl object-cover ring-1 ring-border/50 shrink-0"
          />
        ) : (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconFile className="size-4.5" />
          </div>
        )}
        <div className="min-w-0 pr-1">
          <p className="font-semibold text-foreground text-xs truncate max-w-[180px] leading-tight">
            {attachment.fileName || "Attachment"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{attachment.fileSize}</p>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-background/80 transition-colors cursor-pointer shrink-0 ml-1"
            title="Remove attachment"
            aria-label="Remove attachment"
          >
            <IconX className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default PendingAttachmentPreview
