import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChannelInfo = ({ channel, onAddMember, onRemoveMember }) => {
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const handleAddMember = (e) => {
    e.preventDefault();
    onAddMember(newMemberEmail);
    setNewMemberEmail('');
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">#{channel.name}</h2>
      <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
      <h3 className="text-lg font-semibold mb-2">Members</h3>
      <ScrollArea className="flex-1 mb-4">
        {channel.members.map((member) => (
          <div key={member.id} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <span>{member.name}</span>
            </div>
            {member.role !== 'admin' && (
              <Button variant="ghost" size="sm" onClick={() => onRemoveMember(member.id)}>
                Remove
              </Button>
            )}
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleAddMember} className="flex space-x-2">
        <Input
          type="email"
          placeholder="Add member by email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
};

export default ChannelInfo;