import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { useMessages } from '../hooks/useMessages';
import { users } from '../data/users';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import RightSidebar from '../components/layout/RightSidebar';

export default function DirectMessagesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const { messages, sendMessage, uploadFile, recentDocuments } = useMessages('direct');
  const [localMessages, setLocalMessages] = useState([]);

  useEffect(() => {
    if (id) {
      const user = users.find(u => u.id.toString() === id);
      setSelectedUser(user || null);
    } else {
      setSelectedUser(null);
    }
  }, [id]);

  useEffect(() => {
    if (selectedUser) {
      setLocalMessages(messages.filter(m => 
        (m.senderId === selectedUser.id && m.receiverId === users[0].id) || 
        (m.senderId === users[0].id && m.receiverId === selectedUser.id)
      ));
    } else {
      setLocalMessages([]);
    }
  }, [selectedUser, messages]);

  const handleUserSelect = (user) => {
    navigate(`/direct-messages/${user.id}`);
  };

  const handleSendMessage = async (content) => {
    if (selectedUser) {
      const newMessage = await sendMessage(content, selectedUser.id);
      setLocalMessages(prev => [...prev, newMessage]);
    }
  };

  const handleFileUpload = async (file) => {
    if (selectedUser) {
      const uploadedFile = await uploadFile(file, selectedUser.id);
      setLocalMessages(prev => [...prev, uploadedFile]);
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
            <MessageList messages={localMessages} currentUser={users[0]} />
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