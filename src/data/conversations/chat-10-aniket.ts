import { type ChatMessage } from "../mock-messages"

export const chat10Messages: ChatMessage[] = [
  {
    id: "as_1",
    chatId: "chat_10",
    senderId: "chat_10",
    senderName: "Aniket Shah",
    text: "Bhai weekend par tennis ramiye?",
    timestamp: "10:30 am",
    date: "Today",
    isSentByMe: false,
  },
  {
    id: "as_2",
    chatId: "chat_10",
    senderId: "curr_user",
    senderName: "Kirtan Patel",
    text: "Court book thayi shake em che? Last time slot nahoto malyo.",
    timestamp: "10:45 am",
    date: "Today",
    isSentByMe: true,
    status: "read",
  },
  {
    id: "as_3",
    chatId: "chat_10",
    senderId: "chat_10",
    senderName: "Aniket Shah",
    text: "Ha mane subah 7 AM no slot mali jase club ma.",
    timestamp: "11:00 am",
    date: "Today",
    isSentByMe: false,
    reactions: [{ emoji: "🎾", count: 2 }],
  },
  {
    id: "as_4",
    chatId: "chat_10",
    senderId: "curr_user",
    senderName: "Kirtan Patel",
    text: "Aaje sanje chai piva aavish ?",
    timestamp: "11:15 am",
    date: "Today",
    isSentByMe: true,
    status: "sent",
  },
]

