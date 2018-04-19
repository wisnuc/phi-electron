import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'
import { RaisedButton } from '../common/Buttons'

class ConnectionHint extends React.PureComponent {
  render () {
    const { onRequestClose } = this.props
    const texts = [
      i18n.__('Device Connection Text 1'),
      i18n.__('Device Connection Text 2'),
      i18n.__('Device Connection Text 3')
    ]
    return (
      <div style={{ height: 401, width: 300, backgroundColor: '#FFF' }} >
        <div style={{ height: 50, width: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 20 }} className="title">
            { i18n.__('Device Connection Title') }
          </div>
        </div>
        <Divider style={{ marginLeft: 20, width: 'calc(100% - 40px)' }} />
        <div style={{ height: 180, width: '100%' }} className="flexCenter" >
          <img src="./assets/images/pic-connection.png" alt="" width={215} height={120} />
        </div>
        <div style={{ height: 8 }} />
        {
          texts.map(text => (
            <div style={{ display: 'flex', alignItems: 'center', height: 30, marginLeft: 20 }} key={text}>
              <div style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: 'var(--grey-text)', marginRight: 6 }} />
              <div style={{ color: 'var(--grey-text)' }}> { text }</div>
            </div>
          ))
        }
        <div style={{ height: 70, width: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <div style={{ flexGrow: 1 }} />
          <RaisedButton label={i18n.__('Got It')} onClick={onRequestClose} />
        </div>
      </div>
    )
  }
}

export default ConnectionHint
