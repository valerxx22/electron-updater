const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater")

let win

const dispatch = (data) => {
  win.webContents.send('message', data)
}

const createDefaultWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }

  win.on('closed', () => {
    win = null
  })

  win.loadFile('src/index.html')

  return win
}

app.on('ready', () => {
  
  createDefaultWindow()

  autoUpdater.checkForUpdatesAndNotify()

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('version', app.getVersion())
  })

})

app.on('window-all-closed', () => {
  app.quit()
})


autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
  dispatch('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  console.log('Update available');
  dispatch('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available');
  dispatch('Update not available.')
})

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater');
  dispatch('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  console.log('download-progress');
  // let log_message = "Download speed: " + progressObj.bytesPerSecond
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  // dispatch(log_message)

    win.webContents.send('download-progress', progressObj.percent)

})

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
  dispatch('Update downloaded')
})
