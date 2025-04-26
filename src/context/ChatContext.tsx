'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { authenticatedApi } from '@/utils/api'
import { config } from '@/config'
import { useNotifications } from './NotificationsContext'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
}

interface Chat {
  id: string
  participant: {
    id: string
    name: string
    avatar?: string
  }
  lastMessage?: Message
  unreadCount: number
}

interface ChatContextType {
  chats: Chat[]
  currentChat: Chat | null
  messages: Message[]
  isLoading: boolean
  getChats: () => Promise<void>
  getMessages: (chatId: string) => Promise<void>
  sendMessage: (chatId: string, content: string) => Promise<void>
  setCurrentChat: (chat: Chat | null) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { addNotification } = useNotifications()

  const getChats = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data } = await authenticatedApi<{ chats: Chat[] }>(
        config.api.endpoints.chat.list,
        token
      )
      setChats(data.chats)
    } catch (error) {
      addNotification('error', 'Failed to fetch chats')
    } finally {
      setIsLoading(false)
    }
  }

  const getMessages = async (chatId: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data } = await authenticatedApi<{ messages: Message[] }>(
        `${config.api.endpoints.chat.messages}/${chatId}`,
        token
      )
      setMessages(data.messages)
    } catch (error) {
      addNotification('error', 'Failed to fetch messages')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (chatId: string, content: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data } = await authenticatedApi<{ message: Message }>(
        config.api.endpoints.chat.send,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ chatId, content }),
        }
      )

      setMessages((prev) => [...prev, data.message])
      await getChats() // Refresh chat list to update last message
    } catch (error) {
      addNotification('error', 'Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getChats()
  }, [])

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        isLoading,
        getChats,
        getMessages,
        sendMessage,
        setCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
} 