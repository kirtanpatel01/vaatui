import { type MessageContentType, type MessageDeliveryStatus } from "./mock-contacts"
import { CONVERSATIONS } from "./conversations"

export interface MessageReaction {
  emoji: string
  count: number
  hasReacted?: boolean
}

export interface MessageAttachment {
  type: MessageContentType
  url?: string
  fileName?: string
  fileSize?: string
  thumbnailUrl?: string
  duration?: string
  waveform?: number[]
}

export interface MessageReply {
  id: string
  senderName: string
  text: string
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  text?: string
  timestamp: string // e.g. "3:14 pm"
  date: string // e.g. "Yesterday", "Today"
  isSentByMe: boolean
  status?: MessageDeliveryStatus
  attachment?: MessageAttachment
  replyTo?: MessageReply
  reactions?: MessageReaction[]
  isStarred?: boolean
  isPinned?: boolean
}

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = CONVERSATIONS

export * from "./conversations"
