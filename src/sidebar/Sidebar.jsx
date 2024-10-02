import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  LayoutGrid,
  Video,
  Search,
  Menu,
  MessageCircle,
  Hash,
  Settings,
  LogOut,
  Plus,
  Vault,
  PanelLeftClose
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [vaults, setVaults] = useState([])
  const [newVaultName, setNewVaultName] = useState('')
  const location = useLocation()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  const handleCreateVault = () => {
    if (newVaultName.trim()) {
      setVaults([...vaults, { id: Date.now(), name: newVaultName.trim() }])
      setNewVaultName('')
    }
  }

  const navItems = [
    { icon: Search, label: "Search", path: "/search" },
    { icon: LayoutGrid, label: "Overview", path: "/" },
    { icon: Video, label: "Video Meeting", path: "/video" },
    { icon: Hash, label: "Channels", path: "/channels" },
    { icon: MessageCircle, label: "Messages", path: "/direct-messages" },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const NavItem = ({ item, isCollapsed }) => {
    const content = (
      <Button 
        variant="ghost" 
        className={`w-full justify-start ${isCollapsed ? 'p-2' : 'px-3 py-2'} ${isActive(item.path) ? 'bg-gray-100' : ''}`}
      >
        <item.icon className="sidebar-icon w-5 h-5 mr-3" />
        {!isCollapsed && <span className="ml-2">{item.label}</span>}
      </Button>
    );

    return isCollapsed ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={item.path}>{content}</Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    ) : (
      <Link to={item.path}>{content}</Link>
    );
  };

  return (
    <TooltipProvider>
      <div 
        className={`
          bg-white text-gray-800 flex flex-col 
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className="flex items-center justify-between p-4 h-16">
          {!isCollapsed && <img src="/src/assets/logo_icon.svg" alt="logo" className="w-8 h-8" />}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="p-1"
                onClick={toggleSidebar}
              >
                {isCollapsed ? (
                  <Menu className="sidebar-icon w-5 h-5" />
                ) : (
                  <PanelLeftClose className="sidebar-icon w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <nav className="space-y-1 p-2 flex-grow overflow-y-auto">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} isCollapsed={isCollapsed} />
          ))}

          {!isCollapsed && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-gray-400 mb-2 px-3">Vaults</h3>
              <div className="space-y-1">
                {vaults.map((vault) => (
                  <Link to={`/vaults/${vault.id}`} key={vault.id}>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start px-3 py-2 ${isActive(`/vaults/${vault.id}`) ? 'bg-gray-100' : ''}`}
                    >
                      <Vault className="sidebar-icon w-5 h-5 mr-3" />
                      {vault.name}
                    </Button>
                  </Link>
                ))}
                <div className="flex items-center space-x-2 px-3">
                  <Input
                    type="text"
                    placeholder="New Vault Name"
                    value={newVaultName}
                    onChange={(e) => setNewVaultName(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={handleCreateVault}>
                    <Plus className="sidebar-icon w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0">
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Kate Russell" />
                  <AvatarFallback>KR</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="text-left">
                    <p className="text-sm font-semibold">Kate Russell</p>
                    <p className="text-xs text-gray-400">Project Manager</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Settings className="sidebar-icon w-5 h-5 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="sidebar-icon w-5 h-5 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  )
}