import {
  IconFileX,
  IconDownload,
  IconFileTypePdf,
  IconArchive,
  IconFileText,
} from "@tabler/icons-react"
import { toast } from "@/components/ui/toast"
import { type ChatMessage } from "@/data/mock-messages"

export interface FilesTabContentProps {
  fileMessages: ChatMessage[]
}

function renderFileIcon(fileName?: string) {
  const ext = fileName?.split(".").pop()?.toLowerCase() || ""
  if (ext === "pdf") {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 font-bold text-[10px]">
        <IconFileTypePdf className="size-5" />
      </div>
    )
  }
  if (ext === "zip" || ext === "fig" || ext === "tar") {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 font-bold text-[10px]">
        <IconArchive className="size-5" />
      </div>
    )
  }
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-[10px]">
      <IconFileText className="size-5" />
    </div>
  )
}

export function FilesTabContent({ fileMessages }: FilesTabContentProps) {
  if (fileMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <IconFileX className="size-8 opacity-40 mb-1.5 stroke-[1.5]" />
        <p className="text-xs font-medium text-foreground">No documents or files</p>
        <p className="text-[11px] opacity-75 max-w-[200px]">
          Files and attachments will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {fileMessages.map((msg) => {
        const fileName = msg.attachment?.fileName || "document.pdf"
        const fileSize = msg.attachment?.fileSize || "1.2 MB"
        const fileUrl = msg.attachment?.url

        const handleDownload = (e: React.MouseEvent) => {
          e.stopPropagation()
          if (fileUrl) window.open(fileUrl, "_blank")
          else {
            toast.add({
              title: "Downloading file",
              description: `${fileName} (${fileSize})`,
              type: "success",
            })
          }
        }

        return (
          <div
            key={msg.id}
            onClick={handleDownload}
            className="group/file flex items-center justify-between gap-2.5 p-2 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {renderFileIcon(fileName)}
              <div className="min-w-0">
                <span className="text-xs font-semibold text-foreground truncate block leading-snug group-hover/file:text-primary transition-colors">
                  {fileName}
                </span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">
                  {fileSize} • {msg.timestamp}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background border border-border/70 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors cursor-pointer"
              title="Download file"
            >
              <IconDownload className="size-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default FilesTabContent
