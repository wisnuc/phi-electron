import i18n from 'i18n'
import React from 'react'
import Base from './Base'
import Dlna from '../settings/Dlna'

class DlnaApp extends Base {
  constructor (ctx) {
    super(ctx)

    this.refresh = () => {
      this.ctx.props.apis.request('samba')
      this.ctx.props.apis.request('dlna')
      this.ctx.props.apis.request('bt')
    }
  }

  willReceiveProps (nextProps) {
    // this.handleProps(nextProps.apis, ['samba', 'dlna', 'bt'])
  }

  navEnter () {
    // this.refresh()
  }

  navGroup () {
    return 'settings'
  }

  menuName () {
    return i18n.__('DLNA Menu Name')
  }

  menuDes () {
    return i18n.__('DLNA Description')
  }

  menuIcon () {
    const Pic = props => (
      <div {...props}>
        <img src="./assets/images/ic-dlna.png" alt="" width={44} height={48} />
      </div>
    )
    return Pic
  }

  renderContent ({ openSnackBar }) {
    return (
      <Dlna
        {...this.ctx.props}
        openSnackBar={openSnackBar}
      />
    )
  }
}

export default DlnaApp
