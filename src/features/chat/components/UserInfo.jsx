"use client"

import React, { useState, useEffect } from "react"
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, FileText, Download, FileImage, FileVideo, FileClock } from "lucide-react"
import { toast } from "sonner"
import ChatService from "../../../services/chatService"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const UserInfo = ({ user, onClose }) => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Example shared files (in real implementation, these would come from the backend)
  useEffect(() => {
    const fetchSharedFiles = async () => {
      if (!user?._id) return;
      
      setIsLoading(true);
      try {
        // In a real implementation, you would call the API
        // const files = await ChatService.getSharedFiles(user._id);
        
        // Dummy data for now - would be replaced with actual API response
        const dummyFiles = [
          { 
            id: '1', 
            name: 'project_proposal.pdf', 
            type: 'application/pdf',
            size: 1240000,
            url: '#',
            uploadedAt: new Date().toISOString() 
          },
          { 
            id: '2', 
            name: 'meeting_screenshot.png', 
            type: 'image/png',
            size: 850000,
            url: '#',
            uploadedAt: new Date(Date.now() - 86400000).toISOString() 
          },
          { 
            id: '3', 
            name: 'demo_video.mp4', 
            type: 'video/mp4',
            size: 8500000,
            url: '#',
            uploadedAt: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        
        setSharedFiles(dummyFiles);
      } catch (error) {
        console.error("Error fetching shared files:", error);
        toast.error("Failed to load shared files");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedFiles();
  }, [user]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-5 w-5" />;
    if (fileType.startsWith('application/pdf')) return <FileText className="h-5 w-5" />;
    return <FileClock className="h-5 w-5" />;
  };

  const handleDownloadFile = (file) => {
    // In real implementation, you would use the file URL
    toast.info(`Downloading ${file.name}...`);
    // window.open(file.url, '_blank');
  };

  return (
    <SheetContent className="w-[400px] sm:w-[540px]">
      <SheetHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.username?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <SheetTitle className="text-xl">{user?.username}</SheetTitle>
            <SheetDescription>{user?.email}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-6">
        <Tabs defaultValue="files">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="files">Shared Files</TabsTrigger>
            <TabsTrigger value="info">User Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">
              Files 
              <Badge variant="outline" className="ml-2">{sharedFiles.length}</Badge>
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-[200px]">
                <p className="text-sm text-muted-foreground">Loading files...</p>
              </div>
            ) : sharedFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <FileText className="h-10 w-10 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No files shared yet</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-3">
                  {sharedFiles.map((file) => (
                    <div 
                      key={file.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadFile(file)}
                        className="ml-2"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="info" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <p className="text-sm">
                  {user?.status || "No status"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Bio</h3>
                <p className="text-sm text-muted-foreground">
                  {user?.bio || "No bio available"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Role</h3>
                <Badge variant="outline">
                  {user?.role || "Member"}
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SheetContent>
  );
};

export default UserInfo; 