import {
  IconArrowLeft,
  IconSun,
  IconMoon,
  IconDeviceDesktop,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { useChat } from "@/components/chat/chat-provider"
import { useTheme } from "@/components/theme-provider"
import { cn } from "cn"

export interface AppearanceSettingsViewProps {
  onBack: () => void
}

export function AppearanceSettingsView({ onBack }: AppearanceSettingsViewProps) {
  const { enterIsSend, setEnterIsSend } = useChat()
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    toast.add({
      title: "Theme Changed",
      description: `Switched to ${newTheme.toUpperCase()} theme`,
      type: "info",
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
          Chats & Appearance
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-5 [scrollbar-width:thin]">
        {/* Theme Section */}
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block mb-2">
            Theme Mode
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer",
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary shadow-2xs font-medium"
                  : "border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <IconSun className="size-5" />
              <span className="text-xs">Light</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer",
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary shadow-2xs font-medium"
                  : "border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <IconMoon className="size-5" />
              <span className="text-xs">Dark</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("system")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer",
                theme === "system"
                  ? "border-primary bg-primary/10 text-primary shadow-2xs font-medium"
                  : "border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <IconDeviceDesktop className="size-5" />
              <span className="text-xs">System</span>
            </button>
          </div>
        </div>

        {/* Enter to Send Toggle (Functional) */}
        <div className="rounded-xl border border-border/60 bg-card p-3 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="enter-is-send" className="min-w-0 flex-1 cursor-pointer">
              <span className="text-xs font-medium text-foreground block">
                Enter is send
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                {enterIsSend
                  ? "Press Enter to send message, Shift + Enter for a new line"
                  : "Press Enter for a new line, Ctrl + Enter to send message"}
              </span>
            </label>
            <Switch
              id="enter-is-send"
              checked={enterIsSend}
              onCheckedChange={(checked) => {
                setEnterIsSend(checked)
                toast.add({
                  title: checked ? "Enter to Send Enabled" : "Enter to Send Disabled",
                  description: checked
                    ? "Enter sends message"
                    : "Enter creates a new line, Ctrl+Enter sends",
                  type: "info",
                })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppearanceSettingsView
