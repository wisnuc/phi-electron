import i18n from 'i18n'
import React from 'react'
import { Snackbar } from 'material-ui'

import { ipcRenderer } from 'electron'
import { teal600 } from 'material-ui/styles/colors'
import FileIcon from 'material-ui/svg-icons/file/folder'

import FileMenu from './FileMenu'
import TransMenu from './TransMenu'
import Account from './Account'

import Home from '../view/Home'
import Media from '../view/Media'
import Public from '../view/Public'

import Downloading from '../view/Downloading'
import Uploading from '../view/Uploading'
import Finished from '../view/Finished'

import Settings from '../view/Settings'

import Fruitmix from '../common/fruitmix'
import WindowAction from '../common/WindowAction'

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
      { name: 'home', View: Home },
      { name: 'media', View: Media },
      { name: 'public', View: Public },

      { name: 'downloading', View: Downloading },
      { name: 'uploading', View: Uploading },
      { name: 'finished', View: Finished },

      { name: 'settings', View: Settings }
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

    this.navGroup = (group) => {
      if (!this.state.nav || this.views[this.state.nav].navGroup() !== group) {
        switch (group) {
          case 'file':
            this.navTo('home')
            break
          case 'transmission':
            this.navTo('uploading')
            break
          case 'settings':
            this.navTo('settings')
            break
          default:
            break
        }
      }
    }

    this.init = () => {
      this.navTo('home')
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
        text: i18n.__('Files Menu Name'),
        fn: () => this.navGroup('file')
      },
      {
        Icon: FileIcon,
        text: i18n.__('Transmission Menu Name'),
        fn: () => this.navGroup('transmission')
      },
      {
        Icon: FileIcon,
        text: i18n.__('Change Device'),
        fn: () => this.props.nav('login')
      },
      {
        Icon: FileIcon,
        text: i18n.__('Settings Menu Name'),
        fn: () => this.navGroup('settings')
      }
    ]
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, width: 180 }}>
          { 'NAS' }
        </div>
        <div style={{ flexGrow: 1 }} />
        {
          navs.map(({ Icon, text, fn }) => ([
            <div
              key={text}
              style={{
                width: 180,
                height: 120,
                color: teal600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
              onClick={fn}
            >
              <Icon style={{ width: 64, height: 64 }} color={teal600} />
              <div>
                { text }
              </div>
            </div>,
            <div style={{ flexGrow: 1 }} />
          ]))
        }
      </div>
    )
  }

  renderView () {
    return this.views[this.state.nav].render({
      navTo: this.navTo,
      openSnackBar: this.openSnackBar,
      getDetailStatus: () => false
    })
  }

  renderFileGroup () {
    const toolBarStyle = { height: 64, width: '100%', display: 'flex', alignItems: 'center' }
    const breadCrumbStyle = { height: 64, width: '100%', display: 'flex', alignItems: 'center', color: 'red' }
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%', position: 'relative' }}>
        <div style={{ height: '100%', width: 180 }}>
          <FileMenu
            views={this.views}
            nav={this.state.nav}
            navTo={this.navTo}
          />
        </div>

        <div style={{ height: '100%', width: 'calc(100% - 180px)', position: 'relative' }}>
          {/* Toolbar */}
          { this.views[this.state.nav].renderToolBar({ style: toolBarStyle }) }

          {/* Toolbar */}
          { this.state.nav === 'home' && this.views[this.state.nav].renderBreadCrumbItem({ style: breadCrumbStyle }) }

          {/* File Content */}
          <div style={{ height: 'calc(100% - 64px)', width: '100%' }} id="content-container">
            { this.renderView() }
          </div>
        </div>

        {/* drag item */}
        { this.views[this.state.nav].renderDragItems() }
      </div>
    )
  }

  renderTrans () {
    return (
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div style={{ height: 64, width: '100%', display: 'flex', alignItems: 'center' }}>
          <TransMenu
            views={this.views}
            nav={this.state.nav}
            navTo={this.navTo}
          />
        </div>

        <div style={{ height: 'calc(100% - 64px)', width: '100%' }} id="content-container">
          { this.renderView() }
        </div>
      </div>
    )
  }

  render () {
    if (!this.state.nav) return null
    let view = null
    switch (this.views[this.state.nav].navGroup()) {
      case 'file':
        view = this.renderFileGroup()
        break
      case 'transmission':
        view = this.renderTrans()
        break
      case 'settings':
        view = this.renderView()
        break
      default:
        break
    }
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} >
        {/* Navs */}
        <div
          style={{
            height: HEADER_HEIGHT,
            width: '100%',
            position: 'relative',
            backgroundColor: '#F5F5F5'
          }}
        >
          { this.renderHeader() }
        </div>

        {/* Account */}
        <div style={{ position: 'fixed', top: 16, right: 108, height: 36 }}>
          <Account />
        </div>

        {/* Views */}
        <div style={{ height: 'calc(100% - 160px)', position: 'relative', display: 'flex' }}>
          { view }
        </div>

        {/* snackBar */}
        { this.renderSnackBar() }

        <WindowAction />
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
