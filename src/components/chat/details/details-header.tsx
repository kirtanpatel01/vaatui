import { IconX, IconInfoCircle, IconUsers, IconSpeakerphone } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { type ChatType } from "@/data/mock-contacts"

export interface DetailsHeaderProps {
  type: ChatType
  onClose: () => void
}

export function DetailsHeader({ type, onClose }: DetailsHeaderProps) {
  const isGroup = type === "group"
  const isAnnouncement = type === "announcement"

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b px-4 bg-muted/20">
      <div className="flex items-center gap-2 min-w-0">
        {isGroup ? (
          <IconUsers className="size-4 text-muted-foreground shrink-0" />
        ) : isAnnouncement ? (
          <IconSpeakerphone className="size-4 text-muted-foreground shrink-0" />
        ) : (
          <IconInfoCircle className="size-4 text-muted-foreground shrink-0" />
        )}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
          {isGroup ? "Group Details" : isAnnouncement ? "Channel Details" : "Contact Details"}
        </h3>
      </div>

      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
        title="Close details (Esc)"
        aria-label="Close details"
      >
        <IconX className="size-4" />
      </Button>
    </div>
  )
}

export default DetailsHeader
