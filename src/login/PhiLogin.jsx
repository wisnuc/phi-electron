import React from 'react'
import i18n from 'i18n'
import { Checkbox, Divider, IconButton, TextField } from 'material-ui'
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off'
import Visibility from 'material-ui/svg-icons/action/visibility'
import CloseIcon from 'material-ui/svg-icons/navigation/close'

import { RRButton, FLButton } from '../common/Buttons'

class PhiLogin extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pn: '',
      pnError: '',
      pwd: '',
      pwdError: '',
      error: '',
      showPwd: false
    }

    this.onPhoneNumber = (pn) => {
      let pnError = ''
      if (!Number.isInteger(Number(pn))) pnError = i18n.__('Not Phone Number')
      this.setState({ pn, pnError })
    }

    this.onPassword = (pwd) => {
      this.setState({ pwd })
    }

    this.handleSaveToken = () => {
    }

    this.handleAutologin = () => {
    }

    this.clearPn = () => this.setState({ pn: '' })
    this.togglePwd = () => this.setState({ showPwd: !this.state.showPwd })

    this.login = () => {
      this.props.CST('device')
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    const iconStyle = { width: 18, height: 18, color: '#31a0f5', padding: 0 }
    const buttonStyle = { width: 26, height: 26, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
      <div style={{ width: 320, height: 480, zIndex: 100 }} className="paper" >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 19 }} className="title">
          { i18n.__('Login') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} />
        <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            style={{ width: 220, height: 116 }}
            src="./assets/images/pic-login.png"
            alt=""
          />
        </div>
        <div style={{ width: 282, margin: '0 auto', position: 'relative' }}>
          <TextField
            fullWidth
            style={{ marginTop: 12 }}
            hintText={i18n.__('Phone Number Hint')}
            errorStyle={{ position: 'absolute', right: 0, top: 0 }}
            type="text"
            errorText={this.state.pnError}
            value={this.state.pn}
            onChange={e => this.onPhoneNumber(e.target.value)}
          />
          <TextField
            fullWidth
            style={{ marginTop: 12 }}
            hintText={i18n.__('Password Hint')}
            errorStyle={{ position: 'absolute', right: 0, top: 0 }}
            type={this.state.showPwd ? 'text' : 'password'}
            errorText={this.state.pwdError}
            value={this.state.pwd}
            onChange={e => this.onPassword(e.target.value)}
            onKeyDown={this.onKeyDown}
          />

          {/* clear password */}
          <div style={{ position: 'absolute', right: 4, top: 26 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.clearPn}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* password visibility */}
          <div style={{ position: 'absolute', right: 4, top: 86 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.togglePwd}>
              { this.state.showPwd ? <VisibilityOff /> : <Visibility /> }
            </IconButton>
          </div>
        </div>
        <div style={{ display: 'flex', margin: '4px 18px' }}>
          <Checkbox
            label={i18n.__('Remember Password')}
            disableTouchRipple
            style={{ width: 120 }}
            iconStyle={{ height: 16, width: 16, marginTop: 2 }}
            labelStyle={{ fontSize: 14, color: '#85868c', marginLeft: -9 }}
            checked={!!this.state.saveToken}
            onCheck={() => this.handleSaveToken()}
          />
          <Checkbox
            label={i18n.__('Auto Login')}
            disableTouchRipple
            style={{ width: 120 }}
            iconStyle={{ height: 16, width: 16, marginTop: 2 }}
            labelStyle={{ fontSize: 14, color: '#85868c', marginLeft: -9 }}
            checked={!!this.state.autologin}
            onCheck={() => this.handleAutologin()}
          />
        </div>
        <div style={{ height: 18 }} />
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            label={i18n.__('Login')}
            onClick={this.login}
            disabled={this.state.pnError || this.state.pwdError}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', height: 50, color: '#85868c' }}>
          <div style={{ width: '50%', textAlign: 'right' }}>
            <FLButton
              label={i18n.__('Sign Up')}
            />
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(0,0,0,.38)' }} />
          <div style={{ width: '50%', textAlign: 'left' }}>
            <FLButton
              label={i18n.__('Forget Password')}
              style={{ marginLeft: 8 }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default PhiLogin
