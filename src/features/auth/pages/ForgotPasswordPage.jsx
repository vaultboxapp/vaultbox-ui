"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useForm } from "../hooks/useForm"
import AuthCard from "../components/AuthCard"
import CaptchaWidget from "../components/CaptchaWidget"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [requestError, setRequestError] = useState(null)
  const [captchaToken, setCaptchaToken] = useState(null)

  const { values, errors, touched, handleChange, handleBlur, validate } = useForm({
    email: "",
  })

  const validationSchema = {
    email: {
      required: "Email is required",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate(validationSchema)) {
      return
    }

    if (!captchaToken) {
      // Show error that captcha is required
      return
    }

    setIsSubmitting(true)
    setRequestError(null)

    try {
      const { success, error } = await forgotPassword(values.email)

      if (success) {
        setRequestSent(true)
      } else {
        setRequestError(error || "Failed to send password reset email")
      }
    } catch (error) {
      setRequestError(error.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (requestSent) {
    return (
      <AuthCard
        title="Check Your Email"
        subtitle={`We've sent password reset instructions to ${values.email}. Please check your inbox.`}
      >
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            If you don't see the email, check your spam folder or try again.
          </p>
          <Button variant="outline" className="w-full rounded-xl" onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a link to reset your password"
      footer={
        <p className="text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Back to login
          </Link>
        </p>
      }
    >
      {requestError && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertDescription>{requestError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            className={`rounded-xl ${touched.email && errors.email ? "border-destructive" : ""}`}
          />
          {touched.email && errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <CaptchaWidget onVerify={setCaptchaToken} />

        <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting || !captchaToken}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthCard>
  )
}

export default ForgotPasswordPage

