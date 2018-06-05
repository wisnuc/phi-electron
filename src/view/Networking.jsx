import React from 'react'
import i18n from 'i18n'
import Base from './Base'
import NetworkInfo from '../settings/NetworkInfo'

class Ethernet extends Base {
  constructor (ctx) {
    super(ctx)

    this.state = {
    }

    this.refresh = () => {
      this.ctx.props.apis.request('network')
      this.ctx.props.apis.request('speed')
    }
  }

  willReceiveProps (nextProps) {
    this.handleProps(nextProps.apis, ['network', 'speed'])
  }

  navEnter () {
    this.refresh()
    // this.timer = setInterval(this.refresh, 1000)
  }

  navLeave () {
    // clearInterval(this.timer)
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
        {...this.state}
        openSnackBar={openSnackBar}
      />
    )
  }
}

export default Ethernet
