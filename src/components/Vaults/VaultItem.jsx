import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Folder, FileText } from 'lucide-react'

const VaultItem = ({ type, name }) => {
  return (
    <Card className="hover:bg-accent cursor-pointer">
      <CardContent className="flex flex-col items-center justify-center p-4">
        {type === 'folder' ? (
          <Folder className="h-12 w-12 text-blue-500" />
        ) : (
          <FileText className="h-12 w-12 text-gray-500" />
        )}
        <p className="mt-2 text-sm text-center">{name}</p>
      </CardContent>
    </Card>
  )
}

export default VaultItem