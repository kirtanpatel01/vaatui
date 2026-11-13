import { IconPhoto, IconFile, IconLink } from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { type ChatMessage } from "@/data/mock-messages"
import { MediaTabContent } from "./media-tab-content"
import { FilesTabContent } from "./files-tab-content"
import { LinksTabContent, type ExtractedLinkItem } from "./links-tab-content"

export interface DetailsTabsProps {
  mediaMessages: ChatMessage[]
  fileMessages: ChatMessage[]
  links: ExtractedLinkItem[]
  onSelectMedia: (msg: ChatMessage) => void
}

export function DetailsTabs({
  mediaMessages,
  fileMessages,
  links,
  onSelectMedia,
}: DetailsTabsProps) {
  return (
    <div className="p-3">
      <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block px-1 mb-2">
        Shared Media & Docs
      </span>

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid grid-cols-3 h-8 p-0.5 bg-muted/60">
          <TabsTrigger
            value="photos"
            className="text-[11px] py-1 px-1 data-active:shadow-xs flex items-center gap-1"
            title="Photos and Videos"
          >
            <IconPhoto className="size-3.5 shrink-0" />
            <span className="truncate">Media</span>
            <span className="text-[10px] opacity-75 tabular-nums">({mediaMessages.length})</span>
          </TabsTrigger>

          <TabsTrigger
            value="files"
            className="text-[11px] py-1 px-1 data-active:shadow-xs flex items-center gap-1"
            title="Files"
          >
            <IconFile className="size-3.5 shrink-0" />
            <span className="truncate">Files</span>
            <span className="text-[10px] opacity-75 tabular-nums">({fileMessages.length})</span>
          </TabsTrigger>

          <TabsTrigger
            value="links"
            className="text-[11px] py-1 px-1 data-active:shadow-xs flex items-center gap-1"
            title="Links"
          >
            <IconLink className="size-3.5 shrink-0" />
            <span className="truncate">Links</span>
            <span className="text-[10px] opacity-75 tabular-nums">({links.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="pt-3">
          <MediaTabContent
            mediaMessages={mediaMessages}
            onSelectMedia={onSelectMedia}
          />
        </TabsContent>

        <TabsContent value="files" className="pt-3">
          <FilesTabContent fileMessages={fileMessages} />
        </TabsContent>

        <TabsContent value="links" className="pt-3">
          <LinksTabContent links={links} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DetailsTabs
