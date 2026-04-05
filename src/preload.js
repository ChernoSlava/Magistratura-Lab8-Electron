const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    saveData: (data) => ipcRenderer.invoke('save-to-disk', data),
    loadData: () => ipcRenderer.invoke('load-from-disk'),
    openCustomFile: () => ipcRenderer.invoke('open-file-dialog')
});
