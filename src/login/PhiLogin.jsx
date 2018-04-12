import React from 'react'
import i18n from 'i18n'
import { Checkbox, Divider, IconButton, RaisedButton, TextField } from 'material-ui'
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off'
import Visibility from 'material-ui/svg-icons/action/visibility'
import CloseIcon from 'material-ui/svg-icons/navigation/close'

import FlatButton from '../common/FlatButton'
import WindowAction from '../common/WindowAction'

class PhiLogin extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pn: '',
      pwd: '',
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
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    const borderRadius = 20
    const iconStyle = { width: 18, height: 18, color: 'rgba(0,0,0,.54)', padding: 0 }
    const buttonStyle = { width: 26, height: 26, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
      <div style={{ width: 380, height: 540, backgroundColor: '#FAFAFA', zIndex: 100 }}>
        <div style={{ height: 72, backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', paddingLeft: 24 }} >
          { i18n.__('Login or Sign Up') }
        </div>
        <Divider />
        <div style={{ height: 160 }} />
        <div style={{ width: 320, margin: '0 auto', position: 'relative' }}>
          <TextField
            fullWidth
            hintText={i18n.__('Phone Number Hint')}
            floatingLabelText={i18n.__('Phone Number')}
            floatingLabelFixed
            type="text"
            errorText={this.state.pnError}
            value={this.state.pn}
            onChange={e => this.onPhoneNumber(e.target.value)}
          />
          <TextField
            fullWidth
            hintText={i18n.__('Password Hint')}
            floatingLabelText={i18n.__('Password')}
            floatingLabelFixed
            type={this.state.showPwd ? 'text' : 'password'}
            errorText={this.state.pwdError}
            value={this.state.pwd}
            onChange={e => this.onPassword(e.target.value)}
            onKeyDown={this.onKeyDown}
          />

          {/* clear password */}
          <div style={{ position: 'absolute', right: 4, top: 36 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.clearPn}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* password visibility */}
          <div style={{ position: 'absolute', right: 4, top: 108 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.togglePwd}>
              { this.state.showPwd ? <VisibilityOff /> : <Visibility /> }
            </IconButton>
          </div>
        </div>
        <div style={{ display: 'flex', margin: '8px 32px' }}>
          <Checkbox
            label={i18n.__('Remember Password')}
            disableTouchRipple
            style={{ width: 120 }}
            iconStyle={{ height: 16, width: 16, marginTop: 2 }}
            labelStyle={{ fontSize: 12, color: 'rgba(0,0,0,0.54)', marginLeft: -9 }}
            checked={!!this.state.saveToken}
            onCheck={() => this.handleSaveToken()}
          />
          <Checkbox
            label={i18n.__('Auto Login')}
            disableTouchRipple
            style={{ width: 120 }}
            iconStyle={{ height: 16, width: 16, marginTop: 2 }}
            labelStyle={{ fontSize: 12, color: 'rgba(0,0,0,0.54)', marginLeft: -9 }}
            checked={!!this.state.autologin}
            onCheck={() => this.handleAutologin()}
          />
        </div>
        <div style={{ width: 240, margin: '24px auto' }}>
          <RaisedButton
            label={i18n.__('Login')}
            labelColor="#FFF"
            backgroundColor="#00B0FF"
            style={{ borderRadius, width: '100%', height: 40 }}
            buttonStyle={{ borderRadius }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div style={{ width: '50%', textAlign: 'right' }}>
            <FlatButton
              label={i18n.__('Sign Up')}
            />
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(0,0,0,.38)' }} />
          <div style={{ width: '50%' }}>
            <FlatButton
              label={i18n.__('Forget Password')}
              style={{ marginLeft: 8 }}
            />
          </div>
        </div>

        <WindowAction />
      </div>
    )
  }
}

export default PhiLogin
