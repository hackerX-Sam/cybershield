"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scan, Play, Square, FolderOpen, Zap, HardDrive, FileSearch, AlertTriangle, CheckCircle } from "lucide-react"
import { useScanner, useIsElectron } from "@/hooks/use-electron"

const scanTypes = [
  {
    id: "quick",
    name: "Quick Scan",
    description: "Scan critical system areas",
    icon: Zap,
    directory: undefined
  },
  {
    id: "full",
    name: "Full Scan",
    description: "Deep scan of entire system",
    icon: HardDrive,
    directory: undefined
  },
  {
    id: "custom",
    name: "Custom Scan",
    description: "Select specific folders",
    icon: FolderOpen,
    directory: "custom"
  },
]

export function ScanPanel() {
  const [selectedScan, setSelectedScan] = useState<string | null>(null)
  const { scanning, progress, result, startScan, stopScan } = useScanner()
  const isElectron = useIsElectron()

  const handleStartScan = async (scanId: string) => {
    setSelectedScan(scanId)
    const scanType = scanTypes.find(s => s.id === scanId)
    
    if (scanType?.directory === "custom" && isElectron && window.electronAPI) {
      const dir = await window.electronAPI.selectDirectory()
      if (dir) {
        startScan(dir)
      }
    } else {
      startScan()
    }
  }

  const handleStopScan = () => {
    stopScan()
  }

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-1 lg:mb-2">System Scan</h2>
          <p className="text-sm lg:text-base text-muted-foreground font-light">
            {isElectron 
              ? "Detect and remove threats from your system"
              : "Running in web preview mode - install as desktop app for real scanning"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Scan Options */}
          <div className="flex flex-col gap-3 lg:gap-4 order-2 lg:order-1">
            {scanTypes.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`glass border-border cursor-pointer transition-all duration-300 hover:border-primary/50 ${
                    selectedScan === scan.id && scanning ? 'border-primary neon-glow-cyan' : ''
                  }`}
                  onClick={() => !scanning && handleStartScan(scan.id)}
                >
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <scan.icon className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm lg:text-base">{scan.name}</h3>
                        <p className="text-xs lg:text-sm text-muted-foreground font-light truncate">{scan.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={scanning && selectedScan !== scan.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (selectedScan === scan.id && scanning) {
                            handleStopScan()
                          } else {
                            handleStartScan(scan.id)
                          }
                        }}
                        className="border-primary/50 text-primary hover:bg-primary/20 shrink-0"
                      >
                        {selectedScan === scan.id && scanning ? (
                          <Square className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Radar Scanner */}
          <Card className="glass border-border order-1 lg:order-2">
            <CardHeader className="pb-2 lg:pb-6">
              <CardTitle className="flex items-center gap-2 font-medium text-sm lg:text-base">
                <Scan className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Scan Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                {/* Radar Animation */}
                <div className="relative w-48 h-48 lg:w-64 lg:h-64 mb-4 lg:mb-6">
                  {/* Background circles */}
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-primary/20"
                      style={{
                        width: `${i * 25}%`,
                        height: `${i * 25}%`,
                        top: `${50 - (i * 12.5)}%`,
                        left: `${50 - (i * 12.5)}%`,
                      }}
                    />
                  ))}
                  
                  {/* Cross lines */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-primary/20" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-px bg-primary/20" />
                  </div>
                  
                  {/* Radar sweep */}
                  <AnimatePresence>
                    {scanning && (
                      <motion.div
                        className="absolute inset-0"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <div
                          className="absolute top-1/2 left-1/2 w-1/2 h-1"
                          style={{
                            background: "linear-gradient(90deg, oklch(0.8 0.15 190 / 0.8), transparent)",
                            transformOrigin: "left center",
                            boxShadow: "0 0 20px oklch(0.8 0.15 190 / 0.5)",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Center icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {result && !scanning ? (
                      result.threatsFound.length > 0 ? (
                        <AlertTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-destructive" />
                      ) : (
                        <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-accent" />
                      )
                    ) : (
                      <motion.div
                        animate={scanning ? { scale: [1, 1.5, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-primary"
                        style={{ boxShadow: "0 0 20px oklch(0.8 0.15 190)" }}
                      />
                    )}
                  </div>
                  
                  {/* Threat indicators */}
                  {progress && progress.threatsFound > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute"
                      style={{
                        top: "30%",
                        left: "60%",
                      }}
                    >
                      <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-destructive animate-pulse"
                        style={{ boxShadow: "0 0 10px oklch(0.65 0.25 25)" }}
                      />
                    </motion.div>
                  )}
                </div>
                
                {/* Progress */}
                {(scanning || progress || result) ? (
                  <div className="w-full">
                    {scanning && progress && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs lg:text-sm font-mono text-muted-foreground">
                            Scanning...
                          </span>
                          <span className="text-xs lg:text-sm font-mono text-muted-foreground">
                            {progress.filesScanned.toLocaleString()} files
                          </span>
                        </div>
                        <div className="h-1.5 lg:h-2 bg-muted rounded-full overflow-hidden mb-3 lg:mb-4">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 30, repeat: Infinity }}
                            style={{ 
                              boxShadow: "0 0 10px oklch(0.8 0.15 190)"
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground font-mono truncate text-center">
                          {progress.currentFile}
                        </p>
                      </>
                    )}
                    
                    {/* Results */}
                    {result && !scanning && (
                      <div className="text-center">
                        <div className={`text-lg lg:text-xl font-medium mb-2 ${
                          result.threatsFound.length > 0 ? 'text-destructive' : 'text-accent'
                        }`}>
                          {result.threatsFound.length > 0 
                            ? `${result.threatsFound.length} Threats Found`
                            : 'No Threats Found'
                          }
                        </div>
                        <p className="text-xs lg:text-sm text-muted-foreground mb-4">
                          Scanned {result.filesScanned.toLocaleString()} files in {Math.round(result.duration / 1000)}s
                        </p>
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 lg:gap-4 mt-3 lg:mt-4">
                      <div className="text-center p-2 lg:p-3 rounded-lg bg-muted/50">
                        <p className="text-xl lg:text-2xl font-semibold text-foreground">
                          {(progress?.filesScanned || result?.filesScanned || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground font-light">Files Scanned</p>
                      </div>
                      <div className="text-center p-2 lg:p-3 rounded-lg bg-muted/50">
                        <p className={`text-xl lg:text-2xl font-semibold ${
                          (progress?.threatsFound || result?.threatsFound.length || 0) > 0 
                            ? 'text-destructive' 
                            : 'text-accent'
                        }`}>
                          {progress?.threatsFound || result?.threatsFound.length || 0}
                        </p>
                        <p className="text-xs text-muted-foreground font-light">Threats Found</p>
                      </div>
                    </div>
                    
                    {/* Threat list */}
                    {result && result.threatsFound.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs lg:text-sm font-medium text-foreground mb-2">Detected Threats:</h4>
                        <div className="max-h-24 lg:max-h-32 overflow-auto">
                          {result.threatsFound.map((threat, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs p-2 bg-destructive/10 rounded mb-1">
                              <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
                              <span className="truncate font-mono text-muted-foreground">{threat.path}</span>
                              <span className={`shrink-0 px-1.5 py-0.5 rounded text-xs ${
                                threat.threatLevel === 'high' 
                                  ? 'bg-destructive/20 text-destructive' 
                                  : 'bg-orange-500/20 text-orange-400'
                              }`}>
                                {threat.threatLevel}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center font-light">
                    Select a scan type to begin
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
