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
  const [imgError, setImgError] = useState(false)
  const targetUrl = link?.url || url || ""
  const domain =
    link?.domain ||
    (targetUrl
      ? targetUrl.replace(/^(?:https?:\/\/)?(?:www\.)?([^/]+).*/, "$1")
      : "link")
  const iconSrc =
    link?.imageUrl ||
    (domain && domain !== "link"
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`
      : "")

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
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleOpen(e as unknown as React.MouseEvent)
        }
      }}
      className={cn(
        "group/link flex items-center gap-2.5 w-full max-w-[280px] rounded-xl px-3 py-2 transition-colors cursor-pointer select-none",
        isSentByMe
          ? "bg-primary-foreground/10 hover:bg-primary-foreground/15 text-primary-foreground"
          : "bg-background/70 hover:bg-background text-foreground border border-border/50",
        className
      )}
    >
      {iconSrc && !imgError ? (
        <img
          src={iconSrc}
          alt={link?.title || domain}
          onError={() => setImgError(true)}
          className="size-9 rounded-lg object-cover shrink-0 bg-muted"
        />
      ) : (
        <IconLink className="size-4 shrink-0 opacity-70" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate leading-tight">
          {link?.title || domain}
        </p>
        <p
          className={cn(
            "text-[11px] truncate leading-tight mt-0.5",
            isSentByMe ? "text-primary-foreground/65" : "text-muted-foreground"
          )}
        >
          {domain}
        </p>
      </div>

      <IconExternalLink
        className={cn(
          "size-3.5 shrink-0 opacity-60",
          isSentByMe ? "text-primary-foreground" : "text-muted-foreground"
        )}
      />
    </div>
  )
}

export default LinkAttachmentBubble
