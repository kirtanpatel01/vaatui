import { type MessageContentType, type MessageDeliveryStatus } from "./mock-contacts"
import { CONVERSATIONS } from "./conversations"

export interface MessageReaction {
  emoji: string
  count: number
  hasReacted?: boolean
}

export interface PollOption {
  id: string
  text: string
  votes: string[] // user names or user IDs
}

export interface PollData {
  question: string
  options: PollOption[]
  allowMultiple?: boolean
}

export interface SharedContactData {
  name: string
  phone?: string
  avatar?: string
}

export interface LinkPreviewData {
  url: string
  title?: string
  description?: string
  image?: string
  domain?: string
}

export interface MessageAttachment {
  type: MessageContentType
  url?: string
  fileName?: string
  fileSize?: string
  thumbnailUrl?: string
  duration?: string
  waveform?: number[]
  poll?: PollData
  contact?: SharedContactData
  link?: LinkPreviewData
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
  isForwarded?: boolean
}

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = CONVERSATIONS

export * from "./conversations"

export const URL_REGEX = /(https?:\/\/[^\s<>"'()]+|www\.[^\s<>"'()]+)/gi

export function extractUrls(text?: string): string[] {
  if (!text) return []
  const matches = text.match(URL_REGEX)
  return matches ? Array.from(new Set(matches)) : []
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?([^/]+).*/, "$1")
  }
}

