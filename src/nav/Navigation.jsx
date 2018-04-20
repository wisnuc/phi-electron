import i18n from 'i18n'
import React from 'react'
import { Snackbar } from 'material-ui'

import { ipcRenderer } from 'electron'

import Account from './Account'
import FileMenu from './FileMenu'
import TransMenu from './TransMenu'
import SettingsMenu from './SettingMenu'

import Home from '../view/Home'
import Photo from '../view/Photo'
import Music from '../view/Music'
import Docs from '../view/Docs'
import Video from '../view/Video'
import Public from '../view/Public'
import USB from '../view/USB'

import Downloading from '../view/Downloading'
import Uploading from '../view/Uploading'
import Finished from '../view/Finished'

import Settings from '../view/Settings'
import Device from '../view/Device'
import FirmwareUpdate from '../view/FirmwareUpdate'
import Networking from '../view/Networking'
import ClientUpdate from '../view/ClientUpdate'
import Plugin from '../view/Plugin'

import Fruitmix from '../common/fruitmix'
import WindowAction from '../common/WindowAction'
import { FileManage, TransIcon, DeviceChangeIcon, FuncIcon } from '../common/Svg'

const HEADER_HEIGHT = 110

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
      { name: 'photo', View: Photo },
      { name: 'music', View: Music },
      { name: 'docs', View: Docs },
      { name: 'video', View: Video },
      { name: 'public', View: Public },
      { name: 'usb', View: USB },

      { name: 'downloading', View: Downloading },
      { name: 'uploading', View: Uploading },
      { name: 'finished', View: Finished },

      { name: 'settings', View: Settings },
      { name: 'device', View: Device },
      { name: 'firmwareUpdate', View: FirmwareUpdate },
      { name: 'networking', View: Networking },
      { name: 'clientUpdate', View: ClientUpdate },
      { name: 'plugin', View: Plugin }
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
        selected: this.views[this.state.nav].navGroup() === 'file',
        Icon: FileManage,
        text: i18n.__('Files Menu Name'),
        fn: () => this.navGroup('file')
      },
      {
        selected: this.views[this.state.nav].navGroup() === 'transmission',
        Icon: TransIcon,
        text: i18n.__('Transmission Menu Name'),
        fn: () => this.navGroup('transmission')
      },
      {
        selected: this.views[this.state.nav].navGroup() === 'selectingDevice',
        Icon: DeviceChangeIcon,
        text: i18n.__('Change Device'),
        fn: () => this.props.nav('login')
      },
      {
        selected: this.views[this.state.nav].navGroup() === 'settings',
        Icon: FuncIcon,
        text: i18n.__('Settings Menu Name'),
        fn: () => this.navGroup('settings')
      }
    ]
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: HEADER_HEIGHT,
          width: '100%',
          position: 'relative',
          backgroundColor: '#f3f8ff',
          background: 'linear-gradient(to right, #4a95f2, #6363ff)'
        }}
      >
        <div style={{ width: 220, height: '100%' }}>
          <div style={{ color: '#FFF', fontSize: 24, margin: '18px 27px', fontWeight: 900 }}>
            { 'PHINAS' }
          </div>
        </div>
        {
          navs.map(({ Icon, text, fn, selected }) => (
            <div
              key={text}
              style={{
                width: 130,
                paddingTop: 8,
                height: 102,
                color: '#FFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                letterSpacing: '1.4px',
                backgroundColor: selected ? 'rgba(83, 104, 183, 0.17)' : ''
              }}
              onClick={fn}
            >
              <Icon style={{ width: 32, height: 32 }} color="#FFF" />
              <div style={{ height: 8 }} />
              <div style={{ transform: 'scale(1,.9)' }}>
                { text }
              </div>
            </div>
          ))
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
    const toolBarStyle = { height: 50, width: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#e1edfe' }
    const titleStyle = { height: 70, width: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#f3f8ff' }
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%', position: 'relative' }}>
        <div style={{ height: '100%', width: 220 }}>
          <FileMenu
            views={this.views}
            nav={this.state.nav}
            navTo={this.navTo}
          />
        </div>

        <div style={{ height: '100%', width: 'calc(100% - 220px)', position: 'relative' }}>
          {/* Toolbar */}
          { this.views[this.state.nav].renderToolBar({ style: toolBarStyle }) }

          {/* Title and BreadCrumbItem */}
          { this.state.nav === 'home' && this.views[this.state.nav].renderTitle({ style: titleStyle }) }

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

  renderSettings () {
    if (this.state.nav !== 'settings') return this.renderView()
    return (
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <SettingsMenu
          views={this.views}
          nav={this.state.nav}
          navTo={this.navTo}
        />
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
        view = this.renderSettings()
        break
      default:
        break
    }
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} >
        {/* Navs */}
        { this.renderHeader() }

        {/* Account */}
        <div style={{ position: 'fixed', top: 12, right: 147, height: 36 }}>
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
