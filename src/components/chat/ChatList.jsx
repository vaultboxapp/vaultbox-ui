import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatList = ({ chats, currentChat, onChatSelect, chatType }) => {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-64 border-r">
      <div className="p-4 space-y-4">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`flex items-center space-x-3 w-full p-2 rounded-lg transition ${
              currentChat?.id === chat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
            onClick={() => onChatSelect(chat)}
          >
            {chatType === 'direct' ? (
              <Avatar>
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                #{chat.name[0]}
              </div>
            )}
            <span className="text-sm font-medium">{chat.name}</span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatList;