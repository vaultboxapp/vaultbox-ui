"use client"

import { useState } from "react"

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [hasInput, setHasInput] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    
    // Update hasInput whenever values change
    const updatedValues = { ...values, [name]: value }
    const hasAnyInput = Object.values(updatedValues).some(val => val && val.trim() !== '')
    setHasInput(hasAnyInput)

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const validate = (validationSchema) => {
    const newErrors = {}

    Object.keys(validationSchema).forEach((field) => {
      const value = values[field]
      const fieldRules = validationSchema[field]

      if (fieldRules.required && (!value || value.trim() === "")) {
        newErrors[field] = fieldRules.required
      } else if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        newErrors[field] = fieldRules.message
      } else if (fieldRules.minLength && value.length < fieldRules.minLength) {
        newErrors[field] = `Must be at least ${fieldRules.minLength} characters`
      } else if (fieldRules.match && values[fieldRules.match] !== value) {
        newErrors[field] = `Must match ${fieldRules.match}`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    resetForm,
    setValues,
    setErrors,
    isValid: Object.keys(errors).length === 0,
    hasInput,
  }
}

