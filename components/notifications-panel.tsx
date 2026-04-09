"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Bug, Shield, Globe, AlertTriangle, CheckCircle, X, Settings } from "lucide-react"

const initialNotifications = [
  {
    id: 1,
    type: "threat",
    title: "Threat Detected",
    message: "Trojan.Gen.2 was blocked and quarantined",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "scan",
    title: "Scan Complete",
    message: "Quick scan finished - your system is clean",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "web",
    title: "Phishing Blocked",
    message: "A suspicious website was blocked for your protection",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "update",
    title: "Definitions Updated",
    message: "Virus definitions have been updated to the latest version",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "warning",
    title: "Firewall Alert",
    message: "Suspicious incoming connection was blocked",
    time: "5 hours ago",
    read: true,
  },
]

const notificationSettings = [
  { name: "Threat Alerts", description: "Get notified when threats are detected", enabled: true },
  { name: "Scan Results", description: "Notifications for completed scans", enabled: true },
  { name: "Web Protection", description: "Alerts for blocked websites", enabled: true },
  { name: "Update Notifications", description: "Definition and app updates", enabled: false },
  { name: "Sound Alerts", description: "Play sound for critical alerts", enabled: true },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "threat": return Bug
    case "scan": return Shield
    case "web": return Globe
    case "update": return CheckCircle
    case "warning": return AlertTriangle
    default: return Bell
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "threat": return { text: "text-destructive", bg: "bg-destructive/20", border: "border-destructive/30" }
    case "scan": return { text: "text-accent", bg: "bg-accent/20", border: "border-accent/30" }
    case "web": return { text: "text-primary", bg: "bg-primary/20", border: "border-primary/30" }
    case "update": return { text: "text-accent", bg: "bg-accent/20", border: "border-accent/30" }
    case "warning": return { text: "text-chart-5", bg: "bg-chart-5/20", border: "border-chart-5/30" }
    default: return { text: "text-muted-foreground", bg: "bg-muted", border: "border-border" }
  }
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [settings, setSettings] = useState(notificationSettings)
  const [showSettings, setShowSettings] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const toggleSetting = (index: number) => {
    setSettings(prev =>
      prev.map((s, i) => i === index ? { ...s, enabled: !s.enabled } : s)
    )
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Notifications</h2>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="border-border text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-2">
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {notifications.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {notifications.map((notification, index) => {
                        const Icon = getNotificationIcon(notification.type)
                        const colors = getNotificationColor(notification.type)
                        
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => markAsRead(notification.id)}
                            className={`relative flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                              notification.read 
                                ? 'bg-muted/20 border-border' 
                                : `${colors.bg} ${colors.border}`
                            }`}
                          >
                            {!notification.read && (
                              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary"
                                style={{ boxShadow: "0 0 10px oklch(0.75 0.18 180)" }}
                              />
                            )}
                            <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${colors.text}`} />
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                              <p className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                dismissNotification(notification.id)
                              }}
                              className="absolute top-2 right-2 w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-12 text-center">
                      <Bell className="w-16 h-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No notifications</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You&apos;re all caught up!
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div>
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {settings.map((setting, index) => (
                    <motion.div
                      key={setting.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{setting.name}</p>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={() => toggleSetting(index)}
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
