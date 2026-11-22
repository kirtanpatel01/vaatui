import { createFileRoute, Link } from "@tanstack/react-router"
import { COMPONENTS_CATALOG } from "@/data/components-catalog"

export const Route = createFileRoute("/components/")({ component: ComponentsIndexPage })

function ComponentsIndexPage() {
  const sortedComponents = [...COMPONENTS_CATALOG].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-8">
        All Components
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
        {sortedComponents.map((item) => (
          <Link
            key={item.id}
            to="/components/$componentId"
            params={{ componentId: item.id }}
            className="text-sm font-medium text-foreground hover:underline w-fit transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </main>
  )
}
