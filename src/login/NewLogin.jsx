import i18n from 'i18n'
import React from 'react'

import PhiLogin from './PhiLogin'
import DeviceSelect from './DeviceSelect'
import { WISNUC } from '../common/Svg'
import WindowAction from '../common/WindowAction'

const duration = 300

class LoginApp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stage: 'login', // login, device, failed, addNew
      local: true,
      hello: true
    }

    /* change stage */
    this.CST = (stage) => {
      this.setState({ stage })
    }
  }

  componentDidMount () {
    document.getElementById('start-bg').style.display = 'none'
    setTimeout(() => this.setState({ hello: false }), 300)
  }

  render () {
    console.log('NewLogin', this.state, this.props)
    const props = Object.assign({ CST: this.CST }, this.props)
    let view = null
    switch (this.state.stage) {
      case 'login':
        view = <PhiLogin {...props} />
        break
      case 'device':
        view = <DeviceSelect {...props} />
        break
      default:
        break
    }

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* background */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: this.state.hello ? 0 : 1,
            transition: `opacity ${duration}ms`
          }}
        >
          <img
            style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1000 }}
            src="./assets/images/index.jpg"
            alt=""
          />
        </div>

        {/* Icon */}
        <div style={{ position: 'absolute', top: -4, left: 24 }} > <WISNUC /> </div>

        {/* QR Code */}
        <div style={{ position: 'absolute', bottom: 72, right: 48, textAlign: 'center' }}>
          <div style={{ border: '1px solid #BDBDBD', height: 96, width: 96, margin: '8px auto' }} />
          <div> { i18n.__('Download Phi App Text') } </div>
        </div>

        {/* footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            padding: 8,
            boxSizing: 'border-box',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            color: '#FFF',
            width: '100%',
            borderTop: '1px solid #BDBDBD'
          }}
        >
          <div style={{ margin: '0px 16px' }}>
            { i18n.__('Copyright Info') }
          </div>
          <div style={{ margin: '0px 16px' }}>
            { `${i18n.__('Version:')} ${global.config && global.config.appVersion}` }
          </div>
          <div style={{ margin: '0px 16px' }}>
            { `${i18n.__('MAC Address:')} ????` }
          </div>
          <div style={{ flexGrow: 1 }} />
          <div style={{ margin: '0px 16px' }}>
            { i18n.__('Phone Number: ') }
          </div>
          <div style={{ fontSize: 24 }}>
            { '4007 567 567' }
          </div>
        </div>
        { view }
        <WindowAction />
      </div>
    )
  }
}

export default LoginApp
