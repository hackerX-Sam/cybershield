"use client"

import { useState } from "react"
import { StartupAnimation } from "@/components/startup-animation"
import { Sidebar, MobileHeader } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { ScanPanel } from "@/components/scan-panel"
import { WebProtection } from "@/components/web-protection"
import { UsbProtection } from "@/components/usb-protection"
import { FirewallPanel } from "@/components/firewall-panel"
import { OptimizerPanel } from "@/components/optimizer-panel"
import { LogsPanel } from "@/components/logs-panel"
import { NotificationsPanel } from "@/components/notifications-panel"
import { SettingsPanel } from "@/components/settings-panel"
import { TitleBar } from "@/components/title-bar"

export default function Home() {
  const [showStartup, setShowStartup] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "scan":
        return <ScanPanel />
      case "web-protection":
        return <WebProtection />
      case "usb-protection":
        return <UsbProtection />
      case "firewall":
        return <FirewallPanel />
      case "optimizer":
        return <OptimizerPanel />
      case "logs":
        return <LogsPanel />
      case "notifications":
        return <NotificationsPanel />
      case "settings":
        return <SettingsPanel />
      default:
        return <Dashboard />
    }
  }

  return (
    <main className="min-h-screen bg-background cyber-grid flex flex-col">
      <TitleBar />
      <StartupAnimation 
        onComplete={() => setShowStartup(false)} 
        isVisible={showStartup} 
      />
      
      {!showStartup && (
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          <MobileHeader 
            isOpen={sidebarOpen} 
            setIsOpen={setSidebarOpen} 
            activeTab={activeTab}
          />
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
        </div>
      )}
    </main>
  )
}
