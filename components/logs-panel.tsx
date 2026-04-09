"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Shield, Bug, Globe, Flame, Download, Filter, Search } from "lucide-react"

const logs = [
  { id: 1, type: "threat", message: "Trojan.Gen.2 detected and quarantined", path: "C:\\Temp\\malicious.exe", time: "10:23 AM", date: "Today" },
  { id: 2, type: "scan", message: "Quick scan completed - 0 threats", path: "System", time: "9:45 AM", date: "Today" },
  { id: 3, type: "web", message: "Phishing URL blocked: fake-bank.com", path: "Chrome.exe", time: "9:12 AM", date: "Today" },
  { id: 4, type: "firewall", message: "Suspicious connection blocked", path: "185.234.12.45:8080", time: "8:30 AM", date: "Today" },
  { id: 5, type: "threat", message: "PUP.Optional removed", path: "C:\\Downloads\\free_software.exe", time: "6:15 PM", date: "Yesterday" },
  { id: 6, type: "scan", message: "Full scan completed - 2 threats", path: "System", time: "2:30 PM", date: "Yesterday" },
  { id: 7, type: "web", message: "Malware download blocked", path: "Edge.exe", time: "11:00 AM", date: "Yesterday" },
  { id: 8, type: "firewall", message: "Port scan attempt blocked", path: "External", time: "10:45 AM", date: "Yesterday" },
]

const getLogIcon = (type: string) => {
  switch (type) {
    case "threat": return Bug
    case "scan": return Shield
    case "web": return Globe
    case "firewall": return Flame
    default: return FileText
  }
}

const getLogColor = (type: string) => {
  switch (type) {
    case "threat": return { text: "text-destructive", bg: "bg-destructive/20" }
    case "scan": return { text: "text-accent", bg: "bg-accent/20" }
    case "web": return { text: "text-primary", bg: "bg-primary/20" }
    case "firewall": return { text: "text-chart-5", bg: "bg-chart-5/20" }
    default: return { text: "text-muted-foreground", bg: "bg-muted" }
  }
}

export function LogsPanel() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === "all" || log.type === filter
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.path.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    threats: logs.filter(l => l.type === "threat").length,
    scans: logs.filter(l => l.type === "scan").length,
    webBlocks: logs.filter(l => l.type === "web").length,
    firewallBlocks: logs.filter(l => l.type === "firewall").length,
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Logs & Reports</h2>
            <p className="text-muted-foreground">
              View scan history and security event logs
            </p>
          </div>
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Threats", value: stats.threats, icon: Bug, color: "text-destructive" },
            { label: "Scans", value: stats.scans, icon: Shield, color: "text-accent" },
            { label: "Web Blocks", value: stats.webBlocks, icon: Globe, color: "text-primary" },
            { label: "Firewall", value: stats.firewallBlocks, icon: Flame, color: "text-chart-5" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="glass border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              {/* Filter buttons */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {["all", "threat", "scan", "web", "firewall"].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className={filter === f 
                      ? "bg-primary text-primary-foreground" 
                      : "border-border text-muted-foreground hover:text-foreground"
                    }
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Event Log ({filteredLogs.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {filteredLogs.map((log, index) => {
                const Icon = getLogIcon(log.type)
                const colors = getLogColor(log.type)
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{log.message}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{log.path}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                      <p className="text-xs text-muted-foreground">{log.date}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
