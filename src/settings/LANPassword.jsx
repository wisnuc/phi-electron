import i18n from 'i18n'
import React from 'react'
import { RRButton, TextField } from '../common/Buttons'

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
      this.props.apis.pureRequest('setLANPassword', { userUUID, password: this.state.pwd }, (err, res) => {
        console.log('setLANPassword', err, res)
        if (err) {
          console.error('Set LAN Password Error', err)
          this.props.openSnackBar(i18n.__('Set LAN Password Error'))
        } else this.props.openSnackBar(i18n.__('Set LAN Password Success'))
        this.setState({ loading: false })
      })
    }

    this.togglePwd = () => this.setState({ showPwd: !this.state.showPwd })
  }

  render () {
    console.log('LANPassword', this.props)
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
              { i18n.__('Password') }
            </div>
            <div style={{ width: 30 }} />
            <div style={{ width: 320, marginTop: -30, position: 'relative' }}>
              <TextField
                hintText={i18n.__('LAN Password Hint')}
                type={this.state.showPwd ? 'text' : 'password'}
                errorText={this.state.pwdError}
                value={this.state.pwd}
                onChange={e => this.onPassword(e.target.value)}
                onKeyDown={this.onKeyDown}
                disabled={this.state.loading}
              />
            </div>
          </div>

          {/* new Password */}
          <div style={{ height: 30 }} />
          <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('Password') }
            </div>
            <div style={{ width: 30 }} />
            <div style={{ width: 320, marginTop: -30, position: 'relative' }}>
              <TextField
                hintText={i18n.__('LAN Password Hint')}
                type={this.state.showPwd ? 'text' : 'password'}
                errorText={this.state.pwdError}
                value={this.state.pwd}
                onChange={e => this.onPassword(e.target.value)}
                onKeyDown={this.onKeyDown}
                disabled={this.state.loading}
              />
            </div>
          </div>

          {/* new Password again */}
          <div style={{ height: 30 }} />
          <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('Password') }
            </div>
            <div style={{ width: 30 }} />
            <div style={{ width: 320, marginTop: -30, position: 'relative' }}>
              <TextField
                hintText={i18n.__('LAN Password Hint')}
                type={this.state.showPwd ? 'text' : 'password'}
                errorText={this.state.pwdError}
                value={this.state.pwd}
                onChange={e => this.onPassword(e.target.value)}
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
              disabled={!this.state.pwd || this.state.pwdError || this.state.loading}
              loading={this.state.loading}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LANPassword
