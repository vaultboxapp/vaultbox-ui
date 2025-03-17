// App.jsx
"use client"

import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/features/auth/context/AuthContext"
import { ThemeProvider } from "./components/Theme/ThemeProvider"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppRoutes from "@/features/auth/routes"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider>
              <AppRoutes />
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
