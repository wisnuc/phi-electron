import React from 'react'
import i18n from 'i18n'
import ActionSettingsEthernet from 'material-ui/svg-icons/action/settings-ethernet'
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
    return i18n.__('Networking Menu Name')
  }

  menuIcon () {
    const Pic = props => (
      <div {...props}>
        <img src="./assets/images/ic-network.png" alt="" width={48} height={48} />
      </div>
    )
    return Pic
  }

  quickName () {
    return i18n.__('Networking Quick Name')
  }

  appBarStyle () {
    return 'colored'
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
