import React from 'react'
import i18n from 'i18n'
import { shell, remote } from 'electron'

import UploadingFirmware from './UploadingFirmware'
import Dialog from '../common/PureDialog'
import { RRButton, RSButton } from '../common/Buttons'

const compareVerison = (a, b) => {
  const aArray = a.split('.')
  const bArray = b.split('.')

  const len = Math.min(aArray.length, bArray.length)
  for (let i = 0; i < len; i++) {
    if (parseInt(aArray[i], 10) > parseInt(bArray[i], 10)) return 1
    if (parseInt(aArray[i], 10) < parseInt(bArray[i], 10)) return -1
  }
  if (aArray.length > bArray.length) return 1
  if (aArray.length < bArray.length) return -1
  return 0
}

class Update extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      uploading: false
    }

    this.newRelease = (event, result) => {
      const { rel, filePath, error } = result
      if (!rel || error) return this.setState({ status: 'error', error })
      let status = 'needUpdate'
      if (compareVerison(global.config.appVersion, rel.name) >= 0) status = 'latest'
      return this.setState({ rel, filePath, status, error: null })
    }

    this.onChoose = () => {
      remote.dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'image', extensions: ['img'] }] }, (filePaths) => {
        if (!filePaths || !filePaths.length) return
        this.setState({ path: filePaths[0] })
      })
    }

    this.openWeb = () => {
      shell.openExternal('https://sohon2test.phicomm.com/v1/ui/index')
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    const currentVersion = 'v1.0.0'.toUpperCase()
    const status = '版本检查中...'
    const ltsValue = '检测中...'
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter" >
        <div style={{ width: 480, paddingRight: 160, paddingBottom: 60 }}>
          <div style={{ width: 320, height: 180, marginLeft: 160 }}>
            <img
              style={{ width: 320, height: 180 }}
              src="./assets/images/pic_versioncheck.png"
              alt=""
            />
          </div>

          <div style={{ width: 240, height: 40, margin: '0 auto', paddingLeft: 160, color: '#525a60' }} className="flexCenter">
            { status }
          </div>

          <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('Current Version') }
            </div>
            <div style={{ width: 30 }} />
            <div style={{ width: 150, color: '#888a8c', fontSize: 16 }}>
              { currentVersion }
            </div>
          </div>

          <div style={{ height: 1, width: 320, marginLeft: 160, marginTop: -1, backgroundColor: '#bfbfbf', opacity: 0.5 }} />
          <div style={{ height: 20 }} />

          <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('Latest Version') }
            </div>
            <div style={{ width: 30 }} />
            <div style={{ width: 150, color: '#525a60', opacity: 0.5 }}>
              { ltsValue }
            </div>
          </div>

          <div style={{ height: 1, width: 320, marginLeft: 160, marginTop: -1, backgroundColor: '#bfbfbf', opacity: 0.5 }} />
          <div style={{ height: 20 }} />

          <div style={{ position: 'relative', height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('Install Package') }
            </div>
            <div style={{ width: 30 }} />
            <input
              value={this.state.path || ''}
              onChange={() => {}}
              style={{ width: 220, color: '#888a8c', fontSize: 14 }}
            />
            <div style={{ position: 'absolute', right: 0 }}>
              <RSButton label={i18n.__('Choose')} onClick={this.onChoose} alt />
            </div>
          </div>

          <div style={{ height: 1, width: 320, marginLeft: 160, marginTop: -1, backgroundColor: '#bfbfbf', opacity: 0.5 }} />
          <div style={{ height: 40 }} />

          <div style={{ width: 320, height: 40, margin: '0 auto', paddingLeft: 160, display: 'flex', alignItems: 'center' }}>
            <RRButton
              alt
              style={{ width: 131 }}
              label={i18n.__('Open Web to Download Firmware')}
              onClick={this.openWeb}
            />
            <div style={{ width: 20 }} />
            <RRButton
              style={{ width: 131 }}
              label={i18n.__('Update Immediately')}
              onClick={() => this.setState({ uploading: true })}
              disabled={!this.state.path}
            />
          </div>
        </div>
        <Dialog open={!!this.state.uploading} onRequestClose={() => this.setState({ uploading: false })} modal transparent >
          {
            !!this.state.uploading &&
              <UploadingFirmware
                absPath={this.state.path}
                onRequestClose={() => this.setState({ uploading: false })}
              />
          }
        </Dialog>
      </div>
    )
  }
}

export default Update
