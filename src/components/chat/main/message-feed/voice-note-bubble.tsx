import * as React from "react"
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
} from "@tabler/icons-react"
import { cn } from "cn"

export interface VoiceNoteBubbleProps {
  duration?: string
  url?: string
  waveform?: number[]
  isSentByMe: boolean
}

// Generate realistic simulated voice audio tone using Web Audio API when no audio file URL is attached
function createSimulatedAudioTone(durationSec: number) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return null
    const ctx = new AudioContextClass()
    const sampleRate = ctx.sampleRate
    const frameCount = sampleRate * Math.max(1, durationSec)
    const buffer = ctx.createBuffer(1, frameCount, sampleRate)
    const channelData = buffer.getChannelData(0)

    // Generate gentle harmonic voice-like sound waveform
    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate
      // Modulation frequency creating vocal formant effect
      const formant = Math.sin(2 * Math.PI * 220 * t) * 0.4 + Math.sin(2 * Math.PI * 440 * t) * 0.2
      const envelope = Math.sin((Math.PI * i) / frameCount)
      channelData[i] = formant * envelope * 0.25
    }

    // Convert AudioBuffer to WAV blob
    const wavBlob = audioBufferToWavBlob(buffer)
    return URL.createObjectURL(wavBlob)
  } catch {
    return null
  }
}

function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels
  const length = buffer.length * numOfChan * 2 + 44
  const outBuffer = new ArrayBuffer(length)
  const view = new DataView(outBuffer)
  const channels: Float32Array[] = []
  let sample = 0
  let offset = 0
  let pos = 0

  function setUint16(data: number) {
    view.setUint16(pos, data, true)
    pos += 2
  }
  function setUint32(data: number) {
    view.setUint32(pos, data, true)
    pos += 4
  }

  // RIFF identifier
  setUint32(0x46464952) // "RIFF"
  setUint32(length - 8) // file length - 8
  setUint32(0x45564157) // "WAVE"
  setUint32(0x20746d66) // "fmt " chunk
  setUint32(16) // length = 16
  setUint16(1) // PCM (uncompressed)
  setUint16(numOfChan)
  setUint32(buffer.sampleRate)
  setUint32(buffer.sampleRate * 2 * numOfChan) // byte rate
  setUint16(numOfChan * 2) // block align
  setUint16(16) // bits per sample
  setUint32(0x61746164) // "data" chunk
  setUint32(length - pos - 4)

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i))
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]))
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0
      view.setInt16(pos, sample, true)
      pos += 2
    }
    offset++
  }

  return new Blob([outBuffer], { type: "audio/wav" })
}

const DEFAULT_BARS = [
  40, 65, 85, 30, 95, 70, 50, 80, 100, 60, 45, 90, 75, 55, 35, 70, 85,
  60, 40, 75, 90, 50, 65, 45, 80, 55, 30,
]

export function VoiceNoteBubble({
  duration = "0:15",
  url,
  waveform,
  isSentByMe,
}: VoiceNoteBubbleProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0) // 0 to 1
  const [playbackRate, setPlaybackRate] = React.useState<number>(1)
  const [currentTimeStr, setCurrentTimeStr] = React.useState<string>("0:00")
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const syntheticUrlRef = React.useRef<string | null>(null)

  // Parse duration seconds from string e.g. "0:15"
  const totalSeconds = React.useMemo(() => {
    const parts = duration.split(":").map(Number)
    if (parts.length === 2) {
      return (parts[0] || 0) * 60 + (parts[1] || 0)
    }
    return 15
  }, [duration])

  const audioSrc = React.useMemo(() => {
    if (url) return url
    if (!syntheticUrlRef.current) {
      syntheticUrlRef.current = createSimulatedAudioTone(totalSeconds)
    }
    return syntheticUrlRef.current
  }, [url, totalSeconds])

  // Cleanup blob URL on unmount
  React.useEffect(() => {
    return () => {
      if (syntheticUrlRef.current && syntheticUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(syntheticUrlRef.current)
      }
    }
  }, [])

  // Audio setup & playback listener
  React.useEffect(() => {
    if (!audioSrc) return
    const audio = new Audio(audioSrc)
    audioRef.current = audio

    const updateProgress = () => {
      if (!audio.duration || isNaN(audio.duration)) return
      const current = audio.currentTime
      const prog = current / audio.duration
      setProgress(Math.min(1, prog))

      const mins = Math.floor(current / 60)
      const secs = Math.floor(current % 60)
      setCurrentTimeStr(`${mins}:${secs < 10 ? "0" : ""}${secs}`)
    }

    const onEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTimeStr("0:00")
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("ended", onEnded)
      audioRef.current = null
    }
  }, [audioSrc])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.playbackRate = playbackRate
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  const toggleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextSpeed = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1
    setPlaybackRate(nextSpeed)
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width))
    setProgress(newProgress)

    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = newProgress * audioRef.current.duration
    }
  }

  const bars = waveform && waveform.length > 0 ? waveform : DEFAULT_BARS
  const currentActiveBarIndex = Math.floor(progress * bars.length)

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 min-w-[230px] sm:min-w-[270px] select-none shadow-xs transition-colors",
        isSentByMe
          ? "bg-chat-bubble-sent text-chat-bubble-sent-foreground border border-border/80"
          : "bg-chat-bubble-received text-chat-bubble-received-foreground border border-border/60"
      )}
    >
      {/* Play / Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full transition-transform cursor-pointer shadow-xs",
          isSentByMe
            ? "bg-chat-bubble-sent-foreground text-chat-bubble-sent hover:opacity-90"
            : "bg-foreground text-background hover:opacity-90"
        )}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? (
          <IconPlayerPauseFilled className="size-3.5" />
        ) : (
          <IconPlayerPlayFilled className="size-3.5 translate-x-0.5" />
        )}
      </button>

      {/* Interactive Waveform Bars Scrubber */}
      <div
        onClick={handleSeek}
        className="flex flex-1 items-center gap-0.75 h-6 cursor-pointer py-1 group/wave"
        title="Click to seek"
      >
        {bars.map((h, i) => {
          const isPlayed = i <= currentActiveBarIndex
          return (
            <span
              key={i}
              style={{ height: `${Math.max(15, h)}%` }}
              className={cn(
                "w-0.75 rounded-full transition-all duration-75",
                isPlayed
                  ? isSentByMe
                    ? "bg-chat-bubble-sent-foreground"
                    : "bg-primary"
                  : isSentByMe
                    ? "bg-chat-bubble-sent-foreground/35 group-hover/wave:bg-chat-bubble-sent-foreground/60"
                    : "bg-muted-foreground/35 group-hover/wave:bg-muted-foreground/60"
              )}
            />
          )
        })}
      </div>

      {/* Dynamic Duration or Current Timestamp */}
      <span className="text-xs tabular-nums font-medium opacity-85 shrink-0 min-w-[28px] text-right">
        {isPlaying ? currentTimeStr : duration}
      </span>

      {/* Speed badge (1x -> 1.5x -> 2x) */}
      <button
        type="button"
        onClick={toggleSpeed}
        className={cn(
          "rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums shrink-0 cursor-pointer transition-all",
          isSentByMe
            ? "bg-chat-bubble-sent-foreground/15 text-chat-bubble-sent-foreground hover:bg-chat-bubble-sent-foreground/25"
            : "bg-background/80 text-foreground border border-border/60 hover:bg-background"
        )}
        title="Toggle playback speed"
      >
        {playbackRate}x
      </button>
    </div>
  )
}

export default VoiceNoteBubble
