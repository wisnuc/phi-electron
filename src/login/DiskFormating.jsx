import i18n from 'i18n'
import React from 'react'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import { RSButton } from '../common/Buttons'
import CircularLoading from '../common/CircularLoading'

class DiskFormating extends React.PureComponent {
  render () {
    const { status, onRequestClose, onSuccess } = this.props

    let [text, img, label, color, func] = ['', '', '', '#31a0f5', () => {}]
    switch (status) {
      case 'busy':
        img = <CircularLoading />
        text = i18n.__('Disk Format Busy Text')
        color = '#31a0f5'
        break
      case 'success':
        img = <CheckIcon color="#31a0f5" style={{ width: 52, height: 52 }} />
        text = i18n.__('Disk Format Success text')
        color = '#31a0f5'
        label = i18n.__('OK')
        func = () => onSuccess()
        break
      case 'error':
        img = <CloseIcon color="#fa5353" style={{ width: 52, height: 52 }} />
        text = i18n.__('Disk Format Error Text')
        color = '#fa5353'
        label = i18n.__('OK')
        func = () => onRequestClose()
        break
      default:
        break
    }

    return (
      <div style={{ width: 240 }}>
        <div style={{ width: '100%', height: 60, marginTop: 40 }} className="flexCenter">
          { img }
        </div>
        <div style={{ fontSize: 14, color, height: 20 }} className="flexCenter">
          { text }
        </div>
        <div style={{ height: 40 }} />
        {
          status !== 'busy' &&
            <div style={{ height: 34, marginBottom: 20 }} className="flexCenter" >
              <RSButton
                label={label}
                onClick={func}
                style={{ width: 152, height: 34 }}
              />
            </div>
        }
      </div>
    )
  }
}
export default DiskFormating
