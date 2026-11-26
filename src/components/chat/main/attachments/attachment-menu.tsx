import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  IconPlus,
  IconPhoto,
  IconFile,
} from "@tabler/icons-react"
import { CameraModalMenuItem } from "./camera-modal"
import { CreatePollModalMenuItem } from "./create-poll-modal"
import { ShareContactModalMenuItem } from "./share-contact-modal"
import { cn } from "cn"

export interface AttachmentOption {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

export const DEFAULT_ATTACHMENT_OPTIONS: AttachmentOption[] = [
  { id: "photo", icon: IconPhoto, label: "Photo or Video" },
  { id: "file", icon: IconFile, label: "File" },
  { id: "camera", label: "Camera" },
  { id: "contact", label: "Contact" },
  { id: "poll", label: "Poll" },
]

export interface AttachmentMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectOption: (id: string) => void
  options?: AttachmentOption[]
  children?: React.ReactNode
  className?: string
}

export function AttachmentMenu({
  open,
  onOpenChange,
  onSelectOption,
  options = DEFAULT_ATTACHMENT_OPTIONS,
  children,
  className,
}: AttachmentMenuProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          children ? (
            (children as React.ReactElement)
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className={cn("shrink-0", className)}
              aria-label="More attachments"
            >
              <IconPlus className="size-5" />
            </Button>
          )
        }
      />

      <PopoverContent
        side="top"
        align="start"
        sideOffset={12}
        className="w-52 p-1.5"
      >
        <div className="flex flex-col gap-0.5 text-xs font-medium">
          {options.map((item) => {
            const handleClick = () => {
              onOpenChange(false)
              onSelectOption(item.id)
            }
            if (item.id === "camera") {
              return (
                <CameraModalMenuItem key={item.id} onClick={handleClick}>
                  {item.label}
                </CameraModalMenuItem>
              )
            }
            if (item.id === "contact") {
              return (
                <ShareContactModalMenuItem key={item.id} onClick={handleClick}>
                  {item.label}
                </ShareContactModalMenuItem>
              )
            }
            if (item.id === "poll") {
              return (
                <CreatePollModalMenuItem key={item.id} onClick={handleClick}>
                  {item.label}
                </CreatePollModalMenuItem>
              )
            }
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={handleClick}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
              >
                {Icon && <Icon className="size-4 text-muted-foreground" />}
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default AttachmentMenu
