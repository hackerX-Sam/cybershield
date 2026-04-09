"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Usb, Shield, HardDrive, CheckCircle, AlertTriangle, Scan, XCircle } from "lucide-react"

const connectedDevices = [
  { name: "SanDisk USB Drive", size: "32 GB", status: "scanned", threats: 0, lastScan: "Just now" },
  { name: "External HDD", size: "1 TB", status: "scanning", threats: 0, lastScan: "Scanning..." },
]

const deviceHistory = [
  { name: "Kingston DataTraveler", size: "16 GB", date: "Yesterday", threats: 2, action: "Cleaned" },
  { name: "Seagate Backup", size: "2 TB", date: "3 days ago", threats: 0, action: "Safe" },
  { name: "Unknown USB", size: "8 GB", date: "1 week ago", threats: 5, action: "Blocked" },
]

export function UsbProtection() {
  const [autoScan, setAutoScan] = useState(true)
  const [blockUnknown, setBlockUnknown] = useState(true)
  const [deepScan, setDeepScan] = useState(false)

  return (
    <div className="flex-1 p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">USB Protection</h2>
          <p className="text-muted-foreground">
            Auto-scan external devices and protect against USB threats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Usb className="w-5 h-5 text-primary" />
                Protection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  {autoScan && [0, 1].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-accent/30"
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                      style={{ margin: `-${(i + 1) * 16}px` }}
                    />
                  ))}
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    autoScan ? 'bg-accent/20 neon-glow-green' : 'bg-muted'
                  }`}>
                    <Usb className={`w-12 h-12 ${autoScan ? 'text-accent' : 'text-muted-foreground'}`} />
                  </div>
                </motion.div>

                <p className={`mt-4 text-lg font-bold ${autoScan ? 'text-accent neon-text-green' : 'text-muted-foreground'}`}>
                  {autoScan ? 'ACTIVE' : 'DISABLED'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {connectedDevices.length} device(s) connected
                </p>
              </div>

              {/* Settings */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-foreground">Auto-scan on connect</span>
                  <Switch checked={autoScan} onCheckedChange={setAutoScan} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-foreground">Block unknown devices</span>
                  <Switch checked={blockUnknown} onCheckedChange={setBlockUnknown} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-foreground">Deep scan (slower)</span>
                  <Switch checked={deepScan} onCheckedChange={setDeepScan} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connected Devices */}
          <Card className="glass border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-primary" />
                Connected Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connectedDevices.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {connectedDevices.map((device, index) => (
                    <motion.div
                      key={device.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        device.status === 'scanned' ? 'bg-accent/20' :
                        device.status === 'scanning' ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        {device.status === 'scanned' ? (
                          <CheckCircle className="w-6 h-6 text-accent" />
                        ) : device.status === 'scanning' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Scan className="w-6 h-6 text-primary" />
                          </motion.div>
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-chart-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{device.name}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {device.size}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {device.lastScan}
                          {device.status === 'scanned' && ` • ${device.threats} threats found`}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/50 text-primary hover:bg-primary/10"
                      >
                        {device.status === 'scanning' ? 'Stop' : 'Scan'}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-12 text-center">
                  <Usb className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No devices connected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect a USB device to scan it
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device History */}
          <Card className="glass border-border lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Device History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Device</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Threats</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceHistory.map((device, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-border/50 hover:bg-muted/30"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Usb className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{device.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{device.size}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{device.date}</td>
                        <td className="py-3 px-4">
                          <span className={`text-sm font-mono ${
                            device.threats > 0 ? 'text-destructive' : 'text-accent'
                          }`}>
                            {device.threats}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            device.action === 'Safe' ? 'bg-accent/20 text-accent' :
                            device.action === 'Cleaned' ? 'bg-primary/20 text-primary' :
                            'bg-destructive/20 text-destructive'
                          }`}>
                            {device.action}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
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
