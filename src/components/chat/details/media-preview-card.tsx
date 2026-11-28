import { IconChevronRight, IconPlayerPlayFilled, IconFileText, IconLink } from "@tabler/icons-react"
import { type ChatMessage } from "@/data/mock-messages"
import { type ExtractedLinkItem } from "./tabs/links-tab-content"

export interface MediaPreviewCardProps {
  mediaMessages: ChatMessage[]
  fileMessages: ChatMessage[]
  links: ExtractedLinkItem[]
  onOpenMediaView: (tab?: "photos" | "files" | "links") => void
  onSelectMedia: (msg: ChatMessage) => void
}

export function MediaPreviewCard({
  mediaMessages,
  fileMessages,
  links,
  onOpenMediaView,
  onSelectMedia,
}: MediaPreviewCardProps) {
  const totalCount = mediaMessages.length + fileMessages.length + links.length
  const previewMedia = mediaMessages.slice(0, 3)
  const remainingCount = mediaMessages.length - 2

  return (
    <div className="py-2.5">
      {/* Clickable Header Row */}
      <button
        type="button"
        onClick={() => onOpenMediaView("photos")}
        className="w-full flex items-center justify-between px-4 py-1.5 text-left hover:bg-muted/40 transition-colors group cursor-pointer"
      >
        <span className="text-xs font-semibold text-foreground">
          Media, links and docs
        </span>
        <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors">
          <span className="text-xs tabular-nums font-medium">{totalCount}</span>
          <IconChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </button>

      {/* Preview Content */}
      <div className="px-4 pt-2">
        {mediaMessages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {previewMedia.map((msg, idx) => {
              const isVideo = msg.attachment?.type === "video"
              const isLastWithOverflow = idx === 2 && mediaMessages.length > 3

              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    if (isLastWithOverflow) {
                      onOpenMediaView("photos")
                    } else {
                      onSelectMedia(msg)
                    }
                  }}
                  className="group/thumb relative aspect-square w-full overflow-hidden rounded-lg bg-muted border border-border/60 cursor-pointer shadow-2xs hover:border-primary/60 transition-all duration-150"
                  title={
                    isLastWithOverflow
                      ? `View all ${mediaMessages.length} photos & videos`
                      : msg.attachment?.fileName || "View media"
                  }
                >
                  {msg.attachment?.thumbnailUrl ? (
                    <img
                      src={msg.attachment.thumbnailUrl}
                      alt={msg.attachment.fileName || "Media preview"}
                      className="size-full object-cover transition-transform duration-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-muted-foreground text-sm">
                      {isVideo ? "🎥" : "🖼️"}
                    </div>
                  )}

                  {/* Video Play Overlay */}
                  {isVideo && !isLastWithOverflow && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/30 text-foreground">
                      <div className="flex size-5 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-xs">
                        <IconPlayerPlayFilled className="size-2.5 ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* "+N More" Overlay on 3rd Thumbnail */}
                  {isLastWithOverflow && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-2xs text-foreground font-semibold text-xs transition-colors hover:bg-background/70">
                      +{remainingCount}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : fileMessages.length > 0 ? (
          /* Fallback preview for files if no photos */
          <button
            type="button"
            onClick={() => onOpenMediaView("files")}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors border border-border/50 text-left cursor-pointer"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <IconFileText className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-foreground block truncate">
                {fileMessages[0].attachment?.fileName || "Document"}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                {fileMessages[0].attachment?.fileSize || "File"} • Tap to view all files
              </span>
            </div>
          </button>
        ) : links.length > 0 ? (
          /* Fallback preview for links if no photos/files */
          <button
            type="button"
            onClick={() => onOpenMediaView("links")}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors border border-border/50 text-left cursor-pointer"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <IconLink className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-foreground block truncate">
                {links[0].title || links[0].domain}
              </span>
              <span className="text-[10px] text-muted-foreground block truncate">
                {links[0].url}
              </span>
            </div>
          </button>
        ) : (
          <p className="text-xs text-muted-foreground/70 py-1">
            No media, links, or docs shared yet
          </p>
        )}
      </div>
    </div>
  )
}

export default MediaPreviewCard
