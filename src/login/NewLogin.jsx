import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'

import PhiLogin from './PhiLogin'
import DeviceSelect from './DeviceSelect'
import { SIButton } from '../common/IconButton'
import WindowAction from '../common/WindowAction'
import { RefreshIcon, HelpIcon } from '../common/Svg'

const duration = 300

class LoginApp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stage: 'login', // login, device, failed, addNew
      local: true,
      hello: true
    }

    this.login = () => {
      this.setState({ stage: 'addDevice' })
    }

    this.refresh = () => {
    
    }
  }

  componentDidMount () {
    document.getElementById('start-bg').style.display = 'none'
    setTimeout(() => this.setState({ hello: false }), 300)
  }

  renderNetError () {
    return (
      <div
        style={{
          width: 320,
          height: 270,
          overflow: 'hidden',
          zIndex: 200,
          position: 'relative'
        }}
        className="paper"
      >
        <div
          style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 19 }}
          className="title"
        >
          { i18n.__('Network Connection Error') }
          <div style={{ flexGrow: 1 }} />
          <SIButton onClick={this.refresh} > <RefreshIcon /> </SIButton>
          <div style={{ width: 10 }} />
          <SIButton onClick={() => this.setState({ showHelp: true })} > <HelpIcon /> </SIButton>
          <div style={{ width: 14 }} />
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 116, marginTop: 33 }} className="flexCenter">
          <img
            style={{ width: 173, height: 116 }}
            src="./assets/images/pic-network.png"
            alt=""
          />
        </div>
        <div className="flexCenter" style={{ color: 'var(--grey-text)', marginTop: 10 }}>
          { i18n.__('Network Connection Error Text') }
        </div>
      </div>
    )
  }

  renderDeviceSelect (props) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 110,
          width: '100%',
          height: 'calc(100% - 150px)',
          zIndex: 200,
          overflow: 'hidden'
        }}
      >
        <DeviceSelect {...props} />
      </div>
    )
  }

  render () {
    console.log('NewLogin', this.state, this.props)
    const props = this.props
    let view = null

    if (this.props.account) view = this.renderDeviceSelect(props)
    else view = <PhiLogin {...props} />

    // if (!window.navigator.onLine) view = this.renderNetError()

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
          <div style={{ fontSize: 14, color: '#888a8c', marginTop: 8, letterSpacing: 1.4 }}>
            { i18n.__('Welcome Text') }
          </div>
        </div>

        {/* WebkitAppRegion */}
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            height: 80,
            width: 'calc(100% - 8px)',
            WebkitAppRegion: 'drag'
          }}
        />

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
            color: '#85868c',
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
          <div style={{ margin: '0px 16px' }}>
            { i18n.__('Phone Number: ') }
          </div>
          <div style={{ fontSize: 18, marginRight: 20 }}>
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
