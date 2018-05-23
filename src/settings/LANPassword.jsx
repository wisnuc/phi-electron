import i18n from 'i18n'
import React from 'react'
import { IconButton, TextField } from 'material-ui'

import { EyeOpenIcon } from '../common/Svg'
import { RRButton } from '../common/Buttons'

class LANPassword extends React.Component {
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
      this.setState({ loading: true })
      const userUUID = this.props.apis.account && this.props.apis.account.data.uuid
      const deviceSN = this.props.selectedDevice && this.props.selectedDevice.mdev.deviceSN
      this.props.phi.req('setLANPassword', { userUUID, password: this.state.pwd, deviceSN }, (err, res) => {
        if (err) {
          console.error('Set LAN Password Error', err)
          this.props.openSnackBar('Set LAN Password Error')
        } else this.props.openSnackBar('Set LAN Password Success')
        this.setState({ loading: false })
      })
    }

    this.togglePwd = () => this.setState({ showPwd: !this.state.showPwd })
  }

  renderPassword () {
    const iconStyle = { width: 30, height: 30, color: '#31a0f5', iconHoverColor: '#31a0f5' }
    const buttonStyle = { width: 30, height: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
      <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 150, textAlign: 'right', color: '#525a60' }}>
          { i18n.__('Password') }
        </div>
        <div style={{ width: 30 }} />
        <div style={{ width: 320, position: 'relative' }}>
          <TextField
            fullWidth
            style={{ marginTop: 5 }}
            hintText={i18n.__('LAN Password Hint')}
            errorStyle={{ position: 'absolute', left: 0, top: -8, height: 18 }}
            type={this.state.showPwd ? 'text' : 'password'}
            errorText={this.state.pwdError}
            value={this.state.pwd}
            onChange={e => this.onPassword(e.target.value)}
            onKeyDown={this.onKeyDown}
            disabled={this.state.loading}
          />
          {/* show password */}
          <div style={{ position: 'absolute', right: -5, top: 15 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.togglePwd}>
              { this.state.showPwd ? <EyeOpenIcon /> : <EyeOpenIcon /> }
            </IconButton>
          </div>
        </div>
      </div>
    )
  }

  render () {
    console.log('LANPassword', this.props)
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter" >
        <div style={{ width: 480, paddingRight: 160, paddingBottom: 60 }}>
          <div style={{ height: 180, width: 320, paddingLeft: 160 }} className="flexCenter">
            <img
              style={{ width: 280, height: 180 }}
              src="./assets/images/pic_offlinepassword.png"
              alt=""
            />
          </div>

          <div style={{ width: 320, color: '#888a8c', paddingLeft: 160, height: 60, display: 'flex', alignItems: 'center' }} >
            { i18n.__('LAN Password Description') }
          </div>

          <div style={{ height: 30 }} />

          { this.renderPassword() }

          <div style={{ height: 40 }} />

          <div style={{ width: 240, height: 40, margin: '0 auto', paddingLeft: 160 }}>
            <RRButton
              label={i18n.__('Save')}
              onClick={this.save}
              disabled={this.state.loading}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LANPassword
