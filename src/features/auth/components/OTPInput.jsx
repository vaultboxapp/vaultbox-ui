"use client"

import { useState, useRef, useEffect } from "react"

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(""))
  const inputRefs = useRef([])

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (e, index) => {
    const { value } = e.target

    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Update the OTP array
    const newOtp = [...otp]

    // Take only the last character if multiple are pasted
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // If a digit was entered and we're not at the last input, focus the next one
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }

    // Check if OTP is complete
    const otpValue = newOtp.join("")
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue)
    }
  }

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        inputRefs.current[index - 1].focus()
      }
    }

    // Handle left arrow key
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus()
    }

    // Handle right arrow key
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted data contains only numbers
    if (!/^\d+$/.test(pastedData)) return

    const pastedOtp = pastedData.substring(0, length).split("")
    const newOtp = [...otp]

    for (let i = 0; i < pastedOtp.length; i++) {
      newOtp[i] = pastedOtp[i]
    }

    setOtp(newOtp)

    // Focus the input after the last pasted digit
    const focusIndex = Math.min(pastedOtp.length, length - 1)
    inputRefs.current[focusIndex].focus()

    // Check if OTP is complete
    const otpValue = newOtp.join("")
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue)
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-12 h-12 text-center text-xl rounded-xl bg-secondary dark:bg-secondary border border-input focus:outline-none focus:ring-2 focus:ring-ring"
        />
      ))}
    </div>
  )
}

export default OTPInput

