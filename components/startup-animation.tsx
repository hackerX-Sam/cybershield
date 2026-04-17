"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Shield, CheckCircle } from "lucide-react"

interface StartupAnimationProps {
  onComplete: () => void
  isVisible: boolean
}

export function StartupAnimation({ onComplete, isVisible }: StartupAnimationProps) {
  const steps = [
    { text: "Initializing security modules", delay: 0.6 },
    { text: "Loading threat database", delay: 1.2 },
    { text: "Starting real-time protection", delay: 1.8 },
    { text: "System ready", delay: 2.4, isComplete: true },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-20 cyber-grid" />
          
          <div className="relative flex flex-col items-center gap-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              {/* Pulse effect */}
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 w-20 h-20 rounded-full bg-primary/30"
              />
              
              {/* Shield container */}
              <motion.div
                className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
                style={{
                  boxShadow: "0 0 30px oklch(0.75 0.18 180 / 0.3)"
                }}
              >
                <Shield className="w-10 h-10 text-primary" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                CyberShield Pro
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Advanced Protection System
              </p>
            </motion.div>

            {/* Loading steps */}
            <div className="flex flex-col gap-2 min-w-[260px]">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: step.delay + 0.15, type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle 
                      className={`w-4 h-4 ${
                        step.isComplete ? 'text-accent' : 'text-primary/70'
                      }`} 
                    />
                  </motion.div>
                  <span 
                    className={`text-sm ${
                      step.isComplete 
                        ? 'text-accent font-medium' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="w-64 h-1.5 bg-muted rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 2.4, ease: "easeInOut" }}
                onAnimationComplete={onComplete}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </motion.div>

            {/* Version */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              className="text-xs text-muted-foreground/60 font-mono"
            >
              v2.1.0
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
