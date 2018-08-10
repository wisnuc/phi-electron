const fs = require('fs')
const i18n = require('i18n')
const path = require('path')
const UUID = require('uuid')
const { ipcMain, shell } = require('electron')

const store = require('./store')
const { getMainWindow } = require('./window')
const { downloadFile } = require('./server')
const { createTask } = require('./downloadTransform')
const watcher = require('./watcher')

const getDownloadPath = () => store.getState().config.downloadPath

const downloadHandle = (event, args) => {
  const { entries, dirUUID, driveUUID, domain, downloadDir } = args
  const taskUUID = UUID.v4()
  const taskType = entries[0].type
  const createTime = (new Date()).getTime()
  const newWork = true

  const downloadPath = downloadDir || getDownloadPath()
  console.log('downloadHandle downloadPath', downloadPath)
  fs.readdir(downloadPath, (err, files) => {
    if (err) {
      console.error('downloadHandle fs.readdir error: ', err)
      getMainWindow().webContents.send('snackbarMessage', { message: i18n.__('Read Download Failed') })
    } else {
      entries.forEach((entry) => {
        const name = entry.name
        let newName = name
        if (files.findIndex(f => [name, `${name}.download`].includes(f)) > -1) {
          const nameSpace = entries.map(e => e.name)
          nameSpace.push(...files)
          const extension = path.parse(name).ext
          for (let i = 1; nameSpace.includes(newName) || nameSpace.includes(`${newName}.download`); i++) {
            if (!extension || extension === name) {
              newName = `${name}(${i})`
            } else {
              newName = `${path.parse(name).name}(${i})${extension}`
            }
          }
        }
        entry.newName = newName
      })
      createTask(taskUUID, entries, entries[0].newName, dirUUID, driveUUID, taskType, createTime, newWork, downloadPath, domain)
      getMainWindow().webContents.send('snackbarMessage', { message: i18n.__('%s Add to Transfer List', entries.length) })
    }
  })
}

/* args: { driveUUID, dirUUID, entryUUID, fileName, station } */
const openHandle = (event, args) => {
  downloadFile(args, null, (error, filePath) => {
    if (error) console.error('open file error', error)
    else shell.openItem(filePath)
  })
}

/* args: { driveUUID, dirUUID, entryUUID, fileName, session, station } */
const tempDownloadHandle = (e, args) => {
  const { session } = args
  downloadFile(args, null, (error, filePath) => {
    if (error) console.error('temp Download error', error)
    else getMainWindow().webContents.send('TEMP_DOWNLOAD_SUCCESS', session, filePath)
  })
}

const getTextDataHandle = (e, args) => {
  const { session } = args
  downloadFile(args, null, (error, filePath) => {
    if (error) console.error('getTextDataHandle error', error)
    else {
      fs.readFile(filePath, (err, data) => {
        if (err) console.error('getTextData readFile error', err)
        else getMainWindow().webContents.send('GET_TEXT_DATA_SUCCESS', session, { filePath, data: data.toString() })
      })
    }
  })
}

const dragStartHandle = (e, args) => {
  console.log('drag args', args)
  const { session } = args
  const tmpPath = path.join(store.getState().config.tmpPath, session)
  fs.writeFileSync(tmpPath, '')
  watcher('C:\\', session, (err, fullpath) => {
    console.log('watcher res', err, fullpath)
    const dir = path.parse(fullpath).dir
    fs.unlinkSync(path.join(dir, session))
    e.sender.send('DOWNLOAD_DIR', { session, dir })
  })
  const iconName = process.platform === 'win32' ? 'icon.ico' : process.platform === 'darwin' ? 'icon-mac.png' : 'icon.png'
  const icon = path.join(global.rootPath, 'public/assets/images', iconName)
  e.sender.startDrag({
    icon,
    file: tmpPath
  })
}

ipcMain.on('DRAG_START', dragStartHandle)
ipcMain.on('DOWNLOAD', downloadHandle)
ipcMain.on('TEMP_DOWNLOADING', tempDownloadHandle)
ipcMain.on('OPEN_FILE', openHandle) // open file use system applications
ipcMain.on('GET_TEXT_DATA', getTextDataHandle)
