"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Flame, ArrowUpRight, ArrowDownLeft, Shield, Activity, Ban, CheckCircle, RefreshCw } from "lucide-react"
import { useNetworkConnections, useSystemInfo, useProcesses } from "@/hooks/use-electron"

const defaultRules = [
  { name: "Block incoming connections", enabled: true },
  { name: "Block unknown applications", enabled: true },
  { name: "Allow trusted apps only", enabled: false },
  { name: "Log all connections", enabled: true },
]

export function FirewallPanel() {
  const [firewallRules, setFirewallRules] = useState(defaultRules)
  const [firewallEnabled, setFirewallEnabled] = useState(true)
  const { connections, loading } = useNetworkConnections(3000)
  const { systemInfo } = useSystemInfo(5000)
  const { processes } = useProcesses(5000)

  const toggleRule = (index: number) => {
    setFirewallRules(prev =>
      prev.map((r, i) => i === index ? { ...r, enabled: !r.enabled } : r)
    )
  }

  // Calculate traffic from system info
  const outgoingTraffic = systemInfo?.network?.[0]?.txBytes || 0
  const incomingTraffic = systemInfo?.network?.[0]?.rxBytes || 0

  // Count blocked connections (those in non-ESTABLISHED states)
  const blockedCount = connections.filter(c => 
    c.state === 'CLOSE_WAIT' || c.state === 'TIME_WAIT' || c.state === 'FIN_WAIT'
  ).length

  return (
    <div className="flex-1 p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-foreground mb-2">Firewall</h2>
          <p className="text-muted-foreground font-light">
            Monitor and control network traffic
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Status */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-medium">
                <Flame className="w-5 h-5 text-primary" />
                Firewall Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-6">
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
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      firewallEnabled ? 'bg-accent/20' : 'bg-muted'
                    }`}
                  >
                    <Flame className={`w-12 h-12 ${firewallEnabled ? 'text-accent' : 'text-muted-foreground'}`} />
                  </motion.div>
                </motion.div>

                <p className={`mt-4 text-lg font-medium ${firewallEnabled ? 'text-accent neon-text-green' : 'text-muted-foreground'}`}>
                  {firewallEnabled ? 'ACTIVE' : 'DISABLED'}
                </p>
                <p className="text-sm text-muted-foreground mt-1 font-light">
                  Click to toggle
                </p>

                {/* Traffic Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                      <span className="text-lg font-medium text-foreground">{formatBytes(outgoingTraffic)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">Outgoing</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ArrowDownLeft className="w-4 h-4 text-accent" />
                      <span className="text-lg font-medium text-foreground">{formatBytes(incomingTraffic)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">Incoming</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-medium">
                <Shield className="w-5 h-5 text-primary" />
                Firewall Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {firewallRules.map((rule, index) => (
                  <motion.div
                    key={rule.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${
                        rule.enabled ? 'bg-accent/20' : 'bg-muted'
                      }`}>
                        {rule.enabled ? (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        ) : (
                          <Ban className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-sm text-foreground font-normal">{rule.name}</span>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(index)}
                      disabled={!firewallEnabled}
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-medium">
                <Activity className="w-5 h-5 text-primary" />
                Traffic Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1 font-light">Total Connections</p>
                  <p className="text-2xl font-medium text-foreground">{connections.length.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1 font-light">Blocked Connections</p>
                  <p className="text-2xl font-medium text-destructive">{blockedCount}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1 font-light">Active Processes</p>
                  <p className="text-2xl font-medium text-foreground">{processes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Connections */}
          <Card className="glass border-border lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between font-medium">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Active Connections
                  {loading && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
                </span>
                <span className="text-sm font-mono text-muted-foreground">
                  {connections.length} connections
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-80">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Process</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Local</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Remote</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Protocol</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {connections.slice(0, 20).map((conn, index) => (
                      <motion.tr
                        key={`${conn.localAddress}-${conn.localPort}-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-muted/30"
                      >
                        <td className="py-2 px-4 font-mono text-xs text-foreground">
                          {conn.process || 'System'}
                        </td>
                        <td className="py-2 px-4 font-mono text-xs text-muted-foreground">
                          {conn.localAddress}:{conn.localPort}
                        </td>
                        <td className="py-2 px-4 font-mono text-xs text-muted-foreground">
                          {conn.peerAddress || '*'}:{conn.peerPort || '*'}
                        </td>
                        <td className="py-2 px-4">
                          <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                            {conn.protocol}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            conn.state === 'ESTABLISHED' 
                              ? 'bg-accent/20 text-accent' 
                              : conn.state === 'LISTEN'
                              ? 'bg-chart-5/20 text-chart-5'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {conn.state}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {connections.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground font-light">
                    No active connections found
                  </div>
                )}
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
