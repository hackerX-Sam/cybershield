'use client';

import { useState, useEffect, useCallback } from 'react';
import type { 
  SystemInfo, 
  CpuUsage, 
  MemoryInfo, 
  ProcessInfo, 
  NetworkConnection,
  DiskDrive,
  ScanResult,
  ScanProgress,
  StartupProgram,
  UsbDevicesResult,
  TempFilesInfo,
  CleanResult
} from '@/lib/electron-types';

// Check if running in Electron
export function useIsElectron(): boolean {
  const [isElectron, setIsElectron] = useState(false);
  
  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && window.isElectron === true);
  }, []);
  
  return isElectron;
}

// System Information Hook
export function useSystemInfo(refreshInterval = 2000) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isElectron = useIsElectron();
  
  const fetchSystemInfo = useCallback(async () => {
    if (!isElectron || !window.electronAPI) {
      // Generate mock data for web preview
      setSystemInfo(generateMockSystemInfo());
      setLoading(false);
      return;
    }
    
    try {
      const info = await window.electronAPI.getSystemInfo();
      if (info) {
        setSystemInfo(info);
        setError(null);
      }
    } catch (e) {
      setError('Failed to fetch system info');
    } finally {
      setLoading(false);
    }
  }, [isElectron]);
  
  useEffect(() => {
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchSystemInfo, refreshInterval]);
  
  return { systemInfo, loading, error, refresh: fetchSystemInfo };
}

// CPU Usage Hook with real-time updates
export function useCpuUsage(refreshInterval = 1000) {
  const [cpuUsage, setCpuUsage] = useState<CpuUsage>({ current: 0, cores: [] });
  const isElectron = useIsElectron();
  
  useEffect(() => {
    const fetchCpu = async () => {
      if (isElectron && window.electronAPI) {
        try {
          const usage = await window.electronAPI.getCpuUsage();
          setCpuUsage(usage);
        } catch (e) {
          // Fallback to mock
          setCpuUsage({ current: 25 + Math.random() * 30, cores: [] });
        }
      } else {
        // Mock data for web preview - simulate realistic fluctuation
        setCpuUsage(prev => ({
          current: Math.max(5, Math.min(95, prev.current + (Math.random() - 0.5) * 10)),
          cores: Array(8).fill(0).map(() => Math.random() * 100)
        }));
      }
    };
    
    fetchCpu();
    const interval = setInterval(fetchCpu, refreshInterval);
    return () => clearInterval(interval);
  }, [isElectron, refreshInterval]);
  
  return cpuUsage;
}

// Memory Usage Hook
export function useMemoryUsage(refreshInterval = 2000) {
  const [memoryUsage, setMemoryUsage] = useState<MemoryInfo>({
    total: 16 * 1024 * 1024 * 1024,
    used: 8 * 1024 * 1024 * 1024,
    free: 8 * 1024 * 1024 * 1024,
    usagePercent: 50
  });
  const isElectron = useIsElectron();
  
  useEffect(() => {
    const fetchMemory = async () => {
      if (isElectron && window.electronAPI) {
        try {
          const usage = await window.electronAPI.getMemoryUsage();
          setMemoryUsage(usage);
        } catch (e) {
          // Keep current mock
        }
      } else {
        // Mock realistic memory fluctuation
        setMemoryUsage(prev => {
          const fluctuation = (Math.random() - 0.5) * 0.5 * 1024 * 1024 * 1024;
          const newUsed = Math.max(4 * 1024 * 1024 * 1024, Math.min(14 * 1024 * 1024 * 1024, prev.used + fluctuation));
          return {
            total: 16 * 1024 * 1024 * 1024,
            used: newUsed,
            free: 16 * 1024 * 1024 * 1024 - newUsed,
            usagePercent: (newUsed / (16 * 1024 * 1024 * 1024)) * 100
          };
        });
      }
    };
    
    fetchMemory();
    const interval = setInterval(fetchMemory, refreshInterval);
    return () => clearInterval(interval);
  }, [isElectron, refreshInterval]);
  
  return memoryUsage;
}

// Process List Hook
export function useProcesses(refreshInterval = 3000) {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const isElectron = useIsElectron();
  
  useEffect(() => {
    const fetchProcesses = async () => {
      if (isElectron && window.electronAPI) {
        try {
          const procs = await window.electronAPI.getProcesses();
          setProcesses(procs);
        } catch (e) {
          setProcesses(generateMockProcesses());
        }
      } else {
        setProcesses(generateMockProcesses());
      }
      setLoading(false);
    };
    
    fetchProcesses();
    const interval = setInterval(fetchProcesses, refreshInterval);
    return () => clearInterval(interval);
  }, [isElectron, refreshInterval]);
  
  return { processes, loading };
}

// Network Connections Hook
export function useNetworkConnections(refreshInterval = 5000) {
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const isElectron = useIsElectron();
  
  useEffect(() => {
    const fetchConnections = async () => {
      if (isElectron && window.electronAPI) {
        try {
          const conns = await window.electronAPI.getNetworkConnections();
          setConnections(conns);
        } catch (e) {
          setConnections(generateMockConnections());
        }
      } else {
        setConnections(generateMockConnections());
      }
      setLoading(false);
    };
    
    fetchConnections();
    const interval = setInterval(fetchConnections, refreshInterval);
    return () => clearInterval(interval);
  }, [isElectron, refreshInterval]);
  
  return { connections, loading };
}

// Disk Info Hook
export function useDiskInfo(refreshInterval = 10000) {
  const [disks, setDisks] = useState<DiskDrive[]>([]);
  const isElectron = useIsElectron();
  
  useEffect(() => {
    const fetchDisks = async () => {
      if (isElectron && window.electronAPI) {
        try {
          const diskInfo = await window.electronAPI.getDiskInfo();
          setDisks(diskInfo);
        } catch (e) {
          setDisks(generateMockDisks());
        }
      } else {
        setDisks(generateMockDisks());
      }
    };
    
    fetchDisks();
    const interval = setInterval(fetchDisks, refreshInterval);
    return () => clearInterval(interval);
  }, [isElectron, refreshInterval]);
  
  return disks;
}

// File Scanner Hook
export function useScanner() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const isElectron = useIsElectron();
  
  const startScan = useCallback(async (directory?: string) => {
    setScanning(true);
    setProgress({ currentFile: '', filesScanned: 0, threatsFound: 0 });
    setResult(null);
    
    if (isElectron && window.electronAPI) {
      // Set up progress listener
      window.electronAPI.onScanProgress((data) => {
        setProgress(data);
      });
      
      try {
        const scanResult = await window.electronAPI.scanDirectory(directory);
        setResult(scanResult);
      } catch (e) {
        console.error('Scan failed:', e);
      } finally {
        window.electronAPI.removeScanProgressListener();
        setScanning(false);
      }
    } else {
      // Simulate scan for web preview
      await simulateScan(setProgress);
      setResult({
        filesScanned: 15420,
        threatsFound: [],
        currentFile: '',
        startTime: Date.now() - 45000,
        endTime: Date.now(),
        duration: 45000
      });
      setScanning(false);
    }
  }, [isElectron]);
  
  const stopScan = useCallback(() => {
    setScanning(false);
    if (isElectron && window.electronAPI) {
      window.electronAPI.removeScanProgressListener();
    }
  }, [isElectron]);
  
  return { scanning, progress, result, startScan, stopScan };
}

// USB Devices Hook
export function useUsbDevices(refreshInterval = 5000) {
  const [devices, setDevices] = useState<UsbDevicesResult>({ usbDevices: [], removableDrives: [] });
  const isElectron = useIsElectron();
  
  useEffect(() => {
    const fetchDevices = async () => {
      if (isElectron && window.electronAPI) {
        try {
          const usb = await window.electronAPI.getUsbDevices();
          setDevices(usb);
        } catch (e) {
          setDevices(generateMockUsbDevices());
        }
      } else {
        setDevices(generateMockUsbDevices());
      }
    };
    
    fetchDevices();
    const interval = setInterval(fetchDevices, refreshInterval);
    return () => clearInterval(interval);
  }, [isElectron, refreshInterval]);
  
  return devices;
}

