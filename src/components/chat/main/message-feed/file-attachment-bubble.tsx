import * as React from "react"
import { IconFile, IconDownload } from "@tabler/icons-react"
import { cn } from "cn"

export interface FileAttachmentBubbleProps {
  fileName?: string
  fileSize?: string
  url?: string
  isSentByMe: boolean
}

export function FileAttachmentBubble({
  fileName = "document.pdf",
  fileSize = "2.4 MB",
  url,
  isSentByMe,
}: FileAttachmentBubbleProps) {
  const extension = fileName.split(".").pop()?.toUpperCase() || "FILE"

  const handleDownload = () => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  return (
    <div
      onClick={handleDownload}
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer select-none min-w-[220px] max-w-[280px]",
        isSentByMe
          ? "bg-neutral-800/90 border-neutral-700/80 hover:bg-neutral-800 text-white"
          : "bg-card border-border/70 hover:bg-muted/60 text-card-foreground"
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 flex-col items-center justify-center rounded-lg font-bold text-[10px] tracking-tight",
          isSentByMe
            ? "bg-white/10 text-white"
            : "bg-primary/10 text-primary"
        )}
      >
        <IconFile className="size-4 mb-0.5" />
        <span>{extension.slice(0, 4)}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-xs font-semibold truncate leading-tight",
            isSentByMe ? "text-white" : "text-foreground"
          )}
        >
          {fileName}
        </p>
        <p
          className={cn(
            "text-[11px] mt-0.5",
            isSentByMe ? "text-neutral-300" : "text-muted-foreground"
          )}
        >
          {fileSize}
        </p>
      </div>

      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
          isSentByMe
            ? "bg-white/15 text-white hover:bg-white/25"
            : "bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        <IconDownload className="size-3.5" />
      </div>
    </div>
  )
}

export default FileAttachmentBubble

