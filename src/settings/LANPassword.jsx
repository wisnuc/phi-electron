import i18n from 'i18n'
import React from 'react'
import { RRButton, TextField } from '../common/Buttons'

class LANPassword extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pwd: '',
      pwdError: '',
      newPwd: '',
      newPwdError: '',
      pwdAgain: '',
      pwdAgainError: '',
      error: '',
      loading: false,
      showPwd: false
    }

    this.onPwd = (pwd) => {
      this.setState({ pwd, pwdError: '' })
    }

    this.onNewPwd = (pwd) => {
      this.setState({ newPwd: pwd, newPwdError: '' })
    }

    this.onPwdAgain = (pwd) => {
      this.setState({ pwdAgain: pwd, pwdAgainError: '' })
      if (pwd.length >= this.state.newPwd.length && pwd !== this.state.newPwd) {
        this.setState({ pwdAgainError: i18n.__('Inconsistent Password Error') })
      }
    }

    this.save = () => {
      this.setState({ loading: true })
      this.props.apis.pureRequest('setLANPassword', { prePwd: this.state.pwd, newPwd: this.state.newPwd }, (err, res) => {
        if (err) {
          console.error('Set LAN Password Error', err)
          if (err && err.message === 'Unauthorized') this.setState({ pwdError: i18n.__('Previous Password Wrong') })
          this.props.openSnackBar(i18n.__('Set LAN Password Error'))
        } else this.props.openSnackBar(i18n.__('Set LAN Password Success'))
        this.setState({ loading: false })
      })
    }

    this.togglePwd = () => this.setState({ showPwd: !this.state.showPwd })
  }

  shouldFire () {
    return this.state.pwd && !this.state.pwdError && !this.state.loading && this.state.pwdAgain &&
      this.state.newPwd && !this.state.pwdAgainError && !this.state.newPwdError && (this.state.newPwd === this.state.pwdAgain)
  }

  render () {
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter" >
        <div style={{ width: 480, paddingRight: 160, paddingBottom: 60 }}>
          <div style={{ height: 180, width: 320, paddingLeft: 160 }} className="flexCenter">
            <img
              style={{ width: 320, height: 180 }}
              src="./assets/images/pic_offlinepassword.png"
              alt=""
            />
          </div>

          <div style={{ width: 320, color: '#888a8c', paddingLeft: 160, height: 60, display: 'flex', alignItems: 'center' }} >
            { i18n.__('LAN Password Description') }
          </div>

          {/* prePassword */}
          <div style={{ height: 30 }} />
          <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('Pre Password') }
            </div>
            <div style={{ width: 30 }} />
            <div style={{ width: 320, marginTop: -30, position: 'relative' }}>
              <TextField
                hintText={i18n.__('Pre LAN Password Hint')}
                type="password"
                errorText={this.state.pwdError}
                value={this.state.pwd}
                onChange={e => this.onPwd(e.target.value)}
                disabled={this.state.loading}
              />
            </div>
          </div>

          {/* new Password */}
          <div style={{ height: 30 }} />
          <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('New Password') }
            </div>
            <div style={{ width: 30 }} />
            <div style={{ width: 320, marginTop: -30, position: 'relative' }}>
              <TextField
                hintText={i18n.__('New LAN Password Hint')}
                type="password"
                errorText={this.state.newPwdError}
                value={this.state.newPwd}
                onChange={e => this.onNewPwd(e.target.value)}
                disabled={this.state.loading}
              />
            </div>
          </div>

          {/* new Password again */}
          <div style={{ height: 30 }} />
          <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('New Password Again') }
            </div>
            <div style={{ width: 30 }} />
            <div style={{ width: 320, marginTop: -30, position: 'relative' }}>
              <TextField
                hintText={i18n.__('New LAN Password Again Hint')}
                type="password"
                errorText={this.state.pwdAgainError}
                value={this.state.pwdAgain}
                onChange={e => this.onPwdAgain(e.target.value)}
                onKeyDown={this.onKeyDown}
                disabled={this.state.loading}
              />
            </div>
          </div>

          <div style={{ height: 40 }} />
          <div style={{ width: 240, height: 40, margin: '0 auto', paddingLeft: 160 }}>
            <RRButton
              label={this.state.loading ? i18n.__('Saving') : i18n.__('Save')}
              onClick={this.save}
              disabled={!this.shouldFire()}
              loading={this.state.loading}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LANPassword
