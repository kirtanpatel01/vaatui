import * as React from "react"
import { cn } from "cn"
import SidebarHeader from "./header/sidebar-header"
import SidebarMain from "./sidebar-main"
import SidebarFooter from "./sidebar-footer"
import CreateTabSheet from "./header/create-tab-sheet"
import { type FilterTabItem, DEFAULT_FILTER_TABS } from "./header/filter-tabs"

interface ChatSidebarProps {
  className?: string
}

function ChatSidebar({ className }: ChatSidebarProps) {
  const [tabs, setTabs] = React.useState<FilterTabItem[]>(DEFAULT_FILTER_TABS)
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const handleCreateTab = (name: string) => {
    const newId = name.toLowerCase().replace(/\s+/g, "-")
    const newTab: FilterTabItem = { id: newId, label: name }
    setTabs((prev) => [...prev, newTab])
    setActiveTab(newId)
  }

  return (
    <aside
      className={cn(
        "relative h-full w-full min-w-0 rounded-xl border flex flex-col overflow-hidden",
        className
      )}
    >
      <SidebarHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTab={() => setIsSheetOpen(true)}
      />
      <SidebarMain />
      <SidebarFooter />

      <CreateTabSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onCreateTab={handleCreateTab}
      />
    </aside>
  )
}

export default ChatSidebar
