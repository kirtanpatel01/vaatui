import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  IconGif,
  IconAt,
  IconMicrophone,
  IconSend,
} from "@tabler/icons-react"
import CameraModal from "./attachments/camera-modal"
import CreatePollModal from "./attachments/create-poll-modal"
import ShareContactModal from "./attachments/share-contact-modal"
import GifPicker from "./attachments/gif-picker"
import MentionAutocomplete from "./attachments/mention-autocomplete"
import EmojiPicker from "./attachments/emoji-picker"
import AttachmentMenu from "./attachments/attachment-menu"
import VoiceRecorder from "./attachments/voice-recorder"
import PendingAttachmentPreview from "./attachments/pending-attachment-preview"
import MessageReplyBar from "./message-reply-bar"
import { useChatStore, useActiveContact } from "@/stores/chat-store"
import { type MessageAttachment } from "@/data/mock-messages"
import { type UserProfile, type GroupMember } from "@/data/mock-contacts"
import { cn } from "cn"

export interface ChatInputBarProps extends React.ComponentProps<"div"> {
  placeholder?: string
  replyingTo?: {
    id: string
    senderName: string
    text: string
  } | null
  onCancelReply?: () => void
  onSendMessage?: (text: string, attachment?: MessageAttachment) => void
  onRecordVoice?: () => void
}

