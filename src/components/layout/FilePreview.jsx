import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function FilePreview({ file, isOpen, onClose }) {
  if (!file) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
          <DialogDescription>
            Uploaded on {new Date(file.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {file.type && file.type.startsWith('image/') ? (
            <img src={file.url} alt={file.name} className="max-w-full h-auto" />
          ) : (
            <div className="p-4 bg-muted rounded-md">
              <p>File type: {file.type || 'Unknown'}</p>
              <p>Size: {formatFileSize(file.size)}</p>
            </div>
          )}
        </div>
        <Button onClick={handleDownload}>Download</Button>
      </DialogContent>
    </Dialog>
  );
}