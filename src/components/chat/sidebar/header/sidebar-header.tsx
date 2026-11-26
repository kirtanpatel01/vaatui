import * as React from "react"
import SidebarSearch from "./sidebar-search"
import QuickCompose from "./quick-compose"
import FilterTabs, { type FilterTabItem } from "./filter-tabs"
import { cn } from "cn"

interface SidebarHeaderProps extends React.ComponentProps<"div"> {
  searchValue?: string
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: (value: string) => void
  onNewChat?: () => void
  onSelectContact?: (contact: { name: string; phone: string }) => void
  tabs?: FilterTabItem[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  onAddTab?: () => void
}

function SidebarHeader({
  className,
  searchValue,
  onSearchChange,
  onSearch,
  onNewChat,
  onSelectContact,
  tabs,
  activeTab,
  onTabChange,
  onAddTab,
  ...props
}: SidebarHeaderProps) {
  return (
    <div className={cn("space-y-2 p-2 min-w-0 shrink-0", className)} {...props}>
      <div className="flex gap-2 min-w-0">
        <SidebarSearch
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearch}
        />
        <QuickCompose onOpen={onNewChat} onSelectContact={onSelectContact} />
      </div>

      <FilterTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onAddTab={onAddTab}
      />
    </div>
  )
}

export { SidebarHeader }
export default SidebarHeader
