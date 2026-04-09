"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Globe, Shield, Ban, Link, AlertTriangle, CheckCircle } from "lucide-react"

const blockedSites = [
  { url: "malware-download.net", type: "Malware", blocked: "2 hours ago" },
  { url: "phishing-bank.com", type: "Phishing", blocked: "5 hours ago" },
  { url: "suspicious-scripts.ru", type: "Scripts", blocked: "1 day ago" },
  { url: "crypto-scam.xyz", type: "Scam", blocked: "2 days ago" },
]

const protectionFeatures = [
  { name: "Block Phishing Sites", description: "Protect against fake websites", enabled: true },
  { name: "Block Malware Downloads", description: "Prevent malicious file downloads", enabled: true },
  { name: "Safe Search", description: "Filter explicit content from searches", enabled: false },
  { name: "HTTPS Enforcement", description: "Redirect to secure connections", enabled: true },
  { name: "Tracker Blocking", description: "Block website trackers and analytics", enabled: true },
]

export function WebProtection() {
  const [features, setFeatures] = useState(protectionFeatures)

  const toggleFeature = (index: number) => {
    setFeatures(prev => 
      prev.map((f, i) => i === index ? { ...f, enabled: !f.enabled } : f)
    )
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Web Protection</h2>
          <p className="text-muted-foreground">
            Block malicious websites and protect your browsing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Card */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Protection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  {/* Animated rings */}
                  {[0, 1].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-accent/30"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.5,
                        repeat: Infinity,
                      }}
                      style={{ margin: `-${(i + 1) * 16}px` }}
                    />
                  ))}
                  
                  <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center neon-glow-green">
                    <Shield className="w-12 h-12 text-accent" />
                  </div>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 text-lg font-bold text-accent neon-text-green"
                >
                  ACTIVE
                </motion.p>
                <p className="text-sm text-muted-foreground mt-2">
                  All web threats are being blocked
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 w-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">892</p>
                    <p className="text-xs text-muted-foreground">Sites Blocked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">45</p>
                    <p className="text-xs text-muted-foreground">Phishing Attempts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">128</p>
                    <p className="text-xs text-muted-foreground">Trackers Blocked</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Protection Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        feature.enabled ? 'bg-accent/20' : 'bg-muted'
                      }`}>
                        {feature.enabled ? (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        ) : (
                          <Ban className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{feature.name}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => toggleFeature(index)}
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blocked Sites */}
          <Card className="glass border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-destructive" />
                Recently Blocked Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blockedSites.map((site, index) => (
                  <motion.div
                    key={site.url}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                  >
                    <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-foreground truncate">{site.url}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
                          {site.type}
                        </span>
                        <span className="text-xs text-muted-foreground">{site.blocked}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Link className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
