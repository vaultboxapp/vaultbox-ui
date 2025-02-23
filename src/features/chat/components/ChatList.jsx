import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const ChatList = ({ chats = [], currentChat, onChatSelect, chatType }) => {
  if (!Array.isArray(chats)) {
    console.error("ChatList expects an array for chats but got:", chats)
    return null
  }

  return (
    <div className="p-4 space-y-2">
      {chats.length > 0 ? (
        chats.map((chat) => (
          <button
            key={chat._id}
            className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
              currentChat?._id === chat._id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="flex items-center space-x-3">
              {chatType === "direct" ? (
                <Avatar>
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.username?.[0] || "?"}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  #{chat.name?.[0] || "?"}
                </div>
              )}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{chat.name || chat.username}</span>
                {chat.lastMessage && (
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">{chat.lastMessage}</span>
                )}
              </div>
            </div>
            {chat.unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {chat.unreadCount}
              </Badge>
            )}
          </button>
        ))
      ) : (
        <p className="text-center text-muted-foreground p-4">No chats available</p>
      )}
    </div>
  )
}

export default ChatList

