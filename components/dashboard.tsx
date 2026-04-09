"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Bug, Globe, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ProtectionStatus } from "./protection-status"
import { ThreatChart } from "./threat-chart"
import { SystemHealth } from "./system-health"
import { RecentActivity } from "./recent-activity"

const stats = [
  {
    label: "Threats Blocked",
    value: "1,247",
    change: "+12%",
    icon: Bug,
    color: "text-destructive",
    glow: "neon-glow-red"
  },
  {
    label: "Files Scanned",
    value: "48.2K",
    change: "+8%",
    icon: Shield,
    color: "text-primary",
    glow: "neon-glow-cyan"
  },
  {
    label: "Web Blocks",
    value: "892",
    change: "+5%",
    icon: Globe,
    color: "text-accent",
    glow: "neon-glow-green"
  },
  {
    label: "Uptime",
    value: "99.9%",
    change: "Stable",
    icon: Clock,
    color: "text-primary",
    glow: "neon-glow-cyan"
  },
]

export function Dashboard() {
  return (
    <div className="flex-1 p-4 lg:p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-1 lg:mb-2">Dashboard</h2>
          <p className="text-sm lg:text-base text-muted-foreground font-light">
            Monitor your system&apos;s security status and recent activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-border hover:border-primary/50 transition-all duration-300 group">
                <CardContent className="p-3 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div className="order-2 lg:order-1">
                      <p className="text-xs lg:text-sm text-muted-foreground mb-0.5 lg:mb-1">{stat.label}</p>
                      <p className="text-xl lg:text-2xl font-semibold text-foreground">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1 lg:mt-2">
                        <TrendingUp className="w-3 h-3 text-accent" />
                        <span className="text-xs text-accent">{stat.change}</span>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className={`order-1 lg:order-2 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-muted flex items-center justify-center group-hover:${stat.glow} transition-all duration-300`}
                    >
                      <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
          {/* Protection Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <ProtectionStatus />
          </motion.div>

          {/* Threat Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <ThreatChart />
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SystemHealth />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RecentActivity />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
