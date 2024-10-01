const path = require('path');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 330,
    height: 630,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      javascript: true // Consider using contextIsolation: true for better security
    },
  });

  // Load the appropriate URL based on the environment
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Open the DevTools in development mode
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// When the app is ready, create the window
app.whenReady().then(createWindow);

// Handle the event when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recreate a window in the app when the app is activated
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
