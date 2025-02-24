"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import ChatList from "./ChatList"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import ChannelInfo from "./ChannelInfo"
import UserProfile from "./UserProfile"

const ChatLayout = ({
  chatType,
  chats,
  currentChat,
  setCurrentChat,
  messages,
  onSendMessage,
  onFileUpload,
  userId,
}) => {
  const [showInfo, setShowInfo] = useState(false)

  const handleChatSelect = (chat) => {
    setCurrentChat(chat)
    setShowInfo(false)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 border-r flex-shrink-0">
        <ScrollArea className="h-full">
          <ChatList chats={chats} currentChat={currentChat} onChatSelect={handleChatSelect} chatType={chatType} />
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentChat ? (
          <>
            <ChatHeader chat={currentChat} chatType={chatType} onInfoClick={() => setShowInfo(true)} />
            <div className="flex-1 overflow-hidden">
              <MessageList messages={messages} userId={userId} />
            </div>
            <MessageInput onSendMessage={onSendMessage} onFileUpload={onFileUpload} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a {chatType === "direct" ? "conversation" : "channel"} to start chatting
          </div>
        )}
      </div>

      {/* Right Sidebar - User/Channel Info */}
      <Sheet open={showInfo} onOpenChange={setShowInfo}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
          {currentChat &&
            (chatType === "channel" ? <ChannelInfo channel={currentChat} /> : <UserProfile user={currentChat} />)}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ChatLayout

