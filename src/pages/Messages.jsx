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
    error,
    fetchMessages,
    uploadFile,
  } = useChat('direct');

  const userId = 2; // or fetch from localStorage, etc.

  // Handler for incoming messages (via WebSocket)
  const handleIncomingMessage = (newMsg) => {
    // Possibly filter if newMsg.sender === currentChat.id or newMsg.receiverId === userId
    console.log("New direct message:", newMsg);
  };

  // WebSocket for real-time
  const { sendMessage: sendWebSocketMessage } = useWebSocket(userId, handleIncomingMessage);

  const [showProfile, setShowProfile] = useState(false);

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    fetchMessages(chat.id);
    setShowProfile(false);
  };

  const handleSendMessage = (content) => {
    if (!currentChat) return;
    // Only WebSocket for sending text
    sendWebSocketMessage({
      type: "direct_message",
      sender: userId,
      receiver: currentChat.id,
      content,
    });
  };

  const handleFileUpload = async (file) => {
    try {
      await uploadFile(file); // HTTP route for file upload
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
