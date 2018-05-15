import i18n from 'i18n'
import React from 'react'
import { Checkbox, Divider, IconButton, TextField } from 'material-ui'
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off'
import Visibility from 'material-ui/svg-icons/action/visibility'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import { BackIcon, EyeOpenIcon, DelPwdIcon } from '../common/Svg'

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
      // if (pn && !Number.isInteger(Number(pn))) pnError = i18n.__('Not Phone Number')
      this.setState({ pn, pnError })
    }

    this.onPassword = (pwd) => {
      this.setState({ pwd, pwdError: '' })
    }

    this.handleSaveToken = () => {
    }

    this.handleAutologin = () => {
    }

    this.clearPn = () => this.setState({ pn: '', pnError: '' })
    this.togglePwd = () => this.setState({ showPwd: !this.state.showPwd })

    this.login = () => {
      const users = this.props.selectedDevice.users && this.props.selectedDevice.users.data
      const user = users && users.find(u => u.username === this.state.pn)
      if (!user) {
        this.setState({ pnError: '账户不存在' })
        return
      }
      const { uuid } = user
      const password = this.state.pwd
      console.log('uuid pwd', uuid, password)
      this.props.selectedDevice.request('token', { uuid, password }, (err, data) => {
        if (err) {
          console.error(`login err: ${err}`)
          const msg = (err && err.message === 'Unauthorized') ? i18n.__('Wrong Password') : (err && err.message)
          this.setState({ pwdError: msg })
        } else {
          Object.assign(this.props.selectedDevice.mdev, {
            autologin: this.state.autologin,
            saveToken: this.state.saveToken ? data : null,
            user
          })
          console.log('device', this.props.selectedDevice)
          this.props.ipcRenderer.send('LOGIN', this.props.selectedDevice, user)
          this.props.deviceLogin()
        }
      })
    }

    this.reset = () => {
      this.setState({ failed: false, pn: '', pnError: '', pwd: '', pwdError: '' })
    }
  }

  render () {
    console.log('LANLogin', this.props, this.state)
    const iconStyle = { width: 30, height: 30, color: '#505259', iconHoverColor: '#31a0f5' }
    const buttonStyle = { width: 30, height: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
      <div style={{ width: 320, zIndex: 100 }} className="paper" >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 20 }} className="title">
          <IconButton
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 32,
              width: 32,
              padding: 0
            }}
            iconStyle={{ color: '#525a60' }}
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
            hintText={i18n.__('Username Hint')}
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
          <div style={{ position: 'absolute', right: 4, top: 20 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.clearPn}>
              <DelPwdIcon />
            </IconButton>
          </div>

          {/* password visibility */}
          <div style={{ position: 'absolute', right: 4, top: 80 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.togglePwd}>
              { this.state.showPwd ? <EyeOpenIcon /> : <EyeOpenIcon /> }
            </IconButton>
          </div>
        </div>
        {/*
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
        */}
        <div style={{ height: 20 }} />
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            label={i18n.__('Login')}
            onClick={this.login}
            disabled={this.state.pnError || this.state.pwdError || !this.state.pn || !this.state.pwd}
          />
        </div>
        <div style={{ height: 30 }} />
      </div>
    )
  }
}

export default LANLogin
