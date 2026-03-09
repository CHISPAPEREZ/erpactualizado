const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { machineId } = require('node-machine-id');
const CryptoJS = require('crypto-js');

// Configuración de la tienda de datos
const store = new Store();

// Clave secreta para encriptación (en producción, usar una más segura)
const SECRET_KEY = 'SuperMarketERP2024SecretKey';

let mainWindow;
let licenseWindow;

// Función para generar hash de máquina
async function getMachineHash() {
  try {
    const id = await machineId();
    return CryptoJS.SHA256(id).toString();
  } catch (error) {
    console.error('Error getting machine ID:', error);
    return null;
  }
}

// Función para validar serial
function validateSerial(serial, machineHash) {
  try {
    // Formato del serial: SMERP-XXXXX-XXXXX-XXXXX
    const serialPattern = /^SMERP-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
    
    if (!serialPattern.test(serial)) {
      return false;
    }

    // Extraer la parte del código
    const code = serial.replace('SMERP-', '').replace(/-/g, '');
    
    // Validar que el serial corresponda a esta máquina
    const expectedHash = CryptoJS.SHA256(code + SECRET_KEY).toString().substring(0, 8);
    const machineHashShort = machineHash.substring(0, 8);
    
    // Para demo, aceptamos algunos seriales predefinidos
    const validSerials = [
      'SMERP-ADMIN-12345-DEMO1',
      'SMERP-TRIAL-54321-DEMO2',
      'SMERP-FULL1-ABCDE-FGHIJ'
    ];
    
    return validSerials.includes(serial) || expectedHash === machineHashShort;
  } catch (error) {
    console.error('Error validating serial:', error);
    return false;
  }
}

// Función para crear ventana de licencia
function createLicenseWindow() {
  licenseWindow = new BrowserWindow({
    width: 500,
    height: 400,
    resizable: false,
    center: true,
    modal: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  licenseWindow.loadFile(path.join(__dirname, 'license.html'));
  
  licenseWindow.once('ready-to-show', () => {
    licenseWindow.show();
  });

  licenseWindow.on('closed', () => {
    licenseWindow = null;
    if (!store.get('license.valid')) {
      app.quit();
    }
  });
}

// Función para crear ventana principal
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // En desarrollo, cargar desde el servidor de Vite
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, cargar los archivos construidos
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Verificar licencia al iniciar
async function checkLicense() {
  const machineHash = await getMachineHash();
  const storedLicense = store.get('license');
  
  if (storedLicense && storedLicense.valid && storedLicense.machineHash === machineHash) {
    // Licencia válida, crear ventana principal
    createMainWindow();
  } else {
    // Mostrar ventana de activación
    createLicenseWindow();
  }
}

// Eventos de IPC
ipcMain.handle('get-machine-info', async () => {
  const machineHash = await getMachineHash();
  return {
    machineId: machineHash ? machineHash.substring(0, 16) : 'Unknown',
    version: app.getVersion()
  };
});

ipcMain.handle('validate-license', async (event, serial) => {
  const machineHash = await getMachineHash();
  const isValid = validateSerial(serial, machineHash);
  
  if (isValid) {
    // Guardar licencia
    store.set('license', {
      serial: serial,
      machineHash: machineHash,
      valid: true,
      activatedAt: new Date().toISOString()
    });
    
    // Cerrar ventana de licencia y abrir principal
    if (licenseWindow) {
      licenseWindow.close();
    }
    createMainWindow();
    
    return { success: true, message: 'Licencia activada correctamente' };
  } else {
    return { success: false, message: 'Serial inválido o no corresponde a esta máquina' };
  }
});

ipcMain.handle('get-license-info', () => {
  return store.get('license', null);
});

ipcMain.handle('reset-license', () => {
  store.delete('license');
  app.relaunch();
  app.exit();
});

// Eventos de la aplicación
app.whenReady().then(() => {
  checkLicense();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    checkLicense();
  }
});