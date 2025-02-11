"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider, useAuth } from "@/context/auth"
import { FontProvider } from "@/context/font"
import { ThemeProvider } from "./components/Theme/ThemeProvider"
import { SidebarProvider } from "@/components/ui/sidebar"
import Login from "./login/Login"
import { AuthWrapper } from "@/components/AuthWrapper"
import Layout from "@/components/ui/Layout"
import Dashboard from "./pages/Dashboard"
import Search from "./pages/Search"
import VideoMeeting from "./JitsiMeet/VideoMeeting"
import MeetingRoom from "./JitsiMeet/MeetingRoom"
import Channels from "./pages/Channels"
import Messages from "./pages/Messages"
import Settings from "./pages/Settings"
import NotFound from "./pages/NotFound"
import { Loading } from "@/components/ui/loading"

const queryClient = new QueryClient()

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loader for initial app load only
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<AuthWrapper />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video"
            element={
              <ProtectedRoute>
                <VideoMeeting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:roomId"
            element={
              <ProtectedRoute>
                <MeetingRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/channels"
            element={
              <ProtectedRoute>
                <Channels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* Catch-all Route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <FontProvider>
            <ThemeProvider>
              <SidebarProvider>
                <AppContent />
              </SidebarProvider>
            </ThemeProvider>
          </FontProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App

