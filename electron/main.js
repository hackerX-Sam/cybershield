const { app, BrowserWindow, ipcMain, dialog, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { exec, spawn } = require('child_process');

let mainWindow;
let tray;
let isQuitting = false;

// System monitoring module
let si;
try {
  si = require('systeminformation');
} catch (e) {
  console.log('systeminformation not available, using fallback');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png')
  });

  // Load the app
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../public/icon.png');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open CyberShield Pro', click: () => mainWindow.show() },
    { label: 'Quick Scan', click: () => mainWindow.webContents.send('start-quick-scan') },
    { type: 'separator' },
    { label: 'Protection: Active', enabled: false },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('CyberShield Pro - Protected');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});

// ========== IPC HANDLERS FOR WINDOW CONTROLS ==========
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on('window-close', () => mainWindow.hide());

// ========== SYSTEM INFORMATION IPC HANDLERS ==========

// Get basic system info
ipcMain.handle('get-system-info', async () => {
  try {
    const cpuInfo = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const platform = os.platform();
    const hostname = os.hostname();
    const uptime = os.uptime();
    
    let cpuUsage = 0;
    let diskInfo = { total: 0, used: 0, free: 0 };
    let networkStats = [];
    let gpuInfo = null;
    
    if (si) {
      try {
        const currentLoad = await si.currentLoad();
        cpuUsage = currentLoad.currentLoad || 0;
        
        const disks = await si.fsSize();
        if (disks.length > 0) {
          const mainDisk = disks[0];
          diskInfo = {
            total: mainDisk.size,
            used: mainDisk.used,
            free: mainDisk.available
          };
        }
        
        const network = await si.networkStats();
        networkStats = network.map(n => ({
          interface: n.iface,
          rxBytes: n.rx_bytes,
          txBytes: n.tx_bytes,
          rxSec: n.rx_sec,
          txSec: n.tx_sec
        }));
        
        const graphics = await si.graphics();
        if (graphics.controllers && graphics.controllers.length > 0) {
          gpuInfo = {
            model: graphics.controllers[0].model,
            vram: graphics.controllers[0].vram
          };
        }
      } catch (e) {
        console.error('Error getting detailed system info:', e);
      }
    }
    
    return {
      cpu: {
        model: cpuInfo[0]?.model || 'Unknown CPU',
        cores: cpuInfo.length,
        speed: cpuInfo[0]?.speed || 0,
        usage: cpuUsage
      },
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
        usagePercent: (usedMemory / totalMemory) * 100
      },
      disk: diskInfo,
      network: networkStats,
      gpu: gpuInfo,
      os: {
        platform,
        hostname,
        uptime,
        arch: os.arch(),
        release: os.release()
      }
    };
  } catch (error) {
    console.error('Error getting system info:', error);
    return null;
  }
});

// Real-time CPU monitoring
ipcMain.handle('get-cpu-usage', async () => {
  if (si) {
    try {
      const load = await si.currentLoad();
      return {
        current: load.currentLoad,
        cores: load.cpus.map(c => c.load)
      };
    } catch (e) {
      console.error('Error getting CPU usage:', e);
    }
  }
  
  // Fallback to basic CPU calculation
  return new Promise((resolve) => {
    const startUsage = process.cpuUsage();
    const startTime = Date.now();
    
    setTimeout(() => {
      const endUsage = process.cpuUsage(startUsage);
      const elapsedTime = (Date.now() - startTime) * 1000;
      const cpuPercent = ((endUsage.user + endUsage.system) / elapsedTime) * 100;
      resolve({ current: Math.min(cpuPercent, 100), cores: [] });
    }, 100);
  });
});

// Real-time memory monitoring
ipcMain.handle('get-memory-usage', async () => {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  
  return {
    total,
    used,
    free,
    usagePercent: (used / total) * 100
  };
});

// Get running processes
ipcMain.handle('get-processes', async () => {
  if (si) {
    try {
      const processes = await si.processes();
      return processes.list
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 50)
        .map(p => ({
          pid: p.pid,
          name: p.name,
          cpu: p.cpu,
          memory: p.mem,
          state: p.state
        }));
    } catch (e) {
      console.error('Error getting processes:', e);
    }
  }
  return [];
});

// Get network connections
ipcMain.handle('get-network-connections', async () => {
  if (si) {
    try {
      const connections = await si.networkConnections();
      return connections.slice(0, 100).map(c => ({
        protocol: c.protocol,
        localAddress: c.localAddress,
        localPort: c.localPort,
        peerAddress: c.peerAddress,
        peerPort: c.peerPort,
        state: c.state,
        process: c.process
      }));
    } catch (e) {
      console.error('Error getting network connections:', e);
    }
  }
  return [];
});

// Get disk information
ipcMain.handle('get-disk-info', async () => {
  if (si) {
    try {
      const disks = await si.fsSize();
      return disks.map(d => ({
        fs: d.fs,
        type: d.type,
        size: d.size,
        used: d.used,
        available: d.available,
        usePercent: d.use,
        mount: d.mount
      }));
    } catch (e) {
      console.error('Error getting disk info:', e);
    }
  }
  return [];
});

// ========== FILE SCANNING IPC HANDLERS ==========

