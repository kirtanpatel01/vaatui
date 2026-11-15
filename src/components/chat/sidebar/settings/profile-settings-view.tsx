import { useState, useRef } from "react"
import { IconArrowLeft, IconCamera, IconCheck, IconSparkles } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { useChat } from "@/components/chat/chat-provider"

export interface ProfileSettingsViewProps {
  onBack: () => void
}

const PRESET_THOUGHTS = [
  "Working on VaatUI 🚀",
  "In a meeting 🎧",
  "Coding... 💻",
  "Available to chat ✨",
  "Away from keyboard ☕",
]

export function ProfileSettingsView({ onBack }: ProfileSettingsViewProps) {
  const { currentUser, updateCurrentUser } = useChat()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(currentUser.name)
  const [username, setUsername] = useState(currentUser.username || "@kjpatel")
  const [bio, setBio] = useState(currentUser.bio || "")
  const [thought, setThought] = useState(currentUser.thought || "")
  const [isEditingThought, setIsEditingThought] = useState(false)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateCurrentUser({ avatar: reader.result })
        toast.add({
          title: "Avatar Updated",
          description: "Your profile picture has been updated.",
          type: "success",
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    updateCurrentUser({
      name: name.trim() || currentUser.name,
      username: username.trim(),
      bio: bio.trim(),
      thought: thought.trim(),
    })
    toast.add({
      title: "Profile Updated",
      description: "Your profile details have been successfully saved.",
      type: "success",
    })
  }

  const handlePresetThought = (text: string) => {
    setThought(text)
    updateCurrentUser({ thought: text })
    setIsEditingThought(false)
    toast.add({
      title: "Thought Updated",
      description: `Status changed to: "${text}"`,
      type: "info",
    })
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground select-none">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-2 px-4 border-b border-border/60 bg-muted/20">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
          title="Back to Settings"
        >
          <IconArrowLeft className="size-4" />
        </Button>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Profile
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-5 [scrollbar-width:thin]">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFileChange}
          />
          <div
            onClick={handleAvatarClick}
            className="relative group/avatar cursor-pointer"
          >
            <div className="size-24 rounded-full overflow-hidden bg-muted border-2 border-border shadow-md flex items-center justify-center font-bold text-2xl text-foreground">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="size-full object-cover transition-transform duration-200 group-hover/avatar:scale-105"
                />
              ) : (
                <span>{currentUser.name.charAt(0)}</span>
              )}
            </div>

            {/* Change Avatar Overlay */}
            <div className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-foreground gap-1 backdrop-blur-2xs">
              <IconCamera className="size-5" />
              <span className="text-[10px] font-medium">Change</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Click avatar to change profile picture
          </p>
        </div>

        {/* Thought Status Pill */}
        <div className="rounded-xl border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-1">
              <IconSparkles className="size-3 text-primary" />
              Status / Thought
            </span>
            <button
              type="button"
              onClick={() => setIsEditingThought(!isEditingThought)}
              className="text-[10px] text-primary hover:underline font-medium cursor-pointer"
            >
              {isEditingThought ? "Cancel" : "Change"}
            </button>
          </div>

          {isEditingThought ? (
            <div className="space-y-2">
              <Input
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="What's on your mind?"
                className="text-xs h-8"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_THOUGHTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handlePresetThought(t)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/40 transition-colors cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs font-medium text-foreground italic">
              "{currentUser.thought || "No status set"}"
            </p>
          )}
        </div>

        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block">
            Your Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="text-xs h-9"
          />
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block">
            Username
          </label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@username"
            className="text-xs h-9"
          />
        </div>

        {/* About / Bio */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block">
            About
          </label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a few lines about yourself"
            rows={3}
            className="text-xs resize-none"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full h-9 text-xs gap-1.5 cursor-pointer"
        >
          <IconCheck className="size-4" />
          <span>Save Profile Changes</span>
        </Button>
      </div>
    </div>
  )
}

export default ProfileSettingsView
