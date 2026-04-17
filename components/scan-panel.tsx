"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Scan, 
  Play, 
  Square, 
  FolderOpen, 
  Zap, 
  HardDrive, 
  FileSearch, 
  AlertTriangle, 
  CheckCircle,
  Shield,
  Trash2,
  FileWarning,
  Lock,
  RotateCcw,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Bug,
  Clock
} from "lucide-react"

interface ThreatInfo {
  id: string
  fileName: string
  path: string
  threatType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'detected' | 'quarantined' | 'cleaned' | 'ignored'
  size: string
  detectedAt: Date
}

interface ScanResult {
  filesScanned: number
  foldersScanned: number
  threatsFound: ThreatInfo[]
  duration: number
  scanType: string
}

// Simulated threat database
const threatDatabase: Omit<ThreatInfo, 'id' | 'status' | 'detectedAt'>[] = [
  { fileName: "trojan_downloader.exe", path: "C:\\Users\\User\\Downloads\\trojan_downloader.exe", threatType: "Trojan.Downloader.Generic", severity: "critical", size: "2.4 MB" },
  { fileName: "malware_payload.dll", path: "C:\\Windows\\Temp\\malware_payload.dll", threatType: "Malware.Win32.Generic", severity: "critical", size: "856 KB" },
  { fileName: "suspicious_script.vbs", path: "C:\\Users\\User\\AppData\\Local\\Temp\\suspicious_script.vbs", threatType: "VBS.Suspicious.Script", severity: "high", size: "12 KB" },
  { fileName: "adware_installer.exe", path: "C:\\Users\\User\\Downloads\\free_game\\adware_installer.exe", threatType: "PUP.Adware.Generic", severity: "medium", size: "5.1 MB" },
  { fileName: "crypto_miner.exe", path: "C:\\ProgramData\\hidden\\crypto_miner.exe", threatType: "CryptoMiner.Win32", severity: "high", size: "3.2 MB" },
  { fileName: "keylogger.sys", path: "C:\\Windows\\System32\\drivers\\keylogger.sys", threatType: "Spyware.Keylogger", severity: "critical", size: "128 KB" },
  { fileName: "ransomware_stub.exe", path: "C:\\Users\\User\\Desktop\\ransomware_stub.exe", threatType: "Ransom.Generic", severity: "critical", size: "1.8 MB" },
  { fileName: "browser_hijacker.dll", path: "C:\\Program Files\\Browser\\Plugins\\browser_hijacker.dll", threatType: "Hijacker.Browser", severity: "medium", size: "456 KB" },
]

// Simulated file paths for scanning animation
const mockScanPaths = [
  "C:\\Windows\\System32\\kernel32.dll",
  "C:\\Windows\\System32\\ntdll.dll",
  "C:\\Program Files\\Chrome\\chrome.exe",
  "C:\\Program Files\\Microsoft Office\\WINWORD.EXE",
  "C:\\Users\\User\\Documents\\report.docx",
  "C:\\Users\\User\\Downloads\\installer.exe",
  "C:\\Windows\\SysWOW64\\user32.dll",
  "C:\\Program Files (x86)\\Steam\\steam.exe",
  "C:\\Users\\User\\AppData\\Local\\Temp\\cache.dat",
  "C:\\Windows\\Prefetch\\CHROME.EXE-*.pf",
  "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\*.lnk",
  "C:\\Users\\User\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk",
]

const scanTypes = [
  {
    id: "quick",
    name: "Quick Scan",
    description: "Scan critical system areas and running processes",
    icon: Zap,
    duration: 15000, // 15 seconds
    filesEstimate: 5000,
    threatChance: 0.3,
  },
  {
    id: "full",
    name: "Full System Scan",
    description: "Deep scan of entire system including all files",
    icon: HardDrive,
    duration: 45000, // 45 seconds
    filesEstimate: 150000,
    threatChance: 0.6,
  },
  {
    id: "custom",
    name: "Custom Scan",
    description: "Select specific folders to scan",
    icon: FolderOpen,
    duration: 20000,
    filesEstimate: 25000,
    threatChance: 0.4,
  },
]

