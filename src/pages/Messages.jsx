import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useWebSocket } from '../hooks/useWebSocket';
import ChatList from '../components/chat/ChatList';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import UserProfile from '../components/chat/UserProfile';

const Messages = () => {
  const {
    chats,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    error,
    fetchMessages,
    uploadFile,
  } = useChat('direct');

  const userId = "1"; // Ensure type matches your API
  const handleIncomingMessage = (newMsg) => {
    console.log("New direct message:", newMsg);
    setMessages(prev => [...prev, newMsg]);
  };

  const { sendMessage: sendWebSocketMessage } = useWebSocket(userId, handleIncomingMessage);
  const [showProfile, setShowProfile] = useState(false);

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    // Clear previous messages when switching chats
    setMessages([]);
    fetchMessages(chat._id);
    setShowProfile(false);
  };

  const handleSendMessage = (content) => {
    if (!currentChat) return;
    const messagePayload = {
      type: "direct_message",
      senderId: userId,
      receiverId: currentChat._id,
      content, // Use "content" to be consistent
      createdAt: new Date().toISOString(),
    };
    sendWebSocketMessage(messagePayload);
    setMessages(prev => [...prev, messagePayload]);
  };

  const handleFileUpload = async (file) => {
    try {
      await uploadFile(file);
    } catch (err) {
      console.error("File upload error:", err);
    }
  };

  if (error) return <div>Error: {error}</div>;
  
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
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onFileUpload={handleFileUpload}
                />
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
