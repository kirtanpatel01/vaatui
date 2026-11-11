import { type ChatMessage } from "../mock-messages"

export const chat14Messages: ChatMessage[] = [
  {
    id: "cm_1",
    chatId: "chat_14",
    senderId: "chat_14",
    senderName: "Chirag Makwana",
    text: "Bhai highway par chu, petrol pump nathi dekhata aaju baju.",
    timestamp: "2:10 pm",
    date: "15/09/25",
    isSentByMe: false,
  },
  {
    id: "cm_2",
    chatId: "chat_14",
    senderId: "curr_user",
    senderName: "Kirtan Patel",
    text: "Bhai location share kar",
    timestamp: "2:15 pm",
    date: "15/09/25",
    isSentByMe: true,
    status: "failed",
    reactions: [{ emoji: "⚠️", count: 1 }],
  },
]

