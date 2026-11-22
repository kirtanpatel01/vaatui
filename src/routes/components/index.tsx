import { createFileRoute, Link } from "@tanstack/react-router"
import { COMPONENTS_CATALOG } from "@/data/components-catalog"
import { IconChevronRight } from "@tabler/icons-react"

export const Route = createFileRoute("/components/")({ component: ComponentsIndexPage })

function ComponentsIndexPage() {
  // Group components by category
  const categories = Array.from(
    new Set(COMPONENTS_CATALOG.map((c) => c.category))
  )

  return (
    <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
          Components
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Select any component to see its dedicated preview, options, and live isolated instance.
        </p>
      </div>

      <div className="space-y-10">
        {categories.map((category) => {
          const items = COMPONENTS_CATALOG.filter((c) => c.category === category)
          return (
            <section key={category} className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    to="/components/$componentId"
                    params={{ componentId: item.id }}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:bg-muted/60 transition-colors group select-none cursor-pointer"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    <IconChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
