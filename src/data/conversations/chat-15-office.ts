import { type ChatMessage } from "../mock-messages"

export const chat15Messages: ChatMessage[] = [
  {
    id: "oc_1",
    chatId: "chat_15",
    senderId: "u_amit",
    senderName: "Amit Shah",
    text: "Team, sprint review session was scheduled for Monday 10:00 AM.",
    timestamp: "3:00 pm",
    date: "Thursday",
    isSentByMe: false,
  },
  {
    id: "oc_2",
    chatId: "chat_15",
    senderId: "u_pooja",
    senderName: "Pooja Trivedi",
    text: "Monday meeting postponed che. New time will be shared tomorrow morning.",
    timestamp: "3:30 pm",
    date: "Thursday",
    isSentByMe: false,
    reactions: [{ emoji: "👍", count: 5 }],
  },
  {
    id: "oc_3",
    chatId: "chat_15",
    senderId: "curr_user",
    senderName: "Kirtan Patel",
    text: "Noted! We will finish pending code reviews meanwhile.",
    timestamp: "3:45 pm",
    date: "Thursday",
    isSentByMe: true,
    status: "read",
  },
]

