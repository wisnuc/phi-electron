import i18n from 'i18n'
import React from 'react'
import { ipcRenderer } from 'electron'
import { Snackbar, FlatButton } from 'material-ui'

import FileMenu from './FileMenu'
import TransMenu from './TransMenu'
import TransCount from './TransCount'
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
import DiskInfo from '../view/DiskInfo'
import Networking from '../view/Networking'
import Sleep from '../view/Sleep'
import ClientUpdate from '../view/ClientUpdate'
import FirmwareUpdate from '../view/FirmwareUpdate'
import LANPassword from '../view/LANPassword'
import Power from '../view/Power'
import Samba from '../view/Samba'
import DLNA from '../view/DLNA'
import ResetDevice from '../view/ResetDevice'

import DeviceSelect from '../login/DeviceSelect'
import Fruitmix from '../common/fruitmix'
import WindowAction from '../common/WindowAction'
import { FileManage, TransIcon, DeviceChangeIcon, FuncIcon, BackIcon } from '../common/Svg'

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
      { name: 'diskInfo', View: DiskInfo },
      { name: 'networking', View: Networking },
      { name: 'sleep', View: Sleep },
      { name: 'clientUpdate', View: ClientUpdate },
      { name: 'firmwareUpdate', View: FirmwareUpdate },
      { name: 'lanPassword', View: LANPassword },
      { name: 'power', View: Power },
      { name: 'sambe', View: Samba },
      { name: 'dlna', View: DLNA },
      { name: 'resetDevice', View: ResetDevice }
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

    this.navToDrive = (driveUUID, dirUUID) => {
      const drives = this.props.apis.drives.data // no drives ?
      const drive = drives.find(d => d.uuid === driveUUID)
      if (drive.tag === 'home') this.navTo('home', { driveUUID, dirUUID })
      else if (drive.tag === 'public') this.navTo('public', { driveUUID, dirUUID })
    }

    this.navGroup = (group) => {
      if (this.state.changeDevice) this.setState({ changeDevice: false })
      if (!this.state.nav || this.views[this.state.nav].navGroup() !== group) {
        switch (group) {
          case 'file':
            this.navTo('home')
            break
          case 'transmission':
            this.navTo('downloading')
            break
          case 'settings':
            this.navTo('settings')
            break
          default:
            break
        }
      }

      if (this.state.nav !== 'settings' && this.views[this.state.nav].navGroup() === 'settings') {
        this.navTo('settings')
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

  renderChangeDevice () {
    console.log('this.props renderChangeDevice', this.props)
    const refresh = () => {}
    return <DeviceSelect {...this.props} list={this.props.mdns} refresh={refresh} />
  }

  renderHeader () {
    const navs = [
      {
        selected: !this.state.changeDevice && this.views[this.state.nav].navGroup() === 'file',
        Icon: FileManage,
        text: i18n.__('Files Menu Name'),
        fn: () => this.navGroup('file')
      },
      {
        selected: !this.state.changeDevice && this.views[this.state.nav].navGroup() === 'transmission',
        Icon: TransIcon,
        text: i18n.__('Transmission Menu Name'),
        fn: () => this.navGroup('transmission')
      },
      {
        selected: !!this.state.changeDevice,
        Icon: DeviceChangeIcon,
        text: i18n.__('Change Device'),
        fn: () => this.setState({ changeDevice: true })
      },
      {
        selected: !this.state.changeDevice && this.views[this.state.nav].navGroup() === 'settings',
        Icon: FuncIcon,
        text: i18n.__('Settings Menu Name'),
        fn: () => this.navGroup('settings')
      }
    ]
    return (
      <div
        style={{
          WebkitAppRegion: 'drag',
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
                WebkitAppRegion: 'no-drag',
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
        {/* Trans Count */}
        <div style={{ position: 'absolute', top: 20, left: 420, width: 30, height: 30 }} > <TransCount /> </div>
      </div>
    )
  }

  renderView () {
    return this.views[this.state.nav].render({
      navTo: this.navTo,
      navToDrive: this.navToDrive,
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
          { ['home', 'public'].includes(this.state.nav) && this.views[this.state.nav].renderTitle({ style: titleStyle }) }

          {/* File Content */}
          <div style={{ height: 'calc(100% - 120px)', width: '100%' }} id="content-container">
            { this.renderView() }
          </div>
        </div>

        {/* shadow of FileMenu */}
        {/*
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 220,
            width: 10,
            height: '100%',
            backgroundImage: 'linear-gradient(to right, rgba(23,99,207,.03), #f3f8ff)'
          }}
        />
        */}

        {/* drag item */}
        { this.views[this.state.nav].renderDragItems() }
      </div>
    )
  }

  renderTrans () {
    return (
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div style={{ height: 50, width: '100%', display: 'flex', alignItems: 'center' }}>
          <TransMenu
            views={this.views}
            nav={this.state.nav}
            navTo={this.navTo}
          />
        </div>

        <div style={{ height: 'calc(100% - 50px)', width: '100%' }} id="content-container">
          { this.renderView() }
        </div>
      </div>
    )
  }

  renderSettings () {
    if (this.state.nav === 'settings') {
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
    const title = this.views[this.state.nav].menuName()
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div
          style={{ height: 60, width: 210 }}
        >
          <FlatButton
            label={title}
            labelStyle={{ height: 60, width: 210, lineHeight: '60px', fontSize: 22, color: '#525a60', marginLeft: 8 }}
            hoverColor="rgba(0,0,0,.04)"
            rippleColor="rgba(0,0,0,.3)"
            icon={<BackIcon style={{ width: 20, height: 20 }} />}
            onClick={() => this.navTo('settings')}
            style={{ height: 60, width: 210, borderRadius: '0 30px 30px 0' }}
          />
        </div>
        <div style={{ height: 'calc(100% - 50px)', width: '100%' }}>
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
        view = this.renderSettings()
        break
      default:
        break
    }
    if (this.state.changeDevice) view = this.renderChangeDevice()
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} >
        {/* Navs */}
        { this.renderHeader() }

        {/* Views */}
        <div style={{ height: 'calc(100% - 110px)', position: 'relative' }}>
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
