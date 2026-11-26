import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconPlus, IconSearch, IconUser } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "cn"

export interface QuickComposeContact {
  name: string
  phone: string
}

export interface QuickComposeProps {
  className?: string
  onOpen?: () => void
  onSelectContact?: (contact: QuickComposeContact) => void
}

const QUICK_COMPOSE_CONTACTS: QuickComposeContact[] = [
  { name: "Aarav Mehta", phone: "+91 98201 45210" },
  { name: "Priya Sharma", phone: "+91 98112 34567" },
  { name: "Rohan Deshmukh", phone: "+91 97654 32109" },
  { name: "Ananya Iyer", phone: "+91 98450 11223" },
  { name: "Vikram Patel", phone: "+91 98980 55667" },
  { name: "Kavya Nair", phone: "+91 99001 77889" },
]

export function QuickCompose({
  className,
  onOpen,
  onSelectContact,
}: QuickComposeProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredContacts = QUICK_COMPOSE_CONTACTS.filter(
    (contact) =>
      !search.trim() ||
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone.includes(search)
  )

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      onOpen?.()
    }
  }

  const handleSelect = (contact: QuickComposeContact) => {
    onSelectContact?.(contact)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            size="icon"
            className={cn("shrink-0", className)}
            aria-label="Quick compose"
          />
        }
      >
        <IconPlus />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            Search or start a direct conversation with a contact.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <InputGroup>
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            <InputGroupInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or number..."
              autoFocus
            />
          </InputGroup>

          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground px-1">
              Contacts
            </span>

            {filteredContacts.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.phone}
                    type="button"
                    onClick={() => handleSelect(contact)}
                    className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-muted/70 active:bg-muted"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold">
                      <IconUser className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {contact.phone}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No contacts found matching &ldquo;{search}&rdquo;
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuickCompose
