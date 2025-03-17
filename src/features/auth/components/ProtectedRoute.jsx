import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

const ProtectedRoute = ({ children, requireMfa = false }) => {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Set a timeout to prevent infinite loading state
    const timer = setTimeout(() => {
      setIsInitializing(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading || (isInitializing && location.search.includes('refreshToken'))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireMfa && !user?.mfaEnabled) {
    return <Navigate to="/enable-mfa" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

