import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Loading } from "@/components/ui/loading";

export default function AuthWrapper() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Loading />; // ✅ Show loading until auth state is confirmed

  if (!isAuthenticated) return <Navigate to="/login" replace />; // ✅ Redirect if not authenticated

  return <Outlet />; // ✅ Render protected pages if authenticated
}
