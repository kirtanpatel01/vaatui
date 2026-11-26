import { createFileRoute, Link } from "@tanstack/react-router"
import { getComponentById } from "@/data/components-catalog"
import { Container } from "@/components/ui/container"
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
      <main className="py-6 text-center">
        <Container>
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
        </Container>
      </main>
    )
  }

  return (
    <main className="py-6 flex flex-col flex-1">
      <Container className="flex flex-col flex-1">
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
        <h1 className="font-heading font-normal text-2xl sm:text-3xl tracking-tight text-foreground mb-1.5">
          {component.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {component.description}
        </p>
      </div>

      {/* 3. Centered Component Preview Workspace */}
      <div className="flex-1 w-full flex items-center justify-center p-6 sm:p-12 min-h-[460px] overflow-hidden">
        {component.render()}
      </div>
      </Container>
    </main>
  )
}
