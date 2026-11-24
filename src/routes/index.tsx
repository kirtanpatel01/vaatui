import { createFileRoute } from "@tanstack/react-router"
import { Container } from "@/components/ui/container"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center text-center select-none">
      <Container className="flex flex-col items-center">
        {/* Big Bold Hero Headline */}
        <h1 className="mb-6 font-heading text-4xl leading-[1.08] font-semibold tracking- text-foreground sm:text-6xl md:text-7xl">
          Modern Chat UI Components
        </h1>

        {/* Small Description as Hero as Big */}
        <p className="max-w-2xl text-lg leading-relaxed font-normal text-muted-foreground sm:text-2xl">
          A comprehensive collection of beautifully crafted, modular chat UI
          components built on shadcn/ui and Tailwind CSS. Take the whole
          interface or pick only what you need.
        </p>
      </Container>

      <div className="w-full pt-8 bg-zinc-0 fixed bottom-0 text-[28rem] font-extrabold leading-86 text-zinc-50 dark:text-zinc-900/40 tracking-wider text-shadow-md text-shadow-zinc-300/50 dark:text-shadow-zinc-950">
        vaat-ui
      </div>
    </main>
  )
}
