"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthCard from "../components/AuthCard"
import OTPInput from "../components/OTPInput"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

const VerifyDevicePage = () => {
  const { verifyDevice } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationError, setVerificationError] = useState(null)
  const [otpCode, setOtpCode] = useState("")

  // Get userId and deviceId from location state
  const { userId, deviceId, email } = location.state || {}

  useEffect(() => {
    // If we don't have the required data, redirect to login
    if (!userId || !deviceId) {
      navigate("/login")
    }
  }, [userId, deviceId, navigate])

  const handleVerify = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setVerificationError("Please enter a valid verification code")
      return
    }

    setIsSubmitting(true)
    setVerificationError(null)

    try {
      const { success, error } = await verifyDevice({
        userId,
        deviceId,
        otp: otpCode,
      })

      if (success) {
        navigate("/dashboard")
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
    <AuthCard
      title="Verify Your Device"
      subtitle={`We've sent a verification code to ${email || "your email"}. Please enter it below to verify this device.`}
    >
      {verificationError && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertDescription>{verificationError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center text-muted-foreground">Enter the 6-digit code from your email</p>
          <OTPInput length={6} onComplete={handleOtpComplete} />
        </div>

        <Button className="w-full rounded-xl" onClick={handleVerify} disabled={isSubmitting || otpCode.length !== 6}>
          {isSubmitting ? "Verifying..." : "Verify Device"}
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

export default VerifyDevicePage

