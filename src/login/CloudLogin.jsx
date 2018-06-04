import i18n from 'i18n'
import React from 'react'
import { RSButton } from '../common/Buttons'
import CircularLoading from '../common/CircularLoading'

class CloudLogin extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      status: 'busy'
    }

    this.getLANTokenAsync = async () => {
      const { dev, account } = this.props
      const args = { deviceSN: dev.mdev.deviceSN }
      const token = (await this.props.phi.reqAsync('LANToken', args)).token
      const users = (await this.props.phi.reqAsync('localUsers', args))
      const user = Array.isArray(users) && users.find(u => u.phicommUserId === account.phicommUserId)
      console.log('LANToken', token, user)
      if (!token || !user) throw Error('get LANToken or user error')
      return ({ dev, user, token })
    }

    this.getLANToken = () => {
      this.getLANTokenAsync()
        .then(({ dev, user, token }) => {
          /* onSuccess: auto login */
          Object.assign(dev, { token: { isFulfilled: () => true, ctx: user, data: { token } } })
          this.props.onRequestClose()
          this.props.deviceLogin({ dev, user, selectedDevice: this.props.selectedDevice })
        })
        .catch((error) => {
          console.error('this.getLANToken', error)
          this.setState({ status: 'error', error })
        })
    }
  }

  componentDidMount () {
    this.getLANToken()
  }

  render () {
    const { status } = this.state
    const { onRequestClose } = this.props

    let [text, img, label, color, func] = ['', '', '', '#31a0f5', () => {}]
    switch (status) {
      case 'busy':
        img = <CircularLoading />
        text = i18n.__('Cloud Logging Text')
        color = '#31a0f5'
        break
      case 'error':
        img = <img src="./assets/images/pic-loadingfailed.png" width={52} height={52} />
        text = i18n.__('Cloud Logging Error Text')
        color = '#fa5353'
        label = i18n.__('OK')
        func = () => onRequestClose()
        break
      default:
        break
    }
    return (
      <div style={{ width: 240, height: 214, backgroundColor: 'transparent', paddingTop: 54 }}>
        <div style={{ height: status !== 'busy' ? 214 : 160, backgroundColor: '#FFF', transition: 'height 175ms' }}>
          <div style={{ height: 40 }} />
          <div style={{ width: '100%', height: 60 }} className="flexCenter">
            { img }
          </div>
          <div style={{ fontSize: 14, color, height: 20 }} className="flexCenter">
            { text }
          </div>
          <div style={{ height: 40 }} />
          <div style={{ height: 34, opacity: status !== 'busy' ? 1 : 0, transition: 'opacity 175ms 175ms' }} className="flexCenter" >
            <RSButton
              label={label}
              onClick={func}
              style={{ width: 152, height: 34 }}
            />
          </div>
          <div style={{ height: 20 }} />
        </div>
      </div>
    )
  }
}
export default CloudLogin
