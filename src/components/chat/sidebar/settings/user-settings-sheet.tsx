import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import {
  IconX,
  IconSearch,
  IconUser,
  IconPalette,
  IconLock,
  IconLogout,
  IconChevronRight,
  IconMessageDots,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/toast"
import { useChatStore } from "@/stores/chat-store"
import { ProfileSettingsView } from "./profile-settings-view"
import { AppearanceSettingsView } from "./appearance-settings-view"
import { PrivacySettingsView } from "./privacy-settings-view"
import { cn } from "cn"

export const UserSettingsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    type="button"
    variant="ghost"
    size="icon"
    className={cn("shrink-0 text-muted-foreground hover:text-foreground", className)}
    title="Settings"
    aria-label="Settings"
    {...props}
  />
))
UserSettingsTrigger.displayName = "UserSettingsTrigger"

export interface UserSettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SettingsView =
  | "main"
  | "profile"
  | "appearance"
  | "privacy"

interface MenuItem {
  id: SettingsView
  label: string
  description: string
  icon: typeof IconUser
  badge?: string | number
}

export function UserSettingsSheet({ open, onOpenChange }: UserSettingsSheetProps) {
  const currentUser = useChatStore((s) => s.currentUser)
  const blockedContactIds = useChatStore((s) => s.blockedContactIds)

  const [view, setView] = useState<SettingsView>("main")
  const [searchQuery, setSearchQuery] = useState("")
  const [showLogoutAlert, setShowLogoutAlert] = useState(false)

  // Reset to main view whenever sheet is closed or reopened
  useEffect(() => {
    if (!open) {
      setView("main")
      setSearchQuery("")
    }
  }, [open])

  // ESC key navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view !== "main") {
          setView("main")
        } else {
          onOpenChange(false)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, view, onOpenChange])

  const menuItems = useMemo<MenuItem[]>(() => {
    return [
      {
        id: "profile",
        label: "Profile",
        description: "Name, profile picture, username, about",
        icon: IconUser,
      },
      {
        id: "appearance",
        label: "Chats & Appearance",
        description: "Theme mode, enter to send",
        icon: IconPalette,
      },
      {
        id: "privacy",
        label: "Privacy",
        description: "Blocked contacts management",
        icon: IconLock,
        badge: blockedContactIds.size > 0 ? blockedContactIds.size : undefined,
      },
    ]
  }, [blockedContactIds.size])

  const filteredMenuItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return menuItems
    return menuItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    )
  }, [menuItems, searchQuery])

  const handleLogout = () => {
    setShowLogoutAlert(false)
    onOpenChange(false)
    toast.add({
      title: "Logged Out",
      description: "You have been logged out of your session.",
      type: "info",
    })
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "absolute inset-0 z-30 flex flex-col rounded-xl bg-background text-foreground shadow-xl transition-transform duration-200 ease-in-out select-none overflow-hidden",
        open
          ? "pointer-events-auto translate-x-0"
          : "pointer-events-none -translate-x-full"
      )}
    >
      {/* Dynamic Sub-Views */}
      {view === "profile" && (
        <ProfileSettingsView onBack={() => setView("main")} />
      )}
      {view === "appearance" && (
        <AppearanceSettingsView onBack={() => setView("main")} />
      )}
      {view === "privacy" && (
        <PrivacySettingsView onBack={() => setView("main")} />
      )}

      {/* Main Settings Menu */}
      {view === "main" && (
        <div className="flex flex-col h-full bg-background text-foreground">
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-border/60 bg-muted/20">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Settings
            </h3>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
              title="Close settings (Esc)"
            >
              <IconX className="size-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-border/40">
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search settings..."
                className="pl-8 text-xs h-8 bg-muted/40 border-border/50"
              />
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-4 [scrollbar-width:thin]">
            {/* User Profile Hero Card with "Share a thought" */}
            <div className="flex flex-col items-center pt-2 pb-3 px-2 text-center bg-card rounded-xl border border-border/60 shadow-2xs">
              {/* "Share a thought" bubble */}
              <button
                type="button"
                onClick={() => setView("profile")}
                className="relative mb-2 px-3 py-1 rounded-full bg-muted/70 hover:bg-muted text-foreground text-xs font-medium border border-border/60 shadow-2xs transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5 max-w-[90%]"
                title="Click to edit thought"
              >
                <IconMessageDots className="size-3 text-primary shrink-0" />
                <span className="truncate">
                  {currentUser.thought || "Share a thought"}
                </span>
                {/* Speech bubble tail dot */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-border" />
              </button>

              {/* Avatar with Click to Profile */}
              <div
                onClick={() => setView("profile")}
                className="relative size-18 rounded-full overflow-hidden bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center border-2 border-border/80 shadow-xs cursor-pointer group/hero hover:border-primary transition-colors"
                title="View & Edit Profile"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="size-full object-cover transition-transform duration-200 group-hero/thumb:scale-105"
                  />
                ) : (
                  <span>{currentUser.name.charAt(0)}</span>
                )}
                <span className="absolute bottom-1 right-1 size-3 rounded-full bg-online ring-2 ring-card" />
              </div>

              <h4
                onClick={() => setView("profile")}
                className="mt-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer truncate max-w-[200px]"
              >
                {currentUser.name}
              </h4>
              <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                {currentUser.username || currentUser.phone}
              </p>
            </div>

            {/* Menu List */}
            <div className="rounded-xl border border-border/60 bg-card divide-y divide-border/40 overflow-hidden shadow-2xs">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setView(item.id)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground group-hover:bg-muted/80 transition-colors">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-foreground block truncate">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                          {item.badge}
                        </span>
                      )}
                      <IconChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Log Out Action */}
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setShowLogoutAlert(true)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-destructive/10 transition-colors text-destructive cursor-pointer group"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <IconLogout className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium block">Log out</span>
                  <span className="text-[10px] text-destructive/70 block">
                    Sign out of this session
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log out Alert Dialog */}
      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of VaatUI?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleLogout}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UserSettingsSheet
