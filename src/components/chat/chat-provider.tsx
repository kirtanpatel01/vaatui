import * as React from 'react'
import {
  useChatStore,
  useActiveContact,
  useActiveMessages,
  type CurrentUserProfile,
  type ChatStore,
} from '@/stores/chat-store'
import { type UserProfile } from '@/data/mock-contacts'
import { type ChatMessage, type MessageReply, type MessageAttachment } from '@/data/mock-messages'
import { cn } from 'cn'

export { type CurrentUserProfile }

/**
 * Adapter hook that exposes the exact same API as the legacy useChat context,
 * but powered 100% by the lightweight Zustand store under the hood.
 */
export function useChat() {
  const store = useChatStore()
  const activeContact = useActiveContact()
  const messages = useActiveMessages()

  const isMuted = Boolean(activeContact?.isMuted)
  const isBlocked = store.blockedContactIds.has(activeContact?.id)

  return {
    chatDetailsOpen: store.chatDetailsOpen,
    setChatDetailsOpen: store.setChatDetailsOpen,
    activeContact,
    setActiveContact: store.setActiveContact,
    contacts: store.contacts,
    setContacts: store.setContacts,
    messages,
    sendMessage: store.sendMessage,
    toggleReaction: store.toggleReaction,
    votePoll: store.votePoll,
    forwardMessage: store.forwardMessage,
    toggleStar: store.toggleStar,
    togglePin: store.togglePin,
    deleteMessage: store.deleteMessage,
    clearMessages: () => store.clearMessages(activeContact?.id),
    isMuted,
    toggleMute: () => store.toggleMute(activeContact?.id),
    isBlocked,
    toggleBlock: () => store.toggleBlock(activeContact?.id),
    currentUser: store.currentUser,
    updateCurrentUser: store.updateCurrentUser,
    blockedContactIds: store.blockedContactIds,
    unblockContact: store.unblockContact,
    enterIsSend: store.enterIsSend,
    setEnterIsSend: store.setEnterIsSend,
  }
}

export interface ChatProviderProps {
  children?: React.ReactNode
  className?: string
  defaultChatDetailsOpen?: boolean
  defaultContactId?: string
}

/**
 * Optional layout wrapper for backward compatibility or initial state seeding.
 * Does not block components from rendering if omitted!
 */
export function ChatProvider({
  children,
  className,
  defaultChatDetailsOpen,
  defaultContactId,
}: ChatProviderProps) {
  React.useEffect(() => {
    if (defaultChatDetailsOpen !== undefined) {
      useChatStore.getState().setChatDetailsOpen(defaultChatDetailsOpen)
    }
    if (defaultContactId !== undefined) {
      useChatStore.getState().setActiveContactId(defaultContactId)
    }
  }, [defaultChatDetailsOpen, defaultContactId])

  return <div className={cn("w-full h-full flex", className)}>{children}</div>
}

export default ChatProvider
