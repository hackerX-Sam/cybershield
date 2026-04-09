"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, HardDrive, Wifi, MemoryStick } from "lucide-react"
import { useCpuUsage, useMemoryUsage, useDiskInfo, useSystemInfo } from "@/hooks/use-electron"

export function SystemHealth() {
  const cpuUsage = useCpuUsage(1000)
  const memoryUsage = useMemoryUsage(2000)
  const disks = useDiskInfo(10000)
  const { systemInfo } = useSystemInfo(5000)
  
  // Calculate disk usage percentage
  const diskUsage = disks.length > 0 
    ? (disks[0].used / disks[0].size) * 100 
    : 0
  
  // Calculate network activity (simplified)
  const networkActivity = systemInfo?.network?.[0] 
    ? Math.min(100, ((systemInfo.network[0].rxSec + systemInfo.network[0].txSec) / 1000000) * 100)
    : 0

  const metrics = [
    { 
      name: "CPU Usage", 
      value: Math.round(cpuUsage.current), 
      icon: Cpu, 
      color: cpuUsage.current > 80 ? "bg-destructive" : "bg-primary",
      info: systemInfo?.cpu?.model?.split(' ').slice(0, 3).join(' ') || 'Loading...'
    },
    { 
      name: "Memory", 
      value: Math.round(memoryUsage.usagePercent), 
      icon: MemoryStick, 
      color: memoryUsage.usagePercent > 85 ? "bg-destructive" : "bg-accent",
      info: `${formatBytes(memoryUsage.used)} / ${formatBytes(memoryUsage.total)}`
    },
    { 
      name: "Disk", 
      value: Math.round(diskUsage), 
      icon: HardDrive, 
      color: diskUsage > 90 ? "bg-destructive" : "bg-chart-4",
      info: disks.length > 0 ? `${disks[0].mount} - ${formatBytes(disks[0].available)} free` : 'Loading...'
    },
    { 
      name: "Network", 
      value: Math.round(networkActivity), 
      icon: Wifi, 
      color: "bg-chart-5",
      info: systemInfo?.network?.[0] 
        ? `${formatSpeed(systemInfo.network[0].rxSec)} / ${formatSpeed(systemInfo.network[0].txSec)}`
        : 'Loading...'
    },
  ]

  return (
    <Card className="glass border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground font-normal">{metric.name}</span>
                  <span className="text-sm font-mono text-muted-foreground">{metric.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full ${metric.color} rounded-full`}
                    style={{
                      boxShadow: metric.value > 70 
                        ? "0 0 10px oklch(0.65 0.25 25 / 0.5)" 
                        : "0 0 10px oklch(0.75 0.18 180 / 0.3)"
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate font-mono">{metric.info}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec === 0) return '0 B/s'
  const k = 1024
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  const i = Math.floor(Math.log(bytesPerSec) / Math.log(k))
  return parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
