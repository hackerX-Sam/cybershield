"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Usb, 
  Shield, 
  HardDrive, 
  CheckCircle, 
  AlertTriangle, 
  Scan, 
  XCircle, 
  Trash2, 
  RefreshCw,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  FileWarning,
  Zap
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface UsbDevice {
  id: string
  name: string
  size: string
  status: 'connected' | 'scanning' | 'scanned' | 'infected' | 'cleaned'
  threats: ThreatInfo[]
  lastScan: string
  scanProgress: number
  filesScanned: number
  totalFiles: number
}

interface ThreatInfo {
  id: string
  fileName: string
  path: string
  threatType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'detected' | 'quarantined' | 'cleaned' | 'ignored'
}

interface DeviceHistory {
  name: string
  size: string
  date: string
  threats: number
  action: string
  status: 'safe' | 'cleaned' | 'blocked'
}

// Simulated threat database
const threatDatabase: Omit<ThreatInfo, 'id' | 'status'>[] = [
  { fileName: "autorun.inf", path: "E:\\autorun.inf", threatType: "Trojan.AutoRun", severity: "high" },
  { fileName: "setup_crack.exe", path: "E:\\Downloads\\setup_crack.exe", threatType: "Malware.Generic", severity: "critical" },
  { fileName: "free_software.exe", path: "E:\\Programs\\free_software.exe", threatType: "PUP.Adware", severity: "medium" },
  { fileName: "document.exe", path: "E:\\Documents\\document.exe", threatType: "Trojan.Disguised", severity: "high" },
  { fileName: "keygen.exe", path: "E:\\Tools\\keygen.exe", threatType: "HackTool.Keygen", severity: "medium" },
]

const mockFiles = [
  "E:\\Documents\\report.docx",
  "E:\\Photos\\vacation_001.jpg",
  "E:\\Music\\song.mp3",
  "E:\\Videos\\movie.mp4",
  "E:\\Downloads\\installer.exe",
  "E:\\Backup\\data.zip",
  "E:\\Projects\\code.js",
  "E:\\Games\\save.dat",
]

