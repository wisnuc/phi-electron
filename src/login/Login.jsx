import i18n from 'i18n'
import React from 'react'
import { ipcRenderer } from 'electron'

import { WISNUC } from '../common/Svg'
import LocalLogin from './LocalLogin'

const duration = 300

class LoginApp extends React.Component {
  constructor (props) {
    super(props)
    this.state = { local: true, hello: true }
  }

  componentDidMount () {
    document.getElementById('start-bg').style.display = 'none'
    setTimeout(() => this.setState({ hello: false }), 300)
  }

  render () {
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

        {/* version */}
        <div style={{ position: 'absolute', bottom: 24, left: 24, fontSize: 14, color: '#FAFAFA' }}>
          { `${i18n.__('Version')}: ${global.config && global.config.appVersion}` }
        </div>

        {/* copyright */}
        <div style={{ position: 'absolute', bottom: 24, right: 24, fontSize: 14, color: '#FAFAFA' }}>
          {i18n.__('Copyright Info')}
        </div>

        <LocalLogin {...this.props} />
      </div>
    )
  }
}

export default LoginApp
