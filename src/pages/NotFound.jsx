'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"


export default function NotFound() {
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-dot-pattern">
      <div className="text-center space-y-8 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="h-2 w-40 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full my-6" />
          <h2 className="text-2xl font-semibold mb-4">Oops! Meeting Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The meeting room you're looking for might have ended or never existed. 
            Check the link and try again, or start a new meeting.
          </p>
        </motion.div>
        <div className="space-x-4">
          <Button
            onClick={() => router.push('/')}
            size="lg"
            className="rounded-full px-8"
          >
            Go Home
          </Button>
          <Button
            onClick={() => router.push('/video-meeting')}
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            New Meeting
          </Button>
        </div>
      </div>
    </div>
  )
}
