import i18n from 'i18n'
import React from 'react'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import { teal500, pinkA200 } from 'material-ui/styles/colors'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import { RSButton } from '../common/Buttons'
import CircularLoading from '../common/CircularLoading'

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
      const args = { deviceSN: dev.mdev.deviceSN }
      console.log('this.getLANToken1', args, dev)

      const token = (await this.props.phi.reqAsync('LANToken', args)).token
      const users = (await this.props.phi.reqAsync('cloudUsers', args))
      const user = Array.isArray(users) && users.find(u => u.phicommUserId === account.phicommUserId)
      console.log('LANToken', token, user)
      if (!token || !user) throw Error('get LANToken or user error')
      return ({ dev, user, token })
    }

    this.getLANToken = () => {
      this.getLANTokenAsync()
        .then(({ dev, user, token }) => {
          Object.assign(dev, { token: { isFulfilled: () => true, ctx: user, data: { token } } })
          this.props.deviceLogin({ dev, user })
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
          { status === 'busy' && <CircularLoading /> }
          { status === 'success' && <CheckIcon color={primaryColor} style={{ width: 40, height: 40 }} /> }
          { status === 'error' && <CloseIcon color={accentColor} style={{ width: 40, height: 40 }} /> }
        </div>
        <div style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)', height: 24 }} className="flexCenter">
          { text[status] }
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
