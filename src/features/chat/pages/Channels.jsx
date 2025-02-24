import React, { useState, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import { useWebSocket } from '../hooks/useWebSocket';
import ChatList from '../components/ChatList';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import ChannelInfo from '../components/ChannelInfo';
import { useAuth } from '@login/context/auth';

const Channels = () => {
  const {
    chats: channels,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    error,
    fetchMessages,
    uploadFile,
  } = useChat('channel');

  const user = useAuth;
  const userId = user?.id;

  const [showChannelInfo, setShowChannelInfo] = useState(false);

  // Memoize group message handler so it doesn't trigger unnecessary re-renders.
  const handleGrpMessage = useCallback((newMsg) => {
    console.log("New group message received:", newMsg);
    if (currentChat && newMsg.channelId === currentChat._id) {
      setMessages(prev => [...prev, newMsg]);
    }
  }, [currentChat]);

  // Use our WebSocket hook with the stable group message callback.
  const { sendMessage } = useWebSocket(userId, handleGrpMessage);

  const handleChannelSelect = (channel) => {
    console.log("Channel selected:", channel);
    setCurrentChat(channel);
    setMessages([]); // Clear previous messages on switching channels
    fetchMessages(channel);
    setShowChannelInfo(false);
  };

  const handleSendMessage = (content) => {
    if (!currentChat) return;
    const messagePayload = {
      type: "channel_message",
      channelId: currentChat._id,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
    };
    sendMessage(messagePayload);
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
        chats={channels}
        currentChat={currentChat}
        onChatSelect={handleChannelSelect}
        chatType="channel"
      />
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <ChatHeader
              chat={currentChat}
              chatType="channel"
              onInfoClick={() => setShowChannelInfo(!showChannelInfo)}
            />
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <MessageList messages={messages} />
                <MessageInput 
                  onSendMessage={handleSendMessage} 
                  onFileUpload={handleFileUpload} 
                />
              </div>
              {showChannelInfo && (
                <div className="w-80 border-l">
                  <ChannelInfo channel={currentChat} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p>Select a channel to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channels;
