import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import VaultsSidebar from './VaultsSidebar'
import VaultsContent from './VaultsContent'

const Vaults = () => {
  return (
    <Card className="flex h-full">
     
      <CardContent className="flex-1 p-0">
        <VaultsContent />
      </CardContent>
    </Card>
  )
}

export default Vaults