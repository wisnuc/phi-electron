import i18n from 'i18n'
import React from 'react'
import { Divider, TextField } from 'material-ui'
import { BackIcon, EyeOpenIcon, EyeOffIcon, DelPwdIcon } from '../common/Svg'

import { RRButton, LIButton, TFButton } from '../common/Buttons'

class LANLogin extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pn: '',
      pnError: '',
      pwd: '',
      pwdError: '',
      error: '',
      showPwd: false,
      loading: false
    }

    this.onPhoneNumber = (pn) => {
      // let pnError = ''
      // if (pn && !Number.isInteger(Number(pn))) pnError = i18n.__('Not Phone Number')
      this.setState({ pn, pnError: '' })
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
      const users = this.props.dev.users && this.props.dev.users.data
      const user = users && users.find(u => u.username === this.state.pn)
      if (!user) {
        this.setState({ pnError: '账户不存在' })
        return
      }
      this.setState({ loading: true })
      const { uuid } = user
      const password = this.state.pwd
      console.log('uuid pwd', uuid, password)
      this.props.dev.request('token', { uuid, password }, (err, data) => {
        if (err) {
          console.error(`login err: ${err}`)
          const msg = (err && err.message === 'Unauthorized') ? i18n.__('Wrong Password') : (err && err.message)
          this.setState({ pwdError: msg })
        } else {
          Object.assign(this.props.dev, { token: { isFulfilled: () => true, ctx: user, data } })
          this.props.deviceLogin({ dev: this.props.dev, user })
        }
        this.setState({ loading: false })
      })
    }
  }

  render () {
    console.log('LANLogin', this.props, this.state)
    return (
      <div style={{ width: 320, zIndex: 100 }} className="paper" >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 5 }} className="title">
          <LIButton onClick={this.props.onRequestClose} >
            <BackIcon />
          </LIButton>
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
        <div style={{ width: 280, margin: '0 auto', position: 'relative' }}>
          <TextField
            fullWidth
            style={{ marginTop: 22 }}
            hintText={i18n.__('Username Hint')}
            errorStyle={{ position: 'absolute', left: 0, top: -8, height: 18 }}
            type="text"
            errorText={this.state.pnError}
            value={this.state.pn}
            onChange={e => this.onPhoneNumber(e.target.value)}
          />
          <TextField
            fullWidth
            style={{ marginTop: 22 }}
            hintText={i18n.__('Password Hint')}
            errorStyle={{ position: 'absolute', left: 0, top: -8, height: 18 }}
            type={this.state.showPwd ? 'text' : 'password'}
            errorText={this.state.pwdError}
            value={this.state.pwd}
            onChange={e => this.onPassword(e.target.value)}
            onKeyDown={this.onKeyDown}
          />

          {/* clear password */}
          <div style={{ position: 'absolute', right: 4, top: 30 }}>
            <TFButton icon={DelPwdIcon} onClick={this.clearPn} />
          </div>

          {/* password visibility */}
          <div style={{ position: 'absolute', right: 4, top: 100 }}>
            <TFButton icon={this.state.showPwd ? EyeOffIcon : EyeOpenIcon} onClick={this.togglePwd} />
          </div>
        </div>
        <div style={{ height: 20 }} />
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            label={this.state.loading ? i18n.__('Logging') : i18n.__('Login')}
            onClick={this.login}
            disabled={this.state.pnError || this.state.pwdError || !this.state.pn || !this.state.pwd}
            loading={this.state.loading}
          />
        </div>
        <div style={{ height: 30 }} />
      </div>
    )
  }
}

export default LANLogin
