import React from 'react'
import { ipcRenderer, remote } from 'electron'
import EventListener from 'react-event-listener'
import { IconButton } from 'material-ui'
import { WinMiniIcon, WinFullIcon, WinNormalIcon, CloseIcon } from '../common/Svg'

const styles = {
  smallIcon: {
    width: 30,
    height: 30,
    color: '#FFF'
  },
  small: {
    width: 30,
    height: 30,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

class WindowAction extends React.PureComponent {
  constructor () {
    super()

    this.hide = () => ipcRenderer.send('HIDE')
    this.toggleMax = () => ipcRenderer.send('TOGGLE_MAX')
    this.minimize = () => ipcRenderer.send('MINIMIZE')
    this.handleResize = () => this.forceUpdate()
  }

  render () {
    const isMaximized = remote.getCurrentWindow().isMaximized()
    return (
      <div style={{ position: 'fixed', top: 11, right: 17, display: 'flex', alignItems: 'center', WebkitAppRegion: 'no-drag' }}>
        <EventListener target="window" onResize={this.handleResize} />
        <IconButton style={styles.small} iconStyle={styles.smallIcon} onClick={this.minimize} >
          <WinMiniIcon />
        </IconButton>
        <div style={{ width: 12 }} />
        <IconButton style={styles.small} iconStyle={styles.smallIcon} onClick={this.toggleMax} >
          { !isMaximized ? <WinFullIcon /> : <WinNormalIcon /> }
        </IconButton>
        <div style={{ width: 12 }} />
        <IconButton style={styles.small} iconStyle={styles.smallIcon} onClick={this.hide} >
          <CloseIcon />
        </IconButton>
      </div>
    )
  }
}

export default WindowAction
