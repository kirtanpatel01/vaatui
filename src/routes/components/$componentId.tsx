import { createFileRoute, Link } from "@tanstack/react-router"
import { getComponentById } from "@/data/components-catalog"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"

export const Route = createFileRoute("/components/$componentId")({
  component: ComponentDetailPage,
})

function ComponentDetailPage() {
  const { componentId } = Route.useParams()
  const component = getComponentById(componentId)

  if (!component) {
    return (
      <main className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Component not found</h1>
        <p className="text-muted-foreground mb-6">
          Could not find component "{componentId}".
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link to="/components" />}
        >
          <IconArrowLeft data-icon="inline-start" />
          Back to Components
        </Button>
      </main>
    )
  }

  return (
    <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col flex-1">
      {/* 1. Breadcrumb on top */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/components" />}>Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{component.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Component Name */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1.5">
          {component.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {component.description}
        </p>
      </div>

      {/* 3. Centered Component Preview Workspace */}
      <div className="flex-1 w-full rounded-2xl border border-border/80 bg-muted/20 flex items-center justify-center p-6 sm:p-12 min-h-[460px] shadow-2xs overflow-hidden">
        {component.render()}
      </div>
    </main>
  )
}
