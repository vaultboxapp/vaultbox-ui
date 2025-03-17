"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  autoComplete,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`pr-10 ${touched && error ? "border-destructive" : ""} ${className}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
        </Button>
      </div>
      {touched && error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default PasswordInput

