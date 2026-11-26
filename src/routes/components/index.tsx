import * as React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { COMPONENTS_CATALOG, type ComponentEntry } from "@/data/components-catalog"
import { Container } from "@/components/ui/container"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { IconSearch, IconX } from "@tabler/icons-react"

export const Route = createFileRoute("/components/")({ component: ComponentsIndexPage })

const CATEGORY_ORDER: ComponentEntry["category"][] = [
  "Layouts",
  "Sidebar & Navigation",
  "Header & Details",
  "Message Feed",
  "Inputs & Attachments",
]

function ComponentsIndexPage() {
  const [search, setSearch] = React.useState("")
  const q = search.trim().toLowerCase()

  return (
    <main className="py-6">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="font-heading font-semibold text-2xl sm:text-3xl tracking-tight text-foreground">
            All Components
          </h1>

          <InputGroup className="w-full sm:w-72">
            <InputGroupAddon>
              <IconSearch className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search components..."
            />
            {search && (
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Clear search"
                >
                  <IconX className="size-3.5" />
                </button>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        <div className="space-y-10">
          {CATEGORY_ORDER.map((category) => {
            const items = COMPONENTS_CATALOG.filter(
              (c) =>
                c.category === category &&
                (!q ||
                  c.name.toLowerCase().includes(q) ||
                  c.description.toLowerCase().includes(q))
            ).sort((a, b) => a.name.localeCompare(b.name))
            if (items.length === 0) return null

            return (
              <section key={category}>
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b border-border/50">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5">
                  {items.map((item) => (
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
              </section>
            )
          })}
        </div>
      </Container>
    </main>
  )
}
