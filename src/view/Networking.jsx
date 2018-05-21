import React from 'react'
import i18n from 'i18n'
import Base from './Base'
import NetworkInfo from '../settings/NetworkInfo'

class Ethernet extends Base {
  willReceiveProps (nextProps) {
    // this.handleProps(nextProps.selectedDevice, ['net'])
  }

  navEnter () {
    // this.ctx.props.selectedDevice.request('net')
  }

  navGroup () {
    return 'settings'
  }

  menuName () {
    return i18n.__('Networking Menu Name')
  }

  menuDes () {
    return i18n.__('Networking Description')
  }

  menuIcon () {
    const Pic = props => (
      <div {...props}>
        <img src="./assets/images/ic-network.png" alt="" width={44} height={48} />
      </div>
    )
    return Pic
  }

  renderContent ({ openSnackBar }) {
    return (
      <NetworkInfo
        {...this.ctx.props}
        openSnackBar={openSnackBar}
      />
    )
  }
}

export default Ethernet
