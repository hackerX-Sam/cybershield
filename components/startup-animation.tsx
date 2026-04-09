"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Shield, Lock, CheckCircle } from "lucide-react"

interface StartupAnimationProps {
  onComplete: () => void
  isVisible: boolean
}

export function StartupAnimation({ onComplete, isVisible }: StartupAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background cyber-grid"
        >
          <div className="flex flex-col items-center gap-8">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2 
              }}
              className="relative"
            >
              {/* Outer ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 0.5, 0.3] }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="absolute inset-0 w-28 h-28 lg:w-32 lg:h-32 rounded-full border-2 border-primary/30"
                style={{ margin: "-16px" }}
              />
              
              {/* Pulsing rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 2,
                    delay: 0.8 + i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  }}
                  className="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 rounded-full border border-primary/50"
                />
              ))}
              
              {/* Shield icon */}
              <motion.div
                className="relative w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center rounded-full bg-primary/20 neon-glow-cyan"
              >
                <Shield className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
              </motion.div>
            </motion.div>

            {/* Text animations */}
            <div className="flex flex-col items-center gap-3 lg:gap-4 px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-2xl lg:text-4xl font-semibold text-foreground neon-text-cyan text-center"
              >
                CyberShield Pro
              </motion.h1>
              
              {/* Loading steps */}
              <div className="flex flex-col items-center gap-2 mt-4">
                {[
                  { text: "Initializing Core Systems", delay: 1.2 },
                  { text: "Loading Threat Database", delay: 1.8 },
                  { text: "Activating Real-Time Protection", delay: 2.4 },
                  { text: "System Secured", delay: 3.0, isComplete: true },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: step.delay, duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    {step.isComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: step.delay + 0.2, type: "spring" }}
                      >
                        <CheckCircle className="w-4 h-4 text-accent" />
                      </motion.div>
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm font-mono ${step.isComplete ? 'text-accent neon-text-green' : 'text-muted-foreground'}`}>
                      {step.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              className="w-64 lg:w-80 h-1 bg-muted rounded-full overflow-hidden mt-4"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 2.5, ease: "easeInOut" }}
                onAnimationComplete={onComplete}
                className="h-full bg-primary rounded-full"
                style={{
                  boxShadow: "0 0 10px oklch(0.8 0.15 190 / 0.8)"
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
