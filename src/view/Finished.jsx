import i18n from 'i18n'
import React from 'react'
import { ipcRenderer } from 'electron'

import Base from './Base'
import { FinishedIcon } from '../common/Svg'
import TrsContainer from '../transmission/TransmissionContainer'

class Transmission extends Base {
  navEnter () {
    ipcRenderer.send('GET_TRANSMISSION')
  }

  navGroup () {
    return 'transmission'
  }

  menuName () {
    return i18n.__('Finished Menu Name')
  }

  menuIcon () {
    return FinishedIcon
  }

  renderContent ({ navToDrive }) {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <TrsContainer navToDrive={navToDrive} type="f" />
      </div>
    )
  }
}

export default Transmission
