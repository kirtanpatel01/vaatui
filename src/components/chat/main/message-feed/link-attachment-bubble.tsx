import { IconExternalLink, IconCopy, IconCheck, IconLink } from "@tabler/icons-react"
import { type LinkPreviewData } from "@/data/mock-messages"
import { toast } from "@/components/ui/toast"
import { useState } from "react"
import { cn } from "cn"

export interface LinkAttachmentBubbleProps {
  link?: LinkPreviewData
  url?: string
  isSentByMe: boolean
  className?: string
}

export function LinkAttachmentBubble({
  link,
  url,
  isSentByMe,
  className,
}: LinkAttachmentBubbleProps) {
  const [copied, setCopied] = useState(false)
  const targetUrl = link?.url || url || ""
  const domain =
    link?.domain ||
    (targetUrl
      ? targetUrl.replace(/^(?:https?:\/\/)?(?:www\.)?([^/]+).*/, "$1")
      : "link")

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!targetUrl) return
    const href = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`
    window.open(href, "_blank", "noopener,noreferrer")
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!targetUrl) return
    const href = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`
    navigator.clipboard?.writeText(href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.add({
      title: "Link copied",
      description: "URL copied to clipboard",
      type: "success",
    })
  }

  return (
    <div
      onClick={handleOpen}
      className={cn(
        "group/link block rounded-xl border overflow-hidden transition-all duration-150 cursor-pointer max-w-[320px] select-none text-left shadow-2xs hover:shadow-xs",
        isSentByMe
          ? "bg-neutral-800/80 border-neutral-700/80 hover:bg-neutral-800"
          : "bg-muted/50 border-border/70 hover:bg-muted/80",
        className
      )}
    >
      {link?.image && (
        <div className="relative aspect-16/9 w-full overflow-hidden bg-muted">
          <img
            src={link.image}
            alt={link.title || domain}
            className="size-full object-cover transition-transform duration-300 group-hover/link:scale-103"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
            <IconLink className="size-3" />
            <span className="truncate max-w-[120px]">{domain}</span>
          </div>
        </div>
      )}

      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span
            className={cn(
              "text-[11px] font-semibold tracking-wide uppercase truncate",
              isSentByMe ? "text-neutral-300" : "text-primary"
            )}
          >
            {domain}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "p-1 rounded-md transition-colors",
                isSentByMe
                  ? "text-neutral-400 hover:text-white hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title="Copy link"
            >
              {copied ? (
                <IconCheck className="size-3.5 text-emerald-500" />
              ) : (
                <IconCopy className="size-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleOpen}
              className={cn(
                "p-1 rounded-md transition-colors",
                isSentByMe
                  ? "text-neutral-400 hover:text-white hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title="Open in new tab"
            >
              <IconExternalLink className="size-3.5" />
            </button>
          </div>
        </div>

        {link?.title && (
          <h4
            className={cn(
              "text-xs font-semibold line-clamp-1 leading-snug group-hover/link:underline",
              isSentByMe ? "text-white" : "text-foreground"
            )}
          >
            {link.title}
          </h4>
        )}

        {link?.description && (
          <p
            className={cn(
              "text-[11px] line-clamp-2 leading-relaxed mt-0.5",
              isSentByMe ? "text-neutral-300" : "text-muted-foreground"
            )}
          >
            {link.description}
          </p>
        )}

        <span
          className={cn(
            "text-[10px] truncate block mt-1 opacity-70",
            isSentByMe ? "text-neutral-400" : "text-muted-foreground"
          )}
        >
          {targetUrl}
        </span>
      </div>
    </div>
  )
}

export default LinkAttachmentBubble
