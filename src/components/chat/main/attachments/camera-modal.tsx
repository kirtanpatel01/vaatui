import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconCamera, IconRefresh, IconCheck, IconAlertCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

export const CameraModalTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    type="button"
    variant="secondary"
    size="icon"
    className={cn("shrink-0", className)}
    aria-label="Open camera"
    {...props}
  >
    <IconCamera className="size-4" />
  </Button>
))
CameraModalTrigger.displayName = "CameraModalTrigger"

export const CameraModalMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-foreground hover:bg-muted transition-colors cursor-pointer select-none",
      className
    )}
    {...props}
  >
    <IconCamera className="size-4 text-muted-foreground" />
    <span>{children ?? "Camera"}</span>
  </button>
))
CameraModalMenuItem.displayName = "CameraModalMenuItem"

export interface CameraModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCapture: (imageDataUrl: string) => void
}

export function CameraModal({ open, onOpenChange, onCapture }: CameraModalProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null)
  const [cameraError, setCameraError] = React.useState<string | null>(null)

  // Start webcam when opened, stop when closed
  React.useEffect(() => {
    let localStream: MediaStream | null = null

    if (open) {
      setCapturedImage(null)
      setCameraError(null)

      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          })
          .then((mediaStream) => {
            localStream = mediaStream
            setStream(mediaStream)
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream
            }
          })
          .catch((err) => {
            console.warn("Camera access denied or unavailable", err)
            setCameraError("Camera unavailable or permission denied. Please allow camera access.")
          })
      } else {
        setCameraError("Camera API is not supported in this browser.")
      }
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop())
      }
      setStream(null)
    }
  }, [open])

  // Attach stream to video once stream or capturedImage state stabilizes
  React.useEffect(() => {
    if (stream && videoRef.current && !capturedImage) {
      videoRef.current.srcObject = stream
    }
  }, [stream, capturedImage])

  const stopStream = React.useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const handleTakePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setCapturedImage(dataUrl)
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
  }

  const handleSend = () => {
    if (capturedImage) {
      onCapture(capturedImage)
      stopStream()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-md gap-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconCamera className="size-4" />
            </div>
            <DialogTitle className="text-sm font-semibold text-foreground">Take a photo</DialogTitle>
          </div>
        </DialogHeader>

        {/* Viewfinder Area */}
        <div className="relative bg-muted aspect-4/3 flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="flex flex-col items-center gap-2 p-6 text-center text-xs text-muted-foreground max-w-xs">
              <IconAlertCircle className="size-8 text-destructive" />
              <p>{cameraError}</p>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Snapshot"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="flex items-center justify-between p-4 bg-muted/30 border-t">
          {capturedImage ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetake}
                className="gap-1.5 cursor-pointer"
              >
                <IconRefresh className="size-4" />
                <span>Retake</span>
              </Button>

              <Button
                size="sm"
                onClick={handleSend}
                className="gap-1.5 cursor-pointer"
              >
                <IconCheck className="size-4" />
                <span>Use Photo</span>
              </Button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                disabled={Boolean(cameraError)}
                onClick={handleTakePhoto}
                className="size-14 rounded-full border-4 border-foreground/80 bg-destructive hover:bg-destructive/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center"
                aria-label="Take picture"
              >
                <div className="size-5 rounded-full bg-destructive-foreground/40" />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CameraModal