export function ChatInputBar({
  placeholder = "Type a message...",
  replyingTo,
  className,
  onCancelReply,
  onSendMessage,
  onRecordVoice,
  ...props
}: ChatInputBarProps) {
  const contacts = useChatStore((s) => s.contacts)
  const enterIsSend = useChatStore((s) => s.enterIsSend)
  const activeContact = useActiveContact()
  const isGroup = activeContact?.type === "group"

  const [text, setText] = React.useState("")
  const [emojiOpen, setEmojiOpen] = React.useState(false)
  const [gifOpen, setGifOpen] = React.useState(false)
  const [mentionOpen, setMentionOpen] = React.useState(false)
  const [mentionFilter, setMentionFilter] = React.useState("")
  const [attachmentOpen, setAttachmentOpen] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Modals state
  const [cameraModalOpen, setCameraModalOpen] = React.useState(false)
  const [pollModalOpen, setPollModalOpen] = React.useState(false)
  const [contactModalOpen, setContactModalOpen] = React.useState(false)

  // Selected file / photo attachment pending send
  const [pendingAttachment, setPendingAttachment] = React.useState<MessageAttachment | null>(null)

  // Voice recording state
  const [isRecording, setIsRecording] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [recordingSeconds, setRecordingSeconds] = React.useState(0)
  // Continuous scrolling history of waveform bars (like Telegram / WhatsApp)
  const [liveFrequencies, setLiveFrequencies] = React.useState<number[]>(new Array(36).fill(12))

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const audioChunksRef = React.useRef<Blob[]>([])
  const recordingTimerRef = React.useRef<number | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const audioContextRef = React.useRef<AudioContext | null>(null)
  const analyserRef = React.useRef<AnalyserNode | null>(null)
  const animationFrameRef = React.useRef<number | null>(null)
  const recordedWaveformHistoryRef = React.useRef<number[]>([])

  const photoFileInputRef = React.useRef<HTMLInputElement>(null)
  const docFileInputRef = React.useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  React.useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [text])

  // Cleanup active audio recorder stream & audio context on unmount
  React.useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      // Set up real Web Audio API Analyser to read user's mic frequencies
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const audioCtx = new AudioContextClass()
      audioContextRef.current = audioCtx

      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.5
      source.connect(analyser)
      analyserRef.current = analyser

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []
      recordedWaveformHistoryRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        // Collect recorded blob
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        })
        const objectUrl = URL.createObjectURL(audioBlob)

        // Cleanup audio graph & tracks
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(() => {})
          audioContextRef.current = null
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }

        // Format duration mm:ss
        const mins = Math.floor(recordingSeconds / 60)
        const secs = recordingSeconds % 60
        const durationStr = `${mins}:${secs < 10 ? "0" : ""}${Math.max(1, secs)}`

        // Take snapshot of real recorded waveform or fallback
        const history = recordedWaveformHistoryRef.current
        let waveform: number[]
        if (history.length > 8) {
          const targetBars = 26
          const step = Math.max(1, Math.floor(history.length / targetBars))
          waveform = []
          for (let i = 0; i < history.length && waveform.length < targetBars; i += step) {
            waveform.push(history[i])
          }
        } else {
          waveform = [30, 50, 75, 90, 60, 45, 80, 65, 40, 70, 95, 55, 35, 85, 40, 60]
        }

        // Automatically dispatch voice note message
        onSendMessage?.("", {
          type: "audio",
          url: objectUrl,
          duration: durationStr,
          waveform,
          fileName: `voice_note_${Date.now()}.webm`,
          fileSize: `${(audioBlob.size / 1024).toFixed(1)} KB`,
        })

        setIsRecording(false)
        setIsPaused(false)
        setRecordingSeconds(0)
        setLiveFrequencies(new Array(36).fill(12))
      }

      recorder.start(100)
      setIsRecording(true)
      setIsPaused(false)
      setRecordingSeconds(0)

      // Start timer
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)

      // Live Audio Analyser loop: continuous scrolling waveform (forwarding ticker)
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      let lastPushTime = performance.now()

      const updateMeter = (now: number) => {
        if (!analyserRef.current) return
        analyserRef.current.getByteFrequencyData(dataArray)

        // Compute root-mean-square / voice volume focused on human vocal frequencies (index 2 to 32)
        let sum = 0
        const startBin = 2
        const endBin = Math.min(36, dataArray.length)
        for (let i = startBin; i < endBin; i++) {
          sum += dataArray[i]
        }
        const avg = sum / (endBin - startBin)

        // Amplify vocal sensitivity and clamp between 12% and 100%
        const normalized = Math.min(100, Math.max(12, Math.round((avg / 140) * 100)))

        // Push new beat every ~80ms so waveform smoothly flows/forwards from right to left
        if (now - lastPushTime >= 80) {
          lastPushTime = now
          setLiveFrequencies((prev) => {
            const next = [...prev.slice(1), normalized]
            return next
          })
          recordedWaveformHistoryRef.current.push(normalized)
        }

        animationFrameRef.current = requestAnimationFrame(updateMeter)
      }

      animationFrameRef.current = requestAnimationFrame(updateMeter)
    } catch (err) {
      console.error("Microphone access failed:", err)
      setIsRecording(false)
      alert("Could not access microphone. Please check your browser audio permissions.")
    }
  }

  const pauseVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }

  const resumeVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume()
      setIsPaused(false)

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)

      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        let lastPushTime = performance.now()
        const updateMeter = (now: number) => {
          if (!analyserRef.current) return
          analyserRef.current.getByteFrequencyData(dataArray)

          let sum = 0
          const startBin = 2
          const endBin = Math.min(36, dataArray.length)
          for (let i = startBin; i < endBin; i++) {
            sum += dataArray[i]
          }
          const avg = sum / (endBin - startBin)
          const normalized = Math.min(100, Math.max(12, Math.round((avg / 140) * 100)))

          if (now - lastPushTime >= 80) {
            lastPushTime = now
            setLiveFrequencies((prev) => [...prev.slice(1), normalized])
            recordedWaveformHistoryRef.current.push(normalized)
          }

          animationFrameRef.current = requestAnimationFrame(updateMeter)
        }
        animationFrameRef.current = requestAnimationFrame(updateMeter)
      }
    }
  }

  const stopVoiceRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
  }

  const cancelVoiceRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.ondataavailable = null
      mediaRecorderRef.current.onstop = null
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    audioChunksRef.current = []
    recordedWaveformHistoryRef.current = []
    setIsRecording(false)
    setIsPaused(false)
    setRecordingSeconds(0)
    setLiveFrequencies(new Array(36).fill(12))
  }

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed && !pendingAttachment) return
    onSendMessage?.(trimmed, pendingAttachment ?? undefined)
    setText("")
    setPendingAttachment(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    const isVid = file.type.startsWith("video")

    setPendingAttachment({
      type: isVid ? "video" : "photo",
      thumbnailUrl: objectUrl,
      url: objectUrl,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    })
    e.target.value = ""
  }

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPendingAttachment({
      type: "file",
      url: objectUrl,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    })
    e.target.value = ""
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setText(val)

    if (isGroup) {
      // Check if user is typing an @ mention
      const cursor = e.target.selectionStart ?? val.length
      const textBeforeCursor = val.slice(0, cursor)
      const lastAtMatch = textBeforeCursor.match(/@([a-zA-Z0-9_\s]*)$/)

      if (lastAtMatch) {
        setMentionOpen(true)
        setMentionFilter(lastAtMatch[1])
      } else {
        setMentionOpen(false)
      }
    }
  }

  const handleSelectMember = (member: GroupMember) => {
    const textarea = textareaRef.current
    const mentionTag = `@${member.name} `

    if (!textarea) {
      setText((prev) => prev + mentionTag)
      setMentionOpen(false)
      return
    }

    const cursor = textarea.selectionStart ?? text.length
    const textBeforeCursor = text.slice(0, cursor)
    const textAfterCursor = text.slice(cursor)

    const atIndex = textBeforeCursor.lastIndexOf("@")
    const newPrefix = atIndex >= 0 ? textBeforeCursor.slice(0, atIndex) : textBeforeCursor
    const newFullText = newPrefix + mentionTag + textAfterCursor

    setText(newFullText)
    setMentionOpen(false)

    requestAnimationFrame(() => {
      textarea.focus()
      const newCursor = newPrefix.length + mentionTag.length
      textarea.setSelectionRange(newCursor, newCursor)
    })
  }

  const handleSelectGif = (gifUrl: string, title?: string) => {
    onSendMessage?.("", {
      type: "photo",
      thumbnailUrl: gifUrl,
      url: gifUrl,
      fileName: title ? `${title}.gif` : "animation.gif",
      fileSize: "GIF",
    })
  }

  const handleCameraCapture = (dataUrl: string) => {
    setPendingAttachment({
      type: "photo",
      thumbnailUrl: dataUrl,
      url: dataUrl,
      fileName: `camera_${Date.now()}.jpg`,
      fileSize: "1.2 MB",
    })
  }

  const handleCreatePoll = (question: string, options: string[], allowMultiple: boolean) => {
    onSendMessage?.("", {
      type: "poll",
      poll: {
        question,
        allowMultiple,
        options: options.map((opt, i) => ({
          id: `opt_${Date.now()}_${i}`,
          text: opt,
          votes: [],
        })),
      },
    })
  }

  const handleShareContact = (contact: UserProfile) => {
    onSendMessage?.("", {
      type: "contact",
      contact: {
        name: contact.name,
        phone: contact.phone,
        avatar: contact.avatar,
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (enterIsSend) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    } else {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleSend()
      }
    }
  }

  // Insert emoji at the exact current cursor position
  const handleSelectEmoji = (emoji: { native: string }) => {
    const emojiChar = emoji.native
    if (!emojiChar) return

    const textarea = textareaRef.current
    if (!textarea) {
      setText((prev) => prev + emojiChar)
      return
    }

    const start = textarea.selectionStart ?? text.length
    const end = textarea.selectionEnd ?? text.length
    const newText = text.substring(0, start) + emojiChar + text.substring(end)
    setText(newText)

    // Close picker after selection
    setEmojiOpen(false)

    // Restore focus and place cursor right after inserted emoji
    requestAnimationFrame(() => {
      textarea.focus()
      const newPos = start + emojiChar.length
      textarea.setSelectionRange(newPos, newPos)
    })
  }

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 p-3 bg-background/95 backdrop-blur-md border-t border-border/40 w-full",
        className
      )}
      {...props}
    >
      {/* Group Member Mention Autocomplete Dropdown */}
      {isGroup && (
        <MentionAutocomplete
          open={mentionOpen}
          members={activeContact?.members || []}
          filterText={mentionFilter}
          onSelectMember={handleSelectMember}
          onClose={() => setMentionOpen(false)}
        />
      )}

      {/* Replying Banner Preview */}
      {replyingTo && (
        <MessageReplyBar
          replyingTo={replyingTo}
          onCancel={onCancelReply}
        />
      )}

      {/* Pending Attachment Compact Chip Preview */}
      {pendingAttachment && (
        <PendingAttachmentPreview
          attachment={pendingAttachment}
          onRemove={() => setPendingAttachment(null)}
        />
      )}

      {/* Recording in progress overlay bar */}
      {isRecording ? (
        <VoiceRecorder
          isRecording={isRecording}
          isPaused={isPaused}
          recordingSeconds={recordingSeconds}
          liveFrequencies={liveFrequencies}
          onPause={pauseVoiceRecording}
          onResume={resumeVoiceRecording}
          onCancel={cancelVoiceRecording}
          onSend={stopVoiceRecording}
        />
      ) : (
        /* Main Bar with Plus icon, Input, and Actions */
        <div className="flex items-center gap-2 w-full">
          {/* Plus (+) Attachments Menu */}
          <AttachmentMenu
            open={attachmentOpen}
            onOpenChange={setAttachmentOpen}
            onSelectOption={(optionId) => {
              if (optionId === "photo") {
                photoFileInputRef.current?.click()
              } else if (optionId === "file") {
                docFileInputRef.current?.click()
              } else if (optionId === "camera") {
                setCameraModalOpen(true)
              } else if (optionId === "contact") {
                setContactModalOpen(true)
              } else if (optionId === "poll") {
                setPollModalOpen(true)
              }
            }}
          />

          {/* Input Textarea Container */}
          <div className="flex-1 min-w-0 flex items-center rounded-2xl bg-secondary/50 border border-border/40 px-3.5 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none max-h-32 leading-relaxed"
            />

            {/* Right inline icons: Emoji, GIF, Mention (group only) */}
            <div className="flex items-center gap-1 ml-2 text-muted-foreground shrink-0 select-none">
              {/* Emoji Mart Picker Popover */}
              <EmojiPicker
                open={emojiOpen}
                onOpenChange={setEmojiOpen}
                onSelectEmoji={handleSelectEmoji}
              />

              {/* GIF Picker Popover */}
              <GifPicker
                open={gifOpen}
                onOpenChange={setGifOpen}
                onSelectGif={handleSelectGif}
              >
                <button
                  type="button"
                  className={cn(
                    "p-1 hover:text-foreground transition-colors cursor-pointer",
                    gifOpen && "text-foreground"
                  )}
                  aria-label="Insert GIF"
                >
                  <IconGif className="size-4.5" />
                </button>
              </GifPicker>

              {/* Mention button (available ONLY in group chats) */}
              {isGroup && (
                <button
                  type="button"
                  onClick={() => {
                    setMentionOpen((prev) => !prev)
                    setMentionFilter("")
                    textareaRef.current?.focus()
                  }}
                  className={cn(
                    "p-1 hover:text-foreground transition-colors cursor-pointer",
                    mentionOpen && "text-primary"
                  )}
                  aria-label="Mention group member"
                  title="Mention group member"
                >
                  <IconAt className="size-4.5" />
                </button>
              )}
            </div>
          </div>

          {/* Microphone / Voice note button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={startVoiceRecording}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Record voice note"
            title="Record voice note"
          >
            <IconMicrophone className="size-5" />
          </Button>

          {/* Send message button */}
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            className="shrink-0"
            aria-label="Send message"
          >
            <IconSend className="size-4" />
          </Button>
        </div>
      )}

      {/* Hidden File Inputs for Photo/Video and Document pickers */}
      <input
        ref={photoFileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handlePhotoSelect}
        className="hidden"
      />
      <input
        ref={docFileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,.*"
        onChange={handleDocSelect}
        className="hidden"
      />

      {/* Camera Live Snapshot Modal */}
      <CameraModal
        open={cameraModalOpen}
        onOpenChange={setCameraModalOpen}
        onCapture={handleCameraCapture}
      />

      {/* Create Poll Dialog */}
      <CreatePollModal
        open={pollModalOpen}
        onOpenChange={setPollModalOpen}
        onCreatePoll={handleCreatePoll}
      />

      {/* Share Contact Dialog */}
      <ShareContactModal
        contacts={contacts}
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        onShareContact={handleShareContact}
      />
    </div>
  )
}

export default ChatInputBar
