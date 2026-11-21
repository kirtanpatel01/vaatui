import { create } from "zustand"
import { type UserProfile, MOCK_CONTACTS, CURRENT_USER } from "@/data/mock-contacts"
import {
  type ChatMessage,
  type MessageReply,
  type MessageAttachment,
  MOCK_MESSAGES,
} from "@/data/mock-messages"

export interface CurrentUserProfile extends UserProfile {
  thought?: string
}

export interface ChatState {
  chatDetailsOpen: boolean
  activeContactId: string
  contacts: UserProfile[]
  allMessages: Record<string, ChatMessage[]>
  blockedContactIds: Set<string>
  enterIsSend: boolean
  currentUser: CurrentUserProfile
}

export interface ChatActions {
  // Navigation & UI
  setChatDetailsOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  toggleChatDetails: () => void
  setActiveContactId: (id: string) => void
  setActiveContact: (contact: UserProfile) => void

  // Contacts
  setContacts: (contacts: UserProfile[] | ((prev: UserProfile[]) => UserProfile[])) => void
  updateContact: (updated: UserProfile) => void
  deleteChat: (contactId: string) => void
  toggleMute: (contactId?: string) => void
  toggleBlock: (contactId?: string) => void
  unblockContact: (contactId: string) => void

  // Messages
  sendMessage: (text: string, replyTo?: MessageReply | null, attachment?: MessageAttachment) => void
  toggleReaction: (messageId: string, emoji: string) => void
  votePoll: (messageId: string, optionId: string) => void
  forwardMessage: (targetChatIds: string[], messageToForward: ChatMessage) => void
  toggleStar: (messageId: string) => void
  togglePin: (messageId: string) => void
  deleteMessage: (messageId: string) => void
  clearMessages: (contactId?: string) => void

  // User & Settings
  updateCurrentUser: (updates: Partial<CurrentUserProfile>) => void
  setEnterIsSend: (value: boolean | ((prev: boolean) => boolean)) => void
}

