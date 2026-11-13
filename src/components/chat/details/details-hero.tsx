import {
  IconPhone,
  IconVideo,
  IconBell,
  IconBellOff,
  IconUserPlus,
  IconUsers,
  IconSpeakerphone,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { type UserProfile } from "@/data/mock-contacts"
import { cn } from "cn"

export interface DetailsHeroProps {
  contact: UserProfile
  isMuted: boolean
  onToggleMute: () => void
}

export function DetailsHero({
  contact,
  isMuted,
  onToggleMute,
}: DetailsHeroProps) {
  const isDirect = contact.type === "direct"
  const isGroup = contact.type === "group"

  const handleCall = () => {
    toast.add({
      title: "Audio Call",
      description: `Calling ${contact.name}...`,
      type: "info",
    })
  }

  const handleVideoCall = () => {
    toast.add({
      title: "Video Call",
      description: `Starting video call with ${contact.name}...`,
      type: "info",
    })
  }

  const handleAddMember = () => {
    toast.add({
      title: "Add Member",
      description: "Invite link copied to clipboard",
      type: "success",
    })
  }

  return (
    <div className="flex flex-col items-center px-4 py-5 text-center bg-gradient-to-b from-muted/30 to-transparent">
      {/* Large Avatar */}
      <div className="relative mb-3 flex size-20 items-center justify-center rounded-full bg-muted border-2 border-border/80 text-xl font-bold text-foreground shadow-xs">
        {isGroup ? (
          <IconUsers className="size-9 text-muted-foreground stroke-[1.5]" />
        ) : contact.type === "announcement" ? (
          <IconSpeakerphone className="size-9 text-muted-foreground stroke-[1.5]" />
        ) : contact.avatar ? (
          <img
            src={contact.avatar}
            alt={contact.name}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <span>{contact.name.charAt(0)}</span>
        )}

        {isDirect && contact.isOnline && (
          <span
            className="absolute bottom-1 right-1 size-3.5 rounded-full bg-emerald-500 ring-2 ring-background"
            title="Online"
          />
        )}
      </div>

      <h2 className="text-base font-semibold text-foreground tracking-tight max-w-[90%] truncate">
        {contact.name}
      </h2>

      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[95%]">
        {isDirect ? (
          contact.isOnline ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
          ) : (
            contact.phone || "Last seen recently"
          )
        ) : isGroup ? (
          `${contact.members?.length || 0} members • ${
            contact.members?.filter((m) => m.isOnline).length || 1
          } online`
        ) : (
          "Broadcast Channel • 1.2k subscribers"
        )}
      </p>

      {/* Quick Action Buttons */}
      <div className="flex items-center justify-center gap-2 mt-4 w-full">
        {isDirect ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              className="flex-1 h-8 text-xs gap-1.5 rounded-lg border-border/80 cursor-pointer shadow-2xs hover:bg-muted"
              title="Audio call"
            >
              <IconPhone className="size-3.5 text-muted-foreground" />
              <span>Call</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVideoCall}
              className="flex-1 h-8 text-xs gap-1.5 rounded-lg border-border/80 cursor-pointer shadow-2xs hover:bg-muted"
              title="Video call"
            >
              <IconVideo className="size-3.5 text-muted-foreground" />
              <span>Video</span>
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onToggleMute}
              className={cn(
                "size-8 rounded-lg border-border/80 cursor-pointer shadow-2xs",
                isMuted ? "text-amber-500 bg-amber-500/10 border-amber-500/30" : "text-muted-foreground"
              )}
              title={isMuted ? "Unmute notifications" : "Mute notifications"}
            >
              {isMuted ? <IconBellOff className="size-3.5" /> : <IconBell className="size-3.5" />}
            </Button>
          </>
        ) : isGroup ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddMember}
              className="flex-1 h-8 text-xs gap-1.5 rounded-lg border-border/80 cursor-pointer shadow-2xs hover:bg-muted"
            >
              <IconUserPlus className="size-3.5 text-muted-foreground" />
              <span>Add Member</span>
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onToggleMute}
              className={cn(
                "size-8 rounded-lg border-border/80 cursor-pointer shadow-2xs",
                isMuted ? "text-amber-500 bg-amber-500/10 border-amber-500/30" : "text-muted-foreground"
              )}
              title={isMuted ? "Unmute notifications" : "Mute notifications"}
            >
              {isMuted ? <IconBellOff className="size-3.5" /> : <IconBell className="size-3.5" />}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleMute}
            className={cn(
              "w-full h-8 text-xs gap-1.5 rounded-lg border-border/80 cursor-pointer shadow-2xs",
              isMuted && "text-amber-500 bg-amber-500/10 border-amber-500/30"
            )}
          >
            {isMuted ? <IconBellOff className="size-3.5" /> : <IconBell className="size-3.5" />}
            <span>{isMuted ? "Unmute Channel" : "Mute Channel"}</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default DetailsHero
