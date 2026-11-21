import { useState, useMemo, useEffect } from "react"
import { useChatStore, useActiveContact, useActiveMessages } from "@/stores/chat-store"
import { DetailsHeader } from "./details/details-header"
import { DetailsHero } from "./details/details-hero"
import { MediaPreviewCard } from "./details/media-preview-card"
import { ContactInfoCard } from "./details/contact-info-card"
import { GroupInfoCard } from "./details/group-info-card"
import { AnnouncementInfoCard } from "./details/announcement-info-card"
import { DetailsTabs } from "./details/tabs/details-tabs"
import { MediaLightboxModal } from "./details/tabs/media-lightbox-modal"
import { type ExtractedLinkItem } from "./details/tabs/links-tab-content"
import { extractUrls, extractDomain, type ChatMessage } from "@/data/mock-messages"
import { cn } from "cn"

export interface ChatDetailsProps {
  className?: string
}

export function ChatDetails({ className }: ChatDetailsProps) {
  const activeContact = useActiveContact()
  const messages = useActiveMessages()
  const contacts = useChatStore((s) => s.contacts)
  const setActiveContact = useChatStore((s) => s.setActiveContact)
  const setChatDetailsOpen = useChatStore((s) => s.setChatDetailsOpen)
  const toggleMute = useChatStore((s) => s.toggleMute)
  const toggleBlock = useChatStore((s) => s.toggleBlock)
  const clearMessages = useChatStore((s) => s.clearMessages)
  const isBlocked = useChatStore((s) => s.blockedContactIds.has(activeContact.id))
  const isMuted = Boolean(activeContact.isMuted)

  const [view, setView] = useState<"overview" | "media">("overview")
  const [activeMediaTab, setActiveMediaTab] = useState<"photos" | "files" | "links">("photos")
  const [selectedMedia, setSelectedMedia] = useState<ChatMessage | null>(null)

  // Reset view to overview whenever contact changes
  useEffect(() => {
    setView("overview")
    setActiveMediaTab("photos")
  }, [activeContact.id])

  // Esc key closes details or goes back from media view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedMedia) return
        if (view === "media") {
          setView("overview")
        } else {
          setChatDetailsOpen(false)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [view, selectedMedia, setChatDetailsOpen])

  // 1. Photos and videos in this chat
  const sharedMedia = useMemo(() => {
    return messages.filter(
      (m) =>
        m.attachment &&
        (m.attachment.type === "photo" || m.attachment.type === "video")
    )
  }, [messages])

  // 2. Files in this chat
  const sharedFiles = useMemo(() => {
    return messages.filter((m) => m.attachment && m.attachment.type === "file")
  }, [messages])

  // 3. Extracted links in this chat (attachments + embedded in text)
  const sharedLinks = useMemo(() => {
    const result: ExtractedLinkItem[] = []
    const seenUrls = new Set<string>()

    for (const msg of messages) {
      if (msg.attachment?.type === "link" && msg.attachment.link) {
        const link = msg.attachment.link
        if (!seenUrls.has(link.url)) {
          seenUrls.add(link.url)
          result.push({
            id: msg.id,
            url: link.url,
            domain: link.domain || extractDomain(link.url),
            title: link.title || extractDomain(link.url),
            description: link.description || msg.text,
            image: link.image,
            senderName: msg.senderName,
            timestamp: msg.timestamp,
          })
        }
      }

      if (msg.text) {
        const urls = extractUrls(msg.text)
        for (const url of urls) {
          const normalized = url.startsWith("http") ? url : `https://${url}`
          if (!seenUrls.has(normalized)) {
            seenUrls.add(normalized)
            const domain = extractDomain(url)
            result.push({
              id: `${msg.id}-${url}`,
              url: normalized,
              domain,
              title: domain,
              description: msg.text,
              senderName: msg.senderName,
              timestamp: msg.timestamp,
            })
          }
        }
      }
    }

    return result
  }, [messages])

  // 4. Mutual groups for direct contact
  const mutualGroups = useMemo(() => {
    if (activeContact.type !== "direct") return []
    return contacts.filter(
      (c) =>
        c.type === "group" &&
        c.members?.some(
          (m) =>
            m.id === activeContact.id ||
            m.name.toLowerCase() === activeContact.name.toLowerCase() ||
            activeContact.name.toLowerCase().includes(m.name.toLowerCase())
        )
    )
  }, [contacts, activeContact])

  return (
    <aside
      className={cn(
        "flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-2xs select-none",
        className
      )}
    >
      {/* 1. Header with Close Button and Back Button when in Media view */}
      <DetailsHeader
        type={activeContact.type}
        onClose={() => setChatDetailsOpen(false)}
        view={view}
        onBack={() => setView("overview")}
      />

      {/* 2. Main Content Area */}
      {view === "overview" ? (
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 [scrollbar-width:thin] divide-y divide-border/60">
          {/* Hero Section */}
          <DetailsHero
            contact={activeContact}
            isMuted={isMuted}
            onToggleMute={() => toggleMute(activeContact.id)}
          />

          {/* WhatsApp Web Style: Prominent Media & Docs Preview Card */}
          <MediaPreviewCard
            mediaMessages={sharedMedia}
            fileMessages={sharedFiles}
            links={sharedLinks}
            onOpenMediaView={(tab) => {
              if (tab) setActiveMediaTab(tab)
              setView("media")
            }}
            onSelectMedia={setSelectedMedia}
          />

          {/* Dynamic Context Card (Different for Direct, Group, and Channel) */}
          {activeContact.type === "direct" && (
            <ContactInfoCard
              contact={activeContact}
              mutualGroups={mutualGroups}
              isBlocked={isBlocked}
              onToggleBlock={() => toggleBlock(activeContact.id)}
              onClearMessages={() => clearMessages(activeContact.id)}
              onSelectGroup={setActiveContact}
            />
          )}

          {activeContact.type === "group" && (
            <GroupInfoCard
              contact={activeContact}
              contacts={contacts}
              onSelectContact={setActiveContact}
            />
          )}

          {activeContact.type === "announcement" && (
            <AnnouncementInfoCard contact={activeContact} />
          )}
        </div>
      ) : (
        /* Full-Height Media, Links & Docs View */
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <DetailsTabs
            key={activeMediaTab}
            mediaMessages={sharedMedia}
            fileMessages={sharedFiles}
            links={sharedLinks}
            onSelectMedia={setSelectedMedia}
            defaultTab={activeMediaTab}
            hideSectionHeader
            className="flex-1"
          />
        </div>
      )}

      {/* 3. Media Lightbox Modal */}
      <MediaLightboxModal
        media={selectedMedia}
        allMedia={sharedMedia}
        onClose={() => setSelectedMedia(null)}
        onSelectMedia={setSelectedMedia}
      />
    </aside>
  )
}

export default ChatDetails
