import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useWebSocket } from '../hooks/useWebSocket';
import ChatList from '../components/chat/ChatList';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import ChannelInfo from '../components/chat/ChannelInfo';
import ChatService from '../services/chatService';

const Channels = () => {
  const {
    chats: channels,
    currentChat: currentChannel,
    setCurrentChat: setCurrentChannel,
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
  } = useChat('channel');

  const [showChannelInfo, setShowChannelInfo] = useState(false);

  const handleWebSocketMessage = (data) => {
    // Handle real-time updates here
  };

  const { sendMessage: sendWebSocketMessage } = useWebSocket('wss://your-websocket-url', handleWebSocketMessage);

  const handleChannelSelect = (channel) => {
    setCurrentChannel(channel);
    fetchMessages(channel.id);
    setShowChannelInfo(false);
  };

  const handleSendMessage = async (content) => {
    await sendMessage(content);
    sendWebSocketMessage({ type: 'new_channel_message', channelId: currentChannel.id, content });
  };

  const handleFileUpload = async (file) => {
    try {
      const uploadedFile = await ChatService.uploadFile(currentChannel.id, file);
      // Handle the uploaded file (e.g., add it to the messages)
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await ChatService.addChannelMember(currentChannel.id, userId);
      // Update the channel members list
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await ChatService.removeChannelMember(currentChannel.id, userId);
      // Update the channel members list
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                  <ChannelInfo
                    channel={currentChannel}
                    onAddMember={handleAddMember}
                    onRemoveMember={handleRemoveMember}
                  />
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