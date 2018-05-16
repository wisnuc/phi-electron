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
    if (mdev) {
      this.device = new DeviceAPI(mdev)
      this.device.on('updated', (prev, next) => this.setState({ dev: next }))
      this.device.start()
    } else if (cdev) {
      const dev = { address: cdev.localIp, domain: 'phiToLoacl', deviceSN: cdev.deviceSN, stationName: cdev.bindingName }
      this.device = new DeviceAPI(dev)
      this.device.on('updated', (prev, next) => this.setState({ dev: next }))
      this.device.start()
    } else console.error('Device Error: No mdev or cdev')
  }

  systemStatus () {
    return (this.device && this.device.systemStatus()) || 'probing'
  }

  isEnabled () {
    const { type } = this.props
    const status = this.systemStatus()
    return (
      (type === 'LANTOBIND' && status === 'noBoundUser') ||
      (type === 'LANTOLOGIN' && status === 'ready') ||
      (type === 'BOUNDLIST' && status === 'noBoundVolume') ||
      (type === 'BOUNDLIST' && status === 'ready')
    )
  }

  renderStatus (st) {
    let text = st
    switch (st) {
      case 'noBoundUser':
        text = i18n.__('Wait To Bind')
        break

      case 'systemError':
        text = i18n.__('System Error')
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
    console.log('Device status', status)

    const [stationName, storage, speed, location] = ['斐讯N2办公', '500GB/2TB', '30Mbps/3Mbps', '上海 电信']
    const data = [
      { des: i18n.__('Device Storage'), val: storage },
      { des: i18n.__('Device Speed'), val: speed },
      { des: i18n.__('Device Location'), val: location }
    ]

    const address = this.state.dev && this.state.dev.mdev && this.state.dev.mdev.address

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
        <div style={{ height: 20, paddingTop: 20, fontSize: 16, color: '#525a60', display: 'flex', alignItems: 'center' }}>
          { stationName }
          <span style={{ width: 10 }} />
          { address }
        </div>
        <div style={{ height: 16, fontSize: 16, color: '#31a0f5', display: 'flex', alignItems: 'center' }}>
          { this.renderStatus(status) }
        </div>
        <div style={{ height: 224 }} className="flexCenter">
          <img
            style={{ width: 51, height: 104 }}
            src="./assets/images/ic-n-2.png"
            alt=""
          />
        </div>
        {
          data.map(({ des, val }) => (
            <div style={{ height: 30, display: 'flex', alignItems: 'center' }} key={des}>
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
