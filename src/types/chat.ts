export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  createdAt: Date;
  updatedAt: Date;
  readBy: string[]; // Array of user IDs who have read the message
}

export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  lastMessage?: ChatMessage;
  createdAt: Date;
  updatedAt: Date;
  unreadCount: number;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface ChatNotification {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
  type: 'new_message' | 'file_shared' | 'message_read';
  read: boolean;
  createdAt: Date;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: ChatMessage[];
  participants: Record<string, ChatParticipant>;
  loading: boolean;
  error: string | null;
} 