export function ScanPanel() {
  const [selectedScan, setSelectedScan] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState("")
  const [filesScanned, setFilesScanned] = useState(0)
  const [foldersScanned, setFoldersScanned] = useState(0)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [detectedThreats, setDetectedThreats] = useState<ThreatInfo[]>([])
  const [cleaningThreat, setCleaningThreat] = useState<string | null>(null)
  const [scanStartTime, setScanStartTime] = useState<number | null>(null)
  
  // Quarantine state
  const [quarantinedThreats, setQuarantinedThreats] = useState<ThreatInfo[]>([])

  const startScan = useCallback((scanId: string) => {
    const scanType = scanTypes.find(s => s.id === scanId)
    if (!scanType) return

    setSelectedScan(scanId)
    setScanning(true)
    setScanProgress(0)
    setFilesScanned(0)
    setFoldersScanned(0)
    setCurrentFile("")
    setScanResult(null)
    setDetectedThreats([])
    setScanStartTime(Date.now())

    // Determine if threats will be found
    const willFindThreats = Math.random() < scanType.threatChance
    const numThreats = willFindThreats ? Math.floor(Math.random() * 4) + 1 : 0
    const threatsToFind = willFindThreats 
      ? threatDatabase.slice(0, numThreats).map((threat, i) => ({
          ...threat,
          id: `threat-${Date.now()}-${i}`,
          status: 'detected' as const,
          detectedAt: new Date(),
        }))
      : []

    // Calculate when to "find" each threat
    const threatDetectionPoints = threatsToFind.map(() => 
      Math.random() * 80 + 10 // Between 10% and 90%
    ).sort((a, b) => a - b)

    let threatIndex = 0

    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const increment = (100 / (scanType.duration / 100))
        const newProgress = prev + increment

        // Update files scanned
        const newFilesScanned = Math.floor((newProgress / 100) * scanType.filesEstimate)
        setFilesScanned(newFilesScanned)
        setFoldersScanned(Math.floor(newFilesScanned / 50))

        // Update current file being scanned
        if (Math.random() > 0.7) {
          setCurrentFile(mockScanPaths[Math.floor(Math.random() * mockScanPaths.length)])
        }

        // Check if we should detect a threat
        if (threatIndex < threatDetectionPoints.length && newProgress >= threatDetectionPoints[threatIndex]) {
          setDetectedThreats(prev => [...prev, threatsToFind[threatIndex]])
          threatIndex++
        }

        if (newProgress >= 100) {
          clearInterval(scanInterval)
          
          // Complete scan
          setTimeout(() => {
            setScanning(false)
            setScanResult({
              filesScanned: scanType.filesEstimate,
              foldersScanned: Math.floor(scanType.filesEstimate / 50),
              threatsFound: threatsToFind,
              duration: Date.now() - (scanStartTime || Date.now()),
              scanType: scanType.name,
            })
          }, 500)
          
          return 100
        }

        return newProgress
      })
    }, 100)

    return () => clearInterval(scanInterval)
  }, [scanStartTime])

  const stopScan = useCallback(() => {
    setScanning(false)
    setScanProgress(0)
    setSelectedScan(null)
  }, [])

  const quarantineThreat = useCallback(async (threatId: string) => {
    setCleaningThreat(threatId)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setDetectedThreats(prev => prev.map(t => 
      t.id === threatId ? { ...t, status: 'quarantined' } : t
    ))
    
    const threat = detectedThreats.find(t => t.id === threatId)
    if (threat) {
      setQuarantinedThreats(prev => [...prev, { ...threat, status: 'quarantined' }])
    }
    
    setCleaningThreat(null)
  }, [detectedThreats])

  const cleanThreat = useCallback(async (threatId: string) => {
    setCleaningThreat(threatId)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setDetectedThreats(prev => prev.map(t => 
      t.id === threatId ? { ...t, status: 'cleaned' } : t
    ))
    
    setCleaningThreat(null)
  }, [])

  const cleanAllThreats = useCallback(async () => {
    const activeThreats = detectedThreats.filter(t => t.status === 'detected')
    
    for (const threat of activeThreats) {
      setCleaningThreat(threat.id)
      await new Promise(resolve => setTimeout(resolve, 800))
      setDetectedThreats(prev => prev.map(t => 
        t.id === threat.id ? { ...t, status: 'cleaned' } : t
      ))
    }
    
    setCleaningThreat(null)
  }, [detectedThreats])

  const ignoreThreat = useCallback((threatId: string) => {
    setDetectedThreats(prev => prev.map(t => 
      t.id === threatId ? { ...t, status: 'ignored' } : t
    ))
  }, [])

  const activeThreats = detectedThreats.filter(t => t.status === 'detected')
  const cleanedThreats = detectedThreats.filter(t => t.status === 'cleaned' || t.status === 'quarantined')

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
            Detect and remove threats from your system
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
                    selectedScan === scan.id && scanning ? 'border-primary' : ''
                  }`}
                  style={selectedScan === scan.id && scanning ? { boxShadow: "0 0 20px oklch(0.75 0.18 180 / 0.2)" } : {}}
                  onClick={() => !scanning && startScan(scan.id)}
                >
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedScan === scan.id && scanning ? 'bg-primary/20' : 'bg-primary/10'
                      }`}>
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
                            stopScan()
                          } else {
                            startScan(scan.id)
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

            {/* Scan Statistics */}
            {(scanning || scanResult) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <FileSearch className="w-4 h-4 text-primary" />
                      Scan Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-medium text-foreground">
                          {(scanResult?.filesScanned || filesScanned).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Files Scanned</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-medium text-foreground">
                          {(scanResult?.foldersScanned || foldersScanned).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Folders</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className={`text-xl font-medium ${detectedThreats.length > 0 ? 'text-destructive' : 'text-accent'}`}>
                          {detectedThreats.length}
                        </p>
                        <p className="text-xs text-muted-foreground">Threats Found</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-medium text-foreground">
                          {scanResult 
                            ? `${Math.round(scanResult.duration / 1000)}s`
                            : scanning 
                              ? `${Math.round((Date.now() - (scanStartTime || Date.now())) / 1000)}s`
                              : '0s'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Radar Scanner */}
          <Card className="glass border-border order-1 lg:order-2">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 font-medium text-sm lg:text-base">
                <Scan className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Scan Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                {/* Radar Animation */}
                <div className="relative w-48 h-48 lg:w-56 lg:h-56 mb-4 lg:mb-6">
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
                            background: "linear-gradient(90deg, oklch(0.75 0.18 180 / 0.8), transparent)",
                            transformOrigin: "left center",
                            boxShadow: "0 0 20px oklch(0.75 0.18 180 / 0.5)",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Center icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {scanResult && !scanning ? (
                      scanResult.threatsFound.length > 0 ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-destructive/20 flex items-center justify-center"
                        >
                          <ShieldAlert className="w-7 h-7 lg:w-8 lg:h-8 text-destructive" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-accent/20 flex items-center justify-center"
                        >
                          <ShieldCheck className="w-7 h-7 lg:w-8 lg:h-8 text-accent" />
                        </motion.div>
                      )
                    ) : (
                      <motion.div
                        animate={scanning ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 rounded-full bg-primary"
                        style={{ boxShadow: "0 0 20px oklch(0.75 0.18 180)" }}
                      />
                    )}
                  </div>
                  
                  {/* Threat indicators on radar */}
                  <AnimatePresence>
                    {detectedThreats.map((threat, index) => {
                      const angle = (index * 72) * (Math.PI / 180)
                      const radius = 35 + (index * 8)
                      const x = 50 + radius * Math.cos(angle)
                      const y = 50 + radius * Math.sin(angle)
                      
                      return (
                        <motion.div
                          key={threat.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute"
                          style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className={`w-3 h-3 rounded-full ${
                              threat.status === 'cleaned' || threat.status === 'quarantined'
                                ? 'bg-accent'
                                : threat.severity === 'critical'
                                ? 'bg-destructive'
                                : 'bg-orange-500'
                            }`}
                            style={{ 
                              boxShadow: threat.status === 'cleaned' || threat.status === 'quarantined'
                                ? "0 0 10px oklch(0.65 0.2 160)"
                                : "0 0 10px oklch(0.65 0.25 25)"
                            }}
                          />
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
                
                {/* Progress */}
                {scanning && (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs lg:text-sm font-mono text-muted-foreground">
                        Scanning...
                      </span>
                      <span className="text-xs lg:text-sm font-mono text-muted-foreground">
                        {Math.round(scanProgress)}%
                      </span>
                    </div>
                    <Progress value={scanProgress} className="h-1.5 lg:h-2 mb-3" />
                    <p className="text-xs text-muted-foreground font-mono truncate text-center">
                      {currentFile || 'Initializing scan...'}
                    </p>
                  </div>
                )}

                {/* Results Summary */}
                {scanResult && !scanning && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full text-center"
                  >
                    <div className={`text-lg lg:text-xl font-medium mb-2 ${
                      activeThreats.length > 0 ? 'text-destructive' : 'text-accent'
                    }`}>
                      {activeThreats.length > 0 
                        ? `${activeThreats.length} Active Threat${activeThreats.length > 1 ? 's' : ''}`
                        : cleanedThreats.length > 0
                        ? 'All Threats Resolved'
                        : 'System is Clean'
                      }
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {scanResult.scanType} completed in {Math.round(scanResult.duration / 1000)}s
                    </p>
                  </motion.div>
                )}

                {!scanning && !scanResult && (
                  <p className="text-sm text-muted-foreground text-center font-light">
                    Select a scan type to begin
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detected Threats */}
          <AnimatePresence>
            {detectedThreats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:col-span-2"
              >
                <Card className="glass border-border border-destructive/30">
                  <CardHeader className="pb-2 lg:pb-4">
                    <CardTitle className="flex items-center justify-between text-sm lg:text-base font-medium">
                      <span className="flex items-center gap-2">
                        <Bug className="w-4 h-4 lg:w-5 lg:h-5 text-destructive" />
                        Detected Threats ({detectedThreats.length})
                      </span>
                      {activeThreats.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cleanAllThreats}
                          disabled={cleaningThreat !== null}
                          className="border-accent/50 text-accent hover:bg-accent/10"
                        >
                          {cleaningThreat ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          Clean All
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {detectedThreats.map((threat) => (
                        <motion.div
                          key={threat.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 lg:p-4 rounded-lg border transition-all ${
                            threat.status === 'cleaned' || threat.status === 'quarantined'
                              ? 'bg-accent/10 border-accent/30'
                              : threat.status === 'ignored'
                              ? 'bg-muted/50 border-border'
                              : 'bg-destructive/10 border-destructive/30'
                          }`}
                        >
                          <div className="flex items-start gap-3 lg:gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              threat.status === 'cleaned' ? 'bg-accent/20' :
                              threat.status === 'quarantined' ? 'bg-primary/20' :
                              threat.status === 'ignored' ? 'bg-muted' :
                              'bg-destructive/20'
                            }`}>
                              {threat.status === 'cleaned' ? (
                                <CheckCircle className="w-5 h-5 text-accent" />
                              ) : threat.status === 'quarantined' ? (
                                <Lock className="w-5 h-5 text-primary" />
                              ) : threat.status === 'ignored' ? (
                                <Shield className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <FileWarning className="w-5 h-5 text-destructive" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-sm text-foreground">{threat.fileName}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  threat.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                                  threat.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                  threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-muted text-muted-foreground'
                                }`}>
                                  {threat.severity}
                                </span>
                                {threat.status !== 'detected' && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    threat.status === 'cleaned' ? 'bg-accent/20 text-accent' :
                                    threat.status === 'quarantined' ? 'bg-primary/20 text-primary' :
                                    'bg-muted text-muted-foreground'
                                  }`}>
                                    {threat.status}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 font-mono truncate">
                                {threat.path}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {threat.threatType} | {threat.size}
                              </p>
                            </div>

                            {threat.status === 'detected' && (
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cleanThreat(threat.id)}
                                  disabled={cleaningThreat !== null}
                                  className="border-accent/50 text-accent hover:bg-accent/10"
                                  title="Clean (Delete)"
                                >
                                  {cleaningThreat === threat.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => quarantineThreat(threat.id)}
                                  disabled={cleaningThreat !== null}
                                  className="border-primary/50 text-primary hover:bg-primary/10"
                                  title="Quarantine"
                                >
                                  <Lock className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => ignoreThreat(threat.id)}
                                  className="text-muted-foreground hover:text-foreground"
                                  title="Ignore"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan History / Quick Actions */}
          <Card className="glass border-border lg:col-span-2 order-3">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base font-medium">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => startScan('quick')}
                  disabled={scanning}
                >
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-xs">Quick Scan</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => startScan('full')}
                  disabled={scanning}
                >
                  <HardDrive className="w-5 h-5 text-primary" />
                  <span className="text-xs">Full Scan</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
                  disabled={scanning}
                >
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-xs">Update DB</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
                  disabled={scanning}
                >
                  <Lock className="w-5 h-5 text-primary" />
                  <span className="text-xs">Quarantine</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
