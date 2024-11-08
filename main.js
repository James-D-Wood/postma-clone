const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { handleImport } = require("./handlers/import");
const { handleLoad } = require("./handlers/load");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // set up IPC handlers
  ipcMain.handle("load", handleLoad);
  ipcMain.handle("import", handleImport);

  win.loadFile("views/main/index.html");
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
