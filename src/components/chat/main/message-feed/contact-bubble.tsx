import { type SharedContactData } from "@/data/mock-messages"
import { IconMessage, IconPhone } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export interface ContactBubbleProps {
  contact: SharedContactData
  isSentByMe?: boolean
  onMessageClick?: () => void
}

export function ContactBubble({ contact, onMessageClick }: ContactBubbleProps) {
  return (
    <div className="flex flex-col gap-2.5 min-w-[220px] max-w-[280px]">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-sm text-foreground ring-1 ring-border">
          {contact.avatar ? (
            <img src={contact.avatar} alt={contact.name} className="size-full rounded-full object-cover" />
          ) : (
            <span>{contact.name[0]}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground truncate leading-tight">
            {contact.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {contact.phone || "+91 98250 11223"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/40">
        <Button
          variant="outline"
          size="sm"
          onClick={onMessageClick}
          className="h-7 text-xs gap-1 cursor-pointer"
        >
          <IconMessage className="size-3.5" />
          <span>Message</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-7 text-xs gap-1 cursor-pointer"
        >
          <IconPhone className="size-3.5" />
          <span>Call</span>
        </Button>
      </div>
    </div>
  )
}

export default ContactBubble

