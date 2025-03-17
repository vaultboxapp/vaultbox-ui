"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthCard from "../components/AuthCard"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

const LogoutPage = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const [logoutError, setLogoutError] = useState(null)

  useEffect(() => {
    const performLogout = async () => {
      try {
        const { success, error } = await logout()

        if (!success) {
          setLogoutError(error || "Failed to log out")
        }
      } catch (error) {
        setLogoutError(error.message || "An error occurred during logout")
      } finally {
        setIsLoggingOut(false)
      }
    }

    performLogout()
  }, [logout])

  return (
    <AuthCard title="Logging Out">
      {isLoggingOut ? (
        <div className="text-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4">Logging you out...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {logoutError ? (
            <>
              <div className="text-center">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-medium">Logout Failed</h2>
                <p className="text-muted-foreground mt-2">{logoutError}</p>
              </div>
              <Button className="w-full rounded-xl" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </>
          ) : (
            <>
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <h2 className="text-xl font-medium">You've Been Logged Out</h2>
                <p className="text-muted-foreground mt-2">Thank you for using our application.</p>
              </div>
              <Button className="w-full rounded-xl" onClick={() => navigate("/login")}>
                Sign In Again
              </Button>
            </>
          )}
        </div>
      )}
    </AuthCard>
  )
}

export default LogoutPage

