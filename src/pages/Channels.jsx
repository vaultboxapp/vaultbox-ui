import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useWebSocket } from '../hooks/useWebSocket';
import ChatList from '../components/chat/ChatList';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import ChannelInfo from '../components/chat/ChannelInfo';

const Channels = () => {
  const {
    chats: channels,
    currentChat: currentChannel,
    setCurrentChat: setCurrentChannel,
    messages,
    error,
    fetchMessages,
    uploadFile,
  } = useChat('channel');

  const userId = 1; // Replace with your actual user ID retrieval
  const handleIncomingMessage = (newMsg) => {
    // Process the incoming message as needed (e.g., update local state)
    console.log("New channel message:", newMsg);
  };

  const { sendMessage: sendWebSocketMessage } = useWebSocket(userId, handleIncomingMessage);
  const [showChannelInfo, setShowChannelInfo] = useState(false);

  const handleChannelSelect = (channel) => {
    setCurrentChannel(channel);
    fetchMessages(channel.id);
    setShowChannelInfo(false);
  };

  const handleSendMessage = (content) => {
    if (!currentChannel) return;
    // Use only WebSocket for sending text messages
    sendWebSocketMessage({
      type: "channel_message",
      channelId: currentChannel.id,
      sender: userId,
      content,
    });
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
        currentChat={currentChannel}
        onChatSelect={handleChannelSelect}
        chatType="channel"
      />
      <div className="flex-1 flex flex-col">
        {currentChannel && (
          <>
            <ChatHeader
              chat={currentChannel}
              chatType="channel"
              onInfoClick={() => setShowChannelInfo(!showChannelInfo)}
            />
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <MessageList messages={messages} />
                <MessageInput onSendMessage={handleSendMessage} onFileUpload={handleFileUpload} />
              </div>
              {showChannelInfo && (
                <div className="w-80 border-l">
                  <ChannelInfo channel={currentChannel} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Channels;
