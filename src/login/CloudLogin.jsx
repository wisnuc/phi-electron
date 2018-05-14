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

class CloudLogin extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      status: 'busy'
    }

    this.getLANTokenAsync = async () => {
      const { dev, account } = this.props
      const args = {
        token: account.token,
        deviceSN: dev.deviceSN
      }
      console.log('this.getLANToken1', args, dev, this.props.selectedDevice, this.props.account)

      this.props.selectDevice({ address: dev.localIp, domain: 'local' })

      this.props.selectDevice({ address: dev.localIp, domain: 'local' })
      /* fake */
      /*
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiODFlM2Q4M2ItNDVkNi00NjY0LTllODEtNzc1YzNjMmNmNzU4In0.lHw8ICp0niJU258e_wSHyKhdUzEQG4JVeBQVpv617f8'
      const user = {
        uuid: '81e3d83b-45d6-4664-9e81-775c3c2cf758',
        name: 'admin'
      }
      */

      const token = (await this.props.selectedDevice.reqAsync('LANToken', args)).result.data.res.token
      const users = (await this.props.selectedDevice.reqAsync('cloudUsers', args)).result.data.res
      const user = Array.isArray(users) && users.find(u => u.phicommUserId === account.phicommUserId)
      console.log('LANToken', token, user)
      if (!token || !user) throw Error('get LANToken or user error')
      return ({ dev, user, token })
    }

    this.getLANToken = () => {
      this.getLANTokenAsync()
        .then(({ dev, user, token }) => {
          Object.assign(this.props.selectedDevice, {
            token: { isFulfilled: () => true, ctx: user, data: { token } },
            mdev: { address: dev.localIp, domain: 'local', deviceSN: dev.deviceSN, stationName: dev.bindingName }
          })
          this.props.ipcRenderer.send('LOGIN', this.props.selectedDevice, user)
          this.props.login()
        })
        .catch((error) => {
          console.error('this.getLANToken', error)
          this.setState({ status: 'error', error })
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
      busy: i18n.__('Cloud Logging Text'),
      success: i18n.__('Cloud Logging Success Text'),
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
export default CloudLogin
