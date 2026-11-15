import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import {
  IconX,
  IconDownload,
  IconArrowForwardUp,
  IconStar,
  IconStarFilled,
  IconRotateClockwise,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"
import { useChat } from "@/components/chat/chat-provider"
import ForwardMessageDialog from "@/components/chat/main/forward-message-dialog"
import { toast } from "@/components/ui/toast"
import { type ChatMessage } from "@/data/mock-messages"
import { cn } from "cn"

export interface MediaLightboxModalProps {
  media: ChatMessage | null
  allMedia?: ChatMessage[]
  onClose: () => void
  onSelectMedia?: (media: ChatMessage) => void
}

export function MediaLightboxModal({
  media,
  allMedia = [],
  onClose,
  onSelectMedia,
}: MediaLightboxModalProps) {
  const { activeContact, messages, toggleStar, forwardMessage } = useChat()

  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [forwardOpen, setForwardOpen] = useState(false)

  const dragStartRef = useRef({ x: 0, y: 0 })
  const startPosRef = useRef({ x: 0, y: 0 })

  // Reset zoom, rotation and position whenever displayed media changes
  useEffect(() => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
    setIsDragging(false)
  }, [media?.id])

  const handleZoomChange = useCallback((newZoom: number) => {
    const clamped = Math.min(3, Math.max(1, Math.round(newZoom * 10) / 10))
    setZoom(clamped)
    if (clamped <= 1) {
      setPosition({ x: 0, y: 0 })
    }
  }, [])

  // Find index in playlist
  const currentIndex = useMemo(() => {
    if (!media || allMedia.length === 0) return -1
    return allMedia.findIndex((m) => m.id === media.id)
  }, [media, allMedia])

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < allMedia.length - 1

  const handlePrev = useCallback(() => {
    if (hasPrev && onSelectMedia) {
      onSelectMedia(allMedia[currentIndex - 1])
    }
  }, [hasPrev, currentIndex, allMedia, onSelectMedia])

  const handleNext = useCallback(() => {
    if (hasNext && onSelectMedia) {
      onSelectMedia(allMedia[currentIndex + 1])
    }
  }, [hasNext, currentIndex, allMedia, onSelectMedia])

  // Keyboard navigation & shortcuts
  useEffect(() => {
    if (!media) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (forwardOpen || (e.target as HTMLElement)?.tagName === "INPUT") return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "+" || e.key === "=") {
        handleZoomChange(zoom + 0.5)
      } else if (e.key === "-") {
        handleZoomChange(zoom - 0.5)
      } else if (e.key === "0") {
        handleZoomChange(1)
      } else if (e.key.toLowerCase() === "r") {
        setRotation((prev) => (prev + 90) % 360)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [media, forwardOpen, onClose, handlePrev, handleNext, zoom, handleZoomChange])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (media?.attachment?.type === "video" || e.button !== 0) return
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    startPosRef.current = { x: position.x, y: position.y }
  }

  // Global mousemove and mouseup listeners while dragging
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      setPosition({
        x: startPosRef.current.x + dx,
        y: startPosRef.current.y + dy,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (media?.attachment?.type === "video" || e.touches.length !== 1) return
    const touch = e.touches[0]
    setIsDragging(true)
    dragStartRef.current = { x: touch.clientX, y: touch.clientY }
    startPosRef.current = { x: position.x, y: position.y }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const touch = e.touches[0]
    const dx = touch.clientX - dragStartRef.current.x
    const dy = touch.clientY - dragStartRef.current.y
    setPosition({
      x: startPosRef.current.x + dx,
      y: startPosRef.current.y + dy,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Double click toggles between 1x and 2x zoom
  const handleDoubleClick = () => {
    if (media?.attachment?.type === "video") return
    if (zoom > 1) {
      handleZoomChange(1)
    } else {
      handleZoomChange(2)
    }
  }

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (media?.attachment?.type === "video") return
    e.preventDefault()
    const step = e.deltaY < 0 ? 0.25 : -0.25
    handleZoomChange(zoom + step)
  }

  if (!media) return null

  // Get live message state for reactive star status
  const liveMessage = messages.find((m) => m.id === media.id) || media
  const isStarred = Boolean(liveMessage.isStarred)

  const handleToggleStar = () => {
    toggleStar(media.id)
    toast.add({
      title: isStarred ? "Removed from Starred" : "Message Starred",
      description: isStarred
        ? "Photo removed from your starred messages"
        : "Photo added to your starred messages",
      type: "info",
    })
  }

  const handleDownload = () => {
    const url = media.attachment?.url || media.attachment?.thumbnailUrl
    const fileName = media.attachment?.fileName || "media_attachment.jpg"

    if (url) {
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = fileName
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
    }

    toast.add({
      title: "Download Started",
      description: `Downloading ${fileName}`,
      type: "success",
    })
  }

  const handleForwardConfirm = (targetChatIds: string[], messageToForward: ChatMessage) => {
    forwardMessage(targetChatIds, messageToForward)
    toast.add({
      title: "Forwarded",
      description: `Message forwarded to ${targetChatIds.length} contact${
        targetChatIds.length > 1 ? "s" : ""
      }`,
      type: "success",
    })
    setForwardOpen(false)
  }

  const isVideo = media.attachment?.type === "video"
  const mediaUrl = media.attachment?.url || media.attachment?.thumbnailUrl

  if (typeof document === "undefined") return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-background/95 text-foreground select-none backdrop-blur-md animate-in fade-in duration-150"
    >
      {/* 1. Header Bar styled with project tokens */}
      <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-card/80 border-b border-border/60 backdrop-blur-md z-20">
        {/* Left: Sender info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-full overflow-hidden shrink-0 bg-muted border border-border flex items-center justify-center text-xs font-semibold text-foreground">
            {media.senderAvatar || activeContact.avatar ? (
              <img
                src={media.senderAvatar || activeContact.avatar}
                alt={media.senderName || activeContact.name}
                className="size-full object-cover"
              />
            ) : (
              <span>{(media.senderName || activeContact.name).charAt(0)}</span>
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate max-w-[220px]">
              {media.senderName || activeContact.name}
            </h4>
            <p className="text-[11px] text-muted-foreground truncate">
              {media.timestamp}
              {media.date && media.date !== "Today" ? ` • ${media.date}` : ""}
            </p>
          </div>
        </div>

        {/* Right: Functional Action Icons */}
        <div className="flex items-center gap-1 text-muted-foreground">
          {/* Zoom Out */}
          {!isVideo && (
            <button
              type="button"
              onClick={() => handleZoomChange(zoom - 0.5)}
              disabled={zoom <= 1}
              className="p-2 rounded-lg hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Zoom out (-)"
              aria-label="Zoom out"
            >
              <IconZoomOut className="size-4.5" />
            </button>
          )}

          {/* Zoom Level Indicator / Reset */}
          {!isVideo && zoom > 1 && (
            <button
              type="button"
              onClick={() => handleZoomChange(1)}
              className="px-2 py-1 rounded-md text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset Zoom (0)"
            >
              <IconZoomReset className="size-3.5" />
              <span>{Math.round(zoom * 100)}%</span>
            </button>
          )}

          {/* Zoom In */}
          {!isVideo && (
            <button
              type="button"
              onClick={() => handleZoomChange(zoom + 0.5)}
              disabled={zoom >= 3}
              className="p-2 rounded-lg hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Zoom in (+)"
              aria-label="Zoom in"
            >
              <IconZoomIn className="size-4.5" />
            </button>
          )}

          {/* Rotate Clockwise */}
          {!isVideo && (
            <button
              type="button"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="p-2 rounded-lg hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Rotate clockwise (R)"
              aria-label="Rotate clockwise"
            >
              <IconRotateClockwise className="size-4.5" />
            </button>
          )}

          {/* Star Toggle */}
          <button
            type="button"
            onClick={handleToggleStar}
            className="p-2 rounded-lg hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title={isStarred ? "Unstar message" : "Star message"}
            aria-label={isStarred ? "Unstar message" : "Star message"}
          >
            {isStarred ? (
              <IconStarFilled className="size-4.5 text-starred" />
            ) : (
              <IconStar className="size-4.5" />
            )}
          </button>

          {/* Forward */}
          <button
            type="button"
            onClick={() => setForwardOpen(true)}
            className="p-2 rounded-lg hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Forward message"
            aria-label="Forward message"
          >
            <IconArrowForwardUp className="size-4.5" />
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-2 rounded-lg hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Download media"
            aria-label="Download media"
          >
            <IconDownload className="size-4.5" />
          </button>

          {/* Close Lightbox */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:text-foreground hover:bg-muted transition-colors cursor-pointer ml-1"
            title="Close (Esc)"
            aria-label="Close viewer"
          >
            <IconX className="size-4.5" />
          </button>
        </div>
      </header>

      {/* 2. Main Viewer Area with Left / Right Navigation & Draggable Canvas */}
      <main
        onWheel={handleWheel}
        className="relative flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden"
      >
        {/* Previous Navigation Arrow */}
        {hasPrev && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full bg-card/85 text-foreground hover:bg-card border border-border shadow-md backdrop-blur-md transition-all cursor-pointer"
            title="Previous (Left arrow)"
            aria-label="Previous media"
          >
            <IconChevronLeft className="size-5" />
          </button>
        )}

        {/* Main Displayed Media (Draggable & Zoomable) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          className="relative flex items-center justify-center max-h-full max-w-full select-none"
        >
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="max-h-[calc(100vh-220px)] max-w-[calc(100vw-140px)] object-contain rounded-xl shadow-2xl border border-border/50"
            />
          ) : mediaUrl ? (
            <img
              src={mediaUrl}
              alt={media.attachment?.fileName || "Media preview"}
              style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom}) rotate(${rotation}deg)`,
                transition: isDragging ? "none" : "transform 200ms ease",
              }}
              className={cn(
                "max-h-[calc(100vh-220px)] max-w-[calc(100vw-140px)] object-contain select-none shadow-2xl rounded-xl border border-border/40 will-change-transform",
                zoom > 1
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-zoom-in"
              )}
              draggable={false}
            />
          ) : (
            <div className="text-muted-foreground text-sm">Media unavailable</div>
          )}
        </div>

        {/* Next Navigation Arrow */}
        {hasNext && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full bg-card/85 text-foreground hover:bg-card border border-border shadow-md backdrop-blur-md transition-all cursor-pointer"
            title="Next (Right arrow)"
            aria-label="Next media"
          >
            <IconChevronRight className="size-5" />
          </button>
        )}

        {/* Message Caption (if available) */}
        {media.text && (
          <div className="absolute bottom-4 z-20 max-w-xl px-4 py-2 rounded-xl bg-card/90 border border-border text-xs text-card-foreground text-center backdrop-blur-md shadow-md pointer-events-auto">
            {media.text}
          </div>
        )}
      </main>

      {/* 3. Bottom Filmstrip of Thumbnails (using project theme) */}
      {allMedia.length > 0 && (
        <footer className="shrink-0 bg-card/80 border-t border-border/60 py-2.5 px-4 backdrop-blur-md z-20">
          <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full py-1 [scrollbar-width:thin]">
            {allMedia.map((item) => {
              const isActive = item.id === media.id
              const itemIsVideo = item.attachment?.type === "video"
              const thumbUrl = item.attachment?.thumbnailUrl || item.attachment?.url

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectMedia?.(item)
                    handleZoomChange(1)
                    setRotation(0)
                  }}
                  className={cn(
                    "relative size-12 shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all border-2",
                    isActive
                      ? "border-primary ring-2 ring-primary/30 scale-105 opacity-100 shadow-xs"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                  )}
                  title={item.attachment?.fileName || item.timestamp}
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={item.attachment?.fileName || "Media thumbnail"}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="size-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                      {itemIsVideo ? "🎥" : "🖼️"}
                    </div>
                  )}

                  {itemIsVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                      <IconPlayerPlayFilled className="size-2 text-foreground" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </footer>
      )}

      {/* 4. Forward Dialog */}
      <ForwardMessageDialog
        message={media}
        open={forwardOpen}
        onOpenChange={setForwardOpen}
        onForwardConfirm={handleForwardConfirm}
      />
    </div>,
    document.body
  )
}

export default MediaLightboxModal
