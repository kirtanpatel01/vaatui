import { type ChatMessage } from "../mock-messages"

export const chat13Messages: ChatMessage[] = [
  {
    id: "rv_1",
    chatId: "chat_13",
    senderId: "curr_user",
    senderName: "Kirtan Patel",
    text: "Riddhi, design sprint na notes share karje jyare time male.",
    timestamp: "4:00 pm",
    date: "24/10/26",
    isSentByMe: true,
    status: "read",
  },
  {
    id: "rv_2",
    chatId: "chat_13",
    senderId: "chat_13",
    senderName: "Riddhi Vyas",
    text: "Audio message (0:24)",
    timestamp: "4:15 pm",
    date: "24/10/26",
    isSentByMe: false,
    attachment: {
      type: "audio",
      duration: "0:24",
      waveform: [15, 40, 65, 85, 90, 75, 45, 60, 80, 50, 30, 70, 85, 40, 20],
    },
    reactions: [{ emoji: "🎙️", count: 1 }],
  },
]

