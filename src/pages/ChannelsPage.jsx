import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { api } from '../services/api';
import { channels } from '../data/channels';
import RightSidebar from '../components/layout/RightSidebar';

export default function ChannelsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);

  useEffect(() => {
    if (id) {
      const channel = channels.find(c => c.id.toString() === id);
      setSelectedChannel(channel || null);
      if (channel) {
        api.getInitialChannelMessages(channel.id).then(response => {
          setMessages(response.data);
        });
      }
    } else {
      setSelectedChannel(null);
    }
  }, [id]);

  const handleChannelSelect = (channel) => {
    navigate(`/channels/${channel.id}`);
  };

  const handleSendMessage = async (content) => {
    if (selectedChannel) {
      const newMessage = await api.sendChannelMessage(selectedChannel.id, { content });
      setMessages(prev => [...prev, newMessage.data]);
    }
  };

  const handleFileUpload = async (file) => {
    if (selectedChannel) {
      const uploadedFile = await api.uploadChannelFile(selectedChannel.id, file);
      setMessages(prev => [...prev, uploadedFile.data]);
    }
  };

  const LeftSidebar = () => (
    <div className="w-64 bg-muted/40 p-4 border-r border-border">
      {channels.map(channel => (
        <div
          key={channel.id}
          className={`flex items-center p-2 cursor-pointer hover:bg-muted/60 rounded ${
            selectedChannel?.id === channel.id ? 'bg-muted/60' : ''
          }`}
          onClick={() => handleChannelSelect(channel)}
        >
          <span className="mr-2 text-lg">#</span>
          <span>{channel.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Layout
      title={selectedChannel ? selectedChannel.name : "Channels"}
      LeftSidebar={LeftSidebar}
      RightSidebar={<RightSidebar recentDocuments={recentDocuments} showGroupMembers={true} />}
    >
      <div className="flex flex-col h-full">
        {selectedChannel ? (
          <>
            <MessageList messages={messages} />
            <MessageInput 
              onSendMessage={handleSendMessage} 
              onFileUpload={handleFileUpload} 
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a channel to view messages</p>
          </div>
        )}
      </div>
    </Layout>
  );
}