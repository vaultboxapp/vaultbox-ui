import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FilePlus, FolderPlus, Copy, Download, Trash2, Shield } from 'lucide-react'
import VaultItem from './VaultItem'

const VaultsContent = () => {
  const items = [
    { type: 'folder', name: 'OG Images' },
    { type: 'folder', name: 'Testimonial screenshots' },
    { type: 'file', name: 'quick-docs.txt' },
  ]

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FilePlus className="mr-2 h-4 w-4" />
            Add file
          </Button>
          <Button variant="outline" size="sm">
            <FolderPlus className="mr-2 h-4 w-4" />
            Add folder
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button variant="ghost" size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Permissions
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="ghost" size="sm">&larr;</Button>
        <Button variant="ghost" size="sm">&rarr;</Button>
        <Button variant="ghost" size="sm">↻</Button>
        <Input className="flex-1" placeholder="Path://main/public" />
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-4 gap-4">
          {items.map((item, index) => (
            <VaultItem key={index} type={item.type} name={item.name} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default VaultsContent