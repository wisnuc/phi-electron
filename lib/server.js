const path = require('path')
const Promise = require('bluebird')
const rimraf = require('rimraf')
const UUID = require('uuid')
const request = require('superagent')
const querystring = require('querystring')
const { ipcMain } = require('electron')
const fs = Promise.promisifyAll(require('fs'))

const store = require('./store')
const parseRes = require('./parseRes')

const getTmpPath = () => store.getState().config.tmpPath
const getTmpTransPath = () => store.getState().config.tmpTransPath

const clearTmpTrans = () => {
  rimraf(`${getTmpTransPath()}/*`, e => e && console.error('clearTmpTrans error', e))
}

/* init request */
let address = null
let token = null
let cloud = false
let deviceSN = ''

const cloudAddress = process.env.CLOUD_TEST === 'dev' ? 'https://sohon2dev.phicomm.com' : 'https://sohon2test.phicomm.com'

ipcMain.on('LOGIN', (event, { device, user, isCloud }) => {
  address = device.mdev.address
  token = device.token.data.token
  cloud = !!isCloud
  deviceSN = device.mdev.deviceSN
})

const isCloud = () => cloud

/* adapter of cloud api */
const reqCloud = (ep, qsOrData, type, isFormdata) => {
  const url = `${cloudAddress}/ResourceManager/app/pipe/command`
  const url2 = `${cloudAddress}/ResourceManager/app/pipe/resource`
  const data = {
    verb: type,
    urlPath: `/${ep}`,
    params: type === 'GET' ? (qsOrData || {}) : {},
    body: type === 'GET' ? {} : (qsOrData || {})
  }

  /* command get */
  if (!isFormdata) return request.post(url).set('Authorization', token).send({ deviceSN, data })

  const qs = querystring.stringify({ deviceSN, data: JSON.stringify(data) })
  /* download file */
  if (type === 'GET') return request.get(`${url2}?${qs}`).set('Authorization', token)

  /* upload file or mkdir */
  return request.post(`${url2}?${qs}`).set('Authorization', token)
}

const aget = (ep) => {
  if (cloud) return reqCloud(ep, null, 'GET')
  return request
    .get(`http://${address}:3000/${ep}`)
    .set('Authorization', `JWT ${token}`)
}

const adownload = (ep, qs) => {
  if (cloud) return reqCloud(ep, qs, 'GET', true)
  return request
    .get(`http://${address}:3000/${ep}`)
    .set('Authorization', `JWT ${token}`)
    .query(qs)
}

const apost = (ep, data, isFormdata) => {
  if (cloud) return reqCloud(ep, data, 'POST', isFormdata)
  const r = request
    .post(`http://${address}:3000/${ep}`)
    .set('Authorization', `JWT ${token}`)

  return typeof data === 'object'
    ? r.send(data)
    : r
}

/**
get json data from server
@param {string} endpoint
@param {function} callback
*/

const serverGet = (endpoint, callback) => {
  aget(endpoint).end((err, res) => {
    const { error, body } = parseRes(err, res)
    callback(error, body)
  })
}

const serverGetAsync = Promise.promisify(serverGet)

/**
download tmp file to somewhere
@param {string} ep
@param {string} fileName
@param {string} filePath
@param {function} callback
*/

const downloadReq = (ep, qs, fileName, filePath, callback) => {
  const tmpPath = path.join(getTmpTransPath(), UUID.v4())
  const stream = fs.createWriteStream(tmpPath)
  stream.on('error', err => callback(err))
  stream.on('finish', () => {
    fs.rename(tmpPath, filePath, (err) => {
      if (err) return callback(err)
      return callback(null, filePath)
    })
  })

  const handle = adownload(ep, qs)
    .on('error', err => callback(Object.assign({}, err, { response: err.response && err.response.body })))
    .on('response', (res) => {
      if (res.status !== 200 && res.status !== 206) {
        console.error('download http status code not 200', res.error)
        const e = new Error()
        e.message = res.error
        e.code = res.code
        e.status = res.status
        handle.abort()
        callback(e)
      } else if (cloud && !['application/octet-stream', 'multipart/form-data'].includes(res.type)) {
        console.error('download res not octet-stream======\n', res)
        const e = new Error('Download File Error')
        e.code = 'ENOTSTREAM'
        handle.abort()
        callback(e)
      }
    })
  handle.pipe(stream)
}

