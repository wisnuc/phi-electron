import React from 'react'
import i18n from 'i18n'
import { ipcRenderer } from 'electron'
import Base from './Base'
import UpdateApp from '../control/ClientUpdateApp'

class Update extends Base {
  navGroup () {
    return 'settings'
  }

  menuName () {
    return i18n.__('ClientUpdate Menu Name')
  }

  menuIcon () {
    const Pic = props => (
      <div {...props}>
        <img src="./assets/images/ic-update.png" alt="" width={48} height={48} />
      </div>
    )
    return Pic
  }

  quickName () {
    return i18n.__('ClientUpdate Quick Name')
  }

  appBarStyle () {
    return 'colored'
  }

  renderContent ({ openSnackBar }) {
    return (
      <UpdateApp
        ipcRenderer={ipcRenderer}
        openSnackBar={openSnackBar}
        primaryColor={this.groupPrimaryColor()}
      />
    )
  }
}

export default Update
