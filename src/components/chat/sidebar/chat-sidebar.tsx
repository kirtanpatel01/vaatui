import * as React from "react"
import { cn } from "cn"
import SidebarHeader from "./header/sidebar-header"
import SidebarMain from "./sidebar-main"
import SidebarFooter from "./sidebar-footer"
import CreateTabSheet from "./header/create-tab-sheet"
import ArchivedChatsSheet from "./archived-chats-sheet"
import { useChat } from "@/components/chat/chat-provider"
import { type FilterTabItem, DEFAULT_FILTER_TABS } from "./header/filter-tabs"
import { type UserProfile } from "@/data/mock-contacts"

interface ChatSidebarProps {
  className?: string
  showScrollbar?: boolean
  onSelectContact?: (contact: UserProfile) => void
}

function ChatSidebar({
  className,
  showScrollbar = false,
  onSelectContact,
}: ChatSidebarProps) {
  const { contacts, setContacts, activeContact, setActiveContact } = useChat()
  const [tabs, setTabs] = React.useState<FilterTabItem[]>(DEFAULT_FILTER_TABS)
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [isArchivedOpen, setIsArchivedOpen] = React.useState(false)

  const handleCreateTab = (name: string, selectedContactIds: string[]) => {
    const newId = name.toLowerCase().replace(/\s+/g, "-")
    const newTab: FilterTabItem = { id: newId, label: name }

    // Add new tab to tabs list
    setTabs((prev) => [...prev, newTab])

    // Update selected contacts so they belong to this new tab
    if (selectedContactIds.length > 0) {
      setContacts((prev) =>
        prev.map((c) =>
          selectedContactIds.includes(c.id)
            ? { ...c, tabs: [...c.tabs, newId] }
            : c
        )
      )
    }

    // Automatically focus the newly created tab
    setActiveTab(newId)
  }

  const handleUpdateContact = (updated: UserProfile) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    )
  }

  const handleDeleteChat = (contactId: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId))
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

      <SidebarMain
        contacts={contacts}
        activeTab={activeTab}
        activeChatId={activeContact?.id}
        showScrollbar={showScrollbar}
        onOpenArchived={() => setIsArchivedOpen(true)}
        onSelectContact={(c) => {
          onSelectContact?.(c)
          setActiveContact(c)
        }}
        onUpdateContact={handleUpdateContact}
        onDeleteChat={handleDeleteChat}
      />

      <SidebarFooter />

      <CreateTabSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        contacts={contacts}
        onCreateTab={handleCreateTab}
      />

      <ArchivedChatsSheet
        open={isArchivedOpen}
        onOpenChange={setIsArchivedOpen}
        contacts={contacts}
        showScrollbar={showScrollbar}
        onSelectContact={onSelectContact}
        onUpdateContact={handleUpdateContact}
        onDeleteChat={handleDeleteChat}
      />
    </aside>
  )
}

export default ChatSidebar
