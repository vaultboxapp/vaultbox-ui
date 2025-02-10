import { Logo } from "./Logo"; // Ensure correct path
import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Logo className="h-16 w-auto" />
        </motion.div>

      </motion.div>
    </div>
  );
}
