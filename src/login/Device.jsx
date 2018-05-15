import i18n from 'i18n'
import React from 'react'
import DeviceAPI from '../common/device'

class Device extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dev: null
    }

    this.select = () => {
      if (this.systemStatus() !== 'systemError') {
        this.props.slDevice(this.state.dev)
      }
    }
  }

  componentDidMount () {
    /* cloud dev or mdns dev */
    if (this.props.mdev) {
      this.device = new DeviceAPI(this.props.mdev)
      this.device.on('updated', (prev, next) => this.setState({ dev: next }))
      this.device.start()
    } else if (this.props.cdev) {
      this.setState({ dev: this.props.cdev })
    } else console.error('Device Error: No mdev or cdev')
  }

  systemStatus () {
    return (this.device && this.device.systemStatus()) || 'probing'
  }

  render () {
    console.log('Device render', this.props, this.state, this.device)
    const status = this.systemStatus()
    console.log('Device status', status)

    const [stationName, storage, speed, location] = ['斐讯N2办公', '500GB/2TB', '30Mbps/3Mbps', '上海 电信']
    const data = [
      { des: i18n.__('Device Storage'), val: storage },
      { des: i18n.__('Device Speed'), val: speed },
      { des: i18n.__('Device Location'), val: location }
    ]

    const { mdev } = this.props

    return (
      <div
        style={{
          width: 210,
          cursor: 'pointer',
          padding: '0 20px',
          margin: '30px 7px 0 7px'
        }}
        className="paper"
        onClick={this.select}
      >
        <div style={{ height: 20, paddingTop: 20, fontSize: 16, color: '#525a60', display: 'flex', alignItems: 'center' }}>
          { stationName }
          <span style={{ width: 10 }} />
          { mdev.address }
        </div>
        <div style={{ height: 16, fontSize: 16, color: '#31a0f5', display: 'flex', alignItems: 'center' }}>
          { status }
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
