import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { api } from '../services/api';
import { users } from '../data/users';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RightSidebar from '../components/layout/RightSidebar';

export default function DirectMessagesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);

  useEffect(() => {
    if (id) {
      const user = users.find(u => u.id.toString() === id);
      setSelectedUser(user || null);
      if (user) {
        api.getMessagesForUser(user.id).then(response => {
          setMessages(response.data);
        });
      }
    } else {
      setSelectedUser(null);
    }
  }, [id]);

  const handleUserSelect = (user) => {
    navigate(`/direct-messages/${user.id}`);
  };

  const handleSendMessage = async (content) => {
    if (selectedUser) {
      const newMessage = await api.sendMessage({ content, receiverId: selectedUser.id });
      setMessages(prev => [...prev, newMessage.data]);
    }
  };

  const handleFileUpload = async (file) => {
    if (selectedUser) {
      const uploadedFile = await api.uploadFile(file);
      setMessages(prev => [...prev, uploadedFile.data]);
    }
  };

  const LeftSidebar = () => (
    <div className="w-64 bg-muted/40 p-4 border-r border-border">
      {users.map(user => (
        <div
          key={user.id}
          className={`flex items-center p-2 cursor-pointer hover:bg-muted/60 rounded ${
            selectedUser?.id === user.id ? 'bg-muted/60' : ''
          }`}
          onClick={() => handleUserSelect(user)}
        >
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Layout
      title={selectedUser ? selectedUser.name : "Direct Messages"}
      LeftSidebar={LeftSidebar}
      RightSidebar={<RightSidebar recentDocuments={recentDocuments} showGroupMembers={false} />}
    >
      <div className="flex flex-col h-full">
        {selectedUser ? (
          <>
            <MessageList messages={messages} currentUser={users[0]} />
            <MessageInput 
              onSendMessage={handleSendMessage} 
              onFileUpload={handleFileUpload} 
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a user to start messaging</p>
          </div>
        )}
      </div>
    </Layout>
  );
}