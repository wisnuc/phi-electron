import React from 'react'
import { ipcRenderer } from 'electron'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Login from './login/NewLogin'
// import Login from './login/Login'
import Navigation from './nav/Navigation'
import Device from './common/device'

const adjustSeq = (pre) => {
  let mdns = pre
  if (!global.config || !global.config.global.lastDevice) return mdns
  const lastHost = global.config.global.lastDevice.host
  const lastAddress = global.config.global.lastDevice.address
  const lastLANIP = global.config.global.lastDevice.lanip
  const index = mdns.findIndex(m => (m.host === lastHost || m.address === lastAddress || m.address === lastLANIP))
  if (index > -1) {
    mdns = [mdns[index], ...mdns.slice(0, index), ...mdns.slice(index + 1)]
  }
  return mdns
}

const defaultTheme = getMuiTheme({
  fontFamily: 'Microsoft YaHei, PingFang SC, sans-serif',
  color: '#50529',
  fontSize: 14,
  palette: { primary1Color: '#31a0f5', accent1Color: '#fa5353' }
})

class Fruitmix extends React.Component {
  constructor () {
    super()

    this.selectedDevice = null
    this.user = null

    this.state = {
      view: 'login',
      selectedDevice: new Device({ address: '' }),
      theme: defaultTheme,

      nav: this.nav.bind(this),
      refreshMdns: this.refreshMdns.bind(this),
      login: this.login.bind(this),
      selectDevice: this.selectDevice.bind(this),
      setPalette: this.setPalette.bind(this),
      ipcRenderer
    }

    this.hide = () => ipcRenderer.send('HIDE')

    this.toggleMax = () => ipcRenderer.send('TOGGLE_MAX')

    this.minimize = () => ipcRenderer.send('MINIMIZE')

    setTimeout(() => {
      const mdns = adjustSeq(global.mdnsStore)
      if (mdns.length > 0) {
        this.selectDevice(mdns[0])
      }
    }, 200) // make sure mdns scan finished
  }

  setPalette (primary1Color, accent1Color) {
    this.setState({
      theme: getMuiTheme({
        fontFamily: 'Roboto, Noto Sans SC, sans-serif',
        palette: {
          primary1Color,
          accent1Color
        }
      })
    })
  }

  selectDevice (mdev) {
    if (this.selectedDevice) {
      this.selectedDevice.abort()
      this.selectedDevice.removeAllListeners()
    }

    this.selectedDevice = new Device(mdev)
    this.selectedDevice.on('updated', (prev, next) => this.setState({ selectedDevice: next }))
    this.selectedDevice.start()
  }

  nav (view) {
    this.refreshMdns()
    this.setState({ view })
  }

  refreshMdns () {
    global.mdns.scan()
    this.selectDevice({ address: '' })
    setTimeout(() => {
      const mdns = adjustSeq(global.mdnsStore)
      if (mdns.length > 0) {
        this.selectDevice(mdns[0])
      }
    }, 1000)
  }

  login () {
    this.setState({ view: 'user' })
  }

  render () {
    let view = null

    switch (this.state.view) {
      case 'login':
        Object.assign(this.state, { theme: defaultTheme })
        view = <Login mdns={adjustSeq(global.mdnsStore)} primaryColor="#31a0f5" {...this.state} />
        break

      case 'user':
        view = <Navigation {...this.state} />
        break

      default:
        break
    }

    const nodrag = { position: 'fixed', top: 0, WebkitAppRegion: 'no-drag' }

    return (
      <MuiThemeProvider muiTheme={this.state.theme}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
          { view }
          {/* No WebkitAppRegion */}
          <div style={Object.assign({ left: 0, height: 5, width: '100%' }, nodrag)} />
          <div style={Object.assign({ left: 0, height: 110, width: 5 }, nodrag)} />
          <div style={Object.assign({ right: 0, height: 110, width: 5 }, nodrag)} />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Fruitmix
