"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { 
  Globe, 
  Shield, 
  Ban, 
  Link, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  FileWarning,
  Clock,
  TrendingUp
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface BlockedSite {
  id: string
  url: string
  type: 'phishing' | 'malware' | 'scam' | 'adult' | 'tracking' | 'ads'
  timestamp: Date
  blockedCount: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

interface ProtectionFeature {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: typeof Globe
  stats: number
}

interface DownloadScan {
  id: string
  fileName: string
  url: string
  status: 'scanning' | 'safe' | 'blocked' | 'warning'
  progress: number
  size: string
  timestamp: Date
}

interface WhitelistedSite {
  id: string
  url: string
  addedAt: Date
  reason: string
}

// Mock malicious sites database
const maliciousSites = [
  { domain: "malware-download.net", type: "malware" as const, risk: "critical" as const },
  { domain: "phishing-bank.com", type: "phishing" as const, risk: "critical" as const },
  { domain: "suspicious-scripts.ru", type: "malware" as const, risk: "high" as const },
  { domain: "crypto-scam.xyz", type: "scam" as const, risk: "high" as const },
  { domain: "free-iphone.win", type: "scam" as const, risk: "medium" as const },
  { domain: "adult-content.xxx", type: "adult" as const, risk: "low" as const },
  { domain: "tracker-analytics.io", type: "tracking" as const, risk: "low" as const },
  { domain: "popup-ads.network", type: "ads" as const, risk: "low" as const },
  { domain: "fake-login.site", type: "phishing" as const, risk: "critical" as const },
  { domain: "ransomware-host.onion", type: "malware" as const, risk: "critical" as const },
]

const mockDownloads = [
  { name: "setup.exe", url: "https://download.software.com/setup.exe", size: "45.2 MB" },
  { name: "document.pdf", url: "https://docs.example.com/report.pdf", size: "2.1 MB" },
  { name: "archive.zip", url: "https://files.storage.net/data.zip", size: "128 MB" },
  { name: "installer.msi", url: "https://updates.app.io/installer.msi", size: "78.5 MB" },
]

export function WebProtection() {
  const [protectionEnabled, setProtectionEnabled] = useState(true)
  const [features, setFeatures] = useState<ProtectionFeature[]>([
    { id: '1', name: "Block Phishing Sites", description: "Protect against fake websites", enabled: true, icon: ShieldAlert, stats: 156 },
    { id: '2', name: "Block Malware Downloads", description: "Prevent malicious file downloads", enabled: true, icon: FileWarning, stats: 89 },
    { id: '3', name: "Safe Search", description: "Filter explicit content from searches", enabled: false, icon: Search, stats: 0 },
    { id: '4', name: "HTTPS Enforcement", description: "Redirect to secure connections", enabled: true, icon: Lock, stats: 2847 },
    { id: '5', name: "Tracker Blocking", description: "Block website trackers and analytics", enabled: true, icon: Eye, stats: 4521 },
    { id: '6', name: "Ad Blocking", description: "Block intrusive advertisements", enabled: true, icon: Ban, stats: 8932 },
  ])
  
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([])
  const [recentDownloads, setRecentDownloads] = useState<DownloadScan[]>([])
  const [whitelist, setWhitelist] = useState<WhitelistedSite[]>([
    { id: '1', url: 'google.com', addedAt: new Date(), reason: 'Trusted search engine' },
    { id: '2', url: 'github.com', addedAt: new Date(), reason: 'Development platform' },
  ])
  const [newWhitelistUrl, setNewWhitelistUrl] = useState('')
  const [urlCheckInput, setUrlCheckInput] = useState('')
  const [urlCheckResult, setUrlCheckResult] = useState<'safe' | 'dangerous' | 'checking' | null>(null)
  
  // Statistics
  const [totalBlocked, setTotalBlocked] = useState(892)
  const [phishingBlocked, setPhishingBlocked] = useState(156)
  const [trackersBlocked, setTrackersBlocked] = useState(4521)

  // Simulate real-time blocking
  useEffect(() => {
    if (!protectionEnabled) return

    const blockInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const site = maliciousSites[Math.floor(Math.random() * maliciousSites.length)]
        const newBlockedSite: BlockedSite = {
          id: `block-${Date.now()}`,
          url: site.domain,
          type: site.type,
          timestamp: new Date(),
          blockedCount: Math.floor(Math.random() * 5) + 1,
          riskLevel: site.risk,
        }
        
        setBlockedSites(prev => [newBlockedSite, ...prev].slice(0, 15))
        setTotalBlocked(prev => prev + 1)
        
        if (site.type === 'phishing') setPhishingBlocked(prev => prev + 1)
        if (site.type === 'tracking') setTrackersBlocked(prev => prev + Math.floor(Math.random() * 3) + 1)
      }
    }, 4000)

    return () => clearInterval(blockInterval)
  }, [protectionEnabled])

  // Simulate download scanning
  const simulateDownload = useCallback(() => {
    const download = mockDownloads[Math.floor(Math.random() * mockDownloads.length)]
    const newDownload: DownloadScan = {
      id: `dl-${Date.now()}`,
      fileName: download.name,
      url: download.url,
      status: 'scanning',
      progress: 0,
      size: download.size,
      timestamp: new Date(),
    }

    setRecentDownloads(prev => [newDownload, ...prev].slice(0, 5))

    // Simulate scanning progress
    const scanInterval = setInterval(() => {
      setRecentDownloads(prev => prev.map(dl => {
        if (dl.id === newDownload.id && dl.status === 'scanning') {
          const newProgress = dl.progress + Math.random() * 20
          if (newProgress >= 100) {
            clearInterval(scanInterval)
            const isSafe = Math.random() > 0.2
            return { ...dl, progress: 100, status: isSafe ? 'safe' : Math.random() > 0.5 ? 'warning' : 'blocked' }
          }
          return { ...dl, progress: newProgress }
        }
        return dl
      }))
    }, 200)

    return () => clearInterval(scanInterval)
  }, [])

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => 
      prev.map(f => f.id === featureId ? { ...f, enabled: !f.enabled } : f)
    )
  }

  const checkUrl = useCallback(() => {
    if (!urlCheckInput.trim()) return
    
    setUrlCheckResult('checking')
    
    setTimeout(() => {
      const isDangerous = maliciousSites.some(site => 
        urlCheckInput.toLowerCase().includes(site.domain.toLowerCase())
      ) || Math.random() < 0.1
      
      setUrlCheckResult(isDangerous ? 'dangerous' : 'safe')
    }, 1500)
  }, [urlCheckInput])

  const addToWhitelist = useCallback(() => {
    if (!newWhitelistUrl.trim()) return
    
    const newSite: WhitelistedSite = {
      id: `wl-${Date.now()}`,
      url: newWhitelistUrl.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''),
      addedAt: new Date(),
      reason: 'User added',
    }
    
    setWhitelist(prev => [newSite, ...prev])
    setNewWhitelistUrl('')
  }, [newWhitelistUrl])

  const removeFromWhitelist = (siteId: string) => {
    setWhitelist(prev => prev.filter(s => s.id !== siteId))
  }

  const unblockSite = (siteId: string) => {
    const site = blockedSites.find(s => s.id === siteId)
    if (site) {
      addToWhitelist()
      setNewWhitelistUrl(site.url)
    }
    setBlockedSites(prev => prev.filter(s => s.id !== siteId))
  }

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-1 lg:mb-2">Web Protection</h2>
          <p className="text-sm lg:text-base text-muted-foreground font-light">
            Block malicious websites and protect your browsing experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Status Card */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base font-medium">
                <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Protection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4 lg:py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative cursor-pointer"
                  onClick={() => setProtectionEnabled(!protectionEnabled)}
                >
                  {protectionEnabled && [0, 1].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-accent/30"
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                      style={{ margin: `-${(i + 1) * 16}px` }}
                    />
                  ))}
                  
                  <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center ${
                    protectionEnabled ? 'bg-accent/20' : 'bg-muted'
                  }`}
                  style={protectionEnabled ? { boxShadow: "0 0 30px oklch(0.65 0.2 160 / 0.3)" } : {}}
                  >
                    <Shield className={`w-10 h-10 lg:w-12 lg:h-12 ${protectionEnabled ? 'text-accent' : 'text-muted-foreground'}`} />
                  </div>
                </motion.div>
                
                <p className={`mt-3 lg:mt-4 text-base lg:text-lg font-medium ${protectionEnabled ? 'text-accent' : 'text-muted-foreground'}`}>
                  {protectionEnabled ? 'ACTIVE' : 'DISABLED'}
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                  Click to toggle
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 lg:gap-4 mt-4 lg:mt-6 w-full">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg lg:text-xl font-medium text-foreground">{totalBlocked.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Blocked</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg lg:text-xl font-medium text-destructive">{phishingBlocked}</p>
                    <p className="text-xs text-muted-foreground">Phishing</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg lg:text-xl font-medium text-foreground">{trackersBlocked.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Trackers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* URL Scanner */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base font-medium">
                <Search className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                URL Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter URL to check..."
                    value={urlCheckInput}
                    onChange={(e) => setUrlCheckInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkUrl()}
                    className="bg-muted/30 border-border text-sm"
                  />
                  <Button
                    onClick={checkUrl}
                    disabled={urlCheckResult === 'checking'}
                    size="sm"
                    className="shrink-0 bg-primary hover:bg-primary/90"
                  >
                    {urlCheckResult === 'checking' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <AnimatePresence mode="wait">
                  {urlCheckResult && urlCheckResult !== 'checking' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-3 rounded-lg flex items-center gap-3 ${
                        urlCheckResult === 'safe' 
                          ? 'bg-accent/20 border border-accent/30' 
                          : 'bg-destructive/20 border border-destructive/30'
                      }`}
                    >
                      {urlCheckResult === 'safe' ? (
                        <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${
                          urlCheckResult === 'safe' ? 'text-accent' : 'text-destructive'
                        }`}>
                          {urlCheckResult === 'safe' ? 'URL is Safe' : 'Dangerous URL Detected'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {urlCheckResult === 'safe' 
                            ? 'No threats detected' 
                            : 'This site may harm your device'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simulate Download Button */}
                <Button
                  onClick={simulateDownload}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Simulate Download Scan
                </Button>

                {/* Recent Downloads */}
                {recentDownloads.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-2">Recent Downloads</p>
                    <div className="flex flex-col gap-2 max-h-32 overflow-auto">
                      {recentDownloads.slice(0, 3).map((dl) => (
                        <div
                          key={dl.id}
                          className={`p-2 rounded-lg text-xs ${
                            dl.status === 'scanning' ? 'bg-muted/50' :
                            dl.status === 'safe' ? 'bg-accent/10' :
                            dl.status === 'warning' ? 'bg-yellow-500/10' :
                            'bg-destructive/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono truncate max-w-28">{dl.fileName}</span>
                            {dl.status === 'scanning' ? (
                              <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                            ) : dl.status === 'safe' ? (
                              <CheckCircle className="w-3 h-3 text-accent" />
                            ) : dl.status === 'warning' ? (
                              <AlertTriangle className="w-3 h-3 text-yellow-500" />
                            ) : (
                              <Ban className="w-3 h-3 text-destructive" />
                            )}
                          </div>
                          {dl.status === 'scanning' && (
                            <Progress value={dl.progress} className="h-1 mt-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Protection Features */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base font-medium">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Protection Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 lg:gap-3 max-h-64 lg:max-h-none overflow-auto">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                      <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        feature.enabled ? 'bg-accent/20' : 'bg-muted'
                      }`}>
                        {feature.enabled ? (
                          <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-accent" />
                        ) : (
                          <Ban className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs lg:text-sm font-medium text-foreground truncate">{feature.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{feature.stats.toLocaleString()} blocked</p>
                      </div>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => toggleFeature(feature.id)}
                      disabled={!protectionEnabled}
                      className="shrink-0"
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recently Blocked Sites */}
          <Card className="glass border-border lg:col-span-2">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center justify-between text-sm lg:text-base font-medium">
                <span className="flex items-center gap-2">
                  <Ban className="w-4 h-4 lg:w-5 lg:h-5 text-destructive" />
                  Recently Blocked
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-destructive"
                  />
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Live Feed
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 lg:max-h-72 overflow-auto">
                <AnimatePresence mode="popLayout">
                  {blockedSites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3">
                      {blockedSites.map((site) => (
                        <motion.div
                          key={site.id}
                          initial={{ opacity: 0, y: -20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -50, scale: 0.95 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                        >
                          <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            site.riskLevel === 'critical' ? 'bg-destructive/20' :
                            site.riskLevel === 'high' ? 'bg-orange-500/20' :
                            site.riskLevel === 'medium' ? 'bg-yellow-500/20' :
                            'bg-muted'
                          }`}>
                            <AlertTriangle className={`w-4 h-4 lg:w-5 lg:h-5 ${
                              site.riskLevel === 'critical' ? 'text-destructive' :
                              site.riskLevel === 'high' ? 'text-orange-500' :
                              site.riskLevel === 'medium' ? 'text-yellow-500' :
                              'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm font-mono text-foreground truncate">{site.url}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                site.type === 'phishing' ? 'bg-destructive/20 text-destructive' :
                                site.type === 'malware' ? 'bg-orange-500/20 text-orange-400' :
                                site.type === 'scam' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {site.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(site.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unblockSite(site.id)}
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                          >
                            <Unlock className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-accent" />
                      <p className="text-sm">No blocked sites</p>
                      <p className="text-xs">Your browsing is protected</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Whitelist */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base font-medium">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-accent" />
                Whitelist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add trusted site..."
                    value={newWhitelistUrl}
                    onChange={(e) => setNewWhitelistUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addToWhitelist()}
                    className="bg-muted/30 border-border text-sm"
                  />
                  <Button
                    onClick={addToWhitelist}
                    size="sm"
                    className="shrink-0 bg-accent hover:bg-accent/90"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-col gap-2 max-h-40 overflow-auto">
                  {whitelist.map((site) => (
                    <div
                      key={site.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-accent/10 border border-accent/30"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle className="w-3 h-3 text-accent shrink-0" />
                        <span className="text-xs font-mono text-foreground truncate">{site.url}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromWhitelist(site.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threat Statistics */}
          <Card className="glass border-border lg:col-span-3">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base font-medium">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Protection Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
                <div className="p-3 lg:p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-destructive" />
                    <span className="text-xs text-muted-foreground">Phishing</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-destructive">{phishingBlocked}</p>
                </div>
                <div className="p-3 lg:p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FileWarning className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-muted-foreground">Malware</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-orange-500">89</p>
                </div>
                <div className="p-3 lg:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">Scams</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-yellow-500">234</p>
                </div>
                <div className="p-3 lg:p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Trackers</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-foreground">{trackersBlocked.toLocaleString()}</p>
                </div>
                <div className="p-3 lg:p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Ads</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-foreground">8,932</p>
                </div>
                <div className="p-3 lg:p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-accent" />
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-accent">{totalBlocked.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
