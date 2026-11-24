import { createFileRoute, Link } from "@tanstack/react-router"
import { COMPONENTS_CATALOG } from "@/data/components-catalog"
import { Container } from "@/components/ui/container"

export const Route = createFileRoute("/components/")({ component: ComponentsIndexPage })

function ComponentsIndexPage() {
  const sortedComponents = [...COMPONENTS_CATALOG].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <main className="py-6">
      <Container>
        <h1 className="font-heading font-semibold text-2xl sm:text-3xl tracking-tight text-foreground mb-8">
          All Components
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
          {sortedComponents.map((item) => (
            <Link
              key={item.id}
              to="/components/$componentId"
              params={{ componentId: item.id }}
              className="font-medium text-foreground hover:underline w-fit transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}
