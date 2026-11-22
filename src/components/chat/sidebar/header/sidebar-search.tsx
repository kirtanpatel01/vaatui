import * as React from "react"
import { IconCornerDownLeft, IconSearch } from "@tabler/icons-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { cn } from "cn"

interface SidebarSearchProps extends React.ComponentProps<"div"> {
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: (value: string) => void
  placeholder?: string
}

function SidebarSearch({
  className,
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  ...props
}: SidebarSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(e.currentTarget.value)
    }
  }

  return (
    <div className={cn("min-w-0 flex-1", className)} {...props}>
      <InputGroup className="w-full">
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupInput
          id="sidebar-search-input"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <InputGroupAddon align="inline-end">
          <Kbd>
            <IconCornerDownLeft />
            Enter
          </Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export { SidebarSearch }
export default SidebarSearch
