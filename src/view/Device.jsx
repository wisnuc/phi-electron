import React from 'react'
import i18n from 'i18n'
import Base from './Base'
import DeviceInfo from '../settings/DeviceInfo'

class Device extends Base {
  constructor (ctx) {
    super(ctx)

    this.address = ctx.props.selectedDevice.mdev.address // TODO

    this.state = {
      boot: null
    }

    this.refresh = () => this.ctx.props.selectedDevice.request('boot')
  }

  willReceiveProps (nextProps) {
    this.handleProps(nextProps.selectedDevice, ['boot'])
  }

  navEnter () {
    this.refresh()
    this.timer = setInterval(this.refresh, 1000)
  }

  navLeave () {
    clearInterval(this.timer)
  }

  navGroup () {
    return 'settings'
  }

  menuName () {
    return i18n.__('Device Menu Name')
  }

  menuDes () {
    return i18n.__('Device Description')
  }

  menuIcon () {
    const Pic = props => (
      <div {...props}>
        <img src="./assets/images/ic-deviceinfo.png" alt="" width={44} height={48} />
      </div>
    )
    return Pic
  }

  renderContent ({ openSnackBar }) {
    return (
      <DeviceInfo
        {...this.state}
        address={this.address}
        selectedDevice={this.ctx.props.selectedDevice}
        primaryColor={this.groupPrimaryColor()}
        openSnackBar={openSnackBar}
      />
    )
  }
}

export default Device