// Startup Programs Hook
export function useStartupPrograms() {
  const [programs, setPrograms] = useState<StartupProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const isElectron = useIsElectron();
  
  useEffect(() => {
    const fetchPrograms = async () => {
      if (isElectron && window.electronAPI) {
        try {
          const progs = await window.electronAPI.getStartupPrograms();
          setPrograms(progs);
        } catch (e) {
          setPrograms(generateMockStartupPrograms());
        }
      } else {
        setPrograms(generateMockStartupPrograms());
      }
      setLoading(false);
    };
    
    fetchPrograms();
  }, [isElectron]);
  
  return { programs, loading, setPrograms };
}

// Temp Files Cleanup Hook
export function useTempFiles() {
  const [tempInfo, setTempInfo] = useState<TempFilesInfo | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const isElectron = useIsElectron();
  
  const fetchTempInfo = useCallback(async () => {
    if (isElectron && window.electronAPI) {
      try {
        const info = await window.electronAPI.getTempFiles();
        setTempInfo(info);
      } catch (e) {
        setTempInfo({ totalSize: 2.5 * 1024 * 1024 * 1024, fileCount: 1250, tempDir: '/tmp' });
      }
    } else {
      setTempInfo({ totalSize: 2.5 * 1024 * 1024 * 1024, fileCount: 1250, tempDir: '/tmp' });
    }
  }, [isElectron]);
  
  const cleanTempFiles = useCallback(async (): Promise<CleanResult> => {
    setCleaning(true);
    
    if (isElectron && window.electronAPI) {
      try {
        const result = await window.electronAPI.cleanTempFiles();
        await fetchTempInfo();
        return result;
      } catch (e) {
        return { cleaned: 0, freedSpace: 0 };
      } finally {
        setCleaning(false);
      }
    } else {
      // Simulate cleanup
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCleaning(false);
      return { cleaned: 1250, freedSpace: 2.5 * 1024 * 1024 * 1024 };
    }
  }, [isElectron, fetchTempInfo]);
  
  useEffect(() => {
    fetchTempInfo();
  }, [fetchTempInfo]);
  
  return { tempInfo, cleaning, cleanTempFiles, refresh: fetchTempInfo };
}

// Window Controls Hook
export function useWindowControls() {
  const isElectron = useIsElectron();
  
  const minimize = useCallback(() => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  }, [isElectron]);
  
  const maximize = useCallback(() => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.maximizeWindow();
    }
  }, [isElectron]);
  
  const close = useCallback(() => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  }, [isElectron]);
  
  return { minimize, maximize, close, isElectron };
}

// ========== MOCK DATA GENERATORS ==========

function generateMockSystemInfo(): SystemInfo {
  return {
    cpu: {
      model: 'AMD Ryzen 9 5900X 12-Core Processor',
      cores: 12,
      speed: 3700,
      usage: 25 + Math.random() * 20
    },
    memory: {
      total: 32 * 1024 * 1024 * 1024,
      used: 18 * 1024 * 1024 * 1024,
      free: 14 * 1024 * 1024 * 1024,
      usagePercent: 56
    },
    disk: {
      total: 1000 * 1024 * 1024 * 1024,
      used: 650 * 1024 * 1024 * 1024,
      free: 350 * 1024 * 1024 * 1024
    },
    network: [
      { interface: 'Ethernet', rxBytes: 15000000000, txBytes: 5000000000, rxSec: 125000, txSec: 45000 }
    ],
    gpu: {
      model: 'NVIDIA GeForce RTX 4080',
      vram: 16384
    },
    os: {
      platform: 'win32',
      hostname: 'DESKTOP-CYBER',
      uptime: 345600,
      arch: 'x64',
      release: '10.0.22631'
    }
  };
}

function generateMockProcesses(): ProcessInfo[] {
  const mockProcesses = [
    { pid: 4, name: 'System', cpu: 0.5, memory: 0.1, state: 'running' },
    { pid: 1024, name: 'chrome.exe', cpu: 15.2, memory: 8.5, state: 'running' },
    { pid: 2048, name: 'code.exe', cpu: 8.3, memory: 4.2, state: 'running' },
    { pid: 3072, name: 'explorer.exe', cpu: 1.2, memory: 1.8, state: 'running' },
    { pid: 4096, name: 'discord.exe', cpu: 3.5, memory: 2.1, state: 'running' },
    { pid: 5120, name: 'spotify.exe', cpu: 2.1, memory: 1.5, state: 'running' },
    { pid: 6144, name: 'node.exe', cpu: 5.8, memory: 3.2, state: 'running' },
    { pid: 7168, name: 'WindowsTerminal.exe', cpu: 0.8, memory: 0.9, state: 'running' },
    { pid: 8192, name: 'CyberShieldPro.exe', cpu: 2.5, memory: 1.2, state: 'running' },
    { pid: 9216, name: 'svchost.exe', cpu: 0.3, memory: 0.4, state: 'running' },
  ];
  
  return mockProcesses.map(p => ({
    ...p,
    cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 2),
    memory: Math.max(0, p.memory + (Math.random() - 0.5) * 0.5)
  }));
}

