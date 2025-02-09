"use client";

import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import {
  LayoutGrid,
  Video,
  Search,
  MessageCircle,
  Hash,
  LogOut,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";

const navItems = [
  { icon: Search, label: "Search", path: "/search" },
  { icon: LayoutGrid, label: "Overview", path: "/dashboard" },
  { icon: Video, label: "Video Meeting", path: "/video" },
  { icon: Hash, label: "Channels", path: "/channels" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Settings, label: "Settings", path: "/settings" }, // ✅ Added Settings
];

const getInitials = (name) =>
  name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

export function AppSidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <Sidebar className="font-sans">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center justify-between p-6">
          <img
            src="/src/assets/logo_icon.svg"
            alt="logo"
            className="w-10 h-10"
          />
          <ThemeToggle />
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium px-6 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ icon: Icon, label, path }) => (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith(path)}
                    tooltip={label}
                    // Changed hover color to a neutral tone
                    className="px-6 py-3 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                  >
                    <Link to={path} className="flex items-center space-x-4">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile & Logout */}
      <SidebarFooter className="mt-auto">
        <div className="p-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center p-0">
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">{user?.name || "Guest"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || "No Email"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
