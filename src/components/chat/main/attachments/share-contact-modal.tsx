import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconUserPlus, IconSearch, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { type UserProfile } from "@/data/mock-contacts"

export interface ShareContactModalProps {
  contacts: UserProfile[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onShareContact: (contact: UserProfile) => void
}

export function ShareContactModal({
  contacts,
  open,
  onOpenChange,
  onShareContact,
}: ShareContactModalProps) {
  const [query, setQuery] = React.useState("")
  const [selectedContact, setSelectedContact] = React.useState<UserProfile | null>(null)

  React.useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedContact(null)
    }
  }, [open])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return contacts.filter((c) => c.type === "direct")
    return contacts.filter(
      (c) =>
        c.type === "direct" &&
        (c.name.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q))
    )
  }, [contacts, query])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-sm gap-0 rounded-3xl border border-border/80 bg-background shadow-2xl flex flex-col max-h-[75vh]">
        {/* Header */}
        <DialogHeader className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconUserPlus className="size-4" />
            </div>
            <DialogTitle className="text-sm font-semibold text-foreground">Share Contact</DialogTitle>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="p-3 border-b">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full h-8 pl-8 pr-3 rounded-xl bg-muted/30 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary/80 transition-colors"
            />
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No contacts found
            </div>
          ) : (
            filtered.map((c) => {
              const isSelected = selectedContact?.id === c.id

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContact(c)}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-muted/60 transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-xs text-foreground">
                      {c.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{c.phone || "+91 98250 11223"}</p>
                    </div>
                  </div>

                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border">
                    {isSelected && (
                      <div className="size-3 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <IconCheck className="size-2 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-3 bg-muted/30 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!selectedContact}
            onClick={() => {
              if (selectedContact) {
                onShareContact(selectedContact)
                onOpenChange(false)
              }
            }}
            className="bg-primary text-primary-foreground cursor-pointer"
          >
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareContactModal
