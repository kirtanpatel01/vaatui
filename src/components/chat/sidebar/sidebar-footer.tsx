import { Button } from "@/components/ui/button"
import { IconDotsVertical, IconSettings } from "@tabler/icons-react"
import { CURRENT_USER } from "@/data/mock-contacts"
import { cn } from "cn"

interface SidebarFooterProps {
  className?: string
  onOpenSettings?: () => void
}

function SidebarFooter({ className, onOpenSettings }: SidebarFooterProps) {
  const user = CURRENT_USER

  return (
    <div
      className={cn(
        "p-2 border-t border-border/40 bg-background/80 backdrop-blur-xs flex items-center justify-between gap-2 shrink-0 select-none",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* User Avatar */}
        <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold leading-tight text-foreground truncate">
            {user.name}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {user.phone}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onOpenSettings}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Settings"
        >
          <IconSettings className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground"
          aria-label="More options"
        >
          <IconDotsVertical className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default SidebarFooter
