const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("collections", {
  import: (data) => ipcRenderer.invoke("import", data),
  load: () => ipcRenderer.invoke("load"),
});
