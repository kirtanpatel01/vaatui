import * as React from "react"
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toast"
import { ThemeProvider } from "@/components/theme-provider"
import SiteHeader from "@/components/site-header"

import appCss from "../styles.css?url"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15, // 15 minutes fresh cache
      gcTime: 1000 * 60 * 60 * 24, // Keep unused cache for 24 hours
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "VaatUI — Modern Chat UI Library",
      },
    ],
    links: [
      {
        rel: "preload",
        href: "/fonts/satoshi-variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "/fonts.css",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <QueryClientProvider client={queryClient}>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <SiteHeader />
              <div className="flex-1 min-h-0 flex flex-col">
                {children}
              </div>
            </div>
          </QueryClientProvider>
          <Toaster />
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
