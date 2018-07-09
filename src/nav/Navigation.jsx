import i18n from 'i18n'
import React from 'react'
import { ipcRenderer } from 'electron'
import { FlatButton } from 'material-ui'

import Tasks from './Tasks'
import Policy from './Policy'
import FileMenu from './FileMenu'
import TransMenu from './TransMenu'
import TransCount from './TransCount'
import SettingsMenu from './SettingMenu'
import ChangeDevice from './ChangeDevice'

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
import CacheClean from '../view/CacheClean'
import Device from '../view/Device'
import DiskInfo from '../view/DiskInfo'
import PT from '../view/PT'
import Sleep from '../view/Sleep'
import ClientUpdate from '../view/ClientUpdate'
import FirmwareUpdate from '../view/FirmwareUpdate'
import LANPassword from '../view/LANPassword'
import Power from '../view/Power'
import Samba from '../view/Samba'
import DLNA from '../view/DLNA'
import ResetDevice from '../view/ResetDevice'
import UpdateFirmDialog from '../settings/UpdateFirmDialog'

import Fruitmix from '../common/fruitmix'
import WindowAction from '../common/WindowAction'
import DialogOverlay from '../common/PureDialog'
import { TopLogo, FileManage, TransIcon, DeviceChangeIcon, FuncIcon, BackIcon } from '../common/Svg'

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
      { name: 'pt', View: PT },
      { name: 'sleep', View: Sleep },
      { name: 'clientUpdate', View: ClientUpdate },
      { name: 'firmwareUpdate', View: FirmwareUpdate },
      { name: 'cacheClean', View: CacheClean },
      { name: 'lanPassword', View: LANPassword },
      { name: 'sambe', View: Samba },
      { name: 'dlna', View: DLNA },
      { name: 'power', View: Power },
      { name: 'resetDevice', View: ResetDevice }
    ])

    this.navTo = (nav, target) => {
      if ((nav !== this.state.nav) || (target && target.dirUUID)) {
        this.setState({ nav })
        if (this.state.nav) this.views[this.state.nav].navLeave()
        this.views[nav].navEnter(target)
      }
    }

    this.navToDrive = (driveUUID, dirUUID) => {
      const drives = this.props.apis.drives.data // no drives ?
      const drive = drives && drives.find(d => d.uuid === driveUUID)
      if (!drive) return
      if (drive.tag === 'home') this.navTo('home', { driveUUID, dirUUID })
      else if (drive.type === 'public') this.navTo('public', { driveUUID, dirUUID })
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

      if (group === 'settings' && this.state.nav !== 'settings' && this.views[this.state.nav].navGroup() === 'settings') {
        this.navTo('settings')
      }
    }

    this.showFirmUpdate = true

    this.checkFirmWareAsync = async () => {
      await Promise.delay(1000)
      const res = await this.props.apis.pureRequestAsync('firmwareReady')
      if (res && res.error === '0' && res.result && res.result.tag_name) {
        console.log('newRel', res.result, this.props)
        this.setState({ newRel: res.result })
      }
    }

    this.init = () => {
      this.navTo('home')
      this.timer = setInterval(() => process.env.NODE_ENV !== 'dev' && (this.views[this.state.nav].navGroup() === 'file') &&
        this.props.apis.request('phyDrives'), 3000)
    }

    this.handleTask = (uuid, response, conflicts) => {
      conflicts.forEach((c, index) => {
        let policy
        switch (response[index]) {
          case 'rename':
            policy = ['rename', 'rename']
            break
          case 'replace':
            policy = ['replace', 'replace']
            break
          case 'skip':
            policy = ['skip', 'skip']
            break
          case 'merge':
            policy = ['keep', null]
            break
          case 'overwrite':
            policy = ['keep', null]
            break
          default:
            policy = [null, null]
        }
        this.props.apis.pureRequest('handleTask', { taskUUID: uuid, nodeUUID: c.nodeUUID, policy })
      })
    }

    this.showBoundList = () => {
      this.setState({ changeDevice: true })
    }

    this.jumpTo = (nav) => {
      if (nav === 'changeDevice') this.showBoundList()
      else if (nav === 'settings') this.navGroup('settings')
    }

    this.openTasks = () => {
      this.setState({ showTask: true })
    }

    this.openMovePolicy = (data) => {
      this.setState({ conflicts: data })
    }

    this.openHelp = () => {
      this.setState({ onHelp: true })
    }
  }

  componentDidMount () {
    this.init()
    ipcRenderer.send('START_TRANSMISSION')
    ipcRenderer.on('snackbarMessage', (e, message) => this.props.openSnackBar(message.message))
    ipcRenderer.on('conflicts', (e, args) => this.setState({ conflicts: args }))
    ipcRenderer.on('JUMP_TO', (e, nav) => this.jumpTo(nav))
  }

  componentDidUpdate () {
    if (this.showFirmUpdate && this.props.apis && this.props.apis.device && this.props.apis.device.data) {
      this.showFirmUpdate = false
      this.checkFirmWareAsync().catch(e => console.error('checkFirmWareAsync error', e))
    }
    this.views[this.state.nav].willReceiveProps(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.apis && nextProps.apis.phyDrives && Array.isArray(nextProps.apis.phyDrives.data)) {
      this.hasUSB = nextProps.apis.phyDrives.data.filter(d => d.isUSB).length > 0
    }
  }

  componentWillUnmount () {
    clearInterval(this.timer)
    ipcRenderer.removeAllListeners('snackbarMessage')
    ipcRenderer.removeAllListeners('conflicts')
    ipcRenderer.removeAllListeners('JUMP_TO')
  }

  install (navs) {
    navs.forEach(({ name, View }) => {
      this.views[name] = new View(this)
      this.views[name].on('updated', next => this.setState({ [name]: next }))
    })
  }

  renderChangeDevice () {
    return (
      <ChangeDevice {...this.props} />
    )
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
        fn: () => this.showBoundList()
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
        <div style={{ width: 220, height: 110, overflow: 'hidden' }}>
          <TopLogo style={{ height: 160, width: 427, margin: '-25px 0 0 -105px' }} />
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
              <Icon style={{ width: 40, height: 40, color: '#FFF', opacity: selected ? 1 : 0.7 }} />
              <div style={{ height: 8 }} />
              <div style={{ transform: 'scale(1,.9)', opacity: selected ? 1 : 0.7 }}>
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
      openSnackBar: this.props.openSnackBar
    })
  }

  renderFileGroup () {
    const toolBarStyle = { height: 50, width: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#f8f8f8' }
    const titleStyle = { height: 70, width: '100%', display: 'flex', alignItems: 'center' }
    const isAdmin = this.props.apis.account && this.props.apis.account.data && this.props.apis.account.data.isFirstUser

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          position: 'relative',
          backgroundColor: '#FFF'
        }}
      >
        {/* shadow of FileMenu */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 220,
            width: 20,
            height: '100%',
            backgroundImage: 'linear-gradient(to right, rgba(23,99,207,.03), transparent)'
          }}
        />

        <div style={{ height: '100%', width: 220 }}>
          <FileMenu
            views={this.views}
            nav={this.state.nav}
            navTo={this.navTo}
            hasUSB={!!this.hasUSB}
            device={this.props.selectedDevice.mdev}
          />
        </div>

        <div style={{ height: '100%', width: 'calc(100% - 220px)', position: 'relative' }}>
          {/* Toolbar */}
          { this.views[this.state.nav].renderToolBar({ style: toolBarStyle, openHelp: this.openHelp }) }

          {/* Title and BreadCrumbItem */}
          { this.views[this.state.nav].renderTitle({ style: titleStyle }) }

          {/* File Content */}
          <div style={{ height: 'calc(100% - 120px)', width: '100%' }} id="content-container">
            { this.renderView() }
          </div>
        </div>

        {/* shadow of FileMenu toolbar part */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 220,
            width: 20,
            height: 50,
            backgroundImage: 'linear-gradient(to right, rgba(23,99,207,.03), transparent)'
          }}
        />

        {/* help frame */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: this.state.onHelp ? 0 : '100%',
            width: '100%',
            height: '100%',
            zIndex: 100,
            transition: 'left 175ms'
          }}
          onMouseDown={() => this.setState({ onHelp: false })}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 280,
              width: 30,
              height: '100%',
              backgroundImage: 'linear-gradient(to left, rgba(23,99,207,.03), transparent)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              zIndex: 100,
              top: 0,
              right: 0,
              width: 280,
              height: '100%',
              backgroundColor: '#FFF',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
          >
            { this.views[this.state.nav].renderHelp({ nav: this.state.nav, isAdmin, onClose: () => this.setState({ onHelp: false }) }) }
          </div>
        </div>

        {/* drag item */}
        { this.views[this.state.nav].renderDragItems() }

        {/* Tasks */}
        {
          this.state.showTasks &&
            <Tasks
              apis={this.props.apis}
              onRequestClose={() => this.setState({ showTasks: false }, () => this.views[this.state.nav].navEnter())}
              openMovePolicy={this.openMovePolicy}
            />
        }

        {/* upload policy: upload -> ipc || tasks -> handleTask */}
        <DialogOverlay open={!!this.state.conflicts} onRequestClose={() => this.setState({ conflicts: null })} modal >
          {
            this.state.conflicts &&
              <Policy
                primaryColor="#31a0f5"
                data={this.state.conflicts}
                ipcRenderer={ipcRenderer}
                handleTask={this.handleTask}
                onRequestClose={() => this.setState({ conflicts: null })}
              />
          }
        </DialogOverlay>

        <DialogOverlay open={!!this.state.newRel} onRequestClose={() => this.setState({ newRel: null })} modal transparent >
          {
            this.state.newRel &&
              <UpdateFirmDialog
                {...this.props}
                rel={this.state.newRel}
                device={this.props.apis.device.data}
                onRequestClose={() => this.setState({ newRel: null })}
              />
          }
        </DialogOverlay>
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
    const isAdmin = this.props.apis.account && this.props.apis.account.data && this.props.apis.account.data.isFirstUser
    const isLAN = this.props.account && this.props.account.lan
    if (this.state.nav === 'settings') {
      return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
          <SettingsMenu
            isLAN={!!isLAN}
            isAdmin={isAdmin}
            isCloud={this.props.isCloud}
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
          style={{ height: 60, minWidth: 210 }}
        >
          <FlatButton
            label={title}
            labelStyle={{
              height: 60,
              minWidth: 210,
              lineHeight: '60px',
              fontSize: 22,
              color: '#525a60',
              marginLeft: 8,
              textTransform: 'capitalize'
            }}
            hoverColor="rgba(0,0,0,.04)"
            rippleColor="rgba(0,0,0,.3)"
            icon={<BackIcon style={{ color: '#525a60' }} />}
            onClick={() => this.navTo('settings')}
            style={{ height: 60, minWidth: 210, borderRadius: '0 30px 30px 0' }}
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
    const { isCloud, selectedDevice } = props
    const { mdev, token } = selectedDevice
    if (!token.isFulfilled()) throw new Error('token not fulfilled')

    const userUUID = token.ctx.uuid
    const { address, deviceSN } = mdev
    this.fruitmix = new Fruitmix(address, userUUID, token.data.token, isCloud, deviceSN)
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
