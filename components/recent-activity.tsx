"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Shield, Bug, Globe, AlertTriangle } from "lucide-react"

const activities = [
  {
    type: "threat",
    message: "Malware blocked: Trojan.Gen.2",
    time: "2 min ago",
    icon: Bug,
    color: "text-destructive",
    bg: "bg-destructive/20"
  },
  {
    type: "scan",
    message: "Quick scan completed - 0 threats",
    time: "15 min ago",
    icon: Shield,
    color: "text-accent",
    bg: "bg-accent/20"
  },
  {
    type: "web",
    message: "Phishing URL blocked",
    time: "1 hour ago",
    icon: Globe,
    color: "text-primary",
    bg: "bg-primary/20"
  },
  {
    type: "warning",
    message: "Suspicious file quarantined",
    time: "3 hours ago",
    icon: AlertTriangle,
    color: "text-chart-5",
    bg: "bg-chart-5/20"
  },
  {
    type: "threat",
    message: "PUP.Optional blocked",
    time: "5 hours ago",
    icon: Bug,
    color: "text-destructive",
    bg: "bg-destructive/20"
  },
]

export function RecentActivity() {
  return (
    <Card className="glass border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{activity.message}</p>
                <p className="text-xs text-muted-foreground font-mono">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