// Scan a directory for files
ipcMain.handle('scan-directory', async (event, dirPath, options = {}) => {
  const results = {
    filesScanned: 0,
    threatsFound: [],
    currentFile: '',
    startTime: Date.now()
  };
  
  const suspiciousExtensions = ['.exe', '.dll', '.bat', '.cmd', '.vbs', '.js', '.ps1', '.scr', '.pif'];
  const suspiciousPatterns = ['trojan', 'virus', 'malware', 'hack', 'crack', 'keygen'];
  
  async function scanDir(dir) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        results.currentFile = fullPath;
        
        // Send progress update
        mainWindow.webContents.send('scan-progress', {
          currentFile: fullPath,
          filesScanned: results.filesScanned,
          threatsFound: results.threatsFound.length
        });
        
        if (item.isDirectory()) {
          // Skip system directories
          if (!item.name.startsWith('.') && 
              !['node_modules', 'Windows', 'System32', '$Recycle.Bin'].includes(item.name)) {
            await scanDir(fullPath);
          }
        } else {
          results.filesScanned++;
          
          const ext = path.extname(item.name).toLowerCase();
          const nameLower = item.name.toLowerCase();
          
          // Check for suspicious files (demo purposes)
          let threatLevel = null;
          let threatType = null;
          
          if (suspiciousExtensions.includes(ext)) {
            // Check if it's in a suspicious location or has suspicious name
            if (suspiciousPatterns.some(p => nameLower.includes(p))) {
              threatLevel = 'high';
              threatType = 'Suspicious Executable';
            }
          }
          
          // Check for suspicious patterns in filename
          if (suspiciousPatterns.some(p => nameLower.includes(p))) {
            threatLevel = threatLevel || 'medium';
            threatType = threatType || 'Suspicious File Name';
          }
          
          if (threatLevel) {
            results.threatsFound.push({
              path: fullPath,
              name: item.name,
              threatLevel,
              threatType,
              size: fs.statSync(fullPath).size,
              modified: fs.statSync(fullPath).mtime
            });
          }
          
          // Small delay to prevent UI freeze
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }
    } catch (error) {
      // Skip directories we can't access
    }
  }
  
  const targetDir = dirPath || os.homedir();
  await scanDir(targetDir);
  
  results.endTime = Date.now();
  results.duration = results.endTime - results.startTime;
  
  return results;
});

// Get startup programs (Windows)
ipcMain.handle('get-startup-programs', async () => {
  const startupPrograms = [];
  
  if (process.platform === 'win32') {
    // Check common startup locations
    const startupPaths = [
      path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'),
    ];
    
    for (const startupPath of startupPaths) {
      try {
        if (fs.existsSync(startupPath)) {
          const files = fs.readdirSync(startupPath);
          for (const file of files) {
            startupPrograms.push({
              name: path.basename(file, path.extname(file)),
              path: path.join(startupPath, file),
              enabled: true,
              source: 'User Startup Folder'
            });
          }
        }
      } catch (e) {
        // Skip if can't access
      }
    }
  }
  
  return startupPrograms;
});

// ========== USB MONITORING ==========
let usbWatcher = null;

ipcMain.handle('get-usb-devices', async () => {
  if (si) {
    try {
      const usb = await si.usbDevices();
      const blockDevices = await si.blockDevices();
      
      const removable = blockDevices.filter(d => d.removable);
      
      return {
        usbDevices: usb.map(u => ({
          bus: u.bus,
          deviceId: u.deviceId,
          name: u.name || 'USB Device',
          type: u.type,
          vendor: u.vendor,
          serialNumber: u.serialNumber
        })),
        removableDrives: removable.map(d => ({
          name: d.name,
          type: d.type,
          size: d.size,
          mount: d.mount,
          label: d.label
        }))
      };
    } catch (e) {
      console.error('Error getting USB devices:', e);
    }
  }
  return { usbDevices: [], removableDrives: [] };
});

// ========== NETWORK PROTECTION ==========

// Block/unblock website (demo - would need admin rights for real implementation)
ipcMain.handle('block-website', async (event, domain) => {
  // In a real app, this would modify the hosts file or configure a firewall
  return { success: true, message: `Website ${domain} blocked` };
});

// ========== UTILITY HANDLERS ==========

// Open file in explorer
ipcMain.handle('show-in-folder', async (event, filePath) => {
  shell.showItemInFolder(filePath);
});

// Open URL in browser
ipcMain.handle('open-external', async (event, url) => {
  shell.openExternal(url);
});

// Show dialog to select directory
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0] || null;
});

// Get temp files for cleanup
ipcMain.handle('get-temp-files', async () => {
  const tempDirs = [os.tmpdir()];
  let totalSize = 0;
  let fileCount = 0;
  
  for (const tempDir of tempDirs) {
    try {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        try {
          const stat = fs.statSync(path.join(tempDir, file));
          if (stat.isFile()) {
            totalSize += stat.size;
            fileCount++;
          }
        } catch (e) {
          // Skip files we can't access
        }
      }
    } catch (e) {
      // Skip dirs we can't access
    }
  }
  
  return { totalSize, fileCount, tempDir: os.tmpdir() };
});

// Clean temp files
ipcMain.handle('clean-temp-files', async () => {
  let cleaned = 0;
  let freedSpace = 0;
  
  try {
    const tempDir = os.tmpdir();
    const files = fs.readdirSync(tempDir);
    
    for (const file of files) {
      try {
        const filePath = path.join(tempDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile()) {
          freedSpace += stat.size;
          fs.unlinkSync(filePath);
          cleaned++;
        }
      } catch (e) {
        // Skip files we can't delete
      }
    }
  } catch (e) {
    console.error('Error cleaning temp files:', e);
  }
  
  return { cleaned, freedSpace };
});
