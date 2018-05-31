import md5 from 'md5'
import React from 'react'
import i18n from 'i18n'
import { shell } from 'electron'
import { Checkbox, Divider, TextField } from 'material-ui'
import Dialog from '../common/PureDialog'
import { RRButton, FLButton, RSButton, TFButton } from '../common/Buttons'
import { isPhoneNumber } from '../common/validate'
import { EyeOpenIcon, EyeOffIcon, DelPwdIcon } from '../common/Svg'

const phicommUrl = 'https://sohon2test.phicomm.com/v1'
let firstLogin = true

class PhiLogin extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pn: '',
      pwd: '',
      pnError: '',
      pwdError: '',
      error: '',
      showPwd: false,
      saveToken: false,
      autoLogin: false,
      showFakePwd: false
    }

    this.onPhoneNumber = (pn) => {
      this.setState({
        pn,
        showFakePwd: false,
        pnError: pn && !isPhoneNumber(pn) ? i18n.__('Invalid Phone Number') : ''
      })
    }

    this.onPassword = (pwd) => {
      this.setState({ pwd, pwdError: '' })
    }

    this.handleSaveToken = () => {
      this.setState({ saveToken: !this.state.saveToken, autoLogin: false, showFakePwd: false })
    }

    this.handleAutologin = () => {
      this.setState({ autoLogin: !this.state.autoLogin })
      if (!this.state.autoLogin) this.setState({ saveToken: true })
    }

    this.clearPn = () => this.setState({ pn: '', pnError: '', showFakePwd: false })

    this.togglePwd = () => this.setState({ showPwd: !this.state.showPwd })

    this.login = () => {
      this.setState({ loading: true })
      this.props.phi.req(
        'token',
        { phonenumber: this.state.pn, password: md5(this.state.pwd).toUpperCase() },
        (err, res) => {
          if (err || (res && res.error !== '0')) {
            if (res && res.error === '7') this.setState({ pnError: i18n.__('User Not Exist'), loading: false })
            else if (res && res.error === '8') this.setState({ pwdError: i18n.__('Wrong Password'), loading: false })
            else if (res && res.error === '34') this.setState({ pnError: i18n.__('Phonenumber Format Wrong'), loading: false })
            else this.setState({ failed: true, loading: false })
          } else {
            this.props.phi.req('stationList', null, (e, r) => {
              if (e || !r.result || !Array.isArray(r.result.list) || r.error !== '0') {
                this.setState({ failed: true, loading: false })
              } else {
                const phi = {
                  pn: this.state.pn,
                  puid: res.uid,
                  autoLogin: !!this.state.autoLogin,
                  token: this.state.saveToken ? res.access_token : null
                }
                this.props.onSuccess({ list: r.result.list, phonenumber: this.state.pn, phicommUserId: res.uid, phi })
              }
            })
          }
        }
      )
    }

    this.fakeLogin = () => {
      this.setState({ loading: true })
      console.log('phi', this.props.phi, this.phi)
      /* assign token to PhiAPI */
      Object.assign(this.props.phi, { token: this.phi.token })
      this.props.phi.req('stationList', null, (e, r) => {
        if (e || !r.result || !Array.isArray(r.result.list) || r.error !== '0') {
          this.setState({ failed: true, loading: false })
        } else {
          const phi = {
            pn: this.state.pn,
            puid: this.phi.puid,
            autoLogin: !!this.state.autoLogin,
            token: this.state.saveToken ? this.phi.token : null
          }
          this.props.onSuccess({ list: r.result.list, phonenumber: this.state.pn, phicommUserId: this.phi.puid, phi })
        }
      })
    }

    this.reset = () => {
      this.setState({ failed: false, pnError: '', pwdError: '' })
    }

    this.passwordMode = () => {
    }
  }

  componentDidMount () {
    this.phi = window.config && window.config.global && window.config.global.phi
    if (this.phi) {
      console.log('componentDidMount phi', this.phi, firstLogin)
      const { autoLogin, pn, token } = this.phi
      this.setState({ saveToken: !!token, autoLogin: !!autoLogin, pn: pn || '', showFakePwd: !!token })
      if (firstLogin && token && !!autoLogin) this.fakeLogin()
    }
    firstLogin = false
  }

  shouldFire () {
    return (!this.state.loading && !this.state.pnError && this.state.pn &&
      !this.state.pwdError && (this.state.pwd || this.state.showFakePwd))
  }

  renderFailed () {
    return (
      <div style={{ width: 300, zIndex: 100 }} className="paper" >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 20 }} className="title">
          { i18n.__('Phi Login Failed Title') }
        </div>
        <Divider style={{ marginLeft: 20, width: 260 }} />
        <div style={{ padding: 20, width: 'calc(100% - 40px)', color: '#888a8c' }}>
          { i18n.__('Phi Login Failed Text') }
        </div>
        <div style={{ height: 31, display: 'flex', alignItems: 'center', padding: '0 20px 20px 0' }}>
          <div style={{ flexGrow: 1 }} />
          <RSButton label={i18n.__('Cancel')} onClick={this.reset} alt />
          <div style={{ width: 10 }} />
          <RSButton label={i18n.__('OK')} onClick={this.props.enterLANLogin} />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div style={{ width: 320, zIndex: 100 }} className="paper" >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 20 }} className="title">
          { i18n.__('Login') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} />
        <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            style={{ width: 280, height: 150 }}
            src="./assets/images/pic-login.png"
            alt=""
          />
        </div>
        <div style={{ width: 280, margin: '0 auto', position: 'relative' }}>
          <TextField
            fullWidth
            style={{ marginTop: 22, color: '#505259' }}
            hintText={i18n.__('Phone Number Hint')}
            errorStyle={{ position: 'absolute', left: 0, top: -8, height: 18 }}
            type="text"
            errorText={this.state.pnError}
            value={this.state.pn}
            onChange={e => this.onPhoneNumber(e.target.value)}
          />
          {
            this.state.showFakePwd
              ? (
                <TextField
                  value=""
                  fullWidth
                  hintText="*********"
                  style={{ marginTop: 22 }}
                  onClick={() => this.setState({ showFakePwd: false })}
                  errorText={this.state.pwdError}
                  errorStyle={{ position: 'absolute', left: 0, top: -8, height: 18 }}
                />
              ) : (
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
              )
          }

          {/* clear password */}
          {
            !!this.state.pn && (
              <div style={{ position: 'absolute', right: 4, top: 32 }}>
                <TFButton icon={DelPwdIcon} onClick={this.clearPn} />
              </div>
            )
          }

          {/* password visibility */}
          <div style={{ position: 'absolute', right: 4, top: 102 }}>
            <TFButton icon={this.state.showPwd ? EyeOpenIcon : EyeOffIcon} onClick={this.togglePwd} />
          </div>
        </div>
        <div style={{ display: 'flex', width: 280, height: 40, alignItems: 'center', margin: '0 auto' }}>
          <Checkbox
            label={i18n.__('Remember Password')}
            disableTouchRipple
            style={{ width: 140 }}
            iconStyle={{ height: 18, width: 18, marginTop: 2, fill: this.state.saveToken ? '#31a0f5' : 'rgba(0,0,0,.25)' }}
            labelStyle={{ fontSize: 14, color: '#85868c', marginLeft: -9 }}
            checked={this.state.saveToken}
            onCheck={() => this.handleSaveToken()}
          />
          <Checkbox
            label={i18n.__('Auto Login')}
            disableTouchRipple
            style={{ width: 140 }}
            iconStyle={{ height: 18, width: 18, marginTop: 2, fill: this.state.autoLogin ? '#31a0f5' : 'rgba(0,0,0,.25)' }}
            labelStyle={{ fontSize: 14, color: '#85868c', marginLeft: -9 }}
            checked={this.state.autoLogin}
            onCheck={() => this.handleAutologin()}
          />
        </div>
        <div style={{ height: 30 }} />
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            label={this.state.loading ? i18n.__('Logging') : i18n.__('Login')}
            onClick={() => (this.state.showFakePwd ? this.fakeLogin() : this.login())}
            disabled={!this.shouldFire()}
            loading={this.state.loading}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', height: 50, color: '#85868c' }}>
          <div style={{ width: '50%', textAlign: 'right' }}>
            <FLButton
              label={i18n.__('Sign Up')}
              onClick={() => shell.openExternal(phicommUrl)}
            />
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(0,0,0,.38)' }} />
          <div style={{ width: '50%', textAlign: 'left' }}>
            <FLButton
              label={i18n.__('Forget Password')}
              onClick={() => shell.openExternal(phicommUrl)}
            />
          </div>
        </div>

        {/* Phi Login Failed */}
        <Dialog open={!!this.state.failed} onRequestClose={() => this.setState({ failed: false })} modal >
          { !!this.state.failed && this.renderFailed() }
        </Dialog>
      </div>
    )
  }
}

export default PhiLogin
