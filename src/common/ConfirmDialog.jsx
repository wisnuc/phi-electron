import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'
import { RSButton } from '../common/Buttons'
import Dialog from '../common/PureDialog'

class ConfirmDialog extends React.PureComponent {
  render () {
    const { open, onCancel, onConfirm, title, text } = this.props
    return (
      <Dialog open={open} onRequestClose={onCancel} modal >
        {
          open && (
            <div style={{ width: 320 }} >
              <div style={{ height: 60, display: 'flex', alignItems: 'center', paddingLeft: 20 }} className="title">
                { title }
              </div>
              <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
              <div style={{ height: 20 }} />
              <div
                style={{
                  width: 280,
                  padding: '0 20px',
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: '30px',
                  color: 'var(--grey-text)'
                }}
              >
                { text }
              </div>
              <div style={{ height: 20 }} />
              <div style={{ height: 34, width: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', padding: 20 }}>
                <div style={{ flexGrow: 1 }} />
                <RSButton label={i18n.__('Cancel')} onClick={onCancel} alt />
                <div style={{ width: 10 }} />
                <RSButton label={i18n.__('Confirm')} onClick={onConfirm} />
              </div>
            </div>
          )
        }
      </Dialog>
    )
  }
}

export default ConfirmDialog
