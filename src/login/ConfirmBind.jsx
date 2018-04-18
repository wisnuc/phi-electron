import i18n from 'i18n'
import React from 'react'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import { Divider, IconButton } from 'material-ui'

class ConfirmBind extends React.PureComponent {
  render () {
    return (
      <div className="paper" style={{ width: 300, height: 288, zIndex: 100 }} >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 20 }} className="title">
          { i18n.__('Confirm Device to Bind') }
          <div style={{ flexGrow: 1 }} />
          <IconButton
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 29,
              height: 29,
              padding: 4,
              marginRight: 24
            }}
            iconStyle={{ width: 21, height: 21, fill: '#525a60' }}
            onClick={this.props.backToList}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 176, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            style={{ width: 49, height: 100 }}
            src="./assets/images/pic-confirm.png"
            alt=""
          />
        </div>
        <div style={{ color: 'var(--grey-text)', width: '100% - 40px', padding: '0 20px' }}>
          { i18n.__('Confirm Device Text') }
        </div>
      </div>
    )
  }
}

export default ConfirmBind
