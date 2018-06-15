import i18n from 'i18n'
import React from 'react'

import Rebooting from './Rebooting'
import Dialog from '../common/PureDialog'
import { RRButton } from '../common/Buttons'
import ConfirmDialog from '../common/ConfirmDialog'

class Power extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      confirm: false,
      type: 'reboot',
      status: '' // busy, success, error
    }

    this.fire = () => {
      this.setState({ status: 'busy' })
      this.props.apis.request('power', { state: this.state.type }, (err, res) => {
        if (err) {
          console.error('power fire error', err, res)
          this.setState({ status: 'error' })
        } else {
          setTimeout(() => this.setState({ status: 'success' }), 10000)
        }
      })
    }

    this.reboot = () => {
      this.setState({ confirm: false, type: 'reboot' })
      setTimeout(this.fire, 500)
    }

    this.powerOff = () => {
      this.setState({ confirm: false, type: 'poweroff' })
      setTimeout(this.fire, 500)
    }

    this.onSuccess = () => {
      this.props.deviceLogout()
    }

    this.onFailed = () => {
      this.props.deviceLogout()
    }

    this.showConfirm = op => this.setState({ confirm: op })
  }

  render () {
    const reboot = this.state.confirm === 'reboot'
    return (
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', paddingBottom: 60 }} className="flexCenter" >
        <div style={{ width: 320 }}>
          <div style={{ height: 180, width: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              style={{ width: 320, height: 180 }}
              src="./assets/images/pic_powermanage.png"
              alt=""
            />
          </div>
          <div style={{ height: 40 }} />
          <div style={{ width: 270, height: 40, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
            <RRButton
              alt
              tooltip={i18n.__('Reboot Text')}
              label={i18n.__('Reboot Menu Name')}
              onClick={() => this.showConfirm('reboot')}
            />
            <div style={{ width: 18 }} />
            <RRButton
              tooltip={i18n.__('PowerOff Text')}
              label={i18n.__('PowerOff Menu Name')}
              onClick={() => this.showConfirm('powerOff')}
            />
          </div>
          <div style={{ height: 40 }} />
        </div>
        <ConfirmDialog
          open={this.state.confirm}
          onCancel={() => this.setState({ confirm: false })}
          onConfirm={() => (reboot ? this.reboot() : this.powerOff())}
          title={reboot ? i18n.__('Confirm Reboot Title') : i18n.__('Confirm PowerOff Title')}
          text={reboot ? i18n.__('Confirm Reboot Text') : i18n.__('Confirm PowerOff Text')}
        />

        <Dialog open={!!this.state.status} onRequestClose={() => this.setState({ status: false })} modal transparent >
          {
            !!this.state.status &&
            <Rebooting
              type={this.state.type}
              error={this.state.error}
              status={this.state.status}
              onSuccess={this.onSuccess}
              onFailed={this.onFailed}
              onRequestClose={() => this.setState({ status: false })}
            />
          }
        </Dialog>
      </div>
    )
  }
}

export default Power
