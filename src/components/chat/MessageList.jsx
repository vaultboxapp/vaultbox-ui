import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MessageList = ({ messages }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3">
            <Avatar>
              <AvatarImage src={message.sender.avatar} />
              <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{message.sender.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1 text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;