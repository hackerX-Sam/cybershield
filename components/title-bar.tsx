"use client"

import { motion } from "framer-motion"
import { Minus, Square, X, Shield } from "lucide-react"
import { useWindowControls, useIsElectron } from "@/hooks/use-electron"

export function TitleBar() {
  const { minimize, maximize, close, isElectron } = useWindowControls()

  // Only show custom title bar in Electron
  if (!isElectron) {
    return null
  }

  return (
    <div 
      className="h-8 bg-background/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* App Title */}
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-foreground">CyberShield Pro</span>
      </div>

      {/* Window Controls */}
      <div 
        className="flex items-center gap-1"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={minimize}
          className="w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
        >
          <Minus className="w-3 h-3 text-muted-foreground" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={maximize}
          className="w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
        >
          <Square className="w-3 h-3 text-muted-foreground" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'oklch(0.6 0.25 25)' }}
          whileTap={{ scale: 0.9 }}
          onClick={close}
          className="w-8 h-6 flex items-center justify-center rounded hover:bg-destructive transition-colors"
        >
          <X className="w-3 h-3 text-muted-foreground hover:text-white" />
        </motion.button>
      </div>
    </div>
  )
}
