const { app, BrowserWindow, Menu, ipcMain } = require('electron/main')
const path = require('path');

const createLoginWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'img/lumatrack.ico'),
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload-index.js'),
      contextIsolation: true,
    },
    backgroundColor: '#f5f7fa'
  });

  win.loadFile('index.html');
};

const createProjectWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'img/lumatrack.ico'),
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload-project.js'),
      contextIsolation: true,
    },
    backgroundColor: '#f5f7fa'
  });
  


  win.on('maximize', () => {
    win.webContents.send('maximize-state', true);
  });

  win.on('unmaximize', () => {
    win.webContents.send('maximize-state', false);
  });

  win.loadFile('project.html');
};

const createEditorWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'img/lumatrack.ico'),
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload-editor.js'),
      contextIsolation: true,
    },
    backgroundColor: '#f5f7fa'
  });

  win.maximize();
  win.loadFile('editor.html');
};

const createExportWindow = () => {
  const win = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'img/lumatrack.ico'),
    modal: true,
    parent: BrowserWindow.getFocusedWindow(),
    webPreferences: {
      preload: path.join(__dirname, 'preload-export.js'),
      contextIsolation: true,
    },
    backgroundColor: '#f5f7fa'
  });

  win.loadFile('output.html');
};

app.whenReady().then(() => {
  createLoginWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('window-control', (event, action) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  console.log(`Received action: ${action}`);

  switch (action) {
    case 'minimize':
      win.minimize();
      break;
    case 'maximize':
      win.isMaximized() ? win.unmaximize() : win.maximize();
      break;
    case 'close':
      win.close();
      break;
  }
});

ipcMain.on('open-project-window', (event) => {
  const loginWin = BrowserWindow.fromWebContents(event.sender);
  createProjectWindow();
  loginWin.close();
});

ipcMain.on('open-editor-window', (event) => {
  const currentWin = BrowserWindow.fromWebContents(event.sender);
  createEditorWindow();
  currentWin.close();
});

ipcMain.on('open-export-window', () => {
  createExportWindow();
});
