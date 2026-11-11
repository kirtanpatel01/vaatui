import * as React from 'react'
import { cn } from 'cn'
import { type UserProfile, MOCK_CONTACTS } from '@/data/mock-contacts'
import { type ChatMessage, MOCK_MESSAGES } from '@/data/mock-messages'

interface ChatContextValue {
  chatDetailsOpen: boolean
  setChatDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>
  activeContact: UserProfile
  setActiveContact: (contact: UserProfile) => void
  messages: ChatMessage[]
  sendMessage: (text: string) => void
}

const ChatContext = React.createContext<ChatContextValue | null>(null)

interface ChatProviderProps {
  children: React.ReactNode
  className?: string
  defaultChatDetailsOpen?: boolean
  defaultContactId?: string
}

export function ChatProvider({
  children,
  className,
  defaultChatDetailsOpen = false,
  defaultContactId = "chat_2",
}: ChatProviderProps) {
  const [chatDetailsOpen, setChatDetailsOpen] = React.useState(defaultChatDetailsOpen)
  const [activeContact, setActiveContact] = React.useState<UserProfile>(() => {
    return MOCK_CONTACTS.find((c) => c.id === defaultContactId) ?? MOCK_CONTACTS[0]
  })

  const [allMessages, setAllMessages] = React.useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES)

  const messages = allMessages[activeContact.id] ?? []

  const sendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId: activeContact.id,
      senderId: "curr_user",
      senderName: "Kirtan Patel",
      text,
      timestamp: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
        .format(new Date())
        .toLowerCase(),
      date: "Today",
      isSentByMe: true,
      status: "delivered",
    }

    setAllMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] ?? []), newMessage],
    }))
  }

  return (
    <ChatContext.Provider
      value={{
        chatDetailsOpen,
        setChatDetailsOpen,
        activeContact,
        setActiveContact,
        messages,
        sendMessage,
      }}
    >
      <div className={cn(className, "w-full flex")}>{children}</div>
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = React.useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export default ChatProvider
