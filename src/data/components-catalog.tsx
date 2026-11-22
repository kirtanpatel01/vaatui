import * as React from "react"
import { MOCK_CONTACTS } from "./mock-contacts"
import { MOCK_MESSAGES } from "./mock-messages"
import { Button } from "@/components/ui/button"

// Chat & UI components
import { ChatLayout } from "@/components/chat/chat-layout"
import { ChatSidebar } from "@/components/chat/sidebar/chat-sidebar"
import { ChatMain } from "@/components/chat/chat-main"
import { ChatDetails } from "@/components/chat/chat-details"
import { ChatHeader } from "@/components/chat/main/chat-header"
import { ChatHeaderSearch } from "@/components/chat/main/chat-header-search"
import { ChatInputBar } from "@/components/chat/main/chat-input-bar"
import { MessageReplyBar } from "@/components/chat/main/message-reply-bar"
import { PinnedMessageBar } from "@/components/chat/main/pinned-message-bar"
import { ForwardMessageDialog } from "@/components/chat/main/forward-message-dialog"
import { SavedMessagesSheet } from "@/components/chat/main/saved-messages-sheet"

// Message Feed components
import { MessageFeed } from "@/components/chat/main/message-feed/message-feed"
import { MessageItem } from "@/components/chat/main/message-feed/message-item"
import { TextBubble } from "@/components/chat/main/message-feed/text-bubble"
import { PhotoAttachmentBubble } from "@/components/chat/main/message-feed/photo-attachment-bubble"
import { FileAttachmentBubble } from "@/components/chat/main/message-feed/file-attachment-bubble"
import { VoiceNoteBubble } from "@/components/chat/main/message-feed/voice-note-bubble"
import { PollBubble } from "@/components/chat/main/message-feed/poll-bubble"
import { ContactBubble } from "@/components/chat/main/message-feed/contact-bubble"
import { LinkAttachmentBubble } from "@/components/chat/main/message-feed/link-attachment-bubble"
import { MessageReactions } from "@/components/chat/main/message-feed/message-reactions"
import { MessageReplyPreview } from "@/components/chat/main/message-feed/message-reply-preview"
import { DeliveryStatusIcon } from "@/components/chat/main/message-feed/delivery-status-icon"
import { MessageDateSeparator } from "@/components/chat/main/message-feed/message-date-separator"

// Attachments & Modals
import { VoiceRecorder } from "@/components/chat/main/attachments/voice-recorder"
import { EmojiPicker } from "@/components/chat/main/attachments/emoji-picker"
import { AttachmentMenu } from "@/components/chat/main/attachments/attachment-menu"
import { PendingAttachmentPreview } from "@/components/chat/main/attachments/pending-attachment-preview"
import { CameraModal } from "@/components/chat/main/attachments/camera-modal"
import { CreatePollModal } from "@/components/chat/main/attachments/create-poll-modal"
import { ShareContactModal } from "@/components/chat/main/attachments/share-contact-modal"
import { GifPicker } from "@/components/chat/main/attachments/gif-picker"

// Sidebar & Primitives
import { SidebarHeader } from "@/components/chat/sidebar/header/sidebar-header"
import { SidebarSearch } from "@/components/chat/sidebar/header/sidebar-search"
import { FilterTabs } from "@/components/chat/sidebar/header/filter-tabs"
import { DEFAULT_FILTER_TABS } from "@/components/chat/sidebar/header/filter-tabs"
import { SidebarMainItem } from "@/components/chat/sidebar/sidebar-main-item"
import { SidebarFooter } from "@/components/chat/sidebar/sidebar-footer"
import { UserSettingsSheet } from "@/components/chat/sidebar/settings/user-settings-sheet"
import { ArchivedChatsSheet } from "@/components/chat/sidebar/archived-chats-sheet"
import { ChatAvatar } from "@/components/chat/ui/chat-avatar"
import { TypingIndicator } from "@/components/chat/ui/typing-indicator"

// Details components
import { DetailsHero } from "@/components/chat/details/details-hero"
import { ContactInfoCard } from "@/components/chat/details/contact-info-card"
import { GroupInfoCard } from "@/components/chat/details/group-info-card"
import { AnnouncementInfoCard } from "@/components/chat/details/announcement-info-card"
import { DetailsTabs } from "@/components/chat/details/tabs/details-tabs"
import { MediaLightboxModal } from "@/components/chat/details/tabs/media-lightbox-modal"

