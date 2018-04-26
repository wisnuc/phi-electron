import i18n from 'i18n'
import React from 'react'
import { Checkbox, Divider, IconButton, TextField } from 'material-ui'
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off'
import Visibility from 'material-ui/svg-icons/action/visibility'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import { BackIcon } from '../common/Svg'

import { RRButton } from '../common/Buttons'

class LANLogin extends React.Component {
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
      if (pn && !Number.isInteger(Number(pn))) pnError = i18n.__('Not Phone Number')
      this.setState({ pn, pnError })
    }

    this.onPassword = (pwd) => {
      this.setState({ pwd })
    }

    this.handleSaveToken = () => {
    }

    this.handleAutologin = () => {
    }

    this.clearPn = () => this.setState({ pn: '', pnError: '' })
    this.togglePwd = () => this.setState({ showPwd: !this.state.showPwd })

    this.login = () => {
      const user = this.props.selectedDevice.users.data[0]
      const { uuid } = user
      const password = 'w'
      this.props.selectedDevice.request('token', { uuid, password }, (err, data) => {
        if (err) console.error(`login err: ${err}`)
        else {
          Object.assign(this.props.selectedDevice.mdev, {
            autologin: this.state.autologin,
            saveToken: this.state.saveToken ? data : null,
            user
          })
          console.log('device', this.props.selectedDevice)
          this.props.ipcRenderer.send('LOGIN', this.props.selectedDevice, user)
          this.props.login()
        }
      })
    }

    this.reset = () => {
      this.setState({ failed: false, pn: '', pnError: '', pwd: '', pwdError: '' })
    }
  }

  componentDidMount () {
    this.props.selectDevice(this.props.dev)
  }

  render () {
    console.log('LANLogin', this.props, this.state)
    const iconStyle = { width: 18, height: 18, color: '#31a0f5', padding: 0 }
    const buttonStyle = { width: 26, height: 26, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
      <div style={{ width: 320, zIndex: 100 }} className="paper" >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 20 }} className="title">
          <IconButton
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
              height: 32,
              width: 32
            }}
            iconStyle={{ width: 22, height: 22, fill: '#525a60' }}
            onClick={this.props.onRequestClose}
          >
            <BackIcon />
          </IconButton>
          { i18n.__('LAN Login') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} />
        <div style={{ height: 30 }} />
        <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            style={{ width: 220, height: 116 }}
            src="./assets/images/pic-login.png"
            alt=""
          />
        </div>
        <div style={{ height: 10 }} />
        <div style={{ width: 280, margin: '0 auto', position: 'relative' }}>
          <TextField
            fullWidth
            style={{ marginTop: 12 }}
            hintText={i18n.__('Phone Number Hint')}
            errorStyle={{ position: 'absolute', left: 0, top: -8, height: 18 }}
            type="text"
            errorText={this.state.pnError}
            value={this.state.pn}
            onChange={e => this.onPhoneNumber(e.target.value)}
          />
          <TextField
            fullWidth
            style={{ marginTop: 12 }}
            hintText={i18n.__('Password Hint')}
            errorStyle={{ position: 'absolute', left: 0, top: -8, height: 18 }}
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
        <div style={{ display: 'flex', width: 280, height: 30, alignItems: 'center', margin: '0 auto' }}>
          <Checkbox
            label={i18n.__('Remember Password')}
            disableTouchRipple
            style={{ width: 140 }}
            iconStyle={{ height: 18, width: 18, marginTop: 2 }}
            labelStyle={{ fontSize: 14, color: '#85868c', marginLeft: -9 }}
            checked
            onCheck={() => this.handleSaveToken()}
          />
          <Checkbox
            label={i18n.__('Auto Login')}
            disableTouchRipple
            style={{ width: 140 }}
            iconStyle={{ height: 18, width: 18, marginTop: 2, fill: 'rgba(0,0,0,.25)' }}
            labelStyle={{ fontSize: 14, color: '#85868c', marginLeft: -9 }}
            checked={false}
            onCheck={() => this.handleAutologin()}
          />
        </div>
        <div style={{ height: 20 }} />
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            label={i18n.__('Login')}
            onClick={this.login}
            disabled={this.state.pnError || this.state.pwdError}
          />
        </div>
        <div style={{ height: 30 }} />
      </div>
    )
  }
}

export default LANLogin
