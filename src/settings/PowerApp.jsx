import i18n from 'i18n'
import React from 'react'
import { RRButton } from '../common/Buttons'
import ConfirmDialog from '../common/ConfirmDialog'

class Power extends React.Component {
  constructor (props) {
    super(props)

    this.state = { confirm: false }

    this.reboot = () => {
    }

    this.reset = (check) => {
      console.log('this.reset', this.props, check)
      /* check clean data TODO */
      const { phi, selectedDevice } = this.props
      const deviceSN = selectedDevice.mdev.deviceSN
      phi.req('unbindStation', { deviceSN }, (err, res) => {
        console.log('this.reset err res', err, res)
        this.props.deviceLogout()
      })
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
              src="./assets/images/pic_powermanage.png"
              alt=""
            />
          </div>
          <div style={{ height: 40 }} />
          <div style={{ color: '#888a8c', marginBottom: 40, height: 80, display: 'flex', alignItems: 'center' }}>
            { i18n.__('Reboot Text')}
          </div>
          <div style={{ width: 240, height: 40, margin: '0 auto' }}>
            <RRButton
              label={i18n.__('Reboot Menu Name')}
              onClick={this.showConfirm}
            />
          </div>
          <div style={{ height: 40 }} />
        </div>
        <ConfirmDialog
          open={this.state.confirm}
          onCancel={() => this.setState({ confirm: false })}
          onConfirm={() => this.reboot()}
          title={i18n.__('Confirm Reboot Title')}
          text={i18n.__('Confirm Reboot Text')}
        />
      </div>
    )
  }
}

export default Power
