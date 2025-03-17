"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthCard from "../components/AuthCard"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

const VerifyEmailPage = () => {
  const { verifyEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    error: null,
  })

  useEffect(() => {
    const verifyEmailToken = async () => {
      const searchParams = new URLSearchParams(location.search)
      const token = searchParams.get("token")

      if (!token) {
        setVerificationStatus({
          loading: false,
          success: false,
          error: "Verification token is missing",
        })
        return
      }

      try {
        const { success, error } = await verifyEmail(token)

        setVerificationStatus({
          loading: false,
          success,
          error: error || null,
        })
      } catch (error) {
        setVerificationStatus({
          loading: false,
          success: false,
          error: error.message || "An error occurred during verification",
        })
      }
    }

    verifyEmailToken()
  }, [location.search, verifyEmail])

  const renderContent = () => {
    if (verificationStatus.loading) {
      return (
        <div className="text-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4">Verifying your email...</p>
        </div>
      )
    }

    if (verificationStatus.success) {
      return (
        <>
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-xl font-medium">Email Verified Successfully</h2>
            <p className="text-muted-foreground mt-2">
              Your email has been verified. You can now log in to your account.
            </p>
          </div>
          <Button className="w-full rounded-xl" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </>
      )
    }

    return (
      <>
        <div className="text-center mb-6">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-medium">Verification Failed</h2>
          <p className="text-muted-foreground mt-2">
            {verificationStatus.error ||
              "There was an error verifying your email. The link may have expired or is invalid."}
          </p>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full rounded-xl" onClick={() => navigate("/register")}>
            Register Again
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </div>
      </>
    )
  }

  return <AuthCard title="Email Verification">{renderContent()}</AuthCard>
}

export default VerifyEmailPage

