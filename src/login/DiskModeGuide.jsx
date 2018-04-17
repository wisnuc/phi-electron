import i18n from 'i18n'
import React from 'react'
import { Divider, RaisedButton } from 'material-ui'

class DiskModeGuide extends React.PureComponent {
  render () {
    const { onRequestClose, powerOff } = this.props
    return (
      <div style={{ height: 471, width: 590, backgroundColor: '#FFF' }} >
        <div style={{ height: 50, width: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 30 }} className="title">
            { i18n.__('Show Disk Mode') }
          </div>
        </div>
        <Divider style={{ marginLeft: 20, width: 'calc(100% - 40px)' }} />
        <div style={{ height: 350, width: '100%' }} className="flexCenter" >
          <img src="./assets/images/pic-raidmode.png" alt="" width={270} height={320} />
          <div style={{ width: 10 }} />
          <img src="./assets/images/pic-singlemode.png" alt="" width={270} height={320} />
        </div>
        <div style={{ height: 70, width: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <div style={{ color: '#f58631' }}>
            { i18n.__('Change Disk Text') }
          </div>
          <div style={{ flexGrow: 1 }} />
          <RaisedButton label={i18n.__('Got It')} onClick={onRequestClose} />
          <div style={{ width: 10 }} />
          <RaisedButton label={i18n.__('Power Off')} onClick={powerOff} />
        </div>
      </div>
    )
  }
}

export default DiskModeGuide
