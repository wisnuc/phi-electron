import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'

import { EyeOpenIcon, EyeOffIcon } from '../common/Svg'
import { RRButton, Toggle, TFButton, TextField } from '../common/Buttons'

class Samba extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pwd: '',
      pwdError: '',
      error: '',
      loading: false,
      showPwd: false,
      open: this.props.samba && !!this.props.samba.isActive
    }

    this.onPassword = (pwd) => {
      this.setState({ pwd, pwdError: '' })
    }

    this.hanldeStatus = () => {
      if (this.state.open) {
        this.setState({ open: false, pwd: '', pwdError: '' })
      } else {
        this.setState({ open: true, pwd: '', pwdError: '' })
      }
    }

    this.saveAsync = async (open, encrypted, pwd) => {
      const isAdmin = this.props.apis.account && this.props.apis.account.data && this.props.apis.account.data.isFirstUser
      if (isAdmin) await this.props.apis.pureRequestAsync('sambaStatus', { op: open ? 'start' : 'close' })
      await this.props.apis.requestAsync('samba')
      const driveUUID = this.drive && this.drive.uuid
      if (open) await this.props.apis.pureRequestAsync('sambaEncrypted', { encrypted, driveUUID })
      if (open && encrypted && pwd) await this.props.apis.pureRequestAsync('sambaPwd', { pwd })
      await this.props.apis.requestAsync('drives')
    }

    this.save = () => {
      this.setState({ loading: true })
      this.saveAsync(this.state.open, this.state.encrypted, this.state.pwd).asCallback((err) => {
        if (err) {
          console.error('samba error', err)
          this.props.openSnackBar(i18n.__('Operation Failed'))
        } else {
          this.props.openSnackBar(i18n.__('Operation Success'))
        }
        this.setState({ loading: false })
      })
    }

    this.toggle = op => this.setState({ [op]: !this.state[op] })
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps', nextProps)
    if (Array.isArray(nextProps.drives)) {
      const drive = nextProps.drives.find(d => d.type === 'private')
      if (drive !== this.drive) {
        this.drive = drive
        const encrypted = drive && drive.smb
        this.setState({ encrypted })
      }
    }

    if (nextProps.samba) {
      this.setState({ open: nextProps.samba.isActive })
    }
  }

  renderRow ({ type, enabled, func }) {
    const grey = !this.state.open && (type !== i18n.__('Samba'))
    return (
      <div
        style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center', filter: grey ? 'grayscale(100%)' : '' }}
        key={type}
      >
        <div style={{ width: 130, textAlign: 'right', color: grey ? '#c4c5cc' : '#525a60' }}>
          { type }
        </div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ opacity: grey ? 0.5 : 1 }}>
          <Toggle
            toggled={enabled}
            onToggle={func}
          />
        </div>
      </div>
    )
  }

  renderPassword () {
    const disabled = !this.state.encrypted || !this.state.open
    return (
      <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 130, textAlign: 'right', color: disabled ? '#c4c5cc' : '#525a60' }}>
          { i18n.__('Password') }
        </div>
        <div style={{ width: 30 }} />
        <div style={{ width: 320, marginTop: -30, position: 'relative' }}>
          <TextField
            hintText={disabled ? i18n.__('Password Disabled') : i18n.__('Samba Password Hint')}
            type={this.state.showPwd ? 'text' : 'password'}
            errorText={this.state.pwdError}
            value={this.state.pwd}
            onChange={e => this.onPassword(e.target.value)}
            onKeyDown={this.onKeyDown}
            disabled={!this.state.encrypted || !this.state.open}
          />
          {/* show password */}
          <div style={{ position: 'absolute', right: 0, top: 35 }}>
            <TFButton
              disabled={disabled}
              onClick={() => this.toggle('showPwd')}
              icon={this.state.showPwd ? EyeOpenIcon : EyeOffIcon}
            />
          </div>
        </div>
      </div>
    )
  }

  render () {
    if (!this.props.samba) return (<div />)
    const isAdmin = this.props.apis.account && this.props.apis.account.data && this.props.apis.account.data.isFirstUser
    const settings = [
      {
        type: i18n.__('Samba'),
        enabled: this.state.open,
        func: () => isAdmin && this.hanldeStatus()
      },
      {
        type: i18n.__('Samba Encrypt'),
        enabled: this.state.encrypted,
        func: () => this.state.open && this.toggle('encrypted')
      }
    ]
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter" >
        <div style={{ width: 480, paddingRight: 160, paddingBottom: 60 }}>
          <div style={{ height: 180, width: 320, paddingLeft: 160 }} className="flexCenter">
            <img
              style={{ width: 320, height: 180 }}
              src="./assets/images/pic_samba.png"
              alt=""
            />
          </div>

          { this.renderRow(settings[0]) }

          <div style={{ width: 320, color: '#888a8c', paddingLeft: 160, height: 60, display: 'flex', alignItems: 'center' }} >
            { i18n.__('Sambe Description') }
          </div>

          <Divider color="#f2f2f2" style={{ marginLeft: 160 }} />

          { this.renderRow(settings[1]) }

          <div style={{ height: 30 }} />

          { this.renderPassword() }

          <div style={{ height: 40 }} />

          <div style={{ width: 240, height: 40, margin: '0 auto', paddingLeft: 160 }}>
            <RRButton
              label={this.state.loading ? i18n.__('Saving') : i18n.__('Save')}
              onClick={this.save}
              loading={this.state.loading}
              disabled={(this.state.open && this.state.encrypted && !this.state.pwd) || (!this.state.open && !isAdmin)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Samba
