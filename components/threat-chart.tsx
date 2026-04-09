"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Bug } from "lucide-react"

const data = [
  { name: "Mon", threats: 45, blocked: 45 },
  { name: "Tue", threats: 52, blocked: 52 },
  { name: "Wed", threats: 38, blocked: 38 },
  { name: "Thu", threats: 65, blocked: 65 },
  { name: "Fri", threats: 48, blocked: 48 },
  { name: "Sat", threats: 29, blocked: 29 },
  { name: "Sun", threats: 35, blocked: 35 },
]

export function ThreatChart() {
  return (
    <Card className="glass border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bug className="w-5 h-5 text-destructive" />
          Threats Detected (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.25 25)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="oklch(0.65 0.25 25)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.75 0.18 180)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="oklch(0.75 0.18 180)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="oklch(0.3 0.02 200 / 0.2)" 
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.6 0.02 200)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.6 0.02 200)', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'oklch(0.12 0.02 260)',
                  border: '1px solid oklch(0.25 0.04 260)',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px oklch(0 0 0 / 0.5)',
                }}
                labelStyle={{ color: 'oklch(0.95 0.01 200)' }}
                itemStyle={{ color: 'oklch(0.95 0.01 200)' }}
              />
              <Area
                type="monotone"
                dataKey="threats"
                stroke="oklch(0.65 0.25 25)"
                strokeWidth={2}
                fill="url(#threatGradient)"
                name="Detected"
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stroke="oklch(0.75 0.18 180)"
                strokeWidth={2}
                fill="url(#blockedGradient)"
                name="Blocked"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">Detected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Blocked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
