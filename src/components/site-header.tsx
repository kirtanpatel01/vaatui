import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { IconBrandGithub, IconMoon, IconSun, IconMessageDots } from "@tabler/icons-react"
import { cn } from "cn"

export function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border/40 bg-background/80 px-4 sm:px-6 backdrop-blur-md select-none shrink-0">
      {/* Left: Brand Logo & Links */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <IconMessageDots className="size-4.5 stroke-[2]" />
          </div>
          <span className="text-base tracking-tight font-semibold">VaatUI</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/preview"
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === "/preview"
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            Preview
          </Link>
          <Link
            to="/components"
            className={cn(
              "transition-colors hover:text-foreground",
              pathname.startsWith("/components")
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            Components
          </Link>
        </nav>
      </div>

      {/* Right: Theme Toggle & GitHub Link */}
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {theme === "dark" ? (
            <IconSun className="size-4.5" />
          ) : (
            <IconMoon className="size-4.5" />
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          asChild
          className="text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="GitHub Repository"
        >
          <a
            href="https://github.com/kirtanpatel01/vaatui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandGithub className="size-4.5" />
          </a>
        </Button>
      </div>
    </header>
  )
}

export default SiteHeader