export interface ComponentEntry {
  id: string
  name: string
  category: "Inputs & Attachments" | "Message Feed" | "Sidebar & Navigation" | "Header & Details" | "Layouts"
  description: string
  render: () => React.ReactNode
}

function ModalPreviewTrigger({
  label,
  children,
}: {
  label: string
  children: (open: boolean, setOpen: (o: boolean) => void) => React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <Button type="button" onClick={() => setOpen(true)}>
        {label}
      </Button>
      {children(open, setOpen)}
    </div>
  )
}

const mockContact = MOCK_CONTACTS[1] // Shreya Solanki
const mockMessages = MOCK_MESSAGES["chat_2"] ?? []

export const COMPONENTS_CATALOG: ComponentEntry[] = [
  // Layouts
  {
    id: "chat-layout",
    name: "Chat Layout",
    category: "Layouts",
    description: "Full responsive 3-panel chat application layout with resizable sidebar, main feed, and details drawer.",
    render: () => (
      <div className="w-full h-[580px] rounded-2xl border border-border/80 overflow-hidden shadow-sm">
        <ChatLayout />
      </div>
    ),
  },
  {
    id: "chat-sidebar",
    name: "Chat Sidebar",
    category: "Sidebar & Navigation",
    description: "Conversation sidebar with search, dynamic filter tabs, archived drawer, and context menu actions.",
    render: () => (
      <div className="w-[360px] h-[540px] rounded-2xl border border-border/80 overflow-hidden shadow-sm">
        <ChatSidebar />
      </div>
    ),
  },
  {
    id: "chat-main",
    name: "Chat Main Panel",
    category: "Layouts",
    description: "Active chat panel combining header, search, pinned messages, feed, and input bar.",
    render: () => (
      <div className="w-full max-w-3xl h-[580px] rounded-2xl border border-border/80 overflow-hidden shadow-sm">
        <ChatMain />
      </div>
    ),
  },
  {
    id: "chat-details",
    name: "Chat Details",
    category: "Header & Details",
    description: "Side drawer displaying contact profile, media gallery, shared docs, links, and group members.",
    render: () => (
      <div className="w-[360px] h-[540px] rounded-2xl border border-border/80 overflow-hidden shadow-sm">
        <ChatDetails />
      </div>
    ),
  },

  // Inputs & Attachments
  {
    id: "chat-input-bar",
    name: "Chat Input Bar",
    category: "Inputs & Attachments",
    description: "Composed chat input with attachment menu, voice note recorder, emoji picker, and send action.",
    render: () => (
      <div className="w-full max-w-2xl rounded-2xl border border-border/80 overflow-hidden shadow-sm">
        <ChatInputBar />
      </div>
    ),
  },
  {
    id: "voice-recorder",
    name: "Voice Recorder",
    category: "Inputs & Attachments",
    description: "Active voice recording overlay with real-time audio waveform frequencies, timer, and playback controls.",
    render: () => (
      <div className="w-full max-w-xl">
        <VoiceRecorder
          isRecording={true}
          isPaused={false}
          recordingSeconds={24}
          liveFrequencies={[20, 35, 60, 85, 45, 90, 75, 40, 65, 80, 95, 55, 30, 70, 85, 60, 40, 75, 90, 65, 35, 50, 80, 95, 70, 45, 60, 85, 40, 70, 90, 55, 35, 65, 80, 50]}
          onPause={() => {}}
          onResume={() => {}}
          onCancel={() => {}}
          onSend={() => {}}
        />
      </div>
    ),
  },
  {
    id: "attachment-menu",
    name: "Attachment Menu",
    category: "Inputs & Attachments",
    description: "Plus button popover menu for photo, file, camera, contact, and poll attachments.",
    render: () => {
      const [open, setOpen] = React.useState(true)
      return (
        <div className="flex items-center justify-center pt-32 pb-4">
          <AttachmentMenu
            open={open}
            onOpenChange={setOpen}
            onSelectOption={() => {}}
          />
        </div>
      )
    },
  },
  {
    id: "emoji-picker",
    name: "Emoji Picker",
    category: "Inputs & Attachments",
    description: "Emoji Mart popover picker with theme detection and cursor-accurate insertion.",
    render: () => {
      const [open, setOpen] = React.useState(true)
      return (
        <div className="flex items-center justify-center pt-80 pb-4">
          <EmojiPicker
            open={open}
            onOpenChange={setOpen}
            onSelectEmoji={() => {}}
          />
        </div>
      )
    },
  },
  {
    id: "message-reply-bar",
    name: "Message Reply Bar",
    category: "Inputs & Attachments",
    description: "Quoted message preview bar shown above the text input when replying.",
    render: () => (
      <div className="w-full max-w-lg">
        <MessageReplyBar
          replyingTo={{
            senderName: "Shreya Solanki",
            text: "Heyy Kirtan! Free che thodi vaar?",
          }}
          onCancel={() => {}}
        />
      </div>
    ),
  },
  {
    id: "pending-attachment-preview",
    name: "Pending Attachment Preview",
    category: "Inputs & Attachments",
    description: "Compact chip preview of media or document attachments pending send.",
    render: () => (
      <div className="flex flex-col gap-3">
        <PendingAttachmentPreview
          attachment={{
            type: "file",
            fileName: "Chat_Details_Wireframe.pdf",
            fileSize: "4.8 MB",
          }}
          onRemove={() => {}}
        />
        <PendingAttachmentPreview
          attachment={{
            type: "photo",
            thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80",
            fileName: "Preview.jpg",
            fileSize: "1.2 MB",
          }}
          onRemove={() => {}}
        />
      </div>
    ),
  },
  {
    id: "camera-modal",
    name: "Camera Modal",
    category: "Inputs & Attachments",
    description: "Live camera capture modal with real-time video stream and snapshot shutter.",
    render: () => (
      <ModalPreviewTrigger label="Open Camera Modal">
        {(open, setOpen) => (
          <CameraModal open={open} onOpenChange={setOpen} onCapture={() => setOpen(false)} />
        )}
      </ModalPreviewTrigger>
    ),
  },
  {
    id: "create-poll-modal",
    name: "Create Poll Modal",
    category: "Inputs & Attachments",
    description: "Interactive dialog for composing multi-choice polls with multiple vote toggling.",
    render: () => (
      <ModalPreviewTrigger label="Open Create Poll Modal">
        {(open, setOpen) => (
          <CreatePollModal open={open} onOpenChange={setOpen} onCreatePoll={() => setOpen(false)} />
        )}
      </ModalPreviewTrigger>
    ),
  },
  {
    id: "share-contact-modal",
    name: "Share Contact Modal",
    category: "Inputs & Attachments",
    description: "Modal dialog to select and share a contact profile card with direct search.",
    render: () => (
      <ModalPreviewTrigger label="Open Share Contact Modal">
        {(open, setOpen) => (
          <ShareContactModal
            contacts={MOCK_CONTACTS}
            open={open}
            onOpenChange={setOpen}
            onShareContact={() => setOpen(false)}
          />
        )}
      </ModalPreviewTrigger>
    ),
  },
  {
    id: "gif-picker",
    name: "GIF Picker",
    category: "Inputs & Attachments",
    description: "Animated Tenor GIF search and picker popover.",
    render: () => {
      const [open, setOpen] = React.useState(false)
      return (
        <div className="flex flex-col items-center gap-3">
          <GifPicker open={open} onOpenChange={setOpen} onSelectGif={() => setOpen(false)}>
            <Button type="button" onClick={() => setOpen(true)}>
              Open GIF Picker
            </Button>
          </GifPicker>
        </div>
      )
    },
  },

  // Message Feed & Bubbles
  {
    id: "text-bubble",
    name: "Text Bubble",
    category: "Message Feed",
    description: "Rich text message bubble supporting links, mentions, and search keyword highlighting.",
    render: () => (
      <div className="flex flex-col gap-3 w-full max-w-md">
        <div className="rounded-2xl bg-chat-bubble-received text-chat-bubble-received-foreground border border-border/60 p-3 shadow-xs">
          <TextBubble text="Heyy Kirtan! Free che thodi vaar? Check out https://github.com/kirtanpatel01/vaatui" isSentByMe={false} />
        </div>
        <div className="rounded-2xl bg-chat-bubble-sent text-chat-bubble-sent-foreground border border-border/80 p-3 shadow-sm self-end">
          <TextBubble text="Haa bol ne, su thayu? @Shreya Solanki" isSentByMe={true} />
        </div>
      </div>
    ),
  },
  {
    id: "voice-note-bubble",
    name: "Voice Note Bubble",
    category: "Message Feed",
    description: "Audio voice note player with scrubbing waveform bars, duration ticker, and play/pause controls.",
    render: () => (
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <VoiceNoteBubble
          duration="0:42"
          waveform={[25, 40, 75, 90, 60, 45, 80, 65, 40, 70, 95, 55, 35, 85, 40, 60, 75, 90, 50, 30]}
          timestamp="11:25 am"
          isSentByMe={false}
          status="read"
        />
        <VoiceNoteBubble
          duration="1:15"
          waveform={[30, 55, 80, 95, 70, 50, 85, 60, 45, 75, 90, 60, 40, 90, 50, 70, 85, 95, 60, 40]}
          timestamp="11:28 am"
          isSentByMe={true}
          status="read"
        />
      </div>
    ),
  },
  {
    id: "photo-attachment-bubble",
    name: "Photo Attachment Bubble",
    category: "Message Feed",
    description: "Photo and media bubble with thumbnail, image preview, timestamp overlay, and caption.",
    render: () => (
      <div className="w-full max-w-xs">
        <PhotoAttachmentBubble
          thumbnailUrl="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
          fileName="workspace_preview.jpg"
          fileSize="1.4 MB"
          caption="Current UI development preview"
          timestamp="11:32 am"
          isSentByMe={true}
          status="read"
        />
      </div>
    ),
  },
  {
    id: "file-attachment-bubble",
    name: "File Attachment Bubble",
    category: "Message Feed",
    description: "Document and file attachment card with extension icon, file size, and download action.",
    render: () => (
      <div className="w-full max-w-sm">
        <FileAttachmentBubble
          fileName="Chat_Details_Wireframe_v2.pdf"
          fileSize="4.8 MB"
          isSentByMe={false}
        />
      </div>
    ),
  },
  {
    id: "poll-bubble",
    name: "Poll Bubble",
    category: "Message Feed",
    description: "Interactive poll bubble with voting, option percentages, and voter count indicators.",
    render: () => (
      <div className="w-full max-w-md">
        <PollBubble
          poll={{
            question: "When should we schedule the design review?",
            allowMultiple: false,
            options: [
              { id: "1", text: "Today 5:00 PM", votes: ["curr_user", "u1", "u2"] },
              { id: "2", text: "Tomorrow Morning 11:00 AM", votes: ["u3"] },
              { id: "3", text: "Friday Afternoon", votes: [] },
            ],
          }}
          isSentByMe={false}
          onVote={() => {}}
        />
      </div>
    ),
  },
  {
    id: "contact-bubble",
    name: "Contact Card Bubble",
    category: "Message Feed",
    description: "VCard profile contact card with direct message shortcut button.",
    render: () => (
      <div className="w-full max-w-xs">
        <ContactBubble
          contact={{
            name: "Mohit Parmar",
            phone: "+91 98765 43210",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
          }}
          isSentByMe={false}
        />
      </div>
    ),
  },
  {
    id: "link-attachment-bubble",
    name: "Link Attachment Bubble",
    category: "Message Feed",
    description: "Rich OpenGraph link card with image banner, domain badge, and preview text.",
    render: () => (
      <div className="w-full max-w-sm">
        <LinkAttachmentBubble
          link={{
            url: "https://github.com/kirtanpatel01/vaatui",
            title: "VaatUI — Modern Chat UI Library",
            description: "Beautifully crafted, modular chat UI components built on shadcn/ui and Tailwind CSS.",
            domain: "github.com",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
          }}
          isSentByMe={false}
        />
      </div>
    ),
  },
  {
    id: "message-reactions",
    name: "Message Reactions",
    category: "Message Feed",
    description: "Interactive emoji reaction badges with count and active user reaction highlight.",
    render: () => (
      <div className="flex items-center gap-2">
        <MessageReactions
          reactions={[
            { emoji: "❤️", count: 4, hasReacted: true },
            { emoji: "🔥", count: 2, hasReacted: false },
            { emoji: "👍", count: 1, hasReacted: false },
          ]}
          isSentByMe={false}
          onReactionClick={() => {}}
        />
      </div>
    ),
  },
  {
    id: "message-reply-preview",
    name: "Message Reply Preview",
    category: "Message Feed",
    description: "Quoted parent message chip embedded inside a reply message bubble.",
    render: () => (
      <div className="w-full max-w-xs rounded-xl bg-muted/70 p-2 border border-border/50">
        <MessageReplyPreview
          replyTo={{
            id: "msg_1",
            senderName: "Shreya Solanki",
            text: "Pelo UI component library valo project start karyo ke baki?",
          }}
          isSentByMe={true}
        />
      </div>
    ),
  },
  {
    id: "delivery-status-icon",
    name: "Delivery Status Icon",
    category: "Message Feed",
    description: "Visual message status indicator: sending (clock), sent, delivered, read (blue ticks), failed.",
    render: () => (
      <div className="flex items-center gap-6 p-4 rounded-xl border border-border/60 bg-muted/30">
        <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
          <DeliveryStatusIcon status="sending" />
          <span>Sending</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
          <DeliveryStatusIcon status="sent" />
          <span>Sent</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
          <DeliveryStatusIcon status="delivered" />
          <span>Delivered</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
          <DeliveryStatusIcon status="read" />
          <span className="text-read font-medium">Read</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
          <DeliveryStatusIcon status="failed" />
          <span className="text-destructive">Failed</span>
        </div>
      </div>
    ),
  },
  {
    id: "message-date-separator",
    name: "Message Date Separator",
    category: "Message Feed",
    description: "Sticky date divider pill grouping messages by day.",
    render: () => (
      <div className="w-full max-w-md">
        <MessageDateSeparator date="10 Nov 2026" />
      </div>
    ),
  },

  // Sidebar & Navigation
  {
    id: "chat-avatar",
    name: "Chat Avatar",
    category: "Sidebar & Navigation",
    description: "Universal avatar with size variants, online status dot, and fallback badges.",
    render: () => (
      <div className="flex items-center gap-5 p-4 rounded-xl border border-border/60 bg-muted/20">
        <div className="flex flex-col items-center gap-1 text-xs">
          <ChatAvatar name="Mohit Parmar" size="xs" />
          <span>xs</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs">
          <ChatAvatar name="Shreya Solanki" size="sm" showStatus isOnline />
          <span>sm</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs">
          <ChatAvatar name="Design Team" type="group" size="default" />
          <span>default</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs">
          <ChatAvatar name="Kirtan Patel" size="lg" showStatus isOnline />
          <span>lg</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs">
          <ChatAvatar name="Shreya Solanki" size="xl" showStatus isOnline />
          <span>xl</span>
        </div>
      </div>
    ),
  },
  {
    id: "typing-indicator",
    name: "Typing Indicator",
    category: "Sidebar & Navigation",
    description: "Animated 3-dot typing wave or text indicator for chat feeds and sidebar rows.",
    render: () => (
      <div className="flex flex-col gap-4 p-5 rounded-xl border border-border/60 bg-muted/20">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground min-w-[60px]">Dots:</span>
          <TypingIndicator variant="dots" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground min-w-[60px]">Text:</span>
          <TypingIndicator variant="text" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground min-w-[60px]">Full:</span>
          <TypingIndicator variant="full" />
        </div>
      </div>
    ),
  },
  {
    id: "sidebar-main-item",
    name: "Sidebar Main Item",
    category: "Sidebar & Navigation",
    description: "Conversation row with avatar, last message preview, unread count badge, and context menu.",
    render: () => (
      <div className="flex flex-col gap-2 w-full max-w-sm p-2 rounded-xl border border-border/60 bg-background">
        <SidebarMainItem contact={MOCK_CONTACTS[0]} />
        <SidebarMainItem contact={MOCK_CONTACTS[1]} isActive />
        <SidebarMainItem contact={MOCK_CONTACTS[3]} />
      </div>
    ),
  },
  {
    id: "sidebar-header",
    name: "Sidebar Header",
    category: "Sidebar & Navigation",
    description: "Top sidebar header with search input, compose new chat button, and filter tabs.",
    render: () => {
      const [activeTab, setActiveTab] = React.useState("all")
      return (
        <div className="w-full max-w-sm rounded-xl border border-border/60 bg-background overflow-hidden">
          <SidebarHeader
            tabs={DEFAULT_FILTER_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddTab={() => {}}
          />
        </div>
      )
    },
  },
  {
    id: "filter-tabs",
    name: "Filter Tabs",
    category: "Sidebar & Navigation",
    description: "Horizontal scrollable filter tabs (All, Unread, Favorites, Groups) with add tab button.",
    render: () => {
      const [activeTab, setActiveTab] = React.useState("all")
      return (
        <div className="w-full max-w-sm p-3 rounded-xl border border-border/60 bg-background">
          <FilterTabs
            tabs={DEFAULT_FILTER_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddTab={() => {}}
          />
        </div>
      )
    },
  },
  {
    id: "sidebar-search",
    name: "Sidebar Search",
    category: "Sidebar & Navigation",
    description: "Search bar with focus keyboard shortcut pill (`/`) and instant filter callback.",
    render: () => (
      <div className="w-full max-w-xs">
        <SidebarSearch value="" onChange={() => {}} />
      </div>
    ),
  },
  {
    id: "sidebar-footer",
    name: "Sidebar Footer",
    category: "Sidebar & Navigation",
    description: "Bottom profile card with user avatar, status pill, and settings gear launcher.",
    render: () => (
      <div className="w-full max-w-xs rounded-xl border border-border/60 overflow-hidden">
        <SidebarFooter onOpenSettings={() => {}} />
      </div>
    ),
  },
  {
    id: "user-settings-sheet",
    name: "User Settings Sheet",
    category: "Sidebar & Navigation",
    description: "Comprehensive settings sheet covering Profile, Appearance (Dark/Light mode), and Privacy.",
    render: () => (
      <ModalPreviewTrigger label="Open User Settings Sheet">
        {(open, setOpen) => <UserSettingsSheet open={open} onOpenChange={setOpen} />}
      </ModalPreviewTrigger>
    ),
  },
  {
    id: "archived-chats-sheet",
    name: "Archived Chats Sheet",
    category: "Sidebar & Navigation",
    description: "Slide-out sheet listing archived conversations with quick restore and delete actions.",
    render: () => (
      <ModalPreviewTrigger label="Open Archived Chats Sheet">
        {(open, setOpen) => (
          <ArchivedChatsSheet
            open={open}
            onOpenChange={setOpen}
            contacts={MOCK_CONTACTS}
          />
        )}
      </ModalPreviewTrigger>
    ),
  },

  // Header & Details
  {
    id: "chat-header",
    name: "Chat Header",
    category: "Header & Details",
    description: "Active conversation top bar with participant avatar, online status, search bar, and options menu.",
    render: () => (
      <div className="w-full max-w-2xl rounded-xl border border-border/60 overflow-hidden shadow-xs">
        <ChatHeader contact={mockContact} messages={mockMessages} />
      </div>
    ),
  },
  {
    id: "chat-header-search",
    name: "Chat Header Search",
    category: "Header & Details",
    description: "Animated expanding search bar with match counter (`x/y`) and previous/next navigation.",
    render: () => (
      <div className="flex items-center justify-center p-4">
        <ChatHeaderSearch
          isSearchOpen={true}
          searchQuery="wireframe"
          searchMatchCount={3}
          searchMatchIndex={0}
        />
      </div>
    ),
  },
  {
    id: "pinned-message-bar",
    name: "Pinned Message Bar",
    category: "Header & Details",
    description: "Header notification strip for pinned messages with jump-to-message navigation.",
    render: () => (
      <div className="w-full max-w-xl">
        <PinnedMessageBar
          pinnedMessages={[
            {
              id: "pin_1",
              chatId: "chat_2",
              senderId: "u2",
              senderName: "Shreya Solanki",
              text: "Pelo UI component library valo project start karyo ke baki?",
              timestamp: "11:20 am",
              date: "Today",
              isSentByMe: false,
              isPinned: true,
            },
          ]}
          onJumpToMessage={() => {}}
          onUnpin={() => {}}
        />
      </div>
    ),
  },
  {
    id: "forward-message-dialog",
    name: "Forward Message Dialog",
    category: "Header & Details",
    description: "Multi-select modal dialog to forward messages to multiple direct or group chats.",
    render: () => (
      <ModalPreviewTrigger label="Open Forward Dialog">
        {(open, setOpen) => (
          <ForwardMessageDialog
            message={mockMessages[0]}
            open={open}
            onOpenChange={setOpen}
            onForwardConfirm={() => setOpen(false)}
          />
        )}
      </ModalPreviewTrigger>
    ),
  },
  {
    id: "saved-messages-sheet",
    name: "Saved Messages Sheet",
    category: "Header & Details",
    description: "Slide-out browser for all starred and pinned messages with bulk unpin and delete.",
    render: () => (
      <ModalPreviewTrigger label="Open Starred / Pinned Sheet">
        {(open, setOpen) => (
          <SavedMessagesSheet
            type="starred"
            open={open}
            onOpenChange={setOpen}
            messages={mockMessages.filter((m) => m.isStarred || m.isPinned)}
          />
        )}
      </ModalPreviewTrigger>
    ),
  },
  {
    id: "details-hero",
    name: "Details Hero Card",
    category: "Header & Details",
    description: "Prominent contact profile hero banner with avatar, status text, and quick call/mute actions.",
    render: () => (
      <div className="w-full max-w-xs rounded-xl border border-border/60 overflow-hidden shadow-xs">
        <DetailsHero
          contact={mockContact}
          isMuted={false}
          onToggleMute={() => {}}
        />
      </div>
    ),
  },
  {
    id: "contact-info-card",
    name: "Contact Info Card",
    category: "Header & Details",
    description: "Direct contact info card with mutual groups, block button, and clear chat actions.",
    render: () => (
      <div className="w-full max-w-xs rounded-xl border border-border/60 overflow-hidden shadow-xs">
        <ContactInfoCard
          contact={mockContact}
          mutualGroups={[MOCK_CONTACTS[3], MOCK_CONTACTS[4]]}
          isBlocked={false}
          onToggleBlock={() => {}}
          onClearMessages={() => {}}
        />
      </div>
    ),
  },
  {
    id: "group-info-card",
    name: "Group Info Card",
    category: "Header & Details",
    description: "Group profile card showing members list, admin badges, and online indicators.",
    render: () => (
      <div className="w-full max-w-xs rounded-xl border border-border/60 overflow-hidden shadow-xs">
        <GroupInfoCard
          contact={MOCK_CONTACTS[3]}
          contacts={MOCK_CONTACTS}
        />
      </div>
    ),
  },
  {
    id: "announcement-info-card",
    name: "Announcement Info Card",
    category: "Header & Details",
    description: "Broadcast channel card with subscriber count, channel description, and mute toggle.",
    render: () => (
      <div className="w-full max-w-xs rounded-xl border border-border/60 overflow-hidden shadow-xs">
        <AnnouncementInfoCard contact={MOCK_CONTACTS[6]} />
      </div>
    ),
  },
  {
    id: "details-tabs",
    name: "Details Tabs (Media, Files, Links)",
    category: "Header & Details",
    description: "Categorized media browser tabs grouping Photos, Documents, and Extracted Links.",
    render: () => (
      <div className="w-[360px] h-[480px] rounded-xl border border-border/60 overflow-hidden shadow-xs">
        <DetailsTabs
          mediaMessages={mockMessages.filter((m) => m.attachment?.type === "photo")}
          fileMessages={mockMessages.filter((m) => m.attachment?.type === "file")}
          links={[]}
          onSelectMedia={() => {}}
        />
      </div>
    ),
  },
  {
    id: "media-lightbox-modal",
    name: "Media Lightbox Modal",
    category: "Header & Details",
    description: "Full-screen media lightbox modal with zoom, rotation, forwarding, and download tools.",
    render: () => (
      <ModalPreviewTrigger label="Open Media Lightbox">
        {(open, setOpen) => (
          <MediaLightboxModal
            media={open ? mockMessages.find((m) => m.attachment?.type === "photo") ?? null : null}
            allMedia={mockMessages.filter((m) => m.attachment?.type === "photo")}
            onClose={() => setOpen(false)}
          />
        )}
      </ModalPreviewTrigger>
    ),
  },
]

export function getComponentById(id: string): ComponentEntry | undefined {
  return COMPONENTS_CATALOG.find((c) => c.id === id)
}
