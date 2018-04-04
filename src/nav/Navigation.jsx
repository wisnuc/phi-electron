import i18n from 'i18n'
import React from 'react'
import { IconButton, Snackbar } from 'material-ui'
import ListIcon from 'material-ui/svg-icons/action/list'
import GridIcon from 'material-ui/svg-icons/action/view-module'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder'
import BackwardIcon from 'material-ui/svg-icons/navigation/arrow-back'
import ForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward'

import { ipcRenderer } from 'electron'
import { teal600 } from 'material-ui/styles/colors'
import FileIcon from 'material-ui/svg-icons/file/folder'

import FileMenu from './FileMenu'
import Search from './Search'

import Home from '../view/Home'
import Share from '../view/Share'
import Media from '../view/Media'
import Public from '../view/Public'
import Account from '../view/Account'
import Download from '../view/Download'
import Settings from '../view/Settings'
import Transmission from '../view/Transmission'

import Fruitmix from '../common/fruitmix'
import FlatButton from '../common/FlatButton'

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
      { name: 'share', View: Share },
      { name: 'download', View: Download },
      { name: 'account', View: Account },
      { name: 'transmission', View: Transmission },
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
            this.navTo('transmission')
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
        text: i18n.__('Change Device'),
        fn: () => this.props.nav('login')
      },
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
        text: i18n.__('Settings Menu Name'),
        fn: () => this.navGroup('settings')
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
                color: teal600,
                cursor: 'point',
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
    const color = 'rgba(0,0,0,.54)'
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
        <div style={{ height: '100%', width: 180 }}>
          <FileMenu
            views={this.views}
            nav={this.state.nav}
            navTo={this.navTo}
          />
        </div>

        <div style={{ height: '100%', width: 'calc(100% - 180px)', position: 'relative' }}>
          {/* Toolbar */}
          <div style={{ height: 64, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 48 }} />
            <IconButton onTouchTap={() => this.refresh()} tooltip={i18n.__('Refresh')} >
              <BackwardIcon color={color} />
            </IconButton>
            <IconButton onTouchTap={() => this.refresh()} tooltip={i18n.__('Refresh')} >
              <ForwardIcon color={color} />
            </IconButton>
            <IconButton onTouchTap={() => this.refresh()} tooltip={i18n.__('Refresh')} >
              <RefreshIcon color={color} />
            </IconButton>
            <FlatButton
              onTouchTap={() => this.toggleDialog('gridView')}
              label={i18n.__('Upload')}
              icon={<GridIcon color={color} />}
            />
            <FlatButton
              onTouchTap={() => this.toggleDialog('gridView')}
              label={i18n.__('Dowload')}
              icon={<GridIcon color={color} />}
            />
            <FlatButton
              onTouchTap={() => this.toggleDialog('gridView')}
              label={i18n.__('Delete')}
              icon={<ListIcon color={color} />}
            />
            <FlatButton
              onTouchTap={() => this.toggleDialog('gridView')}
              label={this.state.gridView ? i18n.__('List View') : i18n.__('Grid View')}
              icon={this.state.gridView ? <ListIcon color={color} /> : <GridIcon color={color} />}
            />
            <FlatButton
              label={i18n.__('Create New Folder')}
              onTouchTap={() => this.toggleDialog('createNewFolder')}
              icon={<FileCreateNewFolder color={color} />}
            />
            <Search fire={() => {}} />
          </div>

          {/* File Content */}
          <div style={{ height: 'calc(100% - 64px)', width: '100%' }}>
            { this.renderView() }
          </div>
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
        view = this.renderView()
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

        {/* Views */}
        <div style={{ height: 'calc(100% - 160px)', position: 'relative', display: 'flex' }}>
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
