import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';

const ChatHeader = ({ chat, chatType, onInfoClick }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-3">
        {chatType === 'direct' ? (
          <Avatar>
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>{chat.username?.[0] || "?"}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            #{chat.name?.[0] || "?"}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold">{chat.name || chat.username}</h2>
          {chatType === 'direct' && (
            <p className="text-sm text-muted-foreground">{chat.status || "Online"}</p>
          )}
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onInfoClick}>
        <Info className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