function generateMockConnections(): NetworkConnection[] {
  return [
    { protocol: 'TCP', localAddress: '192.168.1.100', localPort: 443, peerAddress: '142.250.80.46', peerPort: 443, state: 'ESTABLISHED', process: 'chrome.exe' },
    { protocol: 'TCP', localAddress: '192.168.1.100', localPort: 49152, peerAddress: '20.190.163.2', peerPort: 443, state: 'ESTABLISHED', process: 'code.exe' },
    { protocol: 'TCP', localAddress: '192.168.1.100', localPort: 49153, peerAddress: '162.159.133.234', peerPort: 443, state: 'ESTABLISHED', process: 'discord.exe' },
    { protocol: 'UDP', localAddress: '0.0.0.0', localPort: 5353, peerAddress: '*', peerPort: 0, state: 'LISTENING', process: 'mDNSResponder.exe' },
    { protocol: 'TCP', localAddress: '127.0.0.1', localPort: 3000, peerAddress: '127.0.0.1', peerPort: 49200, state: 'ESTABLISHED', process: 'node.exe' },
  ];
}

function generateMockDisks(): DiskDrive[] {
  return [
    { fs: 'C:', type: 'NTFS', size: 500 * 1024 * 1024 * 1024, used: 320 * 1024 * 1024 * 1024, available: 180 * 1024 * 1024 * 1024, usePercent: 64, mount: 'C:' },
    { fs: 'D:', type: 'NTFS', size: 1000 * 1024 * 1024 * 1024, used: 650 * 1024 * 1024 * 1024, available: 350 * 1024 * 1024 * 1024, usePercent: 65, mount: 'D:' },
  ];
}

function generateMockUsbDevices(): UsbDevicesResult {
  return {
    usbDevices: [
      { bus: 1, deviceId: 1, name: 'USB Composite Device', type: 'hub', vendor: 'Generic', serialNumber: '' },
      { bus: 1, deviceId: 2, name: 'Logitech G Pro Wireless', type: 'HID', vendor: 'Logitech', serialNumber: 'LG-2024-001' },
    ],
    removableDrives: []
  };
}

function generateMockStartupPrograms(): StartupProgram[] {
  return [
    { name: 'Discord', path: 'C:\\Users\\User\\AppData\\Local\\Discord\\Update.exe', enabled: true, source: 'Registry' },
    { name: 'Spotify', path: 'C:\\Users\\User\\AppData\\Roaming\\Spotify\\Spotify.exe', enabled: true, source: 'Registry' },
    { name: 'Steam', path: 'C:\\Program Files (x86)\\Steam\\steam.exe', enabled: false, source: 'Registry' },
    { name: 'OneDrive', path: 'C:\\Program Files\\Microsoft OneDrive\\OneDrive.exe', enabled: true, source: 'Registry' },
    { name: 'CyberShield Pro', path: 'C:\\Program Files\\CyberShield Pro\\CyberShieldPro.exe', enabled: true, source: 'Registry' },
  ];
}

async function simulateScan(setProgress: (p: ScanProgress) => void) {
  const mockFiles = [
    'C:\\Windows\\System32\\kernel32.dll',
    'C:\\Program Files\\Chrome\\chrome.exe',
    'C:\\Users\\User\\Documents\\report.docx',
    'C:\\Users\\User\\Downloads\\setup.exe',
    'C:\\Windows\\SysWOW64\\ntdll.dll',
  ];
  
  for (let i = 0; i < 100; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    setProgress({
      currentFile: mockFiles[Math.floor(Math.random() * mockFiles.length)],
      filesScanned: Math.floor((i / 100) * 15420),
      threatsFound: 0
    });
  }
}
