import React from 'react'
import { ipcRenderer } from 'electron'
import { IconButton } from 'material-ui'
import { MinIcon, MaxIcon, CloseIcon } from '../common/Svg'

const styles = {
  smallIcon: {
    width: 16,
    height: 16,
    fill: '#FFF'
  },
  small: {
    width: 32,
    height: 32,
    padding: 4,
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
  }

  render () {
    return (
      <div style={{ position: 'fixed', top: 11, right: 17, display: 'flex', alignItems: 'center' }}>
        <IconButton style={styles.small} iconStyle={styles.smallIcon} onClick={this.minimize} >
          <MinIcon />
        </IconButton>
        <div style={{ width: 12 }} />
        <IconButton style={styles.small} iconStyle={styles.smallIcon} onClick={this.toggleMax} >
          <MaxIcon />
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
