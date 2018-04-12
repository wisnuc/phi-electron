import React from 'react'
import { ipcRenderer } from 'electron'
import { IconButton } from 'material-ui'
import MinIcon from 'material-ui/svg-icons/content/remove'
import MaxIcon from 'material-ui/svg-icons/image/crop-landscape'
import CloseIcon from 'material-ui/svg-icons/navigation/close'

const styles = {
  smallIcon: {
    width: 24,
    height: 24,
    fill: 'rgba(0,0,0,.54)'
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
      <div style={{ position: 'fixed', top: 12, right: 16, display: 'flex', alignItems: 'center' }}>
        <IconButton style={styles.small} iconStyle={styles.smallIcon} onClick={this.minimize} >
          <MinIcon />
        </IconButton>
        <IconButton style={styles.small} iconStyle={styles.smallIcon} onClick={this.toggleMax} >
          <MaxIcon />
        </IconButton>
        <IconButton style={styles.small} iconStyle={styles.smallIcon} onClick={this.hide} >
          <CloseIcon />
        </IconButton>
      </div>
    )
  }
}

export default WindowAction
