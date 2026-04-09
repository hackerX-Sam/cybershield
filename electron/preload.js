const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  
  // System information
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getCpuUsage: () => ipcRenderer.invoke('get-cpu-usage'),
  getMemoryUsage: () => ipcRenderer.invoke('get-memory-usage'),
  getProcesses: () => ipcRenderer.invoke('get-processes'),
  getNetworkConnections: () => ipcRenderer.invoke('get-network-connections'),
  getDiskInfo: () => ipcRenderer.invoke('get-disk-info'),
  
  // File scanning
  scanDirectory: (dirPath, options) => ipcRenderer.invoke('scan-directory', dirPath, options),
  onScanProgress: (callback) => {
    ipcRenderer.on('scan-progress', (event, data) => callback(data));
  },
  removeScanProgressListener: () => {
    ipcRenderer.removeAllListeners('scan-progress');
  },
  
  // Startup programs
  getStartupPrograms: () => ipcRenderer.invoke('get-startup-programs'),
  
  // USB devices
  getUsbDevices: () => ipcRenderer.invoke('get-usb-devices'),
  
  // Network protection
  blockWebsite: (domain) => ipcRenderer.invoke('block-website', domain),
  
  // Utilities
  showInFolder: (filePath) => ipcRenderer.invoke('show-in-folder', filePath),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // Cleanup
  getTempFiles: () => ipcRenderer.invoke('get-temp-files'),
  cleanTempFiles: () => ipcRenderer.invoke('clean-temp-files'),
  
  // Events from main process
  onStartQuickScan: (callback) => {
    ipcRenderer.on('start-quick-scan', () => callback());
  }
});

// Indicate that we're running in Electron
contextBridge.exposeInMainWorld('isElectron', true);
