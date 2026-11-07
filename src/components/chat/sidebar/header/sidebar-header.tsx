import * as React from "react"
import SidebarSearch from "./sidebar-search"
import NewChat from "./new-chat"
import FilterTabs, { type FilterTabItem } from "./filter-tabs"
import { cn } from "cn"

interface SidebarHeaderProps extends React.ComponentProps<"div"> {
  searchValue?: string
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: (value: string) => void
  onNewChat?: () => void
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
        <NewChat onNewChat={onNewChat} />
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

export default SidebarHeader
