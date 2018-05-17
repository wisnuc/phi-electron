import i18n from 'i18n'
import React from 'react'
import { Divider, IconButton, TextField } from 'material-ui'
import { EyeOpenIcon } from '../common/Svg'

import { RRButton } from '../common/Buttons'

class SetLANPwd extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pwd: '123456',
      pwdError: '',
      error: '',
      loading: false,
      showPwd: false
    }

    this.onPassword = (pwd) => {
      this.setState({ pwd, pwdError: '' })
    }

    this.togglePwd = () => this.setState({ showPwd: !this.state.showPwd })

    this.fireAsync = async () => {
      const { dev, account } = this.props
      const deviceSN = dev.boot.data.device.deviceSN
      const args = { deviceSN }
      const users = (await this.props.phi.reqAsync('cloudUsers', args))
      const user = Array.isArray(users) && users.find(u => u.phicommUserId === account.phicommUserId)
      console.log('fireAsync users', users, user)
      const userUUID = user.uuid
      const newUser = (await this.props.phi.reqAsync('setLANPassword', { deviceSN, password: this.state.pwd, userUUID }))
      const token = (await this.props.phi.reqAsync('LANToken', args)).token
      console.log('fireAsync newUser', newUser)
      return ({ dev, user: newUser, token })
    }

    this.fire = () => {
      this.setState({ loading: true })
      this.fireAsync()
        .then(({ dev, user, token }) => {
          Object.assign(dev, { token: { isFulfilled: () => true, ctx: user, data: { token } } })
          this.setState({ loading: false })
          this.props.deviceLogin({ dev, user })
        })
        .catch((error) => {
          console.error('this.getLANToken', error)
          this.setState({ status: 'error', error, loading: false })
        })
    }
  }

  render () {
    const iconStyle = { width: 30, height: 30, color: '#505259', iconHoverColor: '#31a0f5' }
    const buttonStyle = { width: 30, height: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
      <div style={{ width: 320, zIndex: 200, position: 'relative' }} className="paper" >
        <div
          style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 19 }}
          className="title"
        >
          { i18n.__('Set LAN Pwd') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 150, paddingBottom: 30 }} className="flexCenter">
          <img
            style={{ width: 280, height: 150 }}
            src="./assets/images/pic-offlinepassword.png"
            alt=""
          />
        </div>
        <div style={{ width: 282, margin: '-20px auto 0px auto', position: 'relative' }}>
          <TextField
            fullWidth
            style={{ marginTop: 12 }}
            hintText={i18n.__('LAN Password Hint')}
            errorStyle={{ position: 'absolute', right: 0, top: 0 }}
            type={this.state.showPwd ? 'text' : 'password'}
            errorText={this.state.pwdError}
            value={this.state.pwd}
            onChange={e => this.onPassword(e.target.value)}
            onKeyDown={this.onKeyDown}
          />
          {/* clear password */}
          <div style={{ position: 'absolute', right: 4, top: 20 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.togglePwd}>
              { this.state.showPwd ? <EyeOpenIcon /> : <EyeOpenIcon /> }
            </IconButton>
          </div>
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RRButton
            label={i18n.__('Save') + (this.state.loading ? '中...' : '')}
            onClick={this.fire}
            disabled={!this.state.pwd || this.state.loading}
          />
        </div>
        <div style={{ height: 30 }} />
      </div>
    )
  }
}

export default SetLANPwd
