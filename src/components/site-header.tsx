import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Logo } from "@/components/logo"
import { IconBrandGithub, IconMoon, IconSun } from "@tabler/icons-react"
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
          className="flex items-center gap-2.5 font-bold text-foreground hover:opacity-90 transition-opacity"
        >
          <Logo size={28} className="text-foreground" />
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
        >
          {theme === "dark" ? <IconSun /> : <IconMoon />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={
            <a
              href="https://github.com/kirtanpatel01/vaatui"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          aria-label="GitHub Repository"
        >
          <IconBrandGithub />
        </Button>
      </div>
    </header>
  )
}

export default SiteHeader
