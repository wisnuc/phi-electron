import React from 'react'
import i18n from 'i18n'
import { Checkbox, Divider, IconButton, RaisedButton, TextField } from 'material-ui'
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off'
import Visibility from 'material-ui/svg-icons/action/visibility'
import CloseIcon from 'material-ui/svg-icons/navigation/close'

import FlatButton from '../common/FlatButton'

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
    const borderRadius = 20
    const iconStyle = { width: 18, height: 18, color: '#31a0f5', padding: 0 }
    const buttonStyle = { width: 26, height: 26, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
      <div style={{ width: 320, height: 500, backgroundColor: '#FAFAFA', zIndex: 100 }}>
        <div style={{ height: 61, backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', paddingLeft: 19, fontSize: 20 }} >
          { i18n.__('Login or Sign Up') }
        </div>
        <Divider />
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
            style={{ marginTop: -10 }}
            hintText={i18n.__('Phone Number Hint')}
            floatingLabelText={i18n.__('Phone Number')}
            errorStyle={{ position: 'absolute', right: 8, top: 18 }}
            floatingLabelStyle={{ fontSize: 14, color: '#505259', marginTop: -6 }}
            floatingLabelFixed
            type="text"
            errorText={this.state.pnError}
            value={this.state.pn}
            onChange={e => this.onPhoneNumber(e.target.value)}
          />
          <TextField
            fullWidth
            style={{ marginTop: -6 }}
            hintText={i18n.__('Password Hint')}
            floatingLabelText={i18n.__('Password')}
            errorStyle={{ position: 'absolute', right: 8, top: 18 }}
            floatingLabelStyle={{ fontSize: 14, color: '#505259', marginTop: -6 }}
            floatingLabelFixed
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
          <div style={{ position: 'absolute', right: 4, top: 94 }}>
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
            labelStyle={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', marginLeft: -9 }}
            checked={!!this.state.saveToken}
            onCheck={() => this.handleSaveToken()}
          />
          <Checkbox
            label={i18n.__('Auto Login')}
            disableTouchRipple
            style={{ width: 120 }}
            iconStyle={{ height: 16, width: 16, marginTop: 2 }}
            labelStyle={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', marginLeft: -9 }}
            checked={!!this.state.autologin}
            onCheck={() => this.handleAutologin()}
          />
        </div>
        <div style={{ height: 26 }} />
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RaisedButton
            label={i18n.__('Login')}
            labelColor="#FFF"
            backgroundColor="#00B0FF"
            style={{ borderRadius, width: 240, height: 40, fontSize: 16 }}
            buttonStyle={{ borderRadius }}
            onClick={this.login}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', height: 50, color: '#85868c' }}>
          <div style={{ width: '50%', textAlign: 'right' }}>
            <FlatButton
              style={{ color: '#85868c' }}
              label={i18n.__('Sign Up')}
            />
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(0,0,0,.38)' }} />
          <div style={{ width: '50%', textAlign: 'left' }}>
            <FlatButton
              label={i18n.__('Forget Password')}
              style={{ marginLeft: 8, color: '#85868c' }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default PhiLogin
