"use client"

import { motion } from "framer-motion"
import { Shield, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const protectionModules = [
  { name: "Real-time Protection", enabled: true },
  { name: "Web Protection", enabled: true },
  { name: "Firewall", enabled: true },
  { name: "USB Shield", enabled: true },
  { name: "AI Detection", enabled: true },
]

export function ProtectionStatus() {
  return (
    <Card className="glass border-border h-full">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-base lg:text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
          Protection Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Main status indicator */}
        <div className="flex flex-col items-center mb-4 lg:mb-6">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Pulsing rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-accent/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                style={{
                  margin: `-${(i + 1) * 10}px`,
                }}
              />
            ))}
            
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-accent/20 flex items-center justify-center neon-glow-green">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-accent/30"
              />
              <Shield className="w-10 h-10 lg:w-12 lg:h-12 text-accent" />
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 lg:mt-4 text-base lg:text-lg font-semibold text-accent neon-text-green"
          >
            FULLY PROTECTED
          </motion.p>
          <p className="text-xs lg:text-sm text-muted-foreground font-light">
            All systems operational
          </p>
        </div>

        {/* Module list */}
        <div className="flex flex-col gap-1.5 lg:gap-2">
          {protectionModules.map((module, index) => (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-muted/50"
            >
              <span className="text-xs lg:text-sm text-foreground">{module.name}</span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center ${
                  module.enabled ? 'bg-accent/20' : 'bg-muted'
                }`}
              >
                {module.enabled && <Check className="w-3 h-3 lg:w-4 lg:h-4 text-accent" />}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
