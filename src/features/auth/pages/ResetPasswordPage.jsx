"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useForm } from "../hooks/useForm"
import AuthCard from "../components/AuthCard"
import PasswordInput from "../components/PasswordInput"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetError, setResetError] = useState(null)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [token, setToken] = useState("")

  const { values, errors, touched, handleChange, handleBlur, validate } = useForm({
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Extract token from URL
    const searchParams = new URLSearchParams(location.search)
    const tokenFromUrl = searchParams.get("token")

    if (!tokenFromUrl) {
      setResetError("Reset token is missing. Please use the link from your email.")
    } else {
      setToken(tokenFromUrl)
    }
  }, [location.search])

  const validationSchema = {
    password: {
      required: "Password is required",
      minLength: 8,
      message: "Password must be at least 8 characters",
    },
    confirmPassword: {
      required: "Please confirm your password",
      match: "password",
      message: "Passwords do not match",
    },
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate(validationSchema)) {
      return
    }

    setIsSubmitting(true)
    setResetError(null)

    try {
      const { success, error } = await resetPassword({
        token,
        password: values.password,
      })

      if (success) {
        setResetSuccess(true)
      } else {
        setResetError(error || "Failed to reset password")
      }
    } catch (error) {
      setResetError(error.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (resetSuccess) {
    return (
      <AuthCard
        title="Password Reset Successful"
        subtitle="Your password has been reset successfully. You can now log in with your new password."
      >
        <Button className="w-full rounded-xl" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Reset Password" subtitle="Enter your new password below">
      {resetError && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertDescription>{resetError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          id="password"
          name="password"
          label="New Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
          placeholder="••••••••"
          required
          className="rounded-xl"
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          placeholder="••••••••"
          required
          className="rounded-xl"
        />

        <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting || !token}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthCard>
  )
}

export default ResetPasswordPage

