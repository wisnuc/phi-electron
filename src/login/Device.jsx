import i18n from 'i18n'
import React from 'react'
import DeviceAPI from '../common/device'

class Device extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dev: {}
    }

    this.select = () => {
      console.log('this.select', this.state.dev)
      this.props.slDevice(this.state.dev)
    }
  }

  componentDidMount () {
    /* cloud dev or mdns dev */
    const { mdev, cdev } = this.props
    if (cdev) {
      const dev = { address: cdev.localIp, domain: 'phiToLoacl', deviceSN: cdev.deviceSN, stationName: cdev.bindingName }
      this.device = new DeviceAPI(dev)
      this.device.on('updated', (prev, next) => this.setState({ dev: next }))
      this.device.start()
    } else if (mdev) {
      this.device = new DeviceAPI(mdev)
      this.device.on('updated', (prev, next) => this.setState({ dev: next }))
      this.device.start()
    } else console.error('Device Error: No mdev or cdev')
  }

  systemStatus () {
    return (this.device && this.device.systemStatus()) || 'probing'
  }

  onlineStatus () {
    if (!this.props.cdev) return null
    if (this.props.cdev.onlineStatus !== 'online') return i18n.__('Offline Mode')
    if (this.systemStatus === 'offline') return i18n.__('Remote Mode')
    return i18n.__('Online and LAN Mode')
  }

  renderIsOwner () {
    if (!this.props.cdev) return null
    if (this.props.cdev.type === 'owner') return i18n.__('Admin User')
    return i18n.__('Normal User')
  }

  isEnabled () {
    const { type } = this.props
    const status = this.systemStatus()
    return (
      (type === 'LANTOBIND' && status === 'noBoundUser') ||
      (type === 'LANTOLOGIN' && status === 'ready') ||
      (type === 'CHANGEDEVICE' && status === 'ready') ||
      (type === 'BOUNDLIST' && status === 'noBoundVolume') ||
      (type === 'BOUNDLIST' && status === 'ready')
    )
  }

  renderStatus () {
    const st = this.systemStatus()
    let text = st
    switch (st) {
      case 'noBoundUser':
        text = i18n.__('Wait To Bind')
        break

      case 'systemError':
        text = i18n.__('System Error')
        break

      case 'noBoundVolume':
        if (this.props.type === 'LANTOBIND') text = i18n.__('Already Bound')
        else text = i18n.__('Need Bind Volume')
        break

      case 'ready':
        if (this.props.type === 'LANTOBIND') text = i18n.__('Already Bound')
        else if (this.props.type === 'CHANGEDEVICE') {
          const currentSN = this.props.selectedDevice && this.props.selectedDevice.mdev && this.props.selectedDevice.mdev.deviceSN
          const newSN = this.state.dev && this.state.dev.mdev && this.state.dev.mdev.deviceSN
          if (currentSN && (currentSN === newSN)) text = i18n.__('Current Logged Device')
          else text = ''
        } else text = ''
        break

      case 'offline':
        if (this.onlineStatus()) text = ''
        else text = i18n.__('System Error')
        break

      case 'probing':
        text = i18n.__('Probing')
        break
      default:
        break
    }
    return text
  }

  render () {
    console.log('Device render', this.props, this.state, this.device)
    const status = this.systemStatus()
    const isEnabled = this.isEnabled()
    console.log('Device status', status, this.renderStatus())

    const stationName = (this.state.dev && this.state.dev.mdev && this.state.dev.mdev.stationName) || 'PhiNAS2'
    const address = (this.state.dev && this.state.dev.mdev && this.state.dev.mdev.address) || '--'

    const storage = '233GB/1TB'

    const data = [
      { des: i18n.__('Device Storage'), val: storage },
      { des: i18n.__('IP Address'), val: address }
    ]

    return (
      <div
        style={{
          width: 210,
          cursor: isEnabled ? 'pointer' : 'not-allowed',
          padding: '0 20px',
          margin: '30px 7px 0 7px',
          filter: isEnabled ? '' : 'grayscale(100%)'
        }}
        className="paper"
        onClick={() => isEnabled && this.select()}
      >
        <div style={{ height: 20, width: '100%', paddingTop: 20, display: 'flex', alignItems: 'center' }}>
          <div
            style={{ width: 170, fontSize: 16, color: '#525a60' }}
            className="text"
          >
            { stationName }
          </div>
          {
            !!this.onlineStatus() &&
              <div
                style={{
                  width: 40,
                  height: 20,
                  fontSize: 12,
                  color: '#FFF',
                  borderRadius: 20,
                  backgroundColor: this.onlineStatus === i18n.__('Offline Mode') ? '#666666' : '#31a0f5'
                }}
                className="flexCenter"
              >
                { this.onlineStatus() }
              </div>
          }
        </div>
        <div style={{ height: 20, width: '100%', display: 'flex', alignItems: 'center' }}>
          {
            !!this.renderIsOwner() &&
            <div style={{ fontSize: 14, color: '#31a0f5' }}>
              { this.renderIsOwner() }
            </div>
          }
          {
            !!this.renderIsOwner() && !!this.renderStatus() &&
              <div style={{ margin: 5, width: 1, backgroundColor: '#d3d3d3', height: 10 }} />
          }
          {
            !!this.renderStatus() &&
            <div style={{ fontSize: 14, color: ['noBoundUser', 'ready'].includes(status) ? '#44c468' : '#fa5353' }}>
              { this.renderStatus() }
            </div>
          }
        </div>
        <div style={{ height: 230 }} className="flexCenter">
          <img
            style={{ width: 51, height: 104, filter: status === 'noBoundUser' ? 'hue-rotate(290deg)' : '' }}
            src="./assets/images/ic-n-2.png"
            alt=""
          />
        </div>
        {
          data.map(({ des, val }) => (
            <div style={{ height: 40, display: 'flex', alignItems: 'center' }} key={des}>
              <div style={{ color: '#525a60' }}>
                { des }
              </div>
              <div style={{ flexGrow: 1 }} />
              <div style={{ color: '#888a8c' }}>
                { val }
              </div>
            </div>
          ))
        }
        <div style={{ height: 10 }} />
      </div>
    )
  }
}

export default Device
