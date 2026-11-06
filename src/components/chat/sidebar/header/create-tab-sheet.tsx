import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconFolderPlus, IconX } from "@tabler/icons-react"
import { cn } from "cn"

interface CreateTabSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTab: (name: string) => void
}

export function CreateTabSheet({
  open,
  onOpenChange,
  onCreateTab,
}: CreateTabSheetProps) {
  const [tabName, setTabName] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = tabName.trim()
    if (!trimmed) return
    onCreateTab(trimmed)
    setTabName("")
    onOpenChange(false)
  }

  // Handle ESC key to close
  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "absolute inset-0 z-30 flex flex-col rounded-xl bg-popover text-popover-foreground shadow-xl transition-all duration-200 ease-in-out",
        open
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-4"
      )}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between border-b p-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <IconFolderPlus className="size-4" />
          </div>
          <div>
            <h3 className="font-heading text-base font-medium text-foreground leading-none">
              New Filter Tab
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Create a customized tab for your conversations.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="bg-secondary shrink-0"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          <IconX />
        </Button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="tab-name-input" className="text-xs font-medium text-foreground">
              Tab Name
            </label>
            <Input
              id="tab-name-input"
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
              placeholder="e.g. Work, Family, VIPs..."
              autoFocus={open}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!tabName.trim()}>
            Create Tab
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateTabSheet
