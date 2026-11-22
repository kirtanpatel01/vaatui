import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconBrandGithub, IconComponents, IconEye } from "@tabler/icons-react"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 sm:py-28 text-center select-none">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/50 px-3.5 py-1 text-xs font-medium text-foreground mb-8 shadow-2xs">
          <span className="size-2 rounded-full bg-online animate-pulse" />
          <span>shadcn/ui compatible &bull; Pure & Standalone Components</span>
        </div>

        {/* Big Bold Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] mb-6">
          Modern Chat UI Components for React & Tailwind
        </h1>

        {/* Small Description as Hero as Big */}
        <p className="text-lg sm:text-2xl text-muted-foreground font-normal max-w-2xl leading-relaxed mb-10">
          A comprehensive collection of beautifully crafted, modular chat UI components built on shadcn/ui and Tailwind CSS. Take the whole interface or pick only what you need.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          <Button asChild size="lg" className="h-12 px-6 font-semibold gap-2 shadow-sm cursor-pointer">
            <Link to="/preview">
              <IconEye className="size-5" />
              <span>Explore Preview</span>
              <IconArrowRight className="size-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="h-12 px-6 font-semibold gap-2 cursor-pointer">
            <Link to="/components">
              <IconComponents className="size-5" />
              <span>Browse Components</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" size="lg" className="h-12 px-5 font-semibold gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
            <a
              href="https://github.com/kirtanpatel01/vaatui"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub className="size-5" />
              <span>GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </main>
  )
}
