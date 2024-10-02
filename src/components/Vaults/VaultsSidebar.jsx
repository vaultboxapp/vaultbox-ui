import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Clock } from 'lucide-react'

const VaultsSidebar = () => {
  return (
    <div className="w-64 border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Personal cloud</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Clock className="mr-2 h-4 w-4" />
            Recently viewed
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}

export default VaultsSidebar