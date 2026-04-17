"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Flame, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Shield, 
  Activity, 
  Ban, 
  CheckCircle, 
  RefreshCw,
  Globe,
  Server,
  Wifi,
  AlertTriangle,
  XCircle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Zap,
  Clock
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface NetworkConnection {
  id: string
  process: string
  localAddress: string
  localPort: number
  remoteAddress: string
  remotePort: number
  protocol: 'TCP' | 'UDP'
  state: 'ESTABLISHED' | 'LISTENING' | 'TIME_WAIT' | 'CLOSE_WAIT' | 'SYN_SENT'
  bytesIn: number
  bytesOut: number
  status: 'allowed' | 'blocked' | 'monitoring'
  risk: 'safe' | 'low' | 'medium' | 'high'
  timestamp: Date
}

interface BlockedAttempt {
  id: string
  ip: string
  port: number
  reason: string
  timestamp: Date
  count: number
  country: string
}

interface FirewallRule {
  id: string
  name: string
  description: string
  enabled: boolean
  type: 'inbound' | 'outbound' | 'both'
}

// Mock data generators
const mockProcesses = ['chrome.exe', 'firefox.exe', 'code.exe', 'discord.exe', 'spotify.exe', 'steam.exe', 'node.exe', 'Teams.exe', 'OneDrive.exe', 'Slack.exe']
const mockRemoteIPs = ['142.250.80.46', '20.190.163.2', '162.159.133.234', '52.97.183.194', '35.186.224.25', '104.244.42.193', '151.101.1.140', '185.199.108.133']
const mockCountries = ['US', 'DE', 'GB', 'JP', 'AU', 'CA', 'FR', 'NL']

const defaultRules: FirewallRule[] = [
  { id: '1', name: "Block incoming connections", description: "Block all unsolicited incoming connections", enabled: true, type: 'inbound' },
  { id: '2', name: "Block unknown applications", description: "Block network access for unrecognized apps", enabled: true, type: 'both' },
  { id: '3', name: "Allow trusted apps only", description: "Only allow whitelisted applications", enabled: false, type: 'both' },
  { id: '4', name: "Log all connections", description: "Record all network activity for review", enabled: true, type: 'both' },
  { id: '5', name: "Block suspicious ports", description: "Block common attack vectors (23, 445, 3389)", enabled: true, type: 'inbound' },
  { id: '6', name: "Stealth mode", description: "Don't respond to port scans", enabled: true, type: 'inbound' },
]

const suspiciousIPs = [
  { ip: '192.168.1.254', reason: 'Port scan detected', country: 'RU' },
  { ip: '10.0.0.99', reason: 'Brute force attempt', country: 'CN' },
  { ip: '172.16.0.50', reason: 'Malware communication', country: 'KP' },
  { ip: '203.0.113.42', reason: 'DDoS source', country: 'IR' },
]

export function FirewallPanel() {
  const [firewallEnabled, setFirewallEnabled] = useState(true)
  const [firewallRules, setFirewallRules] = useState(defaultRules)
  const [connections, setConnections] = useState<NetworkConnection[]>([])
  const [blockedAttempts, setBlockedAttempts] = useState<BlockedAttempt[]>([])
  const [trafficIn, setTrafficIn] = useState(0)
  const [trafficOut, setTrafficOut] = useState(0)
  const [totalBlocked, setTotalBlocked] = useState(47)
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  // Generate random connection
  const generateConnection = useCallback((): NetworkConnection => {
    const isBlocked = Math.random() < 0.1 && firewallEnabled
    const risk = isBlocked ? 'high' : Math.random() < 0.1 ? 'medium' : Math.random() < 0.05 ? 'low' : 'safe'
    
    return {
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      process: mockProcesses[Math.floor(Math.random() * mockProcesses.length)],
      localAddress: '192.168.1.100',
      localPort: Math.floor(Math.random() * 60000) + 1024,
      remoteAddress: mockRemoteIPs[Math.floor(Math.random() * mockRemoteIPs.length)],
      remotePort: [80, 443, 8080, 3000, 5000, 8443][Math.floor(Math.random() * 6)],
      protocol: Math.random() > 0.3 ? 'TCP' : 'UDP',
      state: ['ESTABLISHED', 'LISTENING', 'TIME_WAIT', 'SYN_SENT'][Math.floor(Math.random() * 4)] as NetworkConnection['state'],
      bytesIn: Math.floor(Math.random() * 1000000),
      bytesOut: Math.floor(Math.random() * 500000),
      status: isBlocked ? 'blocked' : 'allowed',
      risk,
      timestamp: new Date(),
    }
  }, [firewallEnabled])

  // Generate blocked attempt
  const generateBlockedAttempt = useCallback((): BlockedAttempt => {
    const suspicious = suspiciousIPs[Math.floor(Math.random() * suspiciousIPs.length)]
    return {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ip: suspicious.ip,
      port: [22, 23, 445, 3389, 8080][Math.floor(Math.random() * 5)],
      reason: suspicious.reason,
      timestamp: new Date(),
      count: Math.floor(Math.random() * 10) + 1,
      country: suspicious.country,
    }
  }, [])

  // Simulate live network activity
  useEffect(() => {
    if (!firewallEnabled) return

    // Initialize with some connections
    const initialConnections = Array.from({ length: 8 }, () => generateConnection())
    setConnections(initialConnections)

    // Add new connections periodically
    const connectionInterval = setInterval(() => {
      const newConnection = generateConnection()
      setConnections(prev => {
        const updated = [newConnection, ...prev].slice(0, 25)
        return updated
      })

      // Update traffic stats
      setTrafficIn(prev => prev + Math.floor(Math.random() * 50000))
      setTrafficOut(prev => prev + Math.floor(Math.random() * 30000))
    }, 2000)

    // Add blocked attempts occasionally
    const blockInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const newBlock = generateBlockedAttempt()
        setBlockedAttempts(prev => [newBlock, ...prev].slice(0, 10))
        setTotalBlocked(prev => prev + 1)
      }
    }, 5000)

    return () => {
      clearInterval(connectionInterval)
      clearInterval(blockInterval)
    }
  }, [firewallEnabled, generateConnection, generateBlockedAttempt])

  const toggleRule = (ruleId: string) => {
    setFirewallRules(prev =>
      prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r)
    )
  }

  const blockConnection = (connId: string) => {
    setConnections(prev => prev.map(c => 
      c.id === connId ? { ...c, status: 'blocked', risk: 'high' } : c
    ))
    setTotalBlocked(prev => prev + 1)
  }

  const allowConnection = (connId: string) => {
    setConnections(prev => prev.map(c => 
      c.id === connId ? { ...c, status: 'allowed', risk: 'safe' } : c
    ))
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const activeConnections = connections.filter(c => c.state === 'ESTABLISHED')
  const displayedConnections = showOnlyActive 
    ? connections.filter(c => c.state === 'ESTABLISHED')
    : connections

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-1 lg:mb-2">Firewall</h2>
          <p className="text-sm lg:text-base text-muted-foreground font-light">
            Monitor and control network traffic in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Status */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 font-medium text-sm lg:text-base">
                <Flame className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Firewall Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4 lg:py-6">
                <motion.div
                  className="relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFirewallEnabled(!firewallEnabled)}
                >
                  <motion.div
                    animate={{
                      boxShadow: firewallEnabled
                        ? ["0 0 20px oklch(0.65 0.2 160 / 0.5)", "0 0 40px oklch(0.65 0.2 160 / 0.3)", "0 0 20px oklch(0.65 0.2 160 / 0.5)"]
                        : "none"
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center ${
                      firewallEnabled ? 'bg-accent/20' : 'bg-muted'
                    }`}
                  >
                    <Flame className={`w-10 h-10 lg:w-12 lg:h-12 ${firewallEnabled ? 'text-accent' : 'text-muted-foreground'}`} />
                  </motion.div>
                </motion.div>

                <p className={`mt-3 lg:mt-4 text-base lg:text-lg font-medium ${firewallEnabled ? 'text-accent' : 'text-muted-foreground'}`}>
                  {firewallEnabled ? 'ACTIVE' : 'DISABLED'}
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1 font-light">
                  Click to toggle
                </p>

                {/* Traffic Stats */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4 mt-4 lg:mt-6 w-full">
                  <div className="text-center p-2 lg:p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ArrowDownLeft className="w-3 h-3 lg:w-4 lg:h-4 text-accent" />
                      <span className="text-base lg:text-lg font-medium text-foreground">{formatBytes(trafficIn)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">Incoming</p>
                  </div>
                  <div className="text-center p-2 lg:p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                      <span className="text-base lg:text-lg font-medium text-foreground">{formatBytes(trafficOut)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">Outgoing</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 w-full">
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <p className="text-lg font-medium text-foreground">{activeConnections.length}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <p className="text-lg font-medium text-destructive">{totalBlocked}</p>
                    <p className="text-xs text-muted-foreground">Blocked</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <p className="text-lg font-medium text-foreground">{firewallRules.filter(r => r.enabled).length}</p>
                    <p className="text-xs text-muted-foreground">Rules</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 font-medium text-sm lg:text-base">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Firewall Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 lg:gap-3 max-h-64 lg:max-h-80 overflow-auto">
                {firewallRules.map((rule, index) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                      <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                        rule.enabled ? 'bg-accent/20' : 'bg-muted'
                      }`}>
                        {rule.enabled ? (
                          <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-accent" />
                        ) : (
                          <Ban className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs lg:text-sm text-foreground font-normal block truncate">{rule.name}</span>
                        <span className="text-xs text-muted-foreground truncate block">{rule.description}</span>
                      </div>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                      disabled={!firewallEnabled}
                      className="shrink-0"
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blocked Attempts */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 font-medium text-sm lg:text-base">
                <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-destructive" />
                Blocked Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 max-h-64 lg:max-h-80 overflow-auto">
                <AnimatePresence mode="popLayout">
                  {blockedAttempts.length > 0 ? (
                    blockedAttempts.map((attempt) => (
                      <motion.div
                        key={attempt.id}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className="p-2 lg:p-3 rounded-lg bg-destructive/10 border border-destructive/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-destructive shrink-0" />
                            <span className="text-xs lg:text-sm font-mono text-foreground">{attempt.ip}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {attempt.country}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            x{attempt.count}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Port {attempt.port} - {attempt.reason}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
                      <p className="text-sm">No blocked attempts</p>
                      <p className="text-xs">Your network is secure</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Active Connections */}
          <Card className="glass border-border lg:col-span-3">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center justify-between font-medium text-sm lg:text-base">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  Network Connections
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-accent"
                  />
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOnlyActive(!showOnlyActive)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showOnlyActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="ml-1 text-xs">{showOnlyActive ? 'Show All' : 'Active Only'}</span>
                  </Button>
                  <span className="text-xs font-mono text-muted-foreground">
                    {displayedConnections.length} connections
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-72 lg:max-h-80">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Process</th>
                      <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Local</th>
                      <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Remote</th>
                      <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground hidden lg:table-cell">Protocol</th>
                      <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">State</th>
                      <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground hidden lg:table-cell">Traffic</th>
                      <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {displayedConnections.map((conn) => (
                        <motion.tr
                          key={conn.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`border-b border-border/50 hover:bg-muted/30 ${
                            conn.status === 'blocked' ? 'bg-destructive/5' : ''
                          }`}
                        >
                          <td className="py-2 px-2 lg:px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                conn.status === 'blocked' ? 'bg-destructive' :
                                conn.risk === 'medium' ? 'bg-yellow-500' :
                                conn.risk === 'low' ? 'bg-orange-400' :
                                'bg-accent'
                              }`} />
                              <span className="font-mono text-xs text-foreground truncate max-w-20 lg:max-w-none">
                                {conn.process}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-2 lg:px-4 font-mono text-xs text-muted-foreground">
                            :{conn.localPort}
                          </td>
                          <td className="py-2 px-2 lg:px-4 font-mono text-xs text-muted-foreground">
                            <span className="hidden lg:inline">{conn.remoteAddress}:</span>
                            <span className="lg:hidden">*:</span>
                            {conn.remotePort}
                          </td>
                          <td className="py-2 px-2 lg:px-4 hidden lg:table-cell">
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                              {conn.protocol}
                            </span>
                          </td>
                          <td className="py-2 px-2 lg:px-4">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              conn.state === 'ESTABLISHED' ? 'bg-accent/20 text-accent' :
                              conn.state === 'LISTENING' ? 'bg-primary/20 text-primary' :
                              conn.state === 'SYN_SENT' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {conn.state === 'ESTABLISHED' ? 'EST' : 
                               conn.state === 'LISTENING' ? 'LSN' :
                               conn.state === 'TIME_WAIT' ? 'TW' :
                               conn.state === 'SYN_SENT' ? 'SYN' : conn.state}
                            </span>
                          </td>
                          <td className="py-2 px-2 lg:px-4 hidden lg:table-cell">
                            <div className="text-xs text-muted-foreground">
                              <span className="text-accent">{formatBytes(conn.bytesIn)}</span>
                              {' / '}
                              <span className="text-primary">{formatBytes(conn.bytesOut)}</span>
                            </div>
                          </td>
                          <td className="py-2 px-2 lg:px-4">
                            <div className="flex gap-1">
                              {conn.status === 'blocked' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => allowConnection(conn.id)}
                                  className="h-7 w-7 p-0 text-accent hover:text-accent hover:bg-accent/10"
                                  title="Allow"
                                >
                                  <Unlock className="w-3 h-3" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => blockConnection(conn.id)}
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  title="Block"
                                >
                                  <Lock className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {displayedConnections.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground font-light">
                    No active connections
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Network Activity Graph (Simplified) */}
          <Card className="glass border-border lg:col-span-3">
            <CardHeader className="pb-2 lg:pb-4">
              <CardTitle className="flex items-center gap-2 font-medium text-sm lg:text-base">
                <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="p-3 lg:p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">HTTP/HTTPS</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-foreground">
                    {connections.filter(c => [80, 443, 8080, 8443].includes(c.remotePort)).length}
                  </p>
                  <Progress value={75} className="h-1 mt-2" />
                </div>
                <div className="p-3 lg:p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">TCP Connections</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-foreground">
                    {connections.filter(c => c.protocol === 'TCP').length}
                  </p>
                  <Progress value={60} className="h-1 mt-2" />
                </div>
                <div className="p-3 lg:p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">UDP Connections</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-foreground">
                    {connections.filter(c => c.protocol === 'UDP').length}
                  </p>
                  <Progress value={30} className="h-1 mt-2" />
                </div>
                <div className="p-3 lg:p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="w-4 h-4 text-destructive" />
                    <span className="text-xs text-muted-foreground">Blocked Today</span>
                  </div>
                  <p className="text-xl lg:text-2xl font-medium text-destructive">
                    {totalBlocked}
                  </p>
                  <Progress value={totalBlocked % 100} className="h-1 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