export function UsbProtection() {
  const [autoScan, setAutoScan] = useState(true)
  const [blockUnknown, setBlockUnknown] = useState(true)
  const [deepScan, setDeepScan] = useState(false)
  const [realTimeProtection, setRealTimeProtection] = useState(true)
  
  const [connectedDevices, setConnectedDevices] = useState<UsbDevice[]>([])
  const [deviceHistory, setDeviceHistory] = useState<DeviceHistory[]>([
    { name: "Kingston DataTraveler", size: "16 GB", date: "Yesterday", threats: 2, action: "Cleaned", status: "cleaned" },
    { name: "Seagate Backup", size: "2 TB", date: "3 days ago", threats: 0, action: "Safe", status: "safe" },
    { name: "Unknown USB", size: "8 GB", date: "1 week ago", threats: 5, action: "Blocked", status: "blocked" },
  ])
  
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [cleaningInProgress, setCleaningInProgress] = useState<string | null>(null)

  // Simulate USB device connection
  const simulateDeviceConnection = useCallback(() => {
    const deviceNames = [
      "SanDisk Ultra USB 3.0",
      "Samsung BAR Plus",
      "Kingston DataTraveler",
      "PNY Turbo USB 3.0",
      "Lexar JumpDrive",
      "Transcend JetFlash",
    ]
    const sizes = ["8 GB", "16 GB", "32 GB", "64 GB", "128 GB"]
    
    const newDevice: UsbDevice = {
      id: `usb-${Date.now()}`,
      name: deviceNames[Math.floor(Math.random() * deviceNames.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      status: 'connected',
      threats: [],
      lastScan: 'Never',
      scanProgress: 0,
      filesScanned: 0,
      totalFiles: Math.floor(Math.random() * 500) + 100,
    }
    
    setConnectedDevices(prev => [...prev, newDevice])
    
    // Auto-scan if enabled
    if (autoScan) {
      setTimeout(() => startScan(newDevice.id), 1000)
    }
  }, [autoScan])

  // Start scanning a device
  const startScan = useCallback((deviceId: string) => {
    setConnectedDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return { ...device, status: 'scanning', scanProgress: 0, filesScanned: 0 }
      }
      return device
    }))
    
    // Simulate scanning progress
    const scanInterval = setInterval(() => {
      setConnectedDevices(prev => {
        const device = prev.find(d => d.id === deviceId)
        if (!device || device.status !== 'scanning') {
          clearInterval(scanInterval)
          return prev
        }
        
        const newProgress = device.scanProgress + Math.random() * 5
        const newFilesScanned = Math.floor((newProgress / 100) * device.totalFiles)
        
        if (newProgress >= 100) {
          clearInterval(scanInterval)
          
          // Randomly detect threats
          const shouldHaveThreats = Math.random() > 0.5
          const detectedThreats: ThreatInfo[] = shouldHaveThreats
            ? threatDatabase
                .slice(0, Math.floor(Math.random() * 3) + 1)
                .map((threat, index) => ({
                  ...threat,
                  id: `threat-${Date.now()}-${index}`,
                  status: 'detected' as const
                }))
            : []
          
          return prev.map(d => {
            if (d.id === deviceId) {
              return {
                ...d,
                status: detectedThreats.length > 0 ? 'infected' : 'scanned',
                scanProgress: 100,
                filesScanned: d.totalFiles,
                threats: detectedThreats,
                lastScan: 'Just now'
              }
            }
            return d
          })
        }
        
        return prev.map(d => {
          if (d.id === deviceId) {
            return { ...d, scanProgress: newProgress, filesScanned: newFilesScanned }
          }
          return d
        })
      })
    }, 100)
  }, [])

  // Stop scanning
  const stopScan = useCallback((deviceId: string) => {
    setConnectedDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return { ...device, status: 'connected', scanProgress: 0 }
      }
      return device
    }))
  }, [])

  // Clean threats from device
  const cleanDevice = useCallback(async (deviceId: string) => {
    setCleaningInProgress(deviceId)
    
    const device = connectedDevices.find(d => d.id === deviceId)
    if (!device) return
    
    // Simulate cleaning each threat
    for (let i = 0; i < device.threats.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setConnectedDevices(prev => prev.map(d => {
        if (d.id === deviceId) {
          const updatedThreats = [...d.threats]
          updatedThreats[i] = { ...updatedThreats[i], status: 'cleaned' }
          return { ...d, threats: updatedThreats }
        }
        return d
      }))
    }
    
    // Mark device as cleaned
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setConnectedDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        return { ...d, status: 'cleaned' }
      }
      return d
    }))
    
    // Add to history
    setDeviceHistory(prev => [{
      name: device.name,
      size: device.size,
      date: 'Just now',
      threats: device.threats.length,
      action: 'Cleaned',
      status: 'cleaned'
    }, ...prev.slice(0, 9)])
    
    setCleaningInProgress(null)
  }, [connectedDevices])

  // Remove/Eject device
  const ejectDevice = useCallback((deviceId: string) => {
    const device = connectedDevices.find(d => d.id === deviceId)
    if (device && device.status === 'scanned') {
      setDeviceHistory(prev => [{
        name: device.name,
        size: device.size,
        date: 'Just now',
        threats: 0,
        action: 'Safe',
        status: 'safe'
      }, ...prev.slice(0, 9)])
    }
    setConnectedDevices(prev => prev.filter(d => d.id !== deviceId))
    if (selectedDevice === deviceId) setSelectedDevice(null)
  }, [connectedDevices, selectedDevice])

  // Simulate periodic USB detection
  useEffect(() => {
    // Add initial demo device after 2 seconds
    const initialTimeout = setTimeout(() => {
      if (connectedDevices.length === 0) {
        simulateDeviceConnection()
      }
    }, 2000)
    
    return () => clearTimeout(initialTimeout)
  }, [])

  const totalThreatsBlocked = deviceHistory.reduce((acc, d) => acc + d.threats, 0)
  const devicesScannedToday = deviceHistory.filter(d => d.date === 'Just now' || d.date === 'Today').length + connectedDevices.filter(d => d.status !== 'connected').length

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-1 lg:mb-2">USB Protection</h2>
          <p className="text-sm lg:text-base text-muted-foreground font-light">
            Auto-scan external devices and protect against USB threats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Status Card */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base font-medium">
                <Usb className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Protection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4 lg:py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  {realTimeProtection && [0, 1].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-accent/30"
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                      style={{ margin: `-${(i + 1) * 16}px` }}
                    />
                  ))}
                  <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center ${
                    realTimeProtection ? 'bg-accent/20' : 'bg-muted'
                  }`}
                  style={realTimeProtection ? { boxShadow: "0 0 30px oklch(0.65 0.2 160 / 0.3)" } : {}}
                  >
                    <Usb className={`w-10 h-10 lg:w-12 lg:h-12 ${realTimeProtection ? 'text-accent' : 'text-muted-foreground'}`} />
                  </div>
                </motion.div>

                <p className={`mt-3 lg:mt-4 text-base lg:text-lg font-medium ${realTimeProtection ? 'text-accent' : 'text-muted-foreground'}`}>
                  {realTimeProtection ? 'ACTIVE' : 'DISABLED'}
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                  {connectedDevices.length} device(s) connected
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4 lg:mt-6 w-full">
                  <div className="text-center p-2 lg:p-3 rounded-lg bg-muted/50">
                    <p className="text-lg lg:text-xl font-medium text-foreground">{devicesScannedToday}</p>
                    <p className="text-xs text-muted-foreground">Scanned Today</p>
                  </div>
                  <div className="text-center p-2 lg:p-3 rounded-lg bg-muted/50">
                    <p className="text-lg lg:text-xl font-medium text-destructive">{totalThreatsBlocked}</p>
                    <p className="text-xs text-muted-foreground">Threats Blocked</p>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="flex flex-col gap-2 lg:gap-3 mt-2 lg:mt-4">
                <div className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-muted/30">
                  <span className="text-xs lg:text-sm text-foreground">Auto-scan on connect</span>
                  <Switch checked={autoScan} onCheckedChange={setAutoScan} />
                </div>
                <div className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-muted/30">
                  <span className="text-xs lg:text-sm text-foreground">Block unknown devices</span>
                  <Switch checked={blockUnknown} onCheckedChange={setBlockUnknown} />
                </div>
                <div className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-muted/30">
                  <span className="text-xs lg:text-sm text-foreground">Deep scan (slower)</span>
                  <Switch checked={deepScan} onCheckedChange={setDeepScan} />
                </div>
                <div className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-muted/30">
                  <span className="text-xs lg:text-sm text-foreground">Real-time protection</span>
                  <Switch checked={realTimeProtection} onCheckedChange={setRealTimeProtection} />
                </div>
              </div>

              {/* Simulate Connection Button */}
              <Button
                onClick={simulateDeviceConnection}
                variant="outline"
                className="w-full mt-4 border-primary/50 text-primary hover:bg-primary/10"
                size="sm"
              >
                <Usb className="w-4 h-4 mr-2" />
                Simulate USB Connection
              </Button>
            </CardContent>
          </Card>

          {/* Connected Devices */}
          <Card className="glass border-border lg:col-span-2">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center justify-between text-sm lg:text-base font-medium">
                <span className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  Connected Devices
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {connectedDevices.length} active
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="popLayout">
                {connectedDevices.length > 0 ? (
                  <div className="flex flex-col gap-3 lg:gap-4">
                    {connectedDevices.map((device) => (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={`p-3 lg:p-4 rounded-lg border transition-all ${
                          device.status === 'infected' 
                            ? 'bg-destructive/10 border-destructive/50' 
                            : device.status === 'cleaned' || device.status === 'scanned'
                            ? 'bg-accent/10 border-accent/50'
                            : 'bg-muted/30 border-border'
                        }`}
                      >
                        <div className="flex items-start gap-3 lg:gap-4">
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            device.status === 'scanned' || device.status === 'cleaned' ? 'bg-accent/20' :
                            device.status === 'scanning' ? 'bg-primary/20' :
                            device.status === 'infected' ? 'bg-destructive/20' : 'bg-muted'
                          }`}>
                            {device.status === 'scanned' || device.status === 'cleaned' ? (
                              <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-accent" />
                            ) : device.status === 'scanning' ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Scan className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                              </motion.div>
                            ) : device.status === 'infected' ? (
                              <ShieldAlert className="w-5 h-5 lg:w-6 lg:h-6 text-destructive" />
                            ) : (
                              <Usb className="w-5 h-5 lg:w-6 lg:h-6 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-sm lg:text-base text-foreground">{device.name}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {device.size}
                              </span>
                            </div>
                            
                            {device.status === 'scanning' ? (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>Scanning files...</span>
                                  <span>{device.filesScanned} / {device.totalFiles}</span>
                                </div>
                                <Progress value={device.scanProgress} className="h-1.5" />
                                <p className="text-xs text-muted-foreground mt-1 font-mono truncate">
                                  {mockFiles[Math.floor(Math.random() * mockFiles.length)]}
                                </p>
                              </div>
                            ) : device.status === 'infected' ? (
                              <div className="mt-2">
                                <p className="text-xs lg:text-sm text-destructive font-medium">
                                  {device.threats.length} threat(s) detected
                                </p>
                                <div className="flex flex-col gap-1 mt-2">
                                  {device.threats.map((threat) => (
                                    <div 
                                      key={threat.id}
                                      className={`flex items-center gap-2 text-xs p-1.5 rounded ${
                                        threat.status === 'cleaned' 
                                          ? 'bg-accent/20 text-accent' 
                                          : 'bg-destructive/20 text-destructive'
                                      }`}
                                    >
                                      {threat.status === 'cleaned' ? (
                                        <CheckCircle className="w-3 h-3 shrink-0" />
                                      ) : (
                                        <FileWarning className="w-3 h-3 shrink-0" />
                                      )}
                                      <span className="truncate">{threat.fileName}</span>
                                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-xs ${
                                        threat.severity === 'critical' ? 'bg-destructive/30' :
                                        threat.severity === 'high' ? 'bg-orange-500/30 text-orange-400' :
                                        'bg-yellow-500/30 text-yellow-400'
                                      }`}>
                                        {threat.severity}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                                {device.lastScan === 'Never' ? 'Ready to scan' : `Last scan: ${device.lastScan}`}
                                {device.status === 'scanned' && ' - No threats found'}
                                {device.status === 'cleaned' && ' - All threats removed'}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            {device.status === 'scanning' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => stopScan(device.id)}
                                className="border-destructive/50 text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            ) : device.status === 'infected' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cleanDevice(device.id)}
                                disabled={cleaningInProgress === device.id}
                                className="border-accent/50 text-accent hover:bg-accent/10"
                              >
                                {cleaningInProgress === device.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            ) : device.status === 'connected' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startScan(device.id)}
                                className="border-primary/50 text-primary hover:bg-primary/10"
                              >
                                <Scan className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startScan(device.id)}
                                className="border-primary/50 text-primary hover:bg-primary/10"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => ejectDevice(device.id)}
                              disabled={device.status === 'scanning'}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center py-8 lg:py-12 text-center"
                  >
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <Usb className="w-8 h-8 lg:w-10 lg:h-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">No devices connected</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect a USB device or click the button to simulate
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Device History */}
          <Card className="glass border-border lg:col-span-3">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base font-medium">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Device History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium text-muted-foreground">Device</th>
                      <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium text-muted-foreground">Size</th>
                      <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium text-muted-foreground">Threats</th>
                      <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {deviceHistory.map((device, index) => (
                        <motion.tr
                          key={`${device.name}-${device.date}-${index}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border/50 hover:bg-muted/30"
                        >
                          <td className="py-2 lg:py-3 px-2 lg:px-4">
                            <div className="flex items-center gap-2">
                              <Usb className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground shrink-0" />
                              <span className="text-xs lg:text-sm text-foreground truncate">{device.name}</span>
                            </div>
                          </td>
                          <td className="py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm text-muted-foreground font-mono">{device.size}</td>
                          <td className="py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm text-muted-foreground">{device.date}</td>
                          <td className="py-2 lg:py-3 px-2 lg:px-4">
                            <span className={`text-xs lg:text-sm font-mono ${
                              device.threats > 0 ? 'text-destructive' : 'text-accent'
                            }`}>
                              {device.threats}
                            </span>
                          </td>
                          <td className="py-2 lg:py-3 px-2 lg:px-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              device.status === 'safe' ? 'bg-accent/20 text-accent' :
                              device.status === 'cleaned' ? 'bg-primary/20 text-primary' :
                              'bg-destructive/20 text-destructive'
                            }`}>
                              {device.action}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
