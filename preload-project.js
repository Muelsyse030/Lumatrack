const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-control', 'minimize'),
  maximize: () => ipcRenderer.send('window-control', 'maximize'),
  close: () => ipcRenderer.send('window-control', 'close'),
  onMaximizeState: (callback) => {
    ipcRenderer.on('maximize-state', (event, isMaximized) => callback(isMaximized))
  },
  openEditor: () => ipcRenderer.send('open-editor-window')
})
