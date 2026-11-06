import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconDots, IconPlus } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "cn"

export interface FilterTabItem {
  id: string
  label: string
}

export const DEFAULT_FILTER_TABS: FilterTabItem[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "favorites", label: "Favorites" },
  { id: "groups", label: "Groups" },
  { id: "archived", label: "Archived" },
]

interface FilterTabsProps extends React.ComponentProps<"div"> {
  tabs?: FilterTabItem[]
  activeTab?: string
  defaultActiveTab?: string
  onTabChange?: (tabId: string) => void
  onAddTab?: () => void
}

function FilterTabs({
  className,
  tabs = DEFAULT_FILTER_TABS,
  activeTab: controlledActiveTab,
  defaultActiveTab = "all",
  onTabChange,
  onAddTab,
  ...props
}: FilterTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultActiveTab)
  const activeTab = controlledActiveTab ?? internalActiveTab

  const handleSelectTab = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId)
    }
    onTabChange?.(tabId)
  }

  const containerRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
  const actionButtonRef = React.useRef<HTMLButtonElement>(null)

  // Initially: only 1 tab ("All") is visible + the three-dots dropdown.
  // This guarantees zero flicker on initial render / page load / dynamic fetch.
  const [isReady, setIsReady] = React.useState(false)
  const [visibleCount, setVisibleCount] = React.useState<number>(1)

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const calculateVisibleTabs = () => {
      const containerWidth = container.offsetWidth
      if (containerWidth <= 0) return

      const actionWidth = actionButtonRef.current?.offsetWidth ?? 36
      const dropdownWidth = 36
      const gap = 6 // gap-1.5 = 6px

      let accumulatedWidth = 0
      let fittingCount = 0

      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i]
        const el = itemRefs.current.get(tab.id)
        // If not rendered in probe yet, take a conservative unmeasured fallback
        const tabWidth = el?.offsetWidth ?? 70

        if (i === tabs.length - 1) {
          if (accumulatedWidth + tabWidth + gap + actionWidth <= containerWidth) {
            fittingCount = tabs.length
          }
        } else {
          if (
            accumulatedWidth + tabWidth + gap + dropdownWidth + gap + actionWidth <=
            containerWidth
          ) {
            fittingCount = i + 1
            accumulatedWidth += tabWidth + gap
          } else {
            break
          }
        }
      }

      setVisibleCount(Math.max(1, fittingCount))
      setIsReady(true)
    }

    calculateVisibleTabs()

    const observer = new ResizeObserver(() => {
      calculateVisibleTabs()
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [tabs])

  // Normal calculation: what naturally fits on the bar from the start
  const naturallyVisibleTabs = tabs.slice(0, isReady ? visibleCount : 1)
  const naturallyOverflowTabs = tabs.slice(isReady ? visibleCount : 1)

  // Is the currently active tab one that was chosen from the overflow dropdown?
  const isSelectedFromDropdown = isReady && naturallyOverflowTabs.some((t) => t.id === activeTab)

  const allTab = tabs.find((t) => t.id === "all") ?? { id: "all", label: "All" }
  const currentActiveTabItem = tabs.find((t) => t.id === activeTab)

  // If a tab from the dropdown was chosen:
  // ONLY show: [All, activeTab, three-dots trigger]
  // ALL remaining tabs + add button move into the dropdown!
  // Otherwise, show as many tabs as fit naturally (or just [All] before measurement).
  const visibleButtons = isSelectedFromDropdown && currentActiveTabItem
    ? [allTab, currentActiveTabItem]
    : naturallyVisibleTabs

  const dropdownTabs = isSelectedFromDropdown
    ? tabs.filter((t) => t.id !== "all" && t.id !== activeTab)
    : naturallyOverflowTabs

  const showThreeDots = dropdownTabs.length > 0
  const showAddButtonOnBar = isReady && !isSelectedFromDropdown

  return (
    <>
      {/* Hidden container to measure real DOM widths of all dynamic tab buttons */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible fixed -left-[9999px] top-0 flex items-center gap-1.5"
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            ref={(node) => {
              if (node) itemRefs.current.set(tab.id, node)
              else itemRefs.current.delete(tab.id)
            }}
            variant="secondary"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Visible Tabs list */}
      <div
        ref={containerRef}
        className={cn("flex min-w-0 items-center gap-1.5 overflow-hidden", className)}
        {...props}
      >
        {visibleButtons.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "secondary"}
              onClick={() => handleSelectTab(tab.id)}
              className="shrink-0"
            >
              {tab.label}
            </Button>
          )
        })}

        {showThreeDots && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="secondary"
                  size="icon"
                  className="shrink-0"
                  aria-label="More tabs"
                />
              }
            >
              <IconDots />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-36">
              {dropdownTabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}

              {/* When in dropdown-selected mode, the Add Tab action also sits inside the menu */}
              {isSelectedFromDropdown && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onAddTab}>
                    <IconPlus className="size-4" />
                    Add tab
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Show add button on the bar when measured and not in dropdown-selected mode */}
        {showAddButtonOnBar && (
          <Button
            ref={actionButtonRef}
            variant="secondary"
            size="icon"
            className="shrink-0"
            onClick={onAddTab}
            aria-label="Add tab"
          >
            <IconPlus />
          </Button>
        )}
      </div>
    </>
  )
}

export default FilterTabs
