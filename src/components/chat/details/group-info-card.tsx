import { useState, useMemo } from "react"
import { IconSearch, IconLogout } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { type UserProfile } from "@/data/mock-contacts"
import { cn } from "cn"

export interface GroupInfoCardProps {
  contact: UserProfile
  contacts: UserProfile[]
  onSelectContact: (contact: UserProfile) => void
}

export function GroupInfoCard({
  contact,
  contacts,
  onSelectContact,
}: GroupInfoCardProps) {
  const [memberSearchQuery, setMemberSearchQuery] = useState("")

  const filteredMembers = useMemo(() => {
    if (!contact.members) return []
    if (!memberSearchQuery.trim()) return contact.members
    const query = memberSearchQuery.toLowerCase()
    return contact.members.filter((m) =>
      m.name.toLowerCase().includes(query)
    )
  }, [contact.members, memberSearchQuery])

  const handleLeaveGroup = () => {
    toast.add({
      title: "Left Group",
      description: `You have left ${contact.name}`,
      type: "info",
    })
  }

  return (
    <div className="p-4 space-y-4 text-xs">
      {/* Description & Creation info */}
      <div>
        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block mb-1">
          Group Description
        </span>
        <p className="text-foreground leading-relaxed">
          {contact.description ||
            "Welcome to the group! Keep conversations polite and productive."}
        </p>
        {contact.createdAt && (
          <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
            <span>Created by {contact.createdBy || "Admin"} on {contact.createdAt}</span>
          </p>
        )}
      </div>

      <Separator className="opacity-60" />

      {/* Group Members List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
            Members ({contact.members?.length || 0})
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            {contact.members?.filter((m) => m.isOnline).length || 1} online
          </span>
        </div>

        {/* Member Search filter */}
        <div className="relative mb-2">
          <IconSearch className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            value={memberSearchQuery}
            onChange={(e) => setMemberSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border/60 bg-muted/30 pl-8 pr-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-ring"
          />
        </div>

        {/* Members Scroll List */}
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {filteredMembers.map((member) => {
            const isCurrentUser = member.id === "curr_user" || member.name.includes("Kirtan")
            return (
              <div
                key={member.id}
                onClick={() => {
                  if (!isCurrentUser) {
                    const direct = contacts.find((c) => c.name.toLowerCase() === member.name.toLowerCase())
                    if (direct) onSelectContact(direct)
                    else {
                      toast.add({
                        title: member.name,
                        description: member.role === "admin" ? "Group Administrator" : "Group Member",
                        type: "info",
                      })
                    }
                  }
                }}
                className={cn(
                  "flex items-center justify-between gap-2 p-1.5 rounded-lg transition-colors",
                  !isCurrentUser && "hover:bg-muted/60 cursor-pointer"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative flex size-6.5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                    {member.name.charAt(0)}
                    {member.isOnline && (
                      <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-1 ring-background" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-xs text-foreground truncate block">
                      {member.name} {isCurrentUser && <span className="text-[10px] text-muted-foreground font-normal">(You)</span>}
                    </span>
                  </div>
                </div>

                {member.role === "admin" && (
                  <span className="px-1.5 py-0.2 rounded-md bg-primary/10 text-primary text-[10px] font-semibold shrink-0">
                    Admin
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Group Exit Action */}
      <Separator className="opacity-60" />
      <button
        type="button"
        onClick={handleLeaveGroup}
        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
      >
        <IconLogout className="size-4" />
        <span>Exit Group</span>
      </button>
    </div>
  )
}

export default GroupInfoCard
