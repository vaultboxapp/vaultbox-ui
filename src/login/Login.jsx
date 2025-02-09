// frontend -> src/login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { login, verifyOTP, getUserById } from "@/services/autheService";
import { Loading } from "@/components/ui/loading";
import { useAuth } from "@/context/auth";

export default function Login() {
  const { handleLoginSuccess } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("login"); // 'login' or 'otp'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle the login submission and store the temporary userId.
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      setStep("otp");
      // The temporary userId is already stored in localStorage by the login API.
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification.
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // The verifyOTP function retrieves the temp userId internally.
      const response = await verifyOTP(otp);
      console.log("OTP verified, userId:", response.userId);
      if (!response.userId) {
        throw new Error("User ID missing from OTP response!");
      }

      console.log("Fetching user data for:", response.userId);
      const userDetailsResponse = await getUserById();
      console.log("Fetched user details:", userDetailsResponse);
      if (!userDetailsResponse || !userDetailsResponse.user || !userDetailsResponse.user.name) {
        throw new Error("User details missing or invalid");
      }

      // Save the full user data in the AuthContext and navigate.
      handleLoginSuccess(userDetailsResponse.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    if (value.length <= 6) {
      setOTP(value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 bg-[#09090B] text-gray-100">
      <div className="flex items-center justify-center">
        <div className="w-[350px] max-w-[90%] space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {step === "login" ? "Login" : "Verify It's You"}
            </h1>
            <p className="text-sm text-gray-400 font-mono">
              {step === "login"
                ? "Enter your email and password to login to your account"
                : "We've sent a 6-digit code to your email. Please enter it below to verify your identity."}
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {step === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="absolute right-2 top-2">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <LoaderIcon className="animate-spin" /> : "Verify"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={handleOTPChange}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <LoaderIcon className="animate-spin" /> : "Verify"}
              </Button>
            </form>
          )}
        </div>
      </div>
      <div className="hidden lg:block">
        <img src="src/assets/new.jpeg" alt="Decorative background" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
