import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ChatList = ({ chats = [], currentChat, onChatSelect, chatType }) => {
  if (!Array.isArray(chats)) {
    console.error("ChatList expects an array for chats but got:", chats);
    return null;
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-64 border-r">
      <div className="p-4 space-y-4">
        {chats.length > 0 ? (
          chats.map((chat, index) => (
            <button
              key={chat._id || index}
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition ${
                currentChat?._id === chat._id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
              onClick={() => onChatSelect(chat)}
            >
              {chatType === "direct" ? (
                <Avatar>
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.username?.[0] || "?"}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  #{chat.name?.[0] || "?"}
                </div>
              )}
              <span className="text-sm font-medium">
                {chat.name || chat.username || "Unnamed Chat"}
              </span>
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500">No chats available</p>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatList;
