const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 330,
    height: 630,
    webPreferences: {
      nodeIntegration: true,  // Allow Node.js integration in the renderer process
      contextIsolation: false, // Disable context isolation so scripts can run
      enableRemoteModule: true, // Enable the use of remote module (optional, depending on your app)
    }
  });

  // Load the React app's index.html after the build
  win.loadFile(path.join(__dirname, 'build', 'index.html'));

  // Open DevTools for debugging (optional)
  win.webContents.openDevTools();
}

// Run createWindow() when Electron has initialized
app.whenReady().then(createWindow);

// Handle closing of all windows (important for macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle reopening of the app (important for macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
