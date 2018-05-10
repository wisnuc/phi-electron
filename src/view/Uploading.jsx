import i18n from 'i18n'
import React from 'react'
import { ipcRenderer } from 'electron'

import Base from './Base'
import { UploadingIcon } from '../common/Svg'
import TrsContainer from '../file/TransmissionContainer'

class Transmission extends Base {
  navEnter () {
    ipcRenderer.send('GET_TRANSMISSION')
  }

  navGroup () {
    return 'transmission'
  }

  menuName () {
    return i18n.__('Uploading Menu Name')
  }

  menuIcon () {
    return UploadingIcon
  }

  renderContent ({ navToDrive }) {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <TrsContainer navToDrive={navToDrive} type="u" />
      </div>
    )
  }
}

export default Transmission
