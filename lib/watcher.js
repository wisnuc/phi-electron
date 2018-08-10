const path = require('path')
const iconv = require('iconv-lite')
const spawn = require('child_process').spawn

const watcher = (abspath, filename, callback) => {
  if (process.platform !== 'win32') setTimeout(() => callback(null, path.join('~/Desktop', 'somefile')), 5000)
  else {
    const watch = spawn(path.resolve(__dirname, '../', 'external', 'watcher.exe'), [path.resolve(abspath), filename])
    watch.stdout.on('data', (data) => {
      watch.kill()
      const buf = iconv.decode(data, 'GBK')
      callback(null, buf.toString('utf8').trim())
    })
    watch.stderr.on('data', (data) => {
      watch.kill()
      console.error(`watch error: ${data.toString()}`)
      callback(data.toString())
    })
  }
}

module.exports = watcher
