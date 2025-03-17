// routes.jsx
"use client"

import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { NotificationsProvider } from "../notifications/NotificationContext"
import Layout from "@/components/Layout/Layout"
import ProtectedRoute from "./components/ProtectedRoute"

// Public pages
import RegisterPage from "./pages/RegisterPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import LoginPage from "./pages/LoginPage"
import VerifyDevicePage from "./pages/VerifyDevicePage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import LogoutPage from "./pages/LogoutPage"

// Protected pages
import Dashboard from "../dashboard/pages/Dashboard"
import Search from "../dashboard/components/Search"
import VideoMeeting from "../meeting/components/VideoMeeting"
import MeetingRoom from "../meeting/components/MeetingRoom"
import Channels from "../chat/pages/Channels"
import Messages from "../chat/pages/Messages"
import Settings from "@/pages/Settings"
import NotFound from "@/pages/NotFound"

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verify-device" element={<VerifyDevicePage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><NotificationsProvider userId={user?.id}><Outlet /></NotificationsProvider></ProtectedRoute>}>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/video" element={<VideoMeeting />} />
          <Route path="/video/:roomId" element={<MeetingRoom />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
