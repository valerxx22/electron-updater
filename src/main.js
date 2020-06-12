const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater")

let mainWindow

const sendStatusToWindow = (data) => {
  mainWindow.webContents.send('message', data)
}

const createDefaultWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.loadFile('src/index.html')

  return mainWindow
}

app.on('ready', () => {
  
  createDefaultWindow()

  autoUpdater.checkForUpdatesAndNotify()

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('version', app.getVersion())
  })

})

app.on('window-all-closed', () => {
  app.quit()
})


autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
  sendStatusToWindow('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  console.log('Update available');
  sendStatusToWindow('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available');
  sendStatusToWindow('Update not available.')
})

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater');
  sendStatusToWindow('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  console.log('download-progress');
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  sendStatusToWindow(log_message)

    mainWindow.webContents.send('download-progress', progressObj.percent)

})

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
  sendStatusToWindow('Update downloaded')
})
