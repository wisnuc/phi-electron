import React from 'react'
import i18n from 'i18n'
import { IconButton, Paper } from 'material-ui'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'

class DeviceSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  renderDev (dev) {
    return (
      <Paper
        style={{
          width: 240,
          height: 360,
          margin: 24,
          display: 'flex',
          flexDirection: 'cloumn'
        }}
      >
        <div>
          { dev.address }
        </div>
      </Paper>
    )
  }

  render () {
    console.log('DeviceSelect', this.state, this.props)
    const { mdns } = this.props
    return (
      <div style={{ width: 960, height: 480, backgroundColor: '#FAFAFA', overflow: 'hidden', zIndex: 200, position: 'relative' }} >
        <div style={{ width: 960, height: 480, overflow: 'auto' }} >
          <div style={{ height: '100%', minWidth: 'min-content', display: 'flex', alignItems: 'center' }} >
            { mdns.map(dev => this.renderDev(dev)) }
          </div>
        </div>
        <div style={{ height: 36, top: 0, left: 0, width: '100%', position: 'absolute', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 20 }}>
            { i18n.__('Select Device') }
          </div>
          <div style={{ flexGrow: 1 }} />
          <div style={{ maginRight: 16 }}>
            <IconButton
              onClick={this.refresh}
              iconStyle={{ color: 'rgba(0,0,0,.54)' }}
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </div>
      </div>
    )
  }
}

export default DeviceSelect
