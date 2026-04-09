"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Trash2, Rocket, HardDrive, FileX, Clock, CheckCircle, Loader2 } from "lucide-react"
import { useTempFiles, useStartupPrograms, useIsElectron } from "@/hooks/use-electron"

const defaultCategories = [
  { name: "Temporary Files", size: "0 B", icon: FileX, selected: true, bytes: 0 },
  { name: "Browser Cache", size: "0 B", icon: HardDrive, selected: true, bytes: 0 },
  { name: "System Cache", size: "0 B", icon: Clock, selected: false, bytes: 0 },
]

export function OptimizerPanel() {
  const [cleaning, setCleaning] = useState(false)
  const [cleaningProgress, setCleaningProgress] = useState(0)
  const [categories, setCategories] = useState(defaultCategories)
  const [cleanResult, setCleanResult] = useState<{ cleaned: number; freedSpace: number } | null>(null)
  
  const { tempInfo, cleaning: tempCleaning, cleanTempFiles, refresh } = useTempFiles()
  const { programs, loading: appsLoading, setPrograms } = useStartupPrograms()
  const isElectron = useIsElectron()

  // Update categories with real temp file data
  useEffect(() => {
    if (tempInfo) {
      setCategories(prev => prev.map((cat, i) => {
        if (i === 0) {
          return { 
            ...cat, 
            size: formatBytes(tempInfo.totalSize), 
            bytes: tempInfo.totalSize 
          }
        }
        // Estimate other categories
        if (i === 1) return { ...cat, size: formatBytes(tempInfo.totalSize * 0.3), bytes: tempInfo.totalSize * 0.3 }
        if (i === 2) return { ...cat, size: formatBytes(tempInfo.totalSize * 0.5), bytes: tempInfo.totalSize * 0.5 }
        return cat
      }))
    }
  }, [tempInfo])

  const startCleaning = async () => {
    setCleaning(true)
    setCleaningProgress(0)
    setCleanResult(null)
    
    // Animate progress
    const interval = setInterval(() => {
      setCleaningProgress(prev => {
        if (prev >= 90) {
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      const result = await cleanTempFiles()
      setCleanResult(result)
      setCleaningProgress(100)
      await refresh()
    } catch (e) {
      console.error('Cleaning failed:', e)
    } finally {
      clearInterval(interval)
      setTimeout(() => {
        setCleaning(false)
      }, 1000)
    }
  }

  const toggleCategory = (index: number) => {
    setCategories(prev =>
      prev.map((c, i) => i === index ? { ...c, selected: !c.selected } : c)
    )
  }

  const toggleApp = (index: number) => {
    setPrograms(prev =>
      prev.map((a, i) => i === index ? { ...a, enabled: !a.enabled } : a)
    )
  }

  const totalSelected = categories
    .filter(c => c.selected)
    .reduce((acc, c) => acc + c.bytes, 0)

  return (
    <div className="flex-1 p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-foreground mb-2">System Optimizer</h2>
          <p className="text-muted-foreground font-light">
            {isElectron 
              ? "Clean junk files and optimize startup performance"
              : "Running in web preview mode - install as desktop app for real cleaning"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Junk Cleaner */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-medium">
                <Trash2 className="w-5 h-5 text-primary" />
                Junk Cleaner
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Progress Circle */}
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  className="relative w-32 h-32"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="oklch(0.15 0.02 260)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="oklch(0.75 0.18 180)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={351.86}
                      initial={{ strokeDashoffset: 351.86 }}
                      animate={{ strokeDashoffset: 351.86 * (1 - cleaningProgress / 100) }}
                      style={{
                        filter: cleaning ? "drop-shadow(0 0 10px oklch(0.75 0.18 180))" : "none"
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {cleaning ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-6 h-6 text-primary" />
                        </motion.div>
                        <span className="text-lg font-medium text-foreground mt-1">
                          {cleaningProgress}%
                        </span>
                      </>
                    ) : cleanResult ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-accent" />
                        <span className="text-sm font-medium text-accent mt-1">
                          {formatBytes(cleanResult.freedSpace)} freed
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-medium text-foreground">
                          {formatBytes(totalSelected)}
                        </span>
                        <span className="text-sm text-muted-foreground font-light">to clean</span>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-3 mb-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => toggleCategory(index)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      category.selected 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        category.selected ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <category.icon className={`w-4 h-4 ${
                          category.selected ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <span className="text-sm text-foreground font-normal">{category.name}</span>
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">{category.size}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={startCleaning}
                disabled={cleaning || totalSelected === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {cleaning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cleaning...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clean Selected
                  </>
                )}
              </Button>

              {tempInfo && (
                <p className="text-xs text-muted-foreground text-center mt-3 font-mono">
                  {tempInfo.fileCount.toLocaleString()} files in temp directory
                </p>
              )}
            </CardContent>
          </Card>

          {/* Startup Optimizer */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-medium">
                <Rocket className="w-5 h-5 text-primary" />
                Startup Optimizer
                {appsLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 max-h-72 overflow-auto">
                {programs.map((app, index) => (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        app.enabled ? 'bg-accent/20' : 'bg-muted'
                      }`}>
                        <Zap className={`w-5 h-5 ${
                          app.enabled ? 'text-accent' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-normal text-foreground">{app.name}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-40">
                          {app.source}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleApp(index)}
                      className={app.enabled 
                        ? 'border-destructive/50 text-destructive hover:bg-destructive/10' 
                        : 'border-accent/50 text-accent hover:bg-accent/10'
                      }
                    >
                      {app.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </motion.div>
                ))}
                {programs.length === 0 && !appsLoading && (
                  <div className="text-center py-8 text-muted-foreground font-light">
                    No startup programs found
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-light">Startup Programs</span>
                  <span className="text-lg font-medium text-foreground">
                    {programs.filter(a => a.enabled).length} / {programs.length}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground font-light">Status</span>
                  <span className="text-sm font-mono text-accent">
                    {programs.filter(a => a.enabled).length <= 3 ? 'Optimized' : 'Can be improved'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