export type ChatStore = ChatState & ChatActions

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial State
  chatDetailsOpen: false,
  activeContactId: "chat_2",
  contacts: MOCK_CONTACTS,
  allMessages: MOCK_MESSAGES,
  blockedContactIds: new Set<string>(),
  enterIsSend: true,
  currentUser: {
    ...CURRENT_USER,
    username: "@kjpatel",
    bio: "Designing interfaces, playing badminton 🏸 and exploring cafes.",
    thought: "Designing interfaces...",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  },

  // Actions
  setChatDetailsOpen: (open) =>
    set((state) => ({
      chatDetailsOpen: typeof open === "function" ? open(state.chatDetailsOpen) : open,
    })),

  toggleChatDetails: () =>
    set((state) => ({
      chatDetailsOpen: !state.chatDetailsOpen,
    })),

  setActiveContactId: (id) =>
    set({
      activeContactId: id,
    }),

  setActiveContact: (contact) =>
    set({
      activeContactId: contact.id,
    }),

  setContacts: (updater) =>
    set((state) => ({
      contacts: typeof updater === "function" ? updater(state.contacts) : updater,
    })),

  updateContact: (updated) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === updated.id ? updated : c)),
    })),

  deleteChat: (contactId) =>
    set((state) => {
      const remaining = state.contacts.filter((c) => c.id !== contactId)
      const nextActiveId =
        state.activeContactId === contactId ? remaining[0]?.id ?? "" : state.activeContactId
      const newAllMessages = { ...state.allMessages }
      delete newAllMessages[contactId]

      return {
        contacts: remaining,
        activeContactId: nextActiveId,
        allMessages: newAllMessages,
      }
    }),

  toggleMute: (targetId) =>
    set((state) => {
      const contactId = targetId ?? state.activeContactId
      return {
        contacts: state.contacts.map((c) =>
          c.id === contactId ? { ...c, isMuted: !c.isMuted } : c
        ),
      }
    }),

  toggleBlock: (targetId) =>
    set((state) => {
      const contactId = targetId ?? state.activeContactId
      const next = new Set(state.blockedContactIds)
      if (next.has(contactId)) {
        next.delete(contactId)
      } else {
        next.add(contactId)
      }
      return { blockedContactIds: next }
    }),

  unblockContact: (contactId) =>
    set((state) => {
      const next = new Set(state.blockedContactIds)
      next.delete(contactId)
      return { blockedContactIds: next }
    }),

  sendMessage: (text, replyTo, attachment) =>
    set((state) => {
      const activeId = state.activeContactId
      const previewText = text || (attachment ? `[${attachment.type}]` : "")
      const contentType = attachment?.type ?? "text"

      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        chatId: activeId,
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
        ...(attachment ? { attachment } : {}),
      }

      const currentMessages = state.allMessages[activeId] ?? []

      return {
        allMessages: {
          ...state.allMessages,
          [activeId]: [...currentMessages, newMessage],
        },
        contacts: state.contacts.map((c) =>
          c.id === activeId
            ? {
                ...c,
                lastMessage: {
                  text: previewText,
                  time: "Just now",
                  status: "delivered",
                  isSentByMe: true,
                  contentType,
                },
              }
            : c
        ),
      }
    }),

  votePoll: (messageId, optionId) =>
    set((state) => {
      const activeId = state.activeContactId
      const chatList = state.allMessages[activeId] ?? []

      return {
        allMessages: {
          ...state.allMessages,
          [activeId]: chatList.map((m) => {
            if (m.id !== messageId || !m.attachment?.poll) return m
            const poll = m.attachment.poll
            const allowMultiple = Boolean(poll.allowMultiple)

            const updatedOptions = poll.options.map((opt) => {
              const hasVoted = opt.votes.includes("curr_user")

              if (opt.id === optionId) {
                return {
                  ...opt,
                  votes: hasVoted
                    ? opt.votes.filter((u) => u !== "curr_user")
                    : [...opt.votes, "curr_user"],
                }
              } else if (!allowMultiple && hasVoted) {
                return {
                  ...opt,
                  votes: opt.votes.filter((u) => u !== "curr_user"),
                }
              }
              return opt
            })

            return {
              ...m,
              attachment: {
                ...m.attachment,
                poll: {
                  ...poll,
                  options: updatedOptions,
                },
              },
            }
          }),
        },
      }
    }),

  toggleReaction: (messageId, emoji) =>
    set((state) => {
      const activeId = state.activeContactId
      const chatList = state.allMessages[activeId] ?? []

      const updatedList = chatList.map((msg) => {
        if (msg.id !== messageId) return msg

        const reactions = [...(msg.reactions ?? [])]
        const existingIdx = reactions.findIndex((r) => r.emoji === emoji)

        if (existingIdx >= 0) {
          const current = reactions[existingIdx]
          if (current.hasReacted) {
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
            reactions[existingIdx] = {
              ...current,
              count: current.count + 1,
              hasReacted: true,
            }
          }
        } else {
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
        allMessages: {
          ...state.allMessages,
          [activeId]: updatedList,
        },
      }
    }),

  forwardMessage: (targetChatIds, messageToForward) =>
    set((state) => {
      const timeNow = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
        .format(new Date())
        .toLowerCase()

      const nextMessages = { ...state.allMessages }

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
          reactions: [],
        }

        nextMessages[chatId] = [...(nextMessages[chatId] ?? []), forwardedMsg]
      })

      return { allMessages: nextMessages }
    }),

  toggleStar: (messageId) =>
    set((state) => {
      const activeId = state.activeContactId
      const currentList = state.allMessages[activeId] ?? []

      return {
        allMessages: {
          ...state.allMessages,
          [activeId]: currentList.map((m) =>
            m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
          ),
        },
      }
    }),

  togglePin: (messageId) =>
    set((state) => {
      const activeId = state.activeContactId
      const currentList = state.allMessages[activeId] ?? []

      return {
        allMessages: {
          ...state.allMessages,
          [activeId]: currentList.map((m) =>
            m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
          ),
        },
      }
    }),

  deleteMessage: (messageId) =>
    set((state) => {
      const activeId = state.activeContactId
      const currentList = state.allMessages[activeId] ?? []

      return {
        allMessages: {
          ...state.allMessages,
          [activeId]: currentList.filter((m) => m.id !== messageId),
        },
      }
    }),

  clearMessages: (targetId) =>
    set((state) => {
      const contactId = targetId ?? state.activeContactId
      return {
        allMessages: {
          ...state.allMessages,
          [contactId]: [],
        },
        contacts: state.contacts.map((c) =>
          c.id === contactId
            ? {
                ...c,
                lastMessage: {
                  text: "No messages yet",
                  time: "Just now",
                  status: undefined,
                  isSentByMe: false,
                },
                unreadCount: 0,
              }
            : c
        ),
      }
    }),

  updateCurrentUser: (updates) =>
    set((state) => ({
      currentUser: { ...state.currentUser, ...updates },
    })),

  setEnterIsSend: (value) =>
    set((state) => ({
      enterIsSend: typeof value === "function" ? value(state.enterIsSend) : value,
    })),
}))

// High-level convenient selectors
export const useActiveContact = () => {
  return useChatStore((state) => {
    return state.contacts.find((c) => c.id === state.activeContactId) ?? state.contacts[0]
  })
}

export const useActiveMessages = () => {
  return useChatStore((state) => state.allMessages[state.activeContactId] ?? [])
}
