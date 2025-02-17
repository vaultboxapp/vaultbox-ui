import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useWebSocket } from '../hooks/useWebSocket';
import ChatList from '../components/chat/ChatList';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import UserProfile from '../components/chat/UserProfile';
import ChatService from '../services/chatService';

const Messages = () => {
  const {
    chats,
    currentChat,
    setCurrentChat,
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
  } = useChat('direct');

  const [showProfile, setShowProfile] = useState(false);

  const handleWebSocketMessage = (data) => {
    // Handle real-time updates here
  };

  const { sendMessage: sendWebSocketMessage } = useWebSocket('wss://your-websocket-url', handleWebSocketMessage);

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    fetchMessages(chat.id);
    setShowProfile(false);
  };

  const handleSendMessage = async (content) => {
    await sendMessage(content);
    sendWebSocketMessage({ type: 'new_message', chatId: currentChat.id, content });
  };

  const handleFileUpload = async (file) => {
    try {
      const uploadedFile = await ChatService.uploadFile(currentChat.id, file);
      // Handle the uploaded file (e.g., add it to the messages)
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen">
      <ChatList
        chats={chats}
        currentChat={currentChat}
        onChatSelect={handleChatSelect}
        chatType="direct"
      />
      <div className="flex-1 flex flex-col">
        {currentChat && (
          <>
            <ChatHeader
              chat={currentChat}
              chatType="direct"
              onInfoClick={() => setShowProfile(!showProfile)}
            />
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <MessageList messages={messages} />
                <MessageInput onSendMessage={handleSendMessage} onFileUpload={handleFileUpload} />
              </div>
              {showProfile && (
                <div className="w-80 border-l">
                  <UserProfile user={currentChat} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;