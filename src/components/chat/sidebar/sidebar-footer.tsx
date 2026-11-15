import { Button } from "@/components/ui/button"
import { IconSettings } from "@tabler/icons-react"
import { useChat } from "@/components/chat/chat-provider"
import { cn } from "cn"

export interface SidebarFooterProps {
  className?: string
  onOpenSettings?: () => void
}

export function SidebarFooter({ className, onOpenSettings }: SidebarFooterProps) {
  const { currentUser } = useChat()

  return (
    <div
      className={cn(
        "p-2 border-t border-border/40 bg-background/80 backdrop-blur-xs flex items-center justify-between gap-2 shrink-0 select-none",
        className
      )}
    >
      {/* Clickable Profile Card */}
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex items-center gap-2.5 min-w-0 flex-1 p-1 rounded-lg hover:bg-muted/60 transition-colors text-left cursor-pointer group"
        title="Open Settings & Profile"
      >
        {/* User Avatar */}
        <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs overflow-hidden">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="size-full object-cover"
            />
          ) : (
            <span>
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-online ring-2 ring-background" />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold leading-tight text-foreground truncate group-hover:text-primary transition-colors">
            {currentUser.name}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {currentUser.thought || currentUser.phone || currentUser.username}
          </p>
        </div>
      </button>

      {/* Action Buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onOpenSettings}
          className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
          aria-label="Settings"
          title="Settings"
        >
          <IconSettings className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default SidebarFooter
