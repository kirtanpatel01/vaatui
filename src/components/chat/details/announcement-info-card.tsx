import { IconShieldCheck } from "@tabler/icons-react"
import { type UserProfile } from "@/data/mock-contacts"

export interface AnnouncementInfoCardProps {
  contact: UserProfile
}

export function AnnouncementInfoCard({ contact }: AnnouncementInfoCardProps) {
  return (
    <div className="p-4 space-y-4 text-xs">
      <div>
        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block mb-1">
          Channel Description
        </span>
        <p className="text-foreground leading-relaxed">
          {contact.description ||
            "Official broadcast channel for announcements, product launches and changelogs."}
        </p>
      </div>

      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
        <div className="flex items-center gap-2 font-semibold text-primary mb-1">
          <IconShieldCheck className="size-4" />
          <span>Broadcast Only</span>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Only channel administrators are allowed to post updates to this channel.
        </p>
      </div>
    </div>
  )
}

export default AnnouncementInfoCard
