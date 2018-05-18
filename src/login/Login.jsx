import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'

import PhiLogin from './PhiLogin'
import ManageDisk from './ManageDisk'
import SelectDevice from './SelectDevice'
import SetLANPwd from './SetLANPwd'

import { RRButton } from '../common/Buttons'
import WindowAction from '../common/WindowAction'
import reqMdns from '../common/mdns'

const duration = 300

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      hello: true,
      loading: true,
      status: 'phiLogin'
    }

    this.onMDNSError = (e) => {
      console.error('reqMdns error', e)
      this.setState({ loading: false, list: [] })
      this.props.openSnackBar(i18n.__('MDNS Search Error'))
    }

    this.showDeviceToBind = () => {
      this.setState({ list: [], loading: true, type: 'LANTOBIND', status: 'deviceSelect' })
      reqMdns()
        .then(mdns => this.setState({ loading: false, list: mdns }))
        .catch(this.onMDNSError)
    }

    this.enterLANLogin = () => {
      this.props.phiLogin({ lan: true })
      this.setState({ list: [], loading: true, type: 'LANTOLOGIN', status: 'deviceSelect' })
      reqMdns()
        .then(mdns => this.setState({ loading: false, list: mdns }))
        .catch(this.onMDNSError)
    }

    this.refreshStationList = () => {
      this.setState({ loading: true, type: 'BOUNDLIST' })
      this.props.phi.req('stationList', null, (e, r) => {
        if (e || !r.result || !Array.isArray(r.result.list) || r.error !== '0') {
          this.setState({ loading: false, list: [], status: 'phiNoBound', error: true }) // TODO Error
        } else {
          const list = r.result.list
          const status = !list.length ? 'phiNoBound' : 'deviceSelect'
          this.setState({ list, loading: false, type: 'BOUNDLIST', status })
        }
      })
    }

    this.addBindDevice = () => {
      this.showDeviceToBind()
    }

    this.refresh = () => {
      switch (this.state.type) {
        case 'LANTOLOGIN':
          this.enterLANLogin()
          break

        case 'LANTOBIND':
          this.showDeviceToBind()
          break

        case 'BOUNDLIST':
          this.refreshStationList()
          break

        default:
          break
      }
    }

    this.manageDisk = (dev) => {
      console.log('this.manageDisk dev', dev, this.state)
      this.setState({ loading: true })
      dev.refreshSystemState(() => {
        if (dev.systemStatus() === 'noBoundVolume') this.setState({ selectedDevice: dev, status: 'diskManage' })
        else this.setState({ type: 'BOUNDLIST' }, () => this.refresh())
      })
    }

    this.backToList = () => {
      this.setState({ selectedDevice: null, status: 'deviceSelect', type: 'BOUNDLIST' }, () => this.refresh())
    }

    this.onFormatSuccess = () => {
      this.setState({ status: 'LANPwd' })
    }

    this.onSetLANPwdSuccess = () => {
      console.log('this.onSetLANPwdSuccess')
    }

    this.phiLoginSuccess = ({ list, phonenumber, token, phicommUserId, phi }) => {
      const status = !list.length ? 'phiNoBound' : 'deviceSelect'
      this.setState({ list, loading: false, type: 'BOUNDLIST', status })
      this.props.phiLogin({ phonenumber, token, phicommUserId, phi })
    }
  }

  componentDidMount () {
    document.getElementById('start-bg').style.display = 'none'
    setTimeout(() => this.setState({ hello: false }), 300)
    /* jump to some status */
    if (this.props.jump) this.setState(this.props.jump, () => this.refresh())
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.account && this.state.status !== 'phiLogin') this.setState({ status: 'phiLogin' })
  }

  renderDeviceSelect (props) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 110,
          width: '100%',
          height: 'calc(100% - 150px)',
          zIndex: 200,
          overflow: 'hidden'
        }}
      >
        <SelectDevice
          {...props}
          {...this.state}
          refresh={this.refresh}
          manageDisk={this.manageDisk}
          addBindDevice={this.addBindDevice}
          refreshStationList={this.refreshStationList}
        />
      </div>
    )
  }

  renderDiskManage () {
    return (
      <ManageDisk
        {...this.props}
        selectedDevice={this.state.selectedDevice}
        backToList={this.backToList}
        onFormatSuccess={this.onFormatSuccess}
      />
    )
  }

  renderLANPwd () {
    return (<SetLANPwd {...this.props} {...this.state} onSuccess={this.onSetLANPwdSuccess} dev={this.state.selectedDevice} />)
  }

  renderNoBound () {
    return (
      <div style={{ width: 320, height: 310, overflow: 'hidden', zIndex: 200, position: 'relative' }}
        className="paper"
      >
        <div
          style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 19 }}
          className="title"
        >
          { i18n.__('Add Device') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            style={{ width: 220, height: 116 }}
            src="./assets/images/pic-login.png"
            alt=""
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RRButton
            label={i18n.__('Add Device')}
            onClick={this.showDeviceToBind}
          />
        </div>
      </div>
    )
  }

  render () {
    console.log('Login', this.props, this.state)
    const props = this.props
    let view = null

    switch (this.state.status) {
      case 'phiLogin':
        view = <PhiLogin {...props} onSuccess={this.phiLoginSuccess} enterLANLogin={this.enterLANLogin} />
        break

      case 'phiNoBound':
        view = this.renderNoBound()
        break

      case 'deviceSelect':
        view = this.renderDeviceSelect(props)
        break

      case 'diskManage':
        view = this.renderDiskManage()
        break

      case 'LANPwd':
        view = this.renderLANPwd()
        break

      default:
        break
    }

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* background */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: this.state.hello ? 0 : 1,
            transition: `opacity ${duration}ms`
          }}
        >
          <img
            style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1000 }}
            src="./assets/images/index.png"
            alt=""
          />
        </div>

        {/* Icon */}
        <div style={{ position: 'absolute', top: 26, left: 44 }}>
          <img
            width={168}
            height={18}
            src="./assets/images/logo.png"
            alt=""
          />
          <div style={{ fontSize: 14, color: '#888a8c', marginTop: 8, letterSpacing: 1.4 }}>
            { i18n.__('Welcome Text') }
          </div>
        </div>

        {/* WebkitAppRegion */}
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            height: 80,
            width: 'calc(100% - 8px)',
            WebkitAppRegion: 'drag'
          }}
        />

        {/* QR Code */}
        <div style={{ position: 'absolute', bottom: 72, right: 48, textAlign: 'center' }}>
          <div style={{ border: '1px solid #BDBDBD', height: 94, width: 94, margin: '8px auto' }} />
          <div style={{ fontSize: 11, color: '#85868c' }}> { i18n.__('Download Phi App Text') } </div>
        </div>

        {/* footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            boxSizing: 'border-box',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            color: '#85868c',
            width: '100%',
            height: 40,
            backgroundColor: '#f3f8ff',
            borderTop: '1px solid rgba(0,0,0,.05)'
          }}
        >
          <div style={{ margin: '0px 24px' }}>
            { i18n.__('Copyright Info') }
          </div>
          <div style={{ margin: '0px 16px' }}>
            { `${i18n.__('Version:')} ${global.config && global.config.appVersion}` }
          </div>
          <div style={{ flexGrow: 1 }} />
          <div style={{ margin: '0px 16px' }}>
            { i18n.__('Phone Number: ') }
          </div>
          <div style={{ fontSize: 18, marginRight: 20 }}>
            { '4007 567 567' }
          </div>
        </div>
        { view }
        <WindowAction />
      </div>
    )
  }
}

export default Login
