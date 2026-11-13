import { useState } from "react"
import {
  IconCopy,
  IconCheck,
  IconUsers,
  IconExternalLink,
  IconTrash,
  IconUserX,
  IconUserCheck,
} from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { type UserProfile } from "@/data/mock-contacts"
import { cn } from "cn"

export interface ContactInfoCardProps {
  contact: UserProfile
  mutualGroups: UserProfile[]
  isBlocked: boolean
  onToggleBlock: () => void
  onClearMessages: () => void
  onSelectGroup: (group: UserProfile) => void
}

export function ContactInfoCard({
  contact,
  mutualGroups,
  isBlocked,
  onToggleBlock,
  onClearMessages,
  onSelectGroup,
}: ContactInfoCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopyText = (text: string, key: string, label: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
    toast.add({
      title: `${label} copied`,
      description: text,
      type: "success",
    })
  }

  const handleClearChat = () => {
    onClearMessages()
    toast.add({
      title: "Chat Cleared",
      description: "All messages in this chat have been cleared.",
      type: "info",
    })
  }

  return (
    <div className="p-4 space-y-4 text-xs">
      {/* About / Bio */}
      <div>
        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block mb-1">
          About
        </span>
        <p className="text-foreground leading-relaxed">
          {contact.bio || "Hey there! I am using VaatUI."}
        </p>
      </div>

      <Separator className="opacity-60" />

      {/* Phone & Username with One-Click Copy */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block">
          Contact Info
        </span>

        {contact.phone && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
            <div className="min-w-0">
              <span className="text-[10px] text-muted-foreground block leading-none">Phone</span>
              <span className="font-medium text-foreground text-xs mt-0.5 block truncate">
                {contact.phone}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(contact.phone!, "phone", "Phone number")}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Copy phone"
            >
              {copiedKey === "phone" ? (
                <IconCheck className="size-3.5 text-emerald-500" />
              ) : (
                <IconCopy className="size-3.5" />
              )}
            </button>
          </div>
        )}

        {contact.username && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
            <div className="min-w-0">
              <span className="text-[10px] text-muted-foreground block leading-none">Username</span>
              <span className="font-medium text-foreground text-xs mt-0.5 block truncate">
                {contact.username}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(contact.username!, "username", "Username")}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Copy username"
            >
              {copiedKey === "username" ? (
                <IconCheck className="size-3.5 text-emerald-500" />
              ) : (
                <IconCopy className="size-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Groups in Common */}
      {mutualGroups.length > 0 && (
        <>
          <Separator className="opacity-60" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                Groups in Common
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                {mutualGroups.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {mutualGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => onSelectGroup(group)}
                  className="flex items-center justify-between gap-2.5 p-2 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer border border-transparent hover:border-border/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                      <IconUsers className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-xs text-foreground block truncate">
                        {group.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {group.members?.length || 0} members
                      </span>
                    </div>
                  </div>
                  <IconExternalLink className="size-3.5 text-muted-foreground shrink-0 opacity-60" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Privacy & Danger Actions */}
      <Separator className="opacity-60" />
      <div className="space-y-1">
        <button
          type="button"
          onClick={onToggleBlock}
          className={cn(
            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
            isBlocked
              ? "text-emerald-600 hover:bg-emerald-500/10"
              : "text-red-500 hover:bg-red-500/10"
          )}
        >
          {isBlocked ? <IconUserCheck className="size-4" /> : <IconUserX className="size-4" />}
          <span>{isBlocked ? `Unblock ${contact.name}` : `Block ${contact.name}`}</span>
        </button>

        <button
          type="button"
          onClick={handleClearChat}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <IconTrash className="size-4" />
          <span>Clear Chat History</span>
        </button>
      </div>
    </div>
  )
}

export default ContactInfoCard
