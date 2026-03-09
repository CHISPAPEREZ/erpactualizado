const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer
contextBridge.exposeInMainWorld('electronAPI', {
  getMachineInfo: () => ipcRenderer.invoke('get-machine-info'),
  validateLicense: (serial) => ipcRenderer.invoke('validate-license', serial),
  getLicenseInfo: () => ipcRenderer.invoke('get-license-info'),
  resetLicense: () => ipcRenderer.invoke('reset-license')
});