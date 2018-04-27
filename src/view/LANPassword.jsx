import React from 'react'
import i18n from 'i18n'
import Base from './Base'
import NetworkInfo from '../device/NetworkInfo'

class Ethernet extends Base {
  willReceiveProps (nextProps) {
    this.handleProps(nextProps.selectedDevice, ['net'])
  }

  navEnter () {
    this.ctx.props.selectedDevice.request('net')
  }

  navGroup () {
    return 'settings'
  }

  menuName () {
    return i18n.__('LANPassword Menu Name')
  }

  menuDes () {
    return i18n.__('LANPassword Description')
  }

  menuIcon () {
    const Pic = props => (
      <div {...props}>
        <img src="./assets/images/ic-offlinepassword.png" alt="" width={42} height={49} />
      </div>
    )
    return Pic
  }

  renderContent ({ openSnackBar }) {
    return (
      <NetworkInfo
        net={this.state.net}
        primaryColor={this.groupPrimaryColor()}
        apis={this.ctx.props.apis}
        openSnackBar={openSnackBar}
      />
    )
  }
}

export default Ethernet
