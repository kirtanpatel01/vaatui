import { IconPhotoOff, IconPlayerPlayFilled } from "@tabler/icons-react"
import { type ChatMessage } from "@/data/mock-messages"

export interface MediaTabContentProps {
  mediaMessages: ChatMessage[]
  onSelectMedia: (msg: ChatMessage) => void
}

export function MediaTabContent({
  mediaMessages,
  onSelectMedia,
}: MediaTabContentProps) {
  if (mediaMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <IconPhotoOff className="size-8 opacity-40 mb-1.5 stroke-[1.5]" />
        <p className="text-xs font-medium text-foreground">No photos or videos</p>
        <p className="text-[11px] opacity-75 max-w-[200px]">
          Media shared in this chat will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {mediaMessages.map((msg) => {
        const isVideo = msg.attachment?.type === "video"
        return (
          <div
            key={msg.id}
            onClick={() => onSelectMedia(msg)}
            className="group/thumb relative aspect-square w-full overflow-hidden rounded-lg bg-muted border border-border/50 cursor-pointer shadow-2xs hover:border-primary/60 transition-all duration-150"
          >
            {msg.attachment?.thumbnailUrl ? (
              <img
                src={msg.attachment.thumbnailUrl}
                alt={msg.attachment.fileName || "Media thumbnail"}
                className="size-full object-cover transition-transform duration-200 group-hover/thumb:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="size-full flex items-center justify-center text-muted-foreground text-xl">
                {isVideo ? "🎥" : "🖼️"}
              </div>
            )}

            {/* Video overlay indicator */}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/30 text-foreground">
                <div className="flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-xs">
                  <IconPlayerPlayFilled className="size-3 ml-0.5" />
                </div>
                {msg.attachment?.duration && (
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded-xs bg-background/90 text-[9px] tabular-nums font-medium text-foreground">
                    {msg.attachment.duration}
                  </span>
                )}
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-end p-1 text-foreground">
              <span className="text-[9px] truncate drop-shadow-xs font-medium">
                {msg.attachment?.fileSize || msg.timestamp}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MediaTabContent
