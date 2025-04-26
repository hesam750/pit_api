'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage } from '@/types/chat';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function ChatInterface() {
  const {
    conversations,
    currentConversation,
    messages,
    participants,
    sendMessage,
    markAsRead,
    startConversation,
    loadMoreMessages,
  } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    await sendMessage(newMessage, selectedFile || undefined);
    setNewMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isOwnMessage = message.senderId === user?.id;
    const sender = participants[message.senderId];

    return (
      <div
        key={`message-${message.id}`}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {!isOwnMessage && (
            <div className="font-semibold mb-1">{sender?.name}</div>
          )}
          {message.content && <div className="mb-2">{message.content}</div>}
          {message.fileUrl && (
            <div className="mb-2">
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {message.fileName || 'Download file'}
              </a>
            </div>
          )}
          <div className="text-xs opacity-70">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Conversations</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {conversations.map((conversation) => {
            const otherParticipantId = conversation.participants.find(
              (id) => id !== user?.id
            );
            const participant = otherParticipantId
              ? participants[otherParticipantId]
              : null;

            return (
              <div
                key={`conversation-${conversation.id}`}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  currentConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => startConversation(otherParticipantId!)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <Image
                      src={participant?.avatar || '/default-avatar.png'}
                      alt={participant?.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    {participant?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold">{participant?.name}</div>
                    <div className="text-sm text-gray-500">
                      {conversation.lastMessage?.content}
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="ml-auto bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="relative">
                  <Image
                    src={
                      participants[
                        currentConversation.participants.find(
                          (id) => id !== user?.id
                        )!
                      ]?.avatar || '/default-avatar.png'
                    }
                    alt="Participant"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  {participants[
                    currentConversation.participants.find(
                      (id) => id !== user?.id
                    )!
                  ]?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="ml-3">
                  <div className="font-semibold">
                    {
                      participants[
                        currentConversation.participants.find(
                          (id) => id !== user?.id
                        )!
                      ]?.name
                    }
                  </div>
                  <div className="text-sm text-gray-500">
                    {participants[
                      currentConversation.participants.find(
                        (id) => id !== user?.id
                      )!
                    ]?.isOnline
                      ? 'Online'
                      : 'Offline'}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <button
                key="load-more-button"
                onClick={loadMoreMessages}
                className="text-blue-500 hover:underline mb-4"
              >
                Load more messages
              </button>
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="ml-4 p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
                <button
                  type="submit"
                  className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </div>
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-500">
                  Selected file: {selectedFile.name}
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
} 