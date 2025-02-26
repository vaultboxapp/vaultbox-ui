import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Info, MoreVertical, UserPlus, Bell, ChevronLeft } from "lucide-react"

const ChatHeader = ({
  chat,
  chatType,
  onInfoClick,
  onAddMember,
  unreadCount = 0,
  onBack, // Optional; only provided on mobile
}) => {
  return (
    <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-3">
        {/* Show the back chevron if onBack is provided */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={onBack}
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        {chatType === "direct" ? (
          <Avatar>
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>{chat.username?.[0] || "?"}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            #{chat.name?.[0] || "?"}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold">
            {chat.name || chat.username}
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h2>
          {chatType === "direct" && (
            <p className="text-sm text-muted-foreground">
              {chat.status === "online" ? (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Online
                </span>
              ) : (
                "Offline"
              )}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {chatType === "channel" && (
          <Button variant="ghost" size="icon" onClick={onAddMember}>
            <UserPlus className="h-5 w-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onInfoClick}>
          <Info className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Mute notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default ChatHeader
