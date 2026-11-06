import * as React from 'react'
import { cn } from 'cn'

interface ChatContextValue {
  chatDetailsOpen: boolean
  setChatDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatContext = React.createContext<ChatContextValue | null>(null)

interface ChatProviderProps {
  children: React.ReactNode
  className?: string
  defaultChatDetailsOpen?: boolean
}

export function ChatProvider({
  children,
  className,
  defaultChatDetailsOpen = false,
}: ChatProviderProps) {
  const [chatDetailsOpen, setChatDetailsOpen] = React.useState(defaultChatDetailsOpen)

  return (
    <ChatContext.Provider value={{ chatDetailsOpen, setChatDetailsOpen }}>
      <div className={cn(className, "w-full flex")}>{children}</div>
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = React.useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export default ChatProvider