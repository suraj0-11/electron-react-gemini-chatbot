const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { saveInteraction, getInteractions } = require('./src/utils/stateManager'); // Adjusted the path


// first read the environment name 
// if dev then enable devTools or else disable

function createWindow() {
  const win = new BrowserWindow({
    width: 330,
    height: 630,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // devTools:
    },
  });

  win.loadFile(path.join(__dirname, 'build', 'index.html'));
  win.removeMenu();

  win.webContents.on('context-menu', (e) => {
    e.preventDefault();
  });
}

// Handle saving interactions
ipcMain.on('save-interaction', (event, interaction) => {
  saveInteraction(interaction);
});

// Handle retrieving interactions
ipcMain.handle('get-interactions', (event) => {
  return getInteractions();
});


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

