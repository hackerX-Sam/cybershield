"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, 
  Scan, 
  Globe, 
  Usb, 
  Flame, 
  Zap, 
  FileText, 
  Bell, 
  Settings,
  LayoutDashboard,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "scan", label: "Scan", icon: Scan },
  { id: "web-protection", label: "Web Protection", icon: Globe },
  { id: "usb-protection", label: "USB Protection", icon: Usb },
  { id: "firewall", label: "Firewall", icon: Flame },
  { id: "optimizer", label: "Optimizer", icon: Zap },
  { id: "logs", label: "Logs & Reports", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
]

export function MobileHeader({ 
  isOpen, 
  setIsOpen, 
  activeTab 
}: { 
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  activeTab: string 
}) {
  const currentItem = menuItems.find(item => item.id === activeTab)
  
  return (
    <div className="lg:hidden glass border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-foreground" />
          )}
        </motion.button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground text-sm">CyberShield</span>
        </div>
      </div>
      {currentItem && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <currentItem.icon className="w-4 h-4" />
          <span className="text-xs font-medium">{currentItem.label}</span>
        </div>
      )}
    </div>
  )
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    setIsOpen(false) // Close sidebar on mobile after selection
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "w-64 glass border-r border-border flex flex-col z-50",
          // Desktop: always visible
          "hidden lg:flex lg:relative lg:min-h-full",
          // Mobile: fixed sidebar
          isOpen && "fixed inset-y-0 left-0 flex min-h-screen"
        )}
      >
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-primary/20 flex items-center justify-center neon-glow-cyan"
            >
              <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="font-semibold text-base lg:text-lg text-foreground">CyberShield</h1>
              <p className="text-xs text-muted-foreground font-mono">PRO v3.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
          <ul className="flex flex-col gap-1.5 lg:gap-2">
            {menuItems.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all duration-200 group",
                    activeTab === item.id
                      ? "bg-primary/20 text-primary neon-glow-cyan"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110 shrink-0",
                    activeTab === item.id && "drop-shadow-[0_0_8px_oklch(0.8_0.15_190)]"
                  )} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                      style={{ boxShadow: "0 0 10px oklch(0.8 0.15 190)" }}
                    />
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Status */}
        <div className="p-3 lg:p-4 border-t border-border">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-lg p-3 lg:p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-accent"
                style={{ boxShadow: "0 0 10px oklch(0.65 0.2 160)" }}
              />
              <span className="text-xs font-mono text-accent">PROTECTED</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Last scan: 2 hours ago
            </p>
          </motion.div>
        </div>
      </motion.aside>
    </>
  )
}
