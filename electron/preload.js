const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Project management
  createProject: (path) => ipcRenderer.invoke('create-project', path),
  openProject: (path) => ipcRenderer.invoke('open-project', path),
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  showExportDialog: () => ipcRenderer.invoke('show-export-dialog'),
  
  // Languages
  getLanguages: () => ipcRenderer.invoke('get-languages'),
  addLanguage: (data) => ipcRenderer.invoke('add-language', data),
  
  // Keys
  getAllKeys: () => ipcRenderer.invoke('get-all-keys'),
  addKey: (data) => ipcRenderer.invoke('add-key', data),
  deleteKey: (keyId) => ipcRenderer.invoke('delete-key', keyId),
  
  // Translations
  getTranslations: () => ipcRenderer.invoke('get-translations'),
  updateTranslation: (data) => ipcRenderer.invoke('update-translation', data),
  
  // Dialog files
  saveDialogFile: (data) => ipcRenderer.invoke('save-dialog-file', data),
  getDialogFiles: () => ipcRenderer.invoke('get-dialog-files'),
  deleteDialogFile: (filename) => ipcRenderer.invoke('delete-dialog-file', filename),
  
  // Export
  exportTranslations: (data) => ipcRenderer.invoke('export-translations', data)
});