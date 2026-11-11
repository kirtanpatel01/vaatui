import { type MessageContentType, type MessageDeliveryStatus } from "./mock-contacts"

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

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  // chat_2: Shreya Solanki (Exact replica of the provided reference design)
  chat_2: [
    {
      id: "shreya_1",
      chatId: "chat_2",
      senderId: "chat_2",
      senderName: "Shreya Solanki",
      text: "Avwano tu ?",
      timestamp: "3:14 pm",
      date: "Yesterday",
      isSentByMe: false,
      reactions: [{ emoji: "❤️", count: 1 }],
    },
    {
      id: "shreya_2",
      chatId: "chat_2",
      senderId: "curr_user",
      senderName: "Kirtan Patel",
      text: "Na yarr bov busy chu me kalna divas mate",
      timestamp: "3:14 pm",
      date: "Yesterday",
      isSentByMe: true,
      status: "delivered", // double tick
    },
    {
      id: "shreya_3",
      chatId: "chat_2",
      senderId: "chat_2",
      senderName: "Shreya Solanki",
      text: "Thik che toh kyare free thayish ?",
      timestamp: "3:14 pm",
      date: "Yesterday",
      isSentByMe: false,
    },
    {
      id: "shreya_4",
      chatId: "chat_2",
      senderId: "curr_user",
      senderName: "Kirtan Patel",
      text: "Jov ave chalne. call karish me etoh, bye.",
      timestamp: "3:14 pm",
      date: "Yesterday",
      isSentByMe: true,
      status: "delivered",
      replyTo: {
        id: "shreya_3",
        senderName: "Shreya Solanki",
        text: "Thik che toh kyare free thayish ?",
      },
      reactions: [{ emoji: "👍", count: 1 }],
    },
    {
      id: "shreya_5",
      chatId: "chat_2",
      senderId: "chat_2",
      senderName: "Shreya Solanki",
      timestamp: "5:20 pm",
      date: "Yesterday",
      isSentByMe: false,
      attachment: {
        type: "audio",
        duration: "0:24",
      },
    },
    {
      id: "shreya_6",
      chatId: "chat_2",
      senderId: "chat_2",
      senderName: "Shreya Solanki",
      timestamp: "9:12 am",
      date: "Today",
      isSentByMe: false,
      attachment: {
        type: "photo",
        fileName: "mountains.jpg",
        fileSize: "2.4 MB",
        thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
      },
    },
    {
      id: "shreya_7",
      chatId: "chat_2",
      senderId: "curr_user",
      senderName: "Kirtan Patel",
      text: "Wow! 🔥",
      timestamp: "9:15 am",
      date: "Today",
      isSentByMe: true,
      status: "delivered",
    },
  ],

  // chat_1: Mohit Parmar
  chat_1: [
    {
      id: "m_1_1",
      chatId: "chat_1",
      senderId: "chat_1",
      senderName: "Mohit Parmar",
      text: "Kem che Kirtan! Aaje sandhye su plan che?",
      timestamp: "10:00 am",
      date: "Today",
      isSentByMe: false,
    },
    {
      id: "m_1_2",
      chatId: "chat_1",
      senderId: "curr_user",
      senderName: "Kirtan Patel",
      text: "Maja ma bhai! Thodu kaam che project nu, baki aaje sanje free thais.",
      timestamp: "10:02 am",
      date: "Today",
      isSentByMe: true,
      status: "read",
    },
    {
      id: "m_1_3",
      chatId: "chat_1",
      senderId: "chat_1",
      senderName: "Mohit Parmar",
      text: "Saru, to apde tea stall par maliye 5:30 vage? Hardik ne pan bolavyo che.",
      timestamp: "10:05 am",
      date: "Today",
      isSentByMe: false,
    },
    {
      id: "m_1_4",
      chatId: "chat_1",
      senderId: "curr_user",
      senderName: "Kirtan Patel",
      text: "bhai kalno su scene che ?",
      timestamp: "3:14 pm",
      date: "Today",
      isSentByMe: true,
      status: "delivered",
    },
  ],
}
