import React from 'react'
import i18n from 'i18n'
import { ipcRenderer } from 'electron'
import { DownloadingIcon } from '../common/Svg'
import TrsContainer from '../file/TransmissionContainer'
import Base from './Base'

class Transmission extends Base {
  navEnter () {
    ipcRenderer.send('GET_TRANSMISSION')
  }

  navGroup () {
    return 'transmission'
  }

  menuName () {
    return i18n.__('Downloading Menu Name')
  }

  menuIcon () {
    return DownloadingIcon
  }

  appBarStyle () {
    return 'colored'
  }

  prominent () {
    return true
  }

  hasDetail () {
    return false
  }

  detailEnabled () {
    return false
  }

  renderTitle ({ style }) {
    return <div style={Object.assign({}, style, { marginLeft: 184 })}>{ i18n.__('Transmission Title') }</div>
  }

  renderContent ({ navToDrive }) {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <TrsContainer navToDrive={navToDrive} type="d" />
      </div>
    )
  }
}

export default Transmission
