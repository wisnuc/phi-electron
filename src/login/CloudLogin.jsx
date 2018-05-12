import i18n from 'i18n'
import React from 'react'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import { CircularProgress } from 'material-ui'
import { teal500, pinkA200 } from 'material-ui/styles/colors'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import ErrorBox from '../common/ErrorBox'
import { RSButton } from '../common/Buttons'

const primaryColor = teal500
const accentColor = pinkA200

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiODFlM2Q4M2ItNDVkNi00NjY0LTllODEtNzc1YzNjMmNmNzU4In0.lHw8ICp0niJU258e_wSHyKhdUzEQG4JVeBQVpv617f8'
const user = {
  uuid: '81e3d83b-45d6-4664-9e81-775c3c2cf758',
  name: 'admin'
}

class ConfirmBind extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      status: 'busy'
    }

    this.getLANToken = () => {
      const { dev, account } = this.props
      const args = {
        token: account.token,
        deviceSN: dev.deviceSN
      }
      console.log('this.getLANToken', args, dev, this.props.selectedDevice)

      /* fake */
      this.props.selectDevice({ address: dev.localIp, domain: 'local' })
      setTimeout(() => {
        Object.assign(this.props.selectedDevice, {
          token: { isFulfilled: () => true, ctx: user, data: { token } },
          mdev: { address: dev.localIp, domain: 'local', deviceSN: dev.deviceSN, stationName: dev.bindingName }
        })
        this.props.login()
      }, 100)

      return

      this.props.selectedDevice.req('getLANToken', args, (err, res) => {
        console.log('getLANToken', err, res)
        if (err) {
          this.setState({ status: 'error' })
        } else {
          // const token = res && res.data && res.data.token
          // const user = res && res.data && res.data.user
          this.props.selectDevice({ address: dev.localIp, domain: 'local' })
          Object.assign(this.props.selectedDevice, {
            token: { isFulfilled: () => true, ctx: user, data: token },
            mdev: { address: dev.localIp, domain: 'local', deviceSN: dev.deviceSN, stationName: dev.bindingName }
          })
          this.props.login()
        }
      })
    }

    this.onSuccess = () => {
    }
  }

  componentDidMount () {
    console.log('CloudLogin Mount', this.props)
    this.getLANToken()
  }

  render () {
    const { onSuccess } = this
    const { status, error } = this.state
    const { onRequestClose } = this.props
    const boxStyle = { display: 'flex', alignItems: 'center' }
    const text = {
      busy: i18n.__('Cloud Logging in...'),
      success: i18n.__('Cloud Logging Success text'),
      error: i18n.__('Cloud Logging Error Text')
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
            <RSButton
              label={status === 'success' ? i18n.__('OK') : i18n.__('Retry')}
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
