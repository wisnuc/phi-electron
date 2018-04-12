import React from 'react'
import { ipcRenderer } from 'electron'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { teal500, pinkA200 } from 'material-ui/styles/colors'

// import Login from './login/NewLogin'
import Login from './login/Login'
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
  fontFamily: 'Roboto, Noto Sans SC, sans-serif',
  color: 'rgba(0,0,0,0.87)',
  palette: { primary1Color: teal500, accent1Color: pinkA200 }
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
    global.mdns.scan()
    setTimeout(() => {
      const mdns = adjustSeq(global.mdnsStore)
      if (mdns.length > 0) {
        this.selectDevice(mdns[0])
      }
    }, 1000)
    this.selectDevice({ address: '' })
    this.setState({ view })
  }

  login () {
    this.setState({ view: 'user' })
  }

  render () {
    let view = null

    switch (this.state.view) {
      case 'login':
        Object.assign(this.state, { theme: defaultTheme })
        view = <Login mdns={adjustSeq(global.mdnsStore)} primaryColor={teal500} {...this.state} />
        break

      case 'user':
        view = <Navigation {...this.state} />
        break

      default:
        break
    }

    return (
      <MuiThemeProvider muiTheme={this.state.theme}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
          { view }
          {/* WebkitAppRegion */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: 12,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              WebkitAppRegion: 'drag'
            }}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Fruitmix
