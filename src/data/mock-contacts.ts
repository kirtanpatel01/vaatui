export type ChatType = "direct" | "group" | "announcement"

export type MessageDeliveryStatus =
  | "sending" // clock icon
  | "sent" // single gray tick
  | "delivered" // double gray tick
  | "read" // double blue tick
  | "failed" // red alert / error icon

export type MessageContentType =
  | "text"
  | "photo"
  | "video"
  | "audio"
  | "file"
  | "location"
  | "contact"
  | "poll"
  | "link"

export interface ChatMessagePreview {
  text: string
  time: string
  contentType?: MessageContentType
  status?: MessageDeliveryStatus
  isSentByMe?: boolean
  isTyping?: boolean
  isDraft?: boolean
  authorPrefix?: string
  emoji?: string
}

export interface GroupMember {
  id: string
  name: string
  role?: "admin" | "member"
  avatar?: string
  phone?: string
  isOnline?: boolean
}

export interface UserProfile {
  id: string
  name: string
  phone?: string
  avatar?: string
  type: ChatType
  lastMessage: ChatMessagePreview
  isOnline?: boolean
  isMuted?: boolean
  isPinned?: boolean
  unreadCount?: number
  hasMention?: boolean
  tabs: string[] // which tab IDs this conversation belongs to (e.g. 'all', 'unread', 'favorites', etc.)
  members?: GroupMember[] // List of members if group
  bio?: string
  username?: string
  email?: string
  description?: string
  createdAt?: string
  createdBy?: string
}

export const CURRENT_USER: UserProfile = {
  id: "curr_user",
  name: "Kirtan Patel",
  phone: "+91 98765 43210",
  type: "direct",
  isOnline: true,
  lastMessage: {
    text: "Available",
    time: "Now",
    status: "read",
  },
  tabs: ["all"],
}

