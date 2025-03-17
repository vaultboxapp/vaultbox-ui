"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthCard from "../components/AuthCard"
import OTPInput from "../components/OTPInput"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

const VerifyMfaPage = () => {
  const { verifyMfa } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationError, setVerificationError] = useState(null)
  const [otpCode, setOtpCode] = useState("")

  // Get redirect path from location state
  const { from } = location.state || { from: { pathname: "/dashboard" } }

  const handleVerify = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setVerificationError("Please enter a valid verification code")
      return
    }

    setIsSubmitting(true)
    setVerificationError(null)

    try {
      const { success, error } = await verifyMfa(otpCode)

      if (success) {
        navigate(from)
      } else {
        setVerificationError(error || "Verification failed. Please try again.")
      }
    } catch (error) {
      setVerificationError(error.message || "An error occurred during verification")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpComplete = (code) => {
    setOtpCode(code)
  }

  return (
    <AuthCard title="Two-Factor Authentication" subtitle="Enter the verification code from your authenticator app">
      {verificationError && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertDescription>{verificationError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center text-muted-foreground">
            Open your authenticator app to view your verification code
          </p>
          <OTPInput length={6} onComplete={handleOtpComplete} />
        </div>

        <Button className="w-full rounded-xl" onClick={handleVerify} disabled={isSubmitting || otpCode.length !== 6}>
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>

        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </div>
      </div>
    </AuthCard>
  )
}

export default VerifyMfaPage

