import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/services/autheService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFormValid(
      username.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword
    );
  }, [username, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError("");
    setLoading(true);
    try {
      await signUp(username, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient-x">
      <Card className="w-[380px] backdrop-blur-sm bg-background/80">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={!isFormValid || loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}