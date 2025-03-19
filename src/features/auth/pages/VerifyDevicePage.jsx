"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthCard from "../components/AuthCard"
import OTPInput from "../components/OTPInput"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import cryptoService from "@/utils/cryptoService"
import keyManagementService from "@/services/keyManagementService"

const VerifyDevicePage = () => {
  const { verifyDevice } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationError, setVerificationError] = useState(null)
  const [otpCode, setOtpCode] = useState("")
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false)

  // Get userId and deviceId from location state
  const { userId, deviceId, email } = location.state || {}

  useEffect(() => {
    // If we don't have the required data, redirect to login
    if (!userId || !deviceId) {
      navigate("/login")
    }
  }, [userId, deviceId, navigate])

  // Handle key generation and storage
  const setupSecureMessaging = async () => {
    try {
      setIsGeneratingKeys(true);
      toast.loading("Setting up secure messaging...");
      
      // Generate Kyber key pair
      const publicKey = await cryptoService.generateAndStoreKeyPair();
      
      if (!publicKey) {
        throw new Error("Failed to generate encryption keys");
      }
      
      // Store public key on server
      const success = await keyManagementService.storePublicKey(userId, publicKey);
      
      if (!success) {
        throw new Error("Failed to store public key on server");
      }
      
      toast.success("End-to-end encryption setup complete");
      return true;
    } catch (error) {
      console.error('Error setting up secure messaging:', error);
      toast.error("Failed to set up encryption keys");
      return false;
    } finally {
      setIsGeneratingKeys(false);
    }
  };

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
      });
      
      if (success) {
        // Set up encryption keys after successful verification
        await setupSecureMessaging();
        
        // Proceed to dashboard regardless of encryption setup result
        navigate("/dashboard");
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

        <Button 
          type="submit" 
          className="w-full rounded-xl" 
          disabled={isSubmitting || isGeneratingKeys || otpCode.length !== 6}
          onClick={handleVerify}
        >
          {isSubmitting ? "Verifying..." : isGeneratingKeys ? "Setting up security..." : "Verify Device"}
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