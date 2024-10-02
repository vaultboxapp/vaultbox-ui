import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import UserAvatar from '../common/UserAvatar';
import { File, Image, Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import FilePreview from './FilePreview';

export default function RightSidebar({ showGroupMembers = true, recentDocuments = [] }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const groupMembers = [
    { id: 1, name: 'John Doe', role: 'Developer', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Jane Smith', role: 'Designer', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
  ];

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <File className="mr-2 h-4 w-4 text-muted-foreground" />;
    return fileType.startsWith('image/') 
      ? <Image className="mr-2 h-4 w-4 text-primary" />
      : <File className="mr-2 h-4 w-4 text-destructive" />;
  };

  return (
    <div className="w-64 bg-background border-l border-border p-4 flex flex-col h-full">
      <h2 className="font-semibold mb-2">Recent Documents</h2>
      <ScrollArea className="flex-grow mb-4">
        <ul className="space-y-2">
          {recentDocuments.map((doc) => (
            <li key={doc.id} className="flex items-center cursor-pointer hover:bg-muted/60 p-2 rounded" onClick={() => handleFileClick(doc)}>
              {getFileIcon(doc.type)}
              <div>
                <p className="text-sm font-medium">{doc.name || 'Unnamed Document'}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.timestamp ? new Date(doc.timestamp).toLocaleString() : 'Unknown date'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      {showGroupMembers && (
        <>
          <h2 className="font-semibold mb-2">Group Members</h2>
          <ScrollArea className="flex-grow">
            <ul className="space-y-2">
              {groupMembers.map((member) => (
                <li key={member.id} className="flex items-center">
                  <UserAvatar user={member} className="mr-2" />
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
          <Button className="mt-4 w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </>
      )}
      <FilePreview
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </div>
  );
}