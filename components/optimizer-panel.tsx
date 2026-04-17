"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  Trash2, 
  Rocket, 
  HardDrive, 
  FileX, 
  Clock, 
  CheckCircle, 
  Loader2,
  Shield,
  Lock,
  Unlock,
  RotateCcw,
  AlertTriangle,
  FolderOpen,
  File,
  RefreshCw,
  History,
  Database,
  Cpu,
  MemoryStick,
  Activity
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CleanupCategory {
  id: string
  name: string
  description: string
  icon: typeof FileX
  size: number
  fileCount: number
  selected: boolean
}

interface StartupProgram {
  id: string
  name: string
  path: string
  enabled: boolean
  impact: 'low' | 'medium' | 'high'
  source: string
}

interface QuarantinedItem {
  id: string
  fileName: string
  path: string
  threatType: string
  quarantinedAt: Date
  size: string
  status: 'quarantined' | 'restored' | 'deleted'
}

interface CleanupHistory {
  id: string
  type: string
  freedSpace: number
  filesRemoved: number
  timestamp: Date
}

// Mock data
const defaultCategories: CleanupCategory[] = [
  { id: '1', name: "Temporary Files", description: "Windows temp files and cache", icon: FileX, size: 2.1 * 1024 * 1024 * 1024, fileCount: 1523, selected: true },
  { id: '2', name: "Browser Cache", description: "Cached web pages and images", icon: HardDrive, size: 856 * 1024 * 1024, fileCount: 4521, selected: true },
  { id: '3', name: "System Cache", description: "Windows system cache files", icon: Database, size: 1.3 * 1024 * 1024 * 1024, fileCount: 892, selected: false },
  { id: '4', name: "Recycle Bin", description: "Deleted files in recycle bin", icon: Trash2, size: 3.2 * 1024 * 1024 * 1024, fileCount: 156, selected: false },
  { id: '5', name: "Log Files", description: "Application and system logs", icon: File, size: 234 * 1024 * 1024, fileCount: 89, selected: true },
  { id: '6', name: "Update Cache", description: "Windows update residual files", icon: RefreshCw, size: 1.8 * 1024 * 1024 * 1024, fileCount: 45, selected: false },
]

const defaultStartupPrograms: StartupProgram[] = [
  { id: '1', name: 'Discord', path: 'C:\\Users\\User\\AppData\\Local\\Discord\\Update.exe', enabled: true, impact: 'medium', source: 'Registry' },
  { id: '2', name: 'Spotify', path: 'C:\\Users\\User\\AppData\\Roaming\\Spotify\\Spotify.exe', enabled: true, impact: 'low', source: 'Registry' },
  { id: '3', name: 'Steam', path: 'C:\\Program Files (x86)\\Steam\\steam.exe', enabled: false, impact: 'high', source: 'Registry' },
  { id: '4', name: 'OneDrive', path: 'C:\\Program Files\\Microsoft OneDrive\\OneDrive.exe', enabled: true, impact: 'medium', source: 'Registry' },
  { id: '5', name: 'CyberShield Pro', path: 'C:\\Program Files\\CyberShield Pro\\CyberShieldPro.exe', enabled: true, impact: 'low', source: 'Registry' },
  { id: '6', name: 'Adobe Creative Cloud', path: 'C:\\Program Files\\Adobe\\Adobe Creative Cloud\\ACC\\Creative Cloud.exe', enabled: true, impact: 'high', source: 'Startup Folder' },
  { id: '7', name: 'Microsoft Teams', path: 'C:\\Users\\User\\AppData\\Local\\Microsoft\\Teams\\Update.exe', enabled: true, impact: 'medium', source: 'Registry' },
  { id: '8', name: 'Nvidia GeForce Experience', path: 'C:\\Program Files\\NVIDIA Corporation\\NVIDIA GeForce Experience\\NVIDIA GeForce Experience.exe', enabled: false, impact: 'medium', source: 'Registry' },
]

const defaultQuarantinedItems: QuarantinedItem[] = [
  { id: '1', fileName: 'suspicious_setup.exe', path: 'C:\\Users\\User\\Downloads\\suspicious_setup.exe', threatType: 'Trojan.Generic', quarantinedAt: new Date(Date.now() - 86400000), size: '2.4 MB', status: 'quarantined' },
  { id: '2', fileName: 'crack_keygen.exe', path: 'C:\\Users\\User\\Desktop\\crack_keygen.exe', threatType: 'HackTool.Keygen', quarantinedAt: new Date(Date.now() - 172800000), size: '1.2 MB', status: 'quarantined' },
  { id: '3', fileName: 'malware.dll', path: 'C:\\Windows\\Temp\\malware.dll', threatType: 'Malware.Win32', quarantinedAt: new Date(Date.now() - 259200000), size: '856 KB', status: 'quarantined' },
]

export function OptimizerPanel() {
  const [activeTab, setActiveTab] = useState('cleanup')
  const [categories, setCategories] = useState(defaultCategories)
  const [startupPrograms, setStartupPrograms] = useState(defaultStartupPrograms)
  const [quarantinedItems, setQuarantinedItems] = useState(defaultQuarantinedItems)
  const [cleanupHistory, setCleanupHistory] = useState<CleanupHistory[]>([])
  
  const [cleaning, setCleaning] = useState(false)
  const [cleaningProgress, setCleaningProgress] = useState(0)
  const [currentCleaningItem, setCurrentCleaningItem] = useState('')
  const [cleanResult, setCleanResult] = useState<{ cleaned: number; freedSpace: number } | null>(null)
  
  const [analyzing, setAnalyzing] = useState(false)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)

  // System stats simulation
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 68,
    startupTime: 28,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(40, Math.min(85, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        diskUsage: prev.diskUsage,
        startupTime: prev.startupTime,
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const analyzeSystem = useCallback(async () => {
    setAnalyzing(true)
    
    // Simulate analysis
    for (let i = 0; i < categories.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setCategories(prev => prev.map((cat, index) => {
        if (index === i) {
          return {
            ...cat,
            size: cat.size + (Math.random() - 0.3) * 500 * 1024 * 1024,
            fileCount: cat.fileCount + Math.floor(Math.random() * 100),
          }
        }
        return cat
      }))
    }
    
    setAnalyzing(false)
  }, [categories.length])

  const startCleaning = async () => {
    const selectedCategories = categories.filter(c => c.selected)
    if (selectedCategories.length === 0) return
    
    setCleaning(true)
    setCleaningProgress(0)
    setCleanResult(null)
    
    let totalFreed = 0
    let totalCleaned = 0
    
    for (let i = 0; i < selectedCategories.length; i++) {
      const category = selectedCategories[i]
      setCurrentCleaningItem(category.name)
      
      // Simulate cleaning each category
      const steps = 10
      for (let step = 0; step < steps; step++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        const overallProgress = ((i * steps + step) / (selectedCategories.length * steps)) * 100
        setCleaningProgress(overallProgress)
      }
      
      totalFreed += category.size
      totalCleaned += category.fileCount
    }
    
    setCleaningProgress(100)
    setCurrentCleaningItem('')
    
    // Update categories to show cleaned
    setCategories(prev => prev.map(cat => 
      cat.selected ? { ...cat, size: 0, fileCount: 0 } : cat
    ))
    
    // Add to history
    const historyItem: CleanupHistory = {
      id: `hist-${Date.now()}`,
      type: selectedCategories.map(c => c.name).join(', '),
      freedSpace: totalFreed,
      filesRemoved: totalCleaned,
      timestamp: new Date(),
    }
    setCleanupHistory(prev => [historyItem, ...prev].slice(0, 10))
    
    setCleanResult({ cleaned: totalCleaned, freedSpace: totalFreed })
    
    setTimeout(() => {
      setCleaning(false)
    }, 1000)
  }

  const toggleCategory = (categoryId: string) => {
    setCategories(prev =>
      prev.map(c => c.id === categoryId ? { ...c, selected: !c.selected } : c)
    )
  }

  const toggleStartupProgram = async (programId: string) => {
    setActionInProgress(programId)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setStartupPrograms(prev =>
      prev.map(p => p.id === programId ? { ...p, enabled: !p.enabled } : p)
    )
    
    setActionInProgress(null)
  }

  const restoreQuarantinedItem = async (itemId: string) => {
    setActionInProgress(itemId)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setQuarantinedItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, status: 'restored' } : item)
    )
    
    setActionInProgress(null)
  }

  const deleteQuarantinedItem = async (itemId: string) => {
    setActionInProgress(itemId)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setQuarantinedItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, status: 'deleted' } : item)
    )
    
    setActionInProgress(null)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const totalSelected = categories
    .filter(c => c.selected)
    .reduce((acc, c) => acc + c.size, 0)

  const activeQuarantined = quarantinedItems.filter(i => i.status === 'quarantined')

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-1 lg:mb-2">System Optimizer</h2>
          <p className="text-sm lg:text-base text-muted-foreground font-light">
            Clean junk files, manage startup programs, and handle quarantined threats
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <Card className="glass border-border">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CPU Usage</p>
                  <p className="text-lg font-medium text-foreground">{Math.round(systemStats.cpuUsage)}%</p>
                </div>
              </div>
              <Progress value={systemStats.cpuUsage} className="h-1 mt-2" />
            </CardContent>
          </Card>
          <Card className="glass border-border">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MemoryStick className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Memory</p>
                  <p className="text-lg font-medium text-foreground">{Math.round(systemStats.memoryUsage)}%</p>
                </div>
              </div>
              <Progress value={systemStats.memoryUsage} className="h-1 mt-2" />
            </CardContent>
          </Card>
          <Card className="glass border-border">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Disk Space</p>
                  <p className="text-lg font-medium text-foreground">{systemStats.diskUsage}%</p>
                </div>
              </div>
              <Progress value={systemStats.diskUsage} className="h-1 mt-2" />
            </CardContent>
          </Card>
          <Card className="glass border-border">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Boot Time</p>
                  <p className="text-lg font-medium text-foreground">{systemStats.startupTime}s</p>
                </div>
              </div>
              <Progress value={Math.max(0, 100 - (systemStats.startupTime - 15) * 3)} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 lg:mb-6">
            <TabsTrigger value="cleanup" className="text-xs lg:text-sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Cleanup
            </TabsTrigger>
            <TabsTrigger value="startup" className="text-xs lg:text-sm">
              <Rocket className="w-4 h-4 mr-2" />
              Startup
            </TabsTrigger>
            <TabsTrigger value="quarantine" className="text-xs lg:text-sm">
              <Lock className="w-4 h-4 mr-2" />
              Quarantine
              {activeQuarantined.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">
                  {activeQuarantined.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Cleanup Tab */}
          <TabsContent value="cleanup">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Cleanup Categories */}
              <Card className="glass border-border">
                <CardHeader className="pb-2 lg:pb-4">
                  <CardTitle className="flex items-center justify-between text-sm lg:text-base font-medium">
                    <span className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                      Junk Categories
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={analyzeSystem}
                      disabled={analyzing || cleaning}
                      className="text-xs"
                    >
                      {analyzing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      <span className="ml-1">Analyze</span>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 lg:gap-3 max-h-72 overflow-auto">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => !cleaning && toggleCategory(category.id)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                          category.selected 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'bg-muted/30 hover:bg-muted/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            category.selected ? 'bg-primary/20' : 'bg-muted'
                          }`}>
                            <category.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${
                              category.selected ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs lg:text-sm font-medium text-foreground truncate">{category.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{category.description}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="text-sm font-mono text-foreground">{formatBytes(category.size)}</p>
                          <p className="text-xs text-muted-foreground">{category.fileCount.toLocaleString()} files</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cleanup Progress */}
              <Card className="glass border-border">
                <CardHeader className="pb-2 lg:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm lg:text-base font-medium">
                    <Trash2 className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    Cleanup Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-4 lg:py-6">
                    {/* Progress Circle */}
                    <motion.div
                      className="relative w-32 h-32 lg:w-40 lg:h-40 mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="oklch(0.15 0.02 260)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="oklch(0.75 0.18 180)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                          animate={{ strokeDashoffset: (2 * Math.PI * 45) * (1 - cleaningProgress / 100) }}
                          style={{
                            filter: cleaning ? "drop-shadow(0 0 10px oklch(0.75 0.18 180))" : "none"
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {cleaning ? (
                          <>
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            <span className="text-lg font-medium text-foreground mt-1">
                              {Math.round(cleaningProgress)}%
                            </span>
                          </>
                        ) : cleanResult ? (
                          <>
                            <CheckCircle className="w-8 h-8 text-accent" />
                            <span className="text-sm font-medium text-accent mt-1">
                              {formatBytes(cleanResult.freedSpace)}
                            </span>
                            <span className="text-xs text-muted-foreground">freed</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl lg:text-2xl font-medium text-foreground">
                              {formatBytes(totalSelected)}
                            </span>
                            <span className="text-xs text-muted-foreground">to clean</span>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {cleaning && currentCleaningItem && (
                      <p className="text-xs text-muted-foreground mb-4 font-mono">
                        Cleaning: {currentCleaningItem}
                      </p>
                    )}

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
                          Clean Selected ({formatBytes(totalSelected)})
                        </>
                      )}
                    </Button>

                    {/* Cleanup History */}
                    {cleanupHistory.length > 0 && (
                      <div className="w-full mt-4">
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <History className="w-3 h-3" />
                          Recent Cleanups
                        </p>
                        <div className="flex flex-col gap-2 max-h-24 overflow-auto">
                          {cleanupHistory.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
                              <span className="text-muted-foreground truncate">{item.type}</span>
                              <span className="text-accent font-mono">{formatBytes(item.freedSpace)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Startup Tab */}
          <TabsContent value="startup">
            <Card className="glass border-border">
              <CardHeader className="pb-2 lg:pb-4">
                <CardTitle className="flex items-center justify-between text-sm lg:text-base font-medium">
                  <span className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    Startup Programs
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {startupPrograms.filter(p => p.enabled).length} / {startupPrograms.length} enabled
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 max-h-96 overflow-auto">
                  {startupPrograms.map((program, index) => (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 lg:p-4 rounded-lg transition-all ${
                        program.enabled ? 'bg-muted/30' : 'bg-muted/10 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shrink-0 ${
                          program.enabled ? 'bg-accent/20' : 'bg-muted'
                        }`}>
                          <Zap className={`w-5 h-5 lg:w-6 lg:h-6 ${
                            program.enabled ? 'text-accent' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{program.name}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              program.impact === 'high' ? 'bg-destructive/20 text-destructive' :
                              program.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                              'bg-accent/20 text-accent'
                            }`}>
                              {program.impact}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono truncate max-w-48 lg:max-w-96">
                            {program.path}
                          </p>
                          <p className="text-xs text-muted-foreground">{program.source}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStartupProgram(program.id)}
                        disabled={actionInProgress === program.id}
                        className={program.enabled 
                          ? 'border-destructive/50 text-destructive hover:bg-destructive/10' 
                          : 'border-accent/50 text-accent hover:bg-accent/10'
                        }
                      >
                        {actionInProgress === program.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : program.enabled ? (
                          'Disable'
                        ) : (
                          'Enable'
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-4 p-4 rounded-lg bg-muted/30">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Programs</p>
                      <p className="text-lg font-medium text-foreground">{startupPrograms.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Enabled</p>
                      <p className="text-lg font-medium text-accent">{startupPrograms.filter(p => p.enabled).length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">High Impact</p>
                      <p className="text-lg font-medium text-destructive">{startupPrograms.filter(p => p.enabled && p.impact === 'high').length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className={`text-sm font-mono ${
                        startupPrograms.filter(p => p.enabled && p.impact === 'high').length > 1 
                          ? 'text-yellow-500' 
                          : 'text-accent'
                      }`}>
                        {startupPrograms.filter(p => p.enabled && p.impact === 'high').length > 1 
                          ? 'Can Improve' 
                          : 'Optimized'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quarantine Tab */}
          <TabsContent value="quarantine">
            <Card className="glass border-border">
              <CardHeader className="pb-2 lg:pb-4">
                <CardTitle className="flex items-center justify-between text-sm lg:text-base font-medium">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    Quarantined Items
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {activeQuarantined.length} active items
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quarantinedItems.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    <AnimatePresence>
                      {quarantinedItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-3 lg:p-4 rounded-lg border transition-all ${
                            item.status === 'quarantined' 
                              ? 'bg-destructive/10 border-destructive/30' 
                              : item.status === 'restored'
                              ? 'bg-yellow-500/10 border-yellow-500/30'
                              : 'bg-muted/30 border-border opacity-50'
                          }`}
                        >
                          <div className="flex items-start gap-3 lg:gap-4">
                            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shrink-0 ${
                              item.status === 'quarantined' ? 'bg-destructive/20' :
                              item.status === 'restored' ? 'bg-yellow-500/20' :
                              'bg-muted'
                            }`}>
                              {item.status === 'quarantined' ? (
                                <Lock className="w-5 h-5 lg:w-6 lg:h-6 text-destructive" />
                              ) : item.status === 'restored' ? (
                                <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
                              ) : (
                                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-accent" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-medium text-foreground">{item.fileName}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.status === 'quarantined' ? 'bg-destructive/20 text-destructive' :
                                  item.status === 'restored' ? 'bg-yellow-500/20 text-yellow-500' :
                                  'bg-accent/20 text-accent'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 font-mono truncate">
                                {item.path}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span>{item.threatType}</span>
                                <span>{item.size}</span>
                                <span>{new Date(item.quarantinedAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {item.status === 'quarantined' && (
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => restoreQuarantinedItem(item.id)}
                                  disabled={actionInProgress === item.id}
                                  className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                                  title="Restore (Not Recommended)"
                                >
                                  {actionInProgress === item.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Unlock className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteQuarantinedItem(item.id)}
                                  disabled={actionInProgress === item.id}
                                  className="border-accent/50 text-accent hover:bg-accent/10"
                                  title="Delete Permanently"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Quarantine Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activeQuarantined.length === 0}
                        className="flex-1 border-accent/50 text-accent hover:bg-accent/10"
                        onClick={async () => {
                          for (const item of activeQuarantined) {
                            await deleteQuarantinedItem(item.id)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 mx-auto mb-3 text-accent" />
                    <p className="text-muted-foreground">No quarantined items</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Threats detected during scans will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
