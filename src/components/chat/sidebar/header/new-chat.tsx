import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconPlus, IconSearch, IconUser, IconPhone } from "@tabler/icons-react"
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

export interface ContactItem {
  name: string
  phone: string
}

interface NewChatProps {
  className?: string
  onNewChat?: () => void
  onSelectContact?: (contact: ContactItem) => void
}

function NewChat({ className, onNewChat, onSelectContact }: NewChatProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const mockContact: ContactItem = {
    name: "Alex Morgan",
    phone: "+1 (555) 234-5678",
  }

  const isVisible =
    !search.trim() ||
    mockContact.name.toLowerCase().includes(search.toLowerCase()) ||
    mockContact.phone.includes(search)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      onNewChat?.()
    }
  }

  const handleSelect = () => {
    onSelectContact?.(mockContact)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            size="icon"
            className={cn("shrink-0", className)}
            aria-label="New chat"
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

            {isVisible ? (
              <button
                type="button"
                onClick={handleSelect}
                className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-muted/70 active:bg-muted"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold">
                  <IconUser className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {mockContact.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                    <IconPhone className="size-3 shrink-0" />
                    {mockContact.phone}
                  </p>
                </div>
              </button>
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

export default NewChat