/**
Upload multiple files in one request.post

@param {string} driveUUID
@param {string} dirUUID
@param {Object[]} Files
@param {string} Files[].name
@param {Object[]} Files[].parts
@param {string} Files[].parts[].start
@param {string} Files[].parts[].end
@param {string} Files[].parts[].sha
@param {string} Files[].parts[].fingerpringt
@param {Object[]} Files[].readStreams
@param {Object} Files[].policy
@param {function} callback
*/

class UploadMultipleFiles {
  constructor (driveUUID, dirUUID, Files, domain, callback) {
    this.driveUUID = driveUUID
    this.dirUUID = dirUUID
    this.Files = Files
    this.domain = domain
    this.callback = callback
    this.handle = null
  }

  normalUpload () {
    this.handle = apost(`drives/${this.driveUUID}/dirs/${this.dirUUID}/entries`, null, true)
    this.Files.forEach((file) => {
      const { name, parts, readStreams, policy } = file
      for (let i = 0; i < parts.length; i++) {
        if (policy && policy.seed !== 0 && policy.seed > i) continue // big file, upload from part[seed]
        const rs = readStreams[i]
        this.handle.attach(name, rs, parts[i].formDataOptions)
      }
    })

    this.handle.on('error', (err) => {
      console.error('normalUpload error===\n', err)
      this.finish(err)
    })

    this.handle.end((err, res) => {
      if (err) this.finish(err)
      else if (res && res.statusCode === 200) this.finish(null)
      else this.finish(res.body)
    })
  }

  phyUpload () {
    this.handle = apost(`phy-drives/${this.driveUUID}?${querystring.stringify({ path: this.dirUUID })}`, null, true)

    this.Files.forEach((file) => {
      const { name, parts, readStreams } = file
      for (let i = 0; i < parts.length; i++) {
        const rs = readStreams[i]
        this.handle.attach('file', rs, name)
      }
    })

    this.handle.on('error', (err) => {
      this.finish(err)
    })

    this.handle.end((err, res) => {
      if (err) this.finish(err)
      else if (res && res.statusCode === 200) this.finish(null)
      else this.finish(res.body)
    })
  }

  upload () {
    const isPhy = this.domain === 'phy'
    if (isPhy) this.phyUpload()
    else this.normalUpload()
  }

  finish (error) {
    if (this.finished) return
    if (error) {
      error.response = error.response && error.response.body
    }
    this.finished = true
    this.callback(error)
  }

  abort () {
    this.finished = true
    if (this.handle) this.handle.abort()
  }
}

/**
download a entire file or part of file

@param {string} driveUUID
@param {string} dirUUID
@param {string} entryUUID
@param {string} fileName
@param {number} size
@param {number} seek
@param {Object} stream
@param {function} callback
*/

class DownloadFile {
  constructor (endpoint, qs, fileName, size, seek, stream, station, callback) {
    this.endpoint = endpoint
    this.qs = qs
    this.fileName = fileName
    this.seek = seek || 0
    this.size = size
    this.stream = stream
    this.station = station
    this.callback = callback
    this.handle = null
  }

  download () {
    if (this.seek) this.qs.header = { range: `${this.seek}-` }
    this.handle = adownload(this.endpoint, this.qs)
    if (this.size && this.size === this.seek) return setImmediate(() => this.finish(null))
    if (this.size) this.handle.set('Range', `bytes=${this.seek}-`)

    /* hack superagent to hanlde both pipe and json res */
    this.handle.piped = true
    this.handle.buffer(false)
    this.handle.end()
    this.handle.req
      .on('error', error => this.finish(error))
      .once('response', (res) => {
        /* cloud: type === 'application/octet-stream' */
        if ((res.statusCode !== 200 && res.statusCode !== 206)) { // error
          const e = new Error()
          e.message = res.error
          e.code = res.statusMessage
          e.status = res.statusCode
          this.handle.abort()
          this.finish(e)
        } else if (cloud && res.headers['content-type'].startsWith('application/json')) {
          const chunk = []
          res.on('data', buf => chunk.push(buf))
          res.on('end', () => {
            let r
            try {
              r = JSON.parse(chunk.toString())
            } catch (e) {
              console.error('parse res error', e)
            }

            const e = new Error('Download File Error')
            if (r && r.error && r.msg) {
              e.code = r.msg
            } else {
              e.code = 'ENOTSTREAM'
            }
            this.handle.abort()
            this.finish(e)
          })
        } else {
          res.pipe(this.stream)
          res.on('end', () => this.finish(null))
        }
      })

    return null
  }

  abort () {
    if (this.finished) return
    this.finish(null)
    if (this.handle) this.handle.abort()
  }

  finish (error) {
    if (this.finished) return
    if (error) {
      error.response = error.response && error.response.body
    }
    this.callback(error)
    this.finished = true
  }
}

/**
createFold

@param {string} driveUUID
@param {string} dirUUID
@param {string} dirname
@param {Object[]} localEntries
@param {string} localEntries[].entry
@param {Object} policy
@param {string} policy.mode
@param {function} callback

*/

const createFold = (driveUUID, dirUUID, dirname, localEntries, policy, domain, callback) => {
  let handle
  if (domain === 'phy') {
    const ep = `phy-drives/${driveUUID}?${querystring.stringify({ path: dirUUID })}`
    handle = apost(ep, null, true).field('directory', dirname)
  } else {
    const ep = `drives/${driveUUID}/dirs/${dirUUID}/entries`
    handle = apost(ep, null, true)
    let args = { op: 'mkdir', policy: ['skip', null] } // mkdirp: normal, merge or overwrite
    if (policy && policy.mode === 'replace') args = Object.assign(args, { policy: ['replace', 'replace'] }) // replace
    handle.field(dirname, JSON.stringify(args))
  }

  handle.end((err, res) => {
    const { error, body } = parseRes(err, res)
    let dirEntry
    let e = error
    if (!error && domain !== 'phy') {
      dirEntry = body && body[0] && body[0].data
    } else if (!error) {
      dirEntry = body
    }
    if (!error && !dirEntry) {
      e = new Error('parse create fold response error')
      e.code = 'EMKDIR'
    }
    callback(e, dirEntry)
  })
}

const createFoldAsync = Promise.promisify(createFold)

/**
download tmp File

@param {object} entry
@param {string} downloadPath
@param {function} callback
file type: [media, driveFiles]
*/
const downloadFile = (entry, downloadPath, callback) => {
  const { driveUUID, dirUUID, entryUUID, fileName, domain } = entry
  const filePath = downloadPath ? path.join(downloadPath, fileName)
    : path.join(getTmpPath(), `${entryUUID.slice(0, 64)}AND${fileName}`)

  /* check local file cache */
  fs.access(filePath, (error) => {
    if (error) {
      const ep = domain === 'phy' ? `phy-drives/${driveUUID}`
        : dirUUID === 'media' ? `media/${entryUUID}` : `drives/${driveUUID}/dirs/${dirUUID}/entries/${entryUUID}`
      const qs = domain === 'phy' ? { path: `${dirUUID}${fileName}` } : dirUUID === 'media' ? { alt: 'data' } : { name: fileName }
      downloadReq(ep, qs, fileName, filePath, callback)
    } else callback(null, filePath)
  })
}

const uploadFirm = (event, absPath, size, session, callback) => {
  const rs = fs.createReadStream(path.resolve(absPath))
  let lastTimeSize = 0
  let completeSize = 0

  const countRead = () => {
    const gap = rs.bytesRead - lastTimeSize
    completeSize += gap
    lastTimeSize = rs.bytesRead
    event.sender.send('FIRM_PROCESS', { progress: completeSize / size * 100, session })
  }

  let countReadHandle
  rs.on('open', () => {
    countReadHandle = setInterval(countRead, 1000)
  })

  rs.on('end', () => {
    countRead()
    clearInterval(countReadHandle)
  })

  request
    .post(`http://${address}:3001/v1/firmwareUpload`)
    .set('Authorization', `JWT ${token}`)
    .set('Content-Type', 'multipart/form-data')
    .set('Content-Disposition', 'form-data;name="image"')
    .attach('image', rs)
    .end(callback)
}

module.exports = {
  clearTmpTrans,
  isCloud,
  serverGet,
  serverGetAsync,
  UploadMultipleFiles,
  DownloadFile,
  createFold,
  createFoldAsync,
  downloadFile,
  uploadFirm
}
