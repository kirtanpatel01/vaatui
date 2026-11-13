import { useState } from "react"
import {
  IconLinkOff,
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconWorld,
  IconBrandGithub,
  IconBrandFigma,
} from "@tabler/icons-react"
import { toast } from "@/components/ui/toast"

export interface ExtractedLinkItem {
  id: string
  url: string
  domain: string
  title?: string
  description?: string
  image?: string
  senderName: string
  timestamp: string
}

export interface LinksTabContentProps {
  links: ExtractedLinkItem[]
}

function renderDomainIcon(domain: string) {
  const d = domain.toLowerCase()
  if (d.includes("github")) return <IconBrandGithub className="size-4 text-foreground" />
  if (d.includes("figma")) return <IconBrandFigma className="size-4 text-purple-400" />
  return <IconWorld className="size-4 text-muted-foreground" />
}

export function LinksTabContent({ links }: LinksTabContentProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard?.writeText(url)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
    toast.add({
      title: "Link copied",
      description: url,
      type: "success",
    })
  }

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <IconLinkOff className="size-8 opacity-40 mb-1.5 stroke-[1.5]" />
        <p className="text-xs font-medium text-foreground">No links shared</p>
        <p className="text-[11px] opacity-75 max-w-[200px]">
          Web links shared in this chat will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {links.map((linkItem) => {
        const handleOpenLink = (e: React.MouseEvent) => {
          e.stopPropagation()
          window.open(linkItem.url, "_blank", "noopener,noreferrer")
        }

        return (
          <div
            key={linkItem.id}
            onClick={handleOpenLink}
            className="group/link flex flex-col gap-1.5 p-2.5 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {renderDomainIcon(linkItem.domain)}
                <span className="text-[11px] font-semibold text-primary truncate uppercase tracking-wider">
                  {linkItem.domain}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy(linkItem.url, linkItem.id)
                  }}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                  title="Copy URL"
                >
                  {copiedKey === linkItem.id ? (
                    <IconCheck className="size-3 text-emerald-500" />
                  ) : (
                    <IconCopy className="size-3" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleOpenLink}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                  title="Open link"
                >
                  <IconExternalLink className="size-3" />
                </button>
              </div>
            </div>

            {linkItem.title && linkItem.title !== linkItem.domain && (
              <h4 className="text-xs font-semibold text-foreground line-clamp-1 leading-snug group-hover/link:underline">
                {linkItem.title}
              </h4>
            )}

            {linkItem.description && (
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {linkItem.description}
              </p>
            )}

            <span className="text-[10px] text-muted-foreground/80 truncate block">
              {linkItem.url}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default LinksTabContent