export const MOCK_CONTACTS: UserProfile[] = [
  {
    id: "chat_1",
    name: "Mohit Parmar",
    type: "direct",
    phone: "+91 98250 12345",
    username: "@mohit_p",
    bio: "Frontend engineer & UI enthusiast. Coffee lover ☕",
    isPinned: true,
    lastMessage: {
      text: "bhai kalno su scene che ?",
      time: "3:14 pm",
      isSentByMe: true,
      status: "delivered", // double tick
    },
    tabs: ["all", "favorites"],
  },
  {
    id: "chat_2",
    name: "Shreya Solanki",
    type: "direct",
    phone: "+91 97234 56789",
    username: "@shreya_solanki",
    bio: "Designing interfaces, playing badminton 🏸 and exploring cafes.",
    isOnline: true,
    isPinned: true,
    lastMessage: {
      text: "Typing...",
      time: "3:14 pm",
      isTyping: true,
    },
    tabs: ["all", "favorites"],
  },
  {
    id: "chat_3",
    name: "Nishant Patel",
    type: "direct",
    phone: "+91 98981 23456",
    username: "@nishant_p",
    bio: "Full-stack developer | React & Rust 🦀",
    lastMessage: {
      text: "Han maliye pachi",
      time: "3:14 pm",
      status: "read", // double blue tick
      isSentByMe: true,
    },
    tabs: ["all"],
  },
  {
    id: "chat_4",
    name: "Design Team",
    type: "group",
    description: "Official workspace for product design syncs, component specs, Figma prototypes, and design system reviews.",
    createdAt: "15 Oct 2026",
    createdBy: "Mohit Parmar",
    unreadCount: 4,
    hasMention: true,
    lastMessage: {
      text: "Pushed the new changes",
      time: "Yesterday",
      authorPrefix: "Mohit: ",
    },
    tabs: ["all", "groups", "unread"],
    members: [
      { id: "mem_1", name: "Mohit Parmar", role: "admin", isOnline: true },
      { id: "mem_2", name: "Shreya Solanki", role: "member", isOnline: true },
      { id: "mem_3", name: "Nishant Patel", role: "member" },
      { id: "mem_4", name: "Hardik Joshi", role: "member", isOnline: true },
      { id: "mem_5", name: "Pooja Trivedi", role: "member" },
    ],
  },
  {
    id: "chat_5",
    name: "College Friends",
    type: "group",
    description: "Batch of 2024 reunion plans, weekend trips, and daily memes! 🎉",
    createdAt: "10 Aug 2024",
    createdBy: "Shreya Solanki",
    isMuted: true,
    unreadCount: 12,
    lastMessage: {
      text: "Let's plan for this weekend!",
      time: "Yesterday",
      authorPrefix: "Shreya: ",
    },
    tabs: ["all", "groups"],
    members: [
      { id: "mem_2", name: "Shreya Solanki", role: "admin", isOnline: true },
      { id: "mem_1", name: "Mohit Parmar", role: "member", isOnline: true },
      { id: "mem_4", name: "Hardik Joshi", role: "member", isOnline: true },
      { id: "mem_6", name: "Aniket Shah", role: "member" },
    ],
  },
  {
    id: "chat_6",
    name: "Family",
    type: "group",
    description: "Family group for news, photos, and festival celebrations ❤️",
    createdAt: "01 Jan 2020",
    createdBy: "Papa",
    lastMessage: {
      text: "Photo",
      time: "Mon",
      contentType: "photo",
    },
    tabs: ["all", "groups"],
    members: [
      { id: "mem_7", name: "Papa", role: "admin" },
      { id: "mem_8", name: "Mummy", role: "member" },
      { id: "mem_9", name: "Dharmesh Vaghela", role: "member" },
    ],
  },
  {
    id: "chat_7",
    name: "Announcements",
    type: "announcement",
    description: "Official product release notes, design updates, and company announcements. Broadcast only channel.",
    createdAt: "01 Jan 2026",
    createdBy: "VaatUI Team",
    lastMessage: {
      text: "New component release is live!",
      time: "Mon",
      emoji: "📢",
    },
    tabs: ["all", "archived"],
  },
  {
    id: "chat_8",
    name: "Hardik Joshi",
    type: "direct",
    phone: "+91 99090 98765",
    username: "@hardik_j",
    bio: "Building cool tech @ DAIICT | AI/ML & Web3 enthusiast",
    isOnline: true,
    unreadCount: 2,
    lastMessage: {
      text: "Bhai assignment patyu ke baki che?",
      time: "1:45 pm",
    },
    tabs: ["all", "unread"],
  },
  {
    id: "chat_9",
    name: "Pooja Trivedi",
    type: "direct",
    phone: "+91 98790 11223",
    username: "@pooja_t",
    bio: "QA Lead & Automation Specialist | Reading books 📚",
    lastMessage: {
      text: "Aa file check kari leje ek vaar",
      time: "12:20 pm",
      contentType: "file",
    },
    tabs: ["all", "favorites"],
  },
  {
    id: "chat_10",
    name: "Aniket Shah",
    type: "direct",
    lastMessage: {
      text: "Aaje sanje chai piva aavish ?",
      time: "11:15 am",
      isSentByMe: true,
      status: "sent", // single tick
    },
    tabs: ["all"],
  },
  {
    id: "chat_11",
    name: "Dharmesh Vaghela",
    type: "direct",
    lastMessage: {
      text: "Call kar mane jyare free thay tyre",
      time: "10:02 am",
      isDraft: true, // draft
    },
    tabs: ["all"],
  },
  {
    id: "chat_12",
    name: "Garba Mandal 2026",
    type: "group",
    isMuted: true,
    lastMessage: {
      text: "Passes aavi gaya che badhana!",
      time: "Sunday",
      authorPrefix: "Hardik: ",
    },
    tabs: ["all", "groups"],
  },
  {
    id: "chat_13",
    name: "Riddhi Vyas",
    type: "direct",
    lastMessage: {
      text: "Audio message (0:24)",
      time: "24/10/26", // Specific date older than a week
      contentType: "audio",
    },
    tabs: ["all", "archived"],
  },
  {
    id: "chat_14",
    name: "Chirag Makwana",
    type: "direct",
    lastMessage: {
      text: "Bhai location share kar",
      time: "15/09/25", // Different year date
      isSentByMe: true,
      status: "failed", // failed to send
    },
    tabs: ["all"],
  },
  {
    id: "chat_15",
    name: "Office Colleagues",
    type: "group",
    lastMessage: {
      text: "Monday meeting postponed che",
      time: "Thursday",
      authorPrefix: "Pooja: ",
    },
    tabs: ["all", "groups"],
  },
]
