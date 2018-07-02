import i18n from 'i18n'
import React from 'react'
import Promise from 'bluebird'
import Unbinding from './Unbinding'
import Dialog from '../common/PureDialog'
import { RRButton } from '../common/Buttons'
import ConfirmDialog from '../common/ConfirmDialog'

class ResetDevice extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      status: '',
      confirm: false
    }

    this.resetAsync = async (check) => {
      const { phi, selectedDevice } = this.props
      const deviceSN = selectedDevice.mdev.deviceSN
      await this.props.apis.pureRequest('unBindVolume', { format: !!check, reset: true })
      await Promise.delay(1200) // for Station to reboot
      await phi.reqAsync('unbindStation', { deviceSN })
    }

    this.reset = (check) => {
      this.setState({ confirm: false })
      setTimeout(() => {
        this.setState({ status: 'busy' })
        this.resetAsync(check).asCallback((err) => {
          if (err) {
            console.error('unbindStation error', err)
            this.setState({ status: 'failed' })
          } else {
            this.setState({ status: 'success' })
          }
        })
      }, 500)
    }

    this.onSuccess = () => {
      this.props.deviceLogout()
    }

    this.onFailed = () => {
      this.props.deviceLogout()
    }

    this.showConfirm = () => this.setState({ confirm: true })
  }

  render () {
    return (
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', paddingBottom: 60 }} className="flexCenter" >
        <div style={{ width: 320 }}>
          <div style={{ height: 180, width: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              style={{ width: 320, height: 180 }}
              src="./assets/images/pic_unbind.png"
              alt=""
            />
          </div>
          <div style={{ height: 40 }} />
          <div style={{ color: '#888a8c', marginBottom: 40, height: 80, display: 'flex', alignItems: 'center' }}>
            { i18n.__('ResetDevice Text')}
          </div>
          <div style={{ width: 240, height: 40, margin: '0 auto' }}>
            <RRButton
              label={i18n.__('ResetDevice Menu Name')}
              onClick={this.showConfirm}
            />
          </div>
          <div style={{ height: 40 }} />
        </div>
        <ConfirmDialog
          open={this.state.confirm}
          onCancel={() => this.setState({ confirm: false })}
          onConfirm={check => this.reset(check)}
          title={i18n.__('Confirm Unbind Title')}
          text={i18n.__('Confirm Unbind Text')}
          checkText={i18n.__('Check Text of Unbind')}
        />
        <Dialog open={!!this.state.status} onRequestClose={() => this.setState({ status: false })} modal transparent >
          {
            !!this.state.status &&
            <Unbinding
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

export default ResetDevice
