import { type ChatMessage } from "../mock-messages"

export const chat7Messages: ChatMessage[] = [
  // --- 28 Oct 2026 ---
  {
    id: "ann_101",
    chatId: "chat_7",
    senderId: "u_system",
    senderName: "VaatUI Bot",
    text: "👋 Welcome to the VaatUI Announcement Channel!\nHere you'll find the latest updates, design system upgrades, and release highlights.",
    timestamp: "10:00 am",
    date: "28 Oct 2026",
    isSentByMe: false,
    reactions: [{ emoji: "👋", count: 24 }],
  },
  {
    id: "ann_102",
    chatId: "chat_7",
    senderId: "u_system",
    senderName: "VaatUI Bot",
    text: "📦 Alpha Release v0.1.0 is published.\n\nKey features:\n• Core layout components (Sidebar, Chat Feed, Chat Header, Footer Input)\n• Base theme tokens & dark mode primitives\n• Tab navigation (All, Unread, Favorites, Groups)",
    timestamp: "10:30 am",
    date: "28 Oct 2026",
    isSentByMe: false,
    reactions: [{ emoji: "🎉", count: 18 }, { emoji: "🚀", count: 12 }],
  },

  // --- 1 Nov 2026 ---
  {
    id: "ann_1",
    chatId: "chat_7",
    senderId: "u_system",
    senderName: "VaatUI Bot",
    text: "🎉 Welcome to VaatUI! Explore modern chat components designed with shadcn/ui and Tailwind CSS.",
    timestamp: "10:00 am",
    date: "1 Nov 2026",
    isSentByMe: false,
    reactions: [{ emoji: "🎉", count: 12 }],
  },
  {
    id: "ann_103",
    chatId: "chat_7",
    senderId: "u_system",
    senderName: "VaatUI Bot",
    text: "⚡ Release v0.2.0: Interactive Popovers & Delivery Statuses\n\nAdded:\n- Clock icon for pending messages\n- Single & Double gray ticks for sent/delivered\n- Double blue ticks for read receipts\n- Error badge with retry action for failed sends",
    timestamp: "3:45 pm",
    date: "1 Nov 2026",
    isSentByMe: false,
    reactions: [{ emoji: "✅", count: 15 }, { emoji: "🔥", count: 8 }],
  },

  // --- 5 Nov 2026 ---
  {
    id: "ann_104",
    chatId: "chat_7",
    senderId: "u_system",
    senderName: "VaatUI Bot",
    text: "🎨 Design Token Update:\nNeutral colors have been recalibrated for improved WCAG AA accessibility contrast ratios in dark and light modes.",
    timestamp: "11:20 am",
    date: "5 Nov 2026",
    isSentByMe: false,
    reactions: [{ emoji: "🎨", count: 14 }],
  },

  // --- Monday ---
  {
    id: "ann_2",
    chatId: "chat_7",
    senderId: "u_system",
    senderName: "VaatUI Bot",
    text: "📢 Release v0.4.0 is out!\n- Added interactive reaction pills\n- Message bubble tails & grouping\n- Improved audio voice note player\n- Floating quick actions bar",
    timestamp: "2:00 pm",
    date: "Monday",
    isSentByMe: false,
    reactions: [{ emoji: "🚀", count: 28 }, { emoji: "❤️", count: 19 }],
  },
  {
    id: "ann_3",
    chatId: "chat_7",
    senderId: "u_system",
    senderName: "VaatUI Bot",
    text: "New component release is live! Check documentation at vaatui.dev for integration guide.",
    timestamp: "4:15 pm",
    date: "Monday",
    isSentByMe: false,
    reactions: [{ emoji: "📚", count: 11 }],
  },

  // --- Today ---
  {
    id: "ann_105",
    chatId: "chat_7",
    senderId: "u_system",
    senderName: "VaatUI Bot",
    text: "💡 Tip of the day: You can now press 'Esc' to close any open message reaction popover or quick action menu.",
    timestamp: "10:00 am",
    date: "Today",
    isSentByMe: false,
    reactions: [{ emoji: "💡", count: 22 }],
  },
]
