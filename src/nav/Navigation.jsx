import i18n from 'i18n'
import React from 'react'
import { Snackbar } from 'material-ui'
import { ipcRenderer } from 'electron'
import { teal600 } from 'material-ui/styles/colors'
import FileIcon from 'material-ui/svg-icons/file/folder'

import Files from '../view/Home'
import Trans from '../view/Transmission'
import Settings from '../view/Settings'
import Fruitmix from '../common/fruitmix'

const HEADER_HEIGHT = 160

class NavViews extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      nav: null,
      snackBar: ''
    }

    this.views = {}

    this.install([
      { name: 'files', View: Files }
    ])

    this.navTo = (nav, target) => {
      console.log('this.navTo', nav, target, this.state, this.views)
      if (nav !== this.state.nav) {
        this.setState({ nav })
        if (this.state.nav) this.views[this.state.nav].navLeave()
        this.props.setPalette(this.views[nav].primaryColor(), this.views[nav].accentColor())
        this.views[nav].navEnter(target)
      }
    }

    this.init = () => {
      this.navTo('files')
    }

    this.openSnackBar = (message) => {
      this.setState({ snackBar: message })
    }
  }

  componentDidMount () {
    this.init()
    ipcRenderer.send('START_TRANSMISSION')
    ipcRenderer.on('snackbarMessage', (e, message) => this.openSnackBar(message.message))
  }

  componentDidUpdate () {
    this.views[this.state.nav].willReceiveProps(this.props)
  }

  componentWillUnmount () {
    ipcRenderer.removeAllListeners('snackbarMessage')
    ipcRenderer.removeAllListeners('conflicts')
  }

  install (navs) {
    navs.forEach(({ name, View }) => {
      this.views[name] = new View(this)
      this.views[name].on('updated', next => this.setState({ [name]: next }))
    })
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

  renderHeader () {
    const navs = [
      {
        Icon: FileIcon,
        text: i18n.__('Change Device'),
        fn: () => this.props.nav('login')
      },
      {
        Icon: FileIcon,
        text: i18n.__('Files Menu Name'),
        fn: () => this.navTo('files')
      },
      {
        Icon: FileIcon,
        text: i18n.__('Transmission Menu Name'),
        fn: () => this.navTo('trans')
      },
      {
        Icon: FileIcon,
        text: i18n.__('Settings Menu Name'),
        fn: () => this.navTo('settings')
      }
    ]
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, width: 180 }}>
          { 'NAS' }
        </div>
        {
          navs.map(({ Icon, text, fn }) => (
            <div
              style={{
                width: 180,
                height: 120,
                padding: 48,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
              onClick={fn}
            >
              <Icon style={{ width: 72, height: 72 }} color="#FFFFFF" />
              <div>
                { text }
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  render () {
    let view = null
    const props = Object.assign({}, this.props, this.state)

    switch (this.state.view) {
      case 'files':
        view = <Files {...props} />
        break

      case 'trans':
        view = <Trans {...props} />
        break

      case 'settings':
        view = <Settings {...props} />
        break
      default:
        break
    }

    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} >
        {/* Navs */}
        <div style={{ height: HEADER_HEIGHT, width: '100%', position: 'relative', backgroundColor: teal600 }}>
          { this.renderHeader() }
        </div>

        {/* Views */}
        <div style={{ height: 'calc(100% - 160px)', position: 'relative' }}>
          { view }
        </div>

        {/* snackBar */}
        { this.renderSnackBar() }
      </div>
    )
  }
}

/**
  this wrapper is necessary because apis update should be routed to each individual view
  if both apis and views are put into the same component, it is hard to inform view model
  to process states like componentWillReceiveProps does. React props is essentially an
  event routing.
  */

class Navigation extends React.Component {
  constructor (props) {
    super(props)

    /* init apis */
    const token = props.selectedDevice.token
    if (!token.isFulfilled()) throw new Error('token not fulfilled')

    const { address, isCloud } = props.selectedDevice.mdev
    const userUUID = token.ctx.uuid
    this.fruitmix = new Fruitmix(address, userUUID, token.data.token, isCloud, token.data.stationID)
    this.fruitmix.on('updated', (prev, next) => this.setState({ apis: next }))

    this.state = { apis: null }
  }

  componentDidMount () {
    this.fruitmix.start()
  }

  render () {
    return <NavViews apis={this.state.apis} {...this.props} />
  }
}

export default Navigation
