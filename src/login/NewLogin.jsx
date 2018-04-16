import i18n from 'i18n'
import React from 'react'

import PhiLogin from './PhiLogin'
import DeviceSelect from './DeviceSelect'
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
            src="./assets/images/index.png"
            alt=""
          />
        </div>

        {/* Icon */}
        <div style={{ position: 'absolute', top: 26, left: 44 }}>
          <img
            width={168}
            height={18}
            src="./assets/images/logo.png"
            alt=""
          />
          <div style={{ fontSize: 14, color: '#888a8c', marginTop: 8 }}>
            { i18n.__('Welcome Text') }
          </div>
        </div>

        {/* QR Code */}
        <div style={{ position: 'absolute', bottom: 72, right: 48, textAlign: 'center' }}>
          <div style={{ border: '1px solid #BDBDBD', height: 94, width: 94, margin: '8px auto' }} />
          <div style={{ fontSize: 11, color: '#85868c' }}> { i18n.__('Download Phi App Text') } </div>
        </div>

        {/* footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            boxSizing: 'border-box',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            color: '#b6b7bf',
            width: '100%',
            height: 40,
            backgroundColor: '#f3f8ff',
            borderTop: '1px solid rgba(0,0,0,.05)'
          }}
        >
          <div style={{ margin: '0px 24px' }}>
            { i18n.__('Copyright Info') }
          </div>
          <div style={{ margin: '0px 16px' }}>
            { `${i18n.__('Version:')} ${global.config && global.config.appVersion}` }
          </div>
          <div style={{ flexGrow: 1 }} />
          <div style={{ margin: '0px 16px', color: '#85868c' }}>
            { i18n.__('Phone Number: ') }
          </div>
          <div style={{ fontSize: 18, color: '#85868c', marginRight: 20 }}>
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
