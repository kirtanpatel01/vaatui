import { IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { type ChatMessage } from "@/data/mock-messages"

export interface MediaLightboxModalProps {
  media: ChatMessage | null
  onClose: () => void
}

export function MediaLightboxModal({
  media,
  onClose,
}: MediaLightboxModalProps) {
  if (!media) return null

  const handleDownload = () => {
    toast.add({
      title: "Download Started",
      description: `Downloading ${media.attachment?.fileName || "media"}`,
      type: "success",
    })
  }

  return (
    <Dialog open={!!media} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-black/95 text-white border-neutral-800">
        <DialogHeader className="p-4 bg-black/60 border-b border-neutral-800 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-sm font-semibold text-white">
              {media.attachment?.fileName || "Shared Media"}
            </DialogTitle>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Shared by {media.senderName} • {media.timestamp}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8 gap-1.5 bg-neutral-900 border-neutral-700 text-neutral-200 hover:text-white"
            >
              <IconDownload className="size-3.5" />
              <span>Download</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="relative flex items-center justify-center p-4 max-h-[70vh] bg-black">
          {media.attachment?.thumbnailUrl && (
            <img
              src={media.attachment.thumbnailUrl}
              alt={media.attachment.fileName || "Media preview"}
              className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg"
            />
          )}
        </div>

        {media.text && (
          <div className="p-4 bg-neutral-900/90 border-t border-neutral-800 text-xs text-neutral-200">
            <p>{media.text}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default MediaLightboxModal
