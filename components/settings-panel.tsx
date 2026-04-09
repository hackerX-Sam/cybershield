"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings, Shield, Database, RefreshCw, Info, CheckCircle, Loader2 } from "lucide-react"

const generalSettings = [
  { name: "Start with Windows", description: "Launch CyberShield when Windows starts", enabled: true },
  { name: "Silent Mode", description: "Minimize notifications and pop-ups", enabled: false },
  { name: "Gaming Mode", description: "Reduce resource usage during games", enabled: false },
  { name: "Auto Updates", description: "Automatically update virus definitions", enabled: true },
]

const protectionSettings = [
  { name: "Real-time Protection", description: "Monitor files in real-time", enabled: true },
  { name: "Behavioral Analysis", description: "AI-powered threat detection", enabled: true },
  { name: "Cloud Scanning", description: "Use cloud for unknown files", enabled: true },
  { name: "Ransomware Protection", description: "Protect against ransomware attacks", enabled: true },
]

export function SettingsPanel() {
  const [general, setGeneral] = useState(generalSettings)
  const [protection, setProtection] = useState(protectionSettings)
  const [updating, setUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState("April 7, 2026 - 10:30 AM")

  const toggleGeneral = (index: number) => {
    setGeneral(prev =>
      prev.map((s, i) => i === index ? { ...s, enabled: !s.enabled } : s)
    )
  }

  const toggleProtection = (index: number) => {
    setProtection(prev =>
      prev.map((s, i) => i === index ? { ...s, enabled: !s.enabled } : s)
    )
  }

  const updateDefinitions = () => {
    setUpdating(true)
    setTimeout(() => {
      setUpdating(false)
      setLastUpdate(new Date().toLocaleString())
    }, 3000)
  }

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-1 lg:mb-2">Settings</h2>
          <p className="text-sm lg:text-base text-muted-foreground font-light">
            Configure your protection preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* General Settings */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 lg:gap-4">
                {general.map((setting, index) => (
                  <motion.div
                    key={setting.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 lg:p-4 rounded-lg bg-muted/30 gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-foreground">{setting.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{setting.description}</p>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() => toggleGeneral(index)}
                      className="shrink-0"
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Protection Settings */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Protection Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 lg:gap-4">
                {protection.map((setting, index) => (
                  <motion.div
                    key={setting.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 lg:p-4 rounded-lg bg-muted/30 gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-foreground">{setting.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{setting.description}</p>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() => toggleProtection(index)}
                      className="shrink-0"
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                <Database className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                Virus Definitions
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
                  {updating && [0, 1].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                      style={{ margin: `-${(i + 1) * 10}px` }}
                    />
                  ))}
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center ${
                    updating ? 'bg-primary/20' : 'bg-accent/20 neon-glow-green'
                  }`}>
                    {updating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
                      </motion.div>
                    ) : (
                      <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-accent" />
                    )}
                  </div>
                </motion.div>

                <p className={`mt-3 lg:mt-4 text-base lg:text-lg font-semibold ${updating ? 'text-primary' : 'text-accent neon-text-green'}`}>
                  {updating ? 'UPDATING...' : 'UP TO DATE'}
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground mt-2 text-center">
                  Last updated: {lastUpdate}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Version: 2026.04.07.001
                </p>

                <Button
                  onClick={updateDefinitions}
                  disabled={updating}
                  className="mt-4 lg:mt-6 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                  size="sm"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Check for Updates
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="glass border-border">
            <CardHeader className="pb-2 lg:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                <Info className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                About CyberShield Pro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4 lg:py-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-cyan mb-3 lg:mb-4"
                >
                  <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
                </motion.div>
                
                <h3 className="text-lg lg:text-xl font-semibold text-foreground">CyberShield Pro</h3>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">Version 3.0.0</p>
                
                <div className="w-full mt-4 lg:mt-6 p-3 lg:p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs lg:text-sm text-muted-foreground">License</span>
                    <span className="text-xs lg:text-sm text-accent">Premium</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs lg:text-sm text-muted-foreground">Expires</span>
                    <span className="text-xs lg:text-sm text-foreground">April 7, 2027</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs lg:text-sm text-muted-foreground">Status</span>
                    <span className="text-xs lg:text-sm text-accent">Active</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-6 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground text-xs">
                    Privacy Policy
                  </Button>
                  <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground text-xs">
                    Terms of Service
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
