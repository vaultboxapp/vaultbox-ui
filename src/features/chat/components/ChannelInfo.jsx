import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, X } from 'lucide-react';
import { toast } from "sonner";

const ChannelInfo = ({ channel, isOpen, onClose, onAddMember, onRemoveMember }) => {
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await onAddMember(newMemberEmail);
      setNewMemberEmail("");
      toast.success("Member added successfully");
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await onRemoveMember(memberId);
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <span className="font-bold">#{channel.name}</span>
          </SheetTitle>
          <SheetDescription>{channel.description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="mb-4 text-sm font-medium">Add Member</h3>
            <form onSubmit={handleAddMember} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </form>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium">Members</h3>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {channel.members?.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.username?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.username}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChannelInfo;
