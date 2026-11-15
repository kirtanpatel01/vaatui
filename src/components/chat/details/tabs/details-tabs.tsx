import { IconPhoto, IconFile, IconLink } from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { type ChatMessage } from "@/data/mock-messages"
import { MediaTabContent } from "./media-tab-content"
import { FilesTabContent } from "./files-tab-content"
import { LinksTabContent, type ExtractedLinkItem } from "./links-tab-content"
import { cn } from "cn"

export interface DetailsTabsProps {
  mediaMessages: ChatMessage[]
  fileMessages: ChatMessage[]
  links: ExtractedLinkItem[]
  onSelectMedia: (msg: ChatMessage) => void
  defaultTab?: "photos" | "files" | "links"
  hideSectionHeader?: boolean
  className?: string
}

export function DetailsTabs({
  mediaMessages,
  fileMessages,
  links,
  onSelectMedia,
  defaultTab = "photos",
  hideSectionHeader = false,
  className,
}: DetailsTabsProps) {
  return (
    <div className={cn("p-3 flex flex-col flex-1 min-h-0", className)}>
      {!hideSectionHeader && (
        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block px-1 mb-2">
          Shared Media & Docs
        </span>
      )}

      <Tabs defaultValue={defaultTab} className="w-full flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-3 shrink-0">
          <TabsTrigger
            value="photos"
            className="flex items-center justify-center gap-1"
            title="Photos and Videos"
          >
            <IconPhoto className="size-3.5 shrink-0" />
            <span className="truncate">Media</span>
            <span className="text-[10px] opacity-75 tabular-nums">({mediaMessages.length})</span>
          </TabsTrigger>

          <TabsTrigger
            value="files"
            className="flex items-center justify-center gap-1"
            title="Files"
          >
            <IconFile className="size-3.5 shrink-0" />
            <span className="truncate">Files</span>
            <span className="text-[10px] opacity-75 tabular-nums">({fileMessages.length})</span>
          </TabsTrigger>

          <TabsTrigger
            value="links"
            className="flex items-center justify-center gap-1"
            title="Links"
          >
            <IconLink className="size-3.5 shrink-0" />
            <span className="truncate">Links</span>
            <span className="text-[10px] opacity-75 tabular-nums">({links.length})</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto min-h-0 pt-3 [scrollbar-width:thin]">
          <TabsContent value="photos" className="mt-0">
            <MediaTabContent
              mediaMessages={mediaMessages}
              onSelectMedia={onSelectMedia}
            />
          </TabsContent>

          <TabsContent value="files" className="mt-0">
            <FilesTabContent fileMessages={fileMessages} />
          </TabsContent>

          <TabsContent value="links" className="mt-0">
            <LinksTabContent links={links} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default DetailsTabs
