import React from 'react'
import i18n from 'i18n'
import Base from './Base'
import LANPassword from '../settings/LANPassword'

class LAN extends Base {
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
      <LANPassword
        {...this.ctx.props}
        openSnackBar={openSnackBar}
      />
    )
  }
}

export default LAN
