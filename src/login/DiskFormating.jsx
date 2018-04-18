import i18n from 'i18n'
import React from 'react'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import { CircularProgress, RaisedButton } from 'material-ui'
import { teal500, pinkA200 } from 'material-ui/styles/colors'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import ErrorBox from '../common/ErrorBox'

const primaryColor = teal500
const accentColor = pinkA200

class ConfirmBind extends React.PureComponent {
  render () {
    const { status, error, onRequestClose, onSuccess } = this.props
    const boxStyle = { display: 'flex', alignItems: 'center' }
    const text = {
      busy: i18n.__('Disk Format Busy Text'),
      success: i18n.__('Disk Format Success text'),
      error: i18n.__('Disk Format Error Text')
    }

    return (
      <div style={{ width: 320, height: 180 }}>
        <div style={{ width: '100%', height: 80 }} className="flexCenter">
          { status === 'busy' && <CircularProgress size={32} thickness={2.5} /> }
          { status === 'success' && <CheckIcon color={primaryColor} style={{ width: 40, height: 40 }} /> }
          { status === 'error' && <CloseIcon color={accentColor} style={{ width: 40, height: 40 }} /> }
        </div>
        <div style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)', height: 24 }} className="flexCenter">
          { status === 'error' ? <ErrorBox style={boxStyle} text={text[status]} error={error} /> : text[status] }
        </div>
        <div style={{ height: 18 }} />
        <div className="flexCenter">
          {
            status !== 'busy' &&
            <RaisedButton
              label={status === 'success' ? i18n.__('OK') : i18n.__('Retry')}
              disableTouchRipple
              disableFocusRipple
              primary
              onClick={() => (status === 'success' ? onSuccess() : onRequestClose())}
              style={{ marginRight: 12 }}
            />
          }
        </div>
      </div>
    )
  }
}
export default ConfirmBind
