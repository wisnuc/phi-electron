const path = require('path')
const i18n = require('i18n')
const { app, dialog, Tray } = require('electron')

const store = require('./store')
const Configuration = require('./configuration')
const { clearTasks } = require('./transmissionUpdate')
const { initMainWindow, getMainWindow, openTrayWindow } = require('./window')

require('./mdns')
require('./login')
require('./media')
require('./newUpload')
require('./newDownload')

/* app close check */
let close = false
const onClose = (e) => {
  if (close || (store.getState().config && store.getState().config.noCloseConfirm)) {
    clearTasks()
  } else {
    dialog.showMessageBox(getMainWindow(), {
      type: 'warning',
      title: i18n.__('Confirm Close Title'),
      buttons: [i18n.__('Cancel'), i18n.__('Close')],
      checkboxLabel: i18n.__('Do not Show again'),
      checkboxChecked: false,
      message: i18n.__('Confirm Close Text')
    }, (response, checkboxChecked) => {
      if (response === 1 && checkboxChecked) {
        close = true
        global.configuration.updateGlobalConfigAsync({ noCloseConfirm: true })
          .then(() => setTimeout(app.quit, 100)) // waiting saving configuration to disk
          .catch(err => console.log('updateGlobalConfigAsync error', err))
      } else if (response === 1) {
        close = true
        setImmediate(app.quit)
      }
    })
    e.preventDefault()
  }
}

/* app ready and open window */
let tray = null
let win = null

const showTrayWindow = () => {
  win = openTrayWindow()
  const windowBounds = win.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 3)

  console.log('x, y', windowBounds, trayBounds, x, y)

  win.setPosition(x, y, false)
  win.show()
  win.focus()
}

const updateTray = () => {
  if (tray) tray.destroy() // required for ubuntu tray

  const icon = path.join(global.rootPath, 'public/assets/images/icon.png')

  tray = new Tray(icon)

  tray.setToolTip('WISNUC')

  tray.on('click', () => getMainWindow().show())

  tray.on('right-click', () => showTrayWindow())

  /*
  const contextMenu = Menu.buildFromTemplate([
    { label: i18n.__('Show'), type: 'normal', click: () => getMainWindow().show() },
    // { label: i18n.__('test'), type: 'normal', click: () => showWindow(), icon },
    // { label: i18n.__('Show'), type: 'normal', click: () => getMainWindow().show(), icon },
    { label: i18n.__('About'), type: 'normal', click: () => openAboutWindow() },
    { label: i18n.__('Quit'), type: 'normal', click: () => app.quit() }
  ])

  tray.setContextMenu(contextMenu)
  */

  // console.log('tray', tray)
  // setInterval(() => (getMainWindow().isVisible() ? getMainWindow().hide() : getMainWindow().show()), 5000)
}

app.on('ready', () => {
  const appDataPath = app.getPath('appData')
  const configuration = new Configuration(appDataPath)
  configuration.initAsync()
    .then(() => {
      initMainWindow()
      getMainWindow().on('close', onClose)
    })
    .catch((err) => {
      console.error('failed to load configuration, die', err)
      process.exit(1)
    })

  global.configuration = configuration

  i18n.configure({
    updateFiles: false,
    locales: ['en-US', 'zh-CN'],
    directory: path.resolve(__dirname, '../', 'locales'),
    defaultLocale: /zh/.test(app.getLocale()) ? 'zh-CN' : 'en-US'
  })

  updateTray()
})

app.on('window-all-closed', () => app.quit())

/* makeSingleInstance */
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (getMainWindow()) {
    if (getMainWindow().isMinimized()) getMainWindow().restore()
    if (!getMainWindow().isVisible()) getMainWindow().show()
    getMainWindow().focus()
  }
})

if (shouldQuit) {
  app.quit()
  return
}

/* configObserver */
let preGlobalConfig
let preUserConfig

const configObserver = () => {
  // console.log('\n\n===\nstore', store.getState())
  if (getMainWindow() && (store.getState().config !== preGlobalConfig || store.getState().userConfig !== preUserConfig)) {
    preGlobalConfig = store.getState().config
    preUserConfig = store.getState().userConfig
    const config = global.configuration.getConfiguration()
    if (config.global && config.global.locales) i18n.setLocale(config.global.locales)
    else i18n.setLocale(/zh/.test(app.getLocale()) ? 'zh-CN' : 'en-US')
    updateTray()
    getMainWindow().webContents.send('CONFIG_UPDATE', config)
  }
}

store.subscribe(configObserver)

/* handle uncaught Exception */
process.on('uncaughtException', (err) => {
  console.log(`!!!!!!\nuncaughtException:\n${err}\n------`)
})
