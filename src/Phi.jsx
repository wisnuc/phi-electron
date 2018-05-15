import React from 'react'
import { ipcRenderer } from 'electron'
import { Snackbar } from 'material-ui'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Login from './login/Login'
import Navigation from './nav/Navigation'

import PhiAPI from './common/PhiAPI'
import Account from './common/Account'

const defaultTheme = getMuiTheme({
  fontFamily: 'Microsoft YaHei, PingFang SC, sans-serif',
  color: '#50529',
  fontSize: 14,
  palette: { primary1Color: '#31a0f5', accent1Color: '#fa5353' }
})

class Fruitmix extends React.Component {
  constructor () {
    super()

    this.state = {
      ipcRenderer,
      snackBar: '',
      view: 'login',
      account: null,
      phi: new PhiAPI(),
      phiLogin: this.phiLogin.bind(this),
      deviceLogin: this.deviceLogin.bind(this),
      openSnackBar: this.openSnackBar.bind(this)
    }
  }

  openSnackBar (message) {
    this.setState({ snackBar: message })
  }

  phiLogin (user) {
    this.setState({ account: user })
  }

  deviceLogin () {
    this.setState({ view: 'device' })
  }

  logout () {
    this.setState({ account: null, view: 'login' })
  }

  renderSnackBar () {
    return (
      <Snackbar
        open={!!this.state.snackBar}
        message={this.state.snackBar}
        autoHideDuration={4000}
        onRequestClose={() => this.setState({ snackBar: '' })}
      />
    )
  }

  render () {
    const view = this.state.view === 'login' ? <Login {...this.state} />
      : this.state.view === 'device' ? <Navigation {...this.state} /> : <div />

    const nodrag = { position: 'fixed', top: 0, WebkitAppRegion: 'no-drag' }
    return (
      <MuiThemeProvider muiTheme={defaultTheme}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#FFF' }}>
          {/* login or device */}
          { view }

          {/* Account */}
          {
            this.state.account &&
              <div style={{ position: 'fixed', top: 12, right: 147, height: 36, WebkitAppRegion: 'no-drag' }}>
                <Account user={this.state.account} logout={this.logout} />
              </div>
          }

          {/* snackBar */}
          { this.renderSnackBar() }

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
