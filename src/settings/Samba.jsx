import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'

import { EyeOpenIcon, EyeOffIcon } from '../common/Svg'
import { RRButton, Toggle, TFButton, TextField } from '../common/Buttons'

class SleepMode extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pwd: '',
      pwdError: '',
      error: '',
      loading: false,
      showPwd: false
    }

    this.onPassword = (pwd) => {
      this.setState({ pwd, pwdError: '' })
    }

    this.save = () => {
    }

    this.togglePwd = () => this.setState({ showPwd: !this.state.showPwd })
  }

  renderRow ({ type, enabled, func }) {
    return (
      <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }} key={type}>
        <div style={{ width: 150, textAlign: 'right', color: '#525a60' }}>
          { type }
        </div>
        <div style={{ flexGrow: 1 }} />
        <Toggle
          toggled={enabled}
          onToggle={func}
        />
      </div>
    )
  }

  renderPassword () {
    return (
      <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center', filter: 'grayscale(10%)' }}>
        <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
          { i18n.__('Password') }
        </div>
        <div style={{ width: 30 }} />
        <div style={{ width: 320, marginTop: -30, position: 'relative' }}>
          <TextField
            hintText={i18n.__('Samba Password Hint')}
            type={this.state.showPwd ? 'text' : 'password'}
            errorText={this.state.pwdError}
            value={this.state.pwd}
            onChange={e => this.onPassword(e.target.value)}
            onKeyDown={this.onKeyDown}
          />
          {/* show password */}
          <div style={{ position: 'absolute', right: 0, top: 35 }}>
            <TFButton icon={this.state.showPwd ? EyeOpenIcon : EyeOffIcon} onClick={this.togglePwd} />
          </div>
        </div>
      </div>
    )
  }

  render () {
    const settings = [
      {
        type: i18n.__('Samba'),
        enabled: true,
        func: () => {}
      },
      {
        type: i18n.__('Samba Encrypt'),
        enabled: true,
        func: () => {}
      }
    ]
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter" >
        <div style={{ width: 480, paddingRight: 160, paddingBottom: 60 }}>
          <div style={{ height: 180, width: 320, paddingLeft: 160 }} className="flexCenter">
            <img
              style={{ width: 320, height: 180 }}
              src="./assets/images/pic_samba.png"
              alt=""
            />
          </div>

          { this.renderRow(settings[0]) }

          <div style={{ width: 320, color: '#888a8c', paddingLeft: 160, height: 60, display: 'flex', alignItems: 'center' }} >
            { i18n.__('Sambe Description') }
          </div>

          <Divider color="#f2f2f2" style={{ marginLeft: 160 }} />

          { this.renderRow(settings[1]) }

          <div style={{ height: 30 }} />

          { this.renderPassword() }

          <div style={{ height: 40 }} />

          <div style={{ width: 240, height: 40, margin: '0 auto', paddingLeft: 160 }}>
            <RRButton
              label={i18n.__('Save')}
              onClick={this.save}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default SleepMode
