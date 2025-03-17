"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useForm } from "../hooks/useForm"
import AuthCard from "../components/AuthCard"
import PasswordInput from "../components/PasswordInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

const LoginPage = () => {
  const { login, oauthLogin } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState(null)

  const { values, errors, touched, handleChange, handleBlur, validate, isValid, hasInput } = useForm({
    email: "",
    password: "",
  })

  const validationSchema = {
    email: {
      required: "Email is required",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    password: {
      required: "Password is required",
    },
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate(validationSchema)) return
    
    setIsSubmitting(true)
    setLoginError(null)
    try {
      const { success, requiresDeviceVerification, error } = await login({
        email: values.email,
        password: values.password,
      })
      if (success) {
        navigate("/dashboard")
      } else if (requiresDeviceVerification) {
        navigate("/verify-device", {
          state: {
            userId: values.email,
            deviceId: "",
            email: values.email,
          },
        })
      } else {
        setLoginError(error || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      setLoginError(err.message || "An error occurred during login")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthLogin = () => {
    // Redirect the browser to your backend OAuth endpoint.
    window.location.href = "http://localhost:5000/api/auth/google"
    
  }
  

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your account"
      footer={
        <p className="text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      }
    >
      {loginError && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <Button
        variant="secondary"
        className="w-full flex items-center justify-center gap-2 rounded-xl h-11"
        onClick={handleOAuthLogin}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span>Sign in with Google</span>
      </Button>

      <div className="relative my-6">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-card dark:bg-card px-2 text-xs text-muted-foreground uppercase">Or continue with</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-medium">
            Email <span className={touched.email && !errors.email ? "text-transparent" : "text-destructive"}>*</span>
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

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
          placeholder="••••••••"
          required={!(touched.password && !errors.password)}
          className="rounded-xl"
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full rounded-xl" 
          disabled={isSubmitting || (!values.email || !values.password)}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </AuthCard>
  )
}

export default LoginPage
