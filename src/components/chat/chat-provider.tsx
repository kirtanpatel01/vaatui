import * as React from 'react'
import { cn } from 'cn'
import { type UserProfile, MOCK_CONTACTS } from '@/data/mock-contacts'
import { type ChatMessage, type MessageReply, MOCK_MESSAGES } from '@/data/mock-messages'

interface ChatContextValue {
  chatDetailsOpen: boolean
  setChatDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>
  activeContact: UserProfile
  setActiveContact: (contact: UserProfile) => void
  messages: ChatMessage[]
  sendMessage: (text: string, replyTo?: MessageReply | null) => void
  toggleReaction: (messageId: string, emoji: string) => void
  forwardMessage: (targetChatIds: string[], messageToForward: ChatMessage) => void
  toggleStar: (messageId: string) => void
  togglePin: (messageId: string) => void
  deleteMessage: (messageId: string) => void
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

  const sendMessage = (text: string, replyTo?: MessageReply | null) => {
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
      ...(replyTo ? { replyTo } : {}),
    }

    setAllMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] ?? []), newMessage],
    }))
  }

  const toggleReaction = (messageId: string, emoji: string) => {
    setAllMessages((prev) => {
      const chatList = prev[activeContact.id] ?? []
      const updatedList = chatList.map((msg) => {
        if (msg.id !== messageId) return msg

        const reactions = [...(msg.reactions ?? [])]
        const existingIdx = reactions.findIndex((r) => r.emoji === emoji)

        if (existingIdx >= 0) {
          const current = reactions[existingIdx]
          if (current.hasReacted) {
            // Unreact if already reacted
            if (current.count <= 1) {
              reactions.splice(existingIdx, 1)
            } else {
              reactions[existingIdx] = {
                ...current,
                count: current.count - 1,
                hasReacted: false,
              }
            }
          } else {
            // Add user's reaction
            reactions[existingIdx] = {
              ...current,
              count: current.count + 1,
              hasReacted: true,
            }
          }
        } else {
          // Brand new reaction
          reactions.push({
            emoji,
            count: 1,
            hasReacted: true,
          })
        }

        return {
          ...msg,
          reactions,
        }
      })

      return {
        ...prev,
        [activeContact.id]: updatedList,
      }
    })
  }

  const forwardMessage = (targetChatIds: string[], messageToForward: ChatMessage) => {
    const timeNow = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
      .format(new Date())
      .toLowerCase()

    setAllMessages((prev) => {
      const nextState = { ...prev }

      targetChatIds.forEach((chatId) => {
        const forwardedMsg: ChatMessage = {
          ...messageToForward,
          id: `fwd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          chatId,
          senderId: "curr_user",
          senderName: "Kirtan Patel",
          timestamp: timeNow,
          date: "Today",
          isSentByMe: true,
          status: "delivered",
          isForwarded: true,
          reactions: [], // reset reactions for forwarded copy
        }

        nextState[chatId] = [...(nextState[chatId] ?? []), forwardedMsg]
      })

      return nextState
    })
  }

  const toggleStar = (messageId: string) => {
    setAllMessages((prev) => {
      const currentList = prev[activeContact.id] ?? []
      return {
        ...prev,
        [activeContact.id]: currentList.map((m) =>
          m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
        ),
      }
    })
  }

  const togglePin = (messageId: string) => {
    setAllMessages((prev) => {
      const currentList = prev[activeContact.id] ?? []
      return {
        ...prev,
        [activeContact.id]: currentList.map((m) =>
          m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
        ),
      }
    })
  }

  const deleteMessage = (messageId: string) => {
    setAllMessages((prev) => {
      const currentList = prev[activeContact.id] ?? []
      return {
        ...prev,
        [activeContact.id]: currentList.filter((m) => m.id !== messageId),
      }
    })
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
        toggleReaction,
        forwardMessage,
        toggleStar,
        togglePin,
        deleteMessage,
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
