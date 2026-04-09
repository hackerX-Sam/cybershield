// Type definitions for Electron API bridge

export interface CpuInfo {
  model: string;
  cores: number;
  speed: number;
  usage: number;
}

export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
  usagePercent: number;
}

export interface DiskInfo {
  total: number;
  used: number;
  free: number;
}

export interface DiskDrive {
  fs: string;
  type: string;
  size: number;
  used: number;
  available: number;
  usePercent: number;
  mount: string;
}

export interface NetworkStat {
  interface: string;
  rxBytes: number;
  txBytes: number;
  rxSec: number;
  txSec: number;
}

export interface GpuInfo {
  model: string;
  vram: number;
}

export interface OsInfo {
  platform: string;
  hostname: string;
  uptime: number;
  arch: string;
  release: string;
}

export interface SystemInfo {
  cpu: CpuInfo;
  memory: MemoryInfo;
  disk: DiskInfo;
  network: NetworkStat[];
  gpu: GpuInfo | null;
  os: OsInfo;
}

export interface CpuUsage {
  current: number;
  cores: number[];
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  state: string;
}

export interface NetworkConnection {
  protocol: string;
  localAddress: string;
  localPort: number;
  peerAddress: string;
  peerPort: number;
  state: string;
  process: string;
}

export interface ScanProgress {
  currentFile: string;
  filesScanned: number;
  threatsFound: number;
}

export interface ThreatInfo {
  path: string;
  name: string;
  threatLevel: 'low' | 'medium' | 'high';
  threatType: string;
  size: number;
  modified: Date;
}

export interface ScanResult {
  filesScanned: number;
  threatsFound: ThreatInfo[];
  currentFile: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface StartupProgram {
  name: string;
  path: string;
  enabled: boolean;
  source: string;
}

export interface UsbDevice {
  bus: number;
  deviceId: number;
  name: string;
  type: string;
  vendor: string;
  serialNumber: string;
}

export interface RemovableDrive {
  name: string;
  type: string;
  size: number;
  mount: string;
  label: string;
}

export interface UsbDevicesResult {
  usbDevices: UsbDevice[];
  removableDrives: RemovableDrive[];
}

export interface TempFilesInfo {
  totalSize: number;
  fileCount: number;
  tempDir: string;
}

export interface CleanResult {
  cleaned: number;
  freedSpace: number;
}

export interface ElectronAPI {
  // Window controls
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  
  // System information
  getSystemInfo: () => Promise<SystemInfo | null>;
  getCpuUsage: () => Promise<CpuUsage>;
  getMemoryUsage: () => Promise<MemoryInfo>;
  getProcesses: () => Promise<ProcessInfo[]>;
  getNetworkConnections: () => Promise<NetworkConnection[]>;
  getDiskInfo: () => Promise<DiskDrive[]>;
  
  // File scanning
  scanDirectory: (dirPath?: string, options?: object) => Promise<ScanResult>;
  onScanProgress: (callback: (data: ScanProgress) => void) => void;
  removeScanProgressListener: () => void;
  
  // Startup programs
  getStartupPrograms: () => Promise<StartupProgram[]>;
  
  // USB devices
  getUsbDevices: () => Promise<UsbDevicesResult>;
  
  // Network protection
  blockWebsite: (domain: string) => Promise<{ success: boolean; message: string }>;
  
  // Utilities
  showInFolder: (filePath: string) => Promise<void>;
  openExternal: (url: string) => Promise<void>;
  selectDirectory: () => Promise<string | null>;
  
  // Cleanup
  getTempFiles: () => Promise<TempFilesInfo>;
  cleanTempFiles: () => Promise<CleanResult>;
  
  // Events
  onStartQuickScan: (callback: () => void) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    isElectron?: boolean;
  }
}

export {};
