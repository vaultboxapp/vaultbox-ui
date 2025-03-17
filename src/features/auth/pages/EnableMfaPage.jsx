"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthCard from "../components/AuthCard"
import QRCode from "../components/QRCode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const EnableMfaPage = () => {
  const { enableMfa, verifyMfa, user } = useAuth()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [mfaSecret, setMfaSecret] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [setupError, setSetupError] = useState(null)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [codeError, setCodeError] = useState("")

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/login")
      return
    }

    // Skip if user already has MFA enabled
    if (user.mfaEnabled) {
      navigate("/dashboard")
      return
    }

    const setupMfa = async () => {
      setIsLoading(true)

      try {
        const { success, data, error } = await enableMfa()

        if (success && data) {
          setMfaSecret(data.secret)
          setQrCodeUrl(data.qrCodeUrl)
        } else {
          setSetupError(error || "Failed to set up MFA")
        }
      } catch (error) {
        setSetupError(error.message || "An error occurred during MFA setup")
      } finally {
        setIsLoading(false)
      }
    }

    setupMfa()
  }, [user, enableMfa, navigate])

  const handleVerify = async (e) => {
    e.preventDefault()

    if (!verificationCode || verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      setCodeError("Please enter a valid 6-digit code")
      return
    }

    setIsLoading(true)
    setCodeError("")

    try {
      const { success, error } = await verifyMfa(verificationCode)

      if (success) {
        setVerificationSuccess(true)
      } else {
        setSetupError(error || "Failed to verify MFA code")
      }
    } catch (error) {
      setSetupError(error.message || "An error occurred during verification")
    } finally {
      setIsLoading(false)
    }
  }

  if (verificationSuccess) {
    return (
      <AuthCard
        title="MFA Enabled Successfully"
        subtitle="Your account is now protected with multi-factor authentication."
      >
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            You'll need to enter a verification code from your authenticator app each time you log in.
          </p>
          <Button className="w-full rounded-xl" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Set Up Two-Factor Authentication"
      subtitle="Enhance your account security with two-factor authentication"
    >
      {setupError && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertDescription>{setupError}</AlertDescription>
        </Alert>
      )}

      {isLoading && !mfaSecret ? (
        <div className="text-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4">Setting up MFA...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Scan the QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft
              Authenticator).
            </p>

            <div className="flex justify-center">
              <QRCode value={qrCodeUrl} />
            </div>

            <div className="bg-secondary/50 p-3 rounded-xl">
              <p className="text-xs text-center font-mono break-all">{mfaSecret}</p>
              <p className="text-xs text-center mt-1 text-muted-foreground">
                If you can't scan the QR code, enter this secret key manually in your app
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode" className="font-medium">
                Verification Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value)
                  if (codeError) setCodeError("")
                }}
                placeholder="Enter 6-digit code"
                className={`rounded-xl ${codeError ? "border-destructive" : ""}`}
              />
              {codeError && <p className="text-sm text-destructive">{codeError}</p>}
            </div>

            <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify & Enable MFA"}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Skip for Now
            </Button>
          </div>
        </div>
      )}
    </AuthCard>
  )
}

export default EnableMfaPage

