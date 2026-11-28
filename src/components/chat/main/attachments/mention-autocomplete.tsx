import * as React from "react"
import { type GroupMember } from "@/data/mock-contacts"
import { IconAt } from "@tabler/icons-react"
import { cn } from "cn"

export interface MentionAutocompleteProps {
  open: boolean
  members: GroupMember[]
  filterText?: string
  onSelectMember: (member: GroupMember) => void
  onClose: () => void
}

export function MentionAutocomplete({
  open,
  members,
  filterText = "",
  onSelectMember,
  onClose,
}: MentionAutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, onClose])

  const filteredMembers = React.useMemo(() => {
    const q = filterText.toLowerCase().trim()
    const allOption: GroupMember = { id: "all", name: "all" }
    const base = !q || "all".includes(q) ? [allOption, ...members] : members
    if (!q) return base
    return base.filter((m) => m.name.toLowerCase().includes(q))
  }, [members, filterText])

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [filterText, open])

  // Handle keyboard up/down/enter
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredMembers.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredMembers.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredMembers.length) % filteredMembers.length)
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault()
        if (filteredMembers[selectedIndex]) {
          onSelectMember(filteredMembers[selectedIndex])
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, filteredMembers, selectedIndex, onSelectMember, onClose])

  if (!open || filteredMembers.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="absolute bottom-full left-12 mb-2 w-64 rounded-2xl border border-border/80 bg-popover p-1.5 shadow-xl z-50 animate-in fade-in-0 slide-in-from-bottom-2 duration-100"
    >
      <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1 border-b border-border/40 mb-1">
        <IconAt className="size-3 text-primary" />
        <span>Mention member</span>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-0.5 no-scrollbar">
        {filteredMembers.map((member, idx) => {
          const isSelected = idx === selectedIndex

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelectMember(member)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer select-none",
                isSelected
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-foreground hover:bg-muted/60"
              )}
            >
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                {member.name[0]}
              </div>

              <span className="flex-1 truncate">{member.name}</span>

              {member.role === "admin" && (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md font-mono">
                  admin
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MentionAutocomplete

