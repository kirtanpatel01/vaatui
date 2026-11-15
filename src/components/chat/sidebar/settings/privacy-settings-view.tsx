import { IconArrowLeft, IconUserCheck, IconShieldCheck, IconLock } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useChat } from "@/components/chat/chat-provider"

export interface PrivacySettingsViewProps {
  onBack: () => void
}

export function PrivacySettingsView({ onBack }: PrivacySettingsViewProps) {
  const { contacts, blockedContactIds, unblockContact } = useChat()

  const blockedContactsList = contacts.filter((c) => blockedContactIds.has(c.id))

  const handleUnblock = (contactId: string, name: string) => {
    unblockContact(contactId)
    toast.add({
      title: "Contact Unblocked",
      description: `${name} has been unblocked.`,
      type: "success",
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
          Privacy
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-5 [scrollbar-width:thin]">
        {/* Blocked Contacts Card */}
        <div className="rounded-xl border border-border/60 bg-card p-3 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
              <IconLock className="size-3 text-primary" />
              Blocked Contacts
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
              {blockedContactsList.length}
            </span>
          </div>

          {blockedContactsList.length > 0 ? (
            <div className="space-y-2 divide-y divide-border/40">
              {blockedContactsList.map((contact) => (
                <div
                  key={contact.id}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-full bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center text-xs font-semibold">
                      {contact.avatar ? (
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span>{contact.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-foreground block truncate">
                        {contact.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {contact.phone || contact.username || "Contact"}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnblock(contact.id, contact.name)}
                    className="h-7 text-[11px] text-primary hover:text-primary gap-1 cursor-pointer"
                  >
                    <IconUserCheck className="size-3.5" />
                    <span>Unblock</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/80 py-1">
              You haven't blocked any contacts yet.
            </p>
          )}
        </div>

        {/* End-to-End Encryption Note */}
        <div className="rounded-xl p-3 bg-muted/40 border border-border/40 text-muted-foreground text-xs flex items-start gap-2.5">
          <IconShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Your personal messages and calls in VaatUI are secured with client-side state privacy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacySettingsView
