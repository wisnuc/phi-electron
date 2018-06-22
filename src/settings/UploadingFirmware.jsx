import i18n from 'i18n'
import UUID from 'uuid'
import React from 'react'
import { ipcRenderer } from 'electron'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import { RSButton } from '../common/Buttons'
import CircularLoading from '../common/CircularLoading'

class UploadingFirmware extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      status: 'busy',
      progress: '0%'
    }

    this.fire = () => {
      this.session = UUID.v4()
      ipcRenderer.send('UPLOAD_FIRM', { session: this.session, absPath: this.props.absPath })
    }

    this.onFirmRes = (event, data) => {
      console.log('this.onFirmRes', data)
      const { success, reason, session } = data
      if (session !== this.session) return
      if (!success) {
        console.error('upload firm error', reason)
        this.setState({ status: 'error', error: i18n.__('Upload Firmware Error Text') })
      } else if (reason && reason.desc === 'Check firmware failed!') {
        console.error('upload firm error', reason)
        this.setState({ status: 'error', error: i18n.__('Check Firmware Failed Text') })
      } else {
        this.setState({ status: 'success', error: '' })
      }
    }

    this.onProcess = (event, data) => {
      console.log('this.onProcess', data)
      const { progress, session } = data
      if (session !== this.session) return
      this.setState({ progress: `${progress.toFixed(0)}%` })
    }
  }

  componentDidMount () {
    ipcRenderer.on('UPLOAD_FIRM_RESULT', this.onFirmRes)
    ipcRenderer.on('FIRM_PROCESS', this.onProcess)
    this.fire()
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('UPLOAD_FIRM_RESULT', this.onFirmRes)
    ipcRenderer.on('FIRM_PROCESS', this.onProcess)
  }

  render () {
    const { status } = this.state
    const { onRequestClose } = this.props

    let [text, img, label, color, func] = ['', '', '', '#31a0f5', () => {}]
    switch (status) {
      case 'busy':
        img = <CircularLoading />
        text = this.state.progress !== '100%' ? i18n.__('Uploading Firmware Text %s', this.state.progress)
          : i18n.__('Checking Firmware')
        color = '#31a0f5'
        break
      case 'success':
        img = <CheckIcon color="#31a0f5" style={{ width: 52, height: 52 }} />
        text = i18n.__('Upload Firmware Success Text')
        color = '#31a0f5'
        label = i18n.__('OK')
        func = () => onRequestClose()
        break
      case 'error':
        img = <img src="./assets/images/pic-loadingfailed.png" width={52} height={52} />
        text = i18n.__('Upload Firmware Error Text')
        color = '#fa5353'
        label = i18n.__('OK')
        func = () => onRequestClose()
        break
      default:
        break
    }
    return (
      <div style={{ width: 240, height: 214, backgroundColor: 'transparent', paddingTop: 54 }}>
        <div style={{ height: status !== 'busy' ? 214 : 160, backgroundColor: '#FFF', transition: 'height 175ms' }}>
          <div style={{ height: 40 }} />
          <div style={{ width: '100%', height: 60 }} className="flexCenter">
            { img }
          </div>
          <div style={{ fontSize: 14, color, height: 20 }} className="flexCenter">
            { text }
          </div>
          <div style={{ height: 40 }} />
          <div style={{ height: 34, opacity: status !== 'busy' ? 1 : 0, transition: 'opacity 175ms 175ms' }} className="flexCenter" >
            <RSButton
              label={label}
              onClick={func}
              style={{ width: 152, height: 34 }}
            />
          </div>
          <div style={{ height: 20 }} />
        </div>
      </div>
    )
  }
}
export default UploadingFirmware
