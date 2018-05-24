import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'
import { AutoSizer } from 'react-virtualized'

import Device from './Device'
import LANLogin from './LANLogin'
import CloudLogin from './CloudLogin'
import ConfirmBind from './ConfirmBind'
import ConnectionHint from './ConnectionHint'

import Dialog from '../common/PureDialog'
import ScrollBar from '../common/ScrollBar'
import { RSButton, LIButton } from '../common/Buttons'
import { RefreshIcon, HelpIcon, AddDeviceIcon, BackIcon } from '../common/Svg'
import CircularLoading from '../common/CircularLoading'

class DeviceSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dev: null,
      list: null,
      confirm: false
    }

    this.bindVolume = (dev) => {
      this.setState({ confirm: false, dev })
      this.props.manageDisk(dev)
    }

    this.slDevice = (dev) => {
      console.log('this.slDevice', dev)
      if (this.props.type === 'BOUNDLIST' && dev.systemStatus() === 'ready') {
        this.setState({ dev, cloudLogin: dev })
      } else if (this.props.type === 'BOUNDLIST' && dev.systemStatus() === 'noBoundVolume') {
        this.bindVolume(dev)
      } else if (this.props.type === 'LANTOLOGIN') {
        this.setState({ dev, LANLogin: dev })
      } else if (this.props.type === 'LANTOBIND') {
        this.setState({ dev, confirm: true })
      } else if (this.props.type === 'CHANGEDEVICE') {
        const currentSN = this.props.selectedDevice && this.props.selectedDevice.mdev && this.props.selectedDevice.mdev.deviceSN
        const newSN = dev && dev.mdev && dev.mdev.deviceSN
        if (currentSN && (currentSN === newSN)) return // the same device
        this.setState({ dev, cloudLogin: dev })
        console.log('CHANGEDEVICE', this.props, this.state, dev)
      }
    }
  }

  renderDev (dev, index) {
    return (
      <Device
        {...this.props}
        slDevice={this.slDevice}
        key={index.toString()}
        mdev={!['BOUNDLIST', 'CHANGEDEVICE'].includes(this.props.type) ? dev : null}
        cdev={['BOUNDLIST', 'CHANGEDEVICE'].includes(this.props.type) ? dev : null}
      />
    )
  }

  renderDevs (arr) {
    return (
      <AutoSizer>
        {({ height, width }) => {
          const count = Math.floor((width - 1100) / 264) + 4
          const rowCount = Math.ceil(arr.length / count)
          if (rowCount === 1) {
            return (
              <div className="flexCenter" style={{ width, height, marginTop: -15 }}>
                { arr.map((dev, i) => this.renderDev(dev, i)) }
              </div>
            )
          }

          const rowRenderer = ({ key, index, style, isScrolling }) => {
            const currArr = arr.slice(index * count, index * count + count)
            return (
              <div key={key} style={style} >
                <div
                  style={{
                    minWidth: 'min-content',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: index > 0 ? -40 * index : 0
                  }}
                >
                  {
                    Array.from({ length: count }).map((v, i) => {
                      const dev = currArr[i]
                      if (dev) return this.renderDev(dev, i)
                      return <div style={{ width: 250, margin: '30px 7px 0 7px', opacity: 0 }} key={i.toString()} />
                    })
                  }
                </div>
              </div>
            )
          }

          const rowHeight = 440
          const allHeight = rowHeight * rowCount
          return (
            <ScrollBar
              allHeight={allHeight}
              height={height}
              width={width}
              estimatedRowSize={rowHeight}
              rowHeight={rowHeight}
              rowRenderer={rowRenderer}
              rowCount={rowCount}
              style={{ outline: 'none' }}
            />
          )
        }}
      </AutoSizer>
    )
  }

  renderNoDev () {
    return (
      <div style={{ height: '100%', width: '100%' }} className="flexCenter">
        <div>
          <img
            width={280}
            height={150}
            src="./assets/images/pic-nodevice.png"
            alt=""
          />
          <div style={{ width: '100%', textAlign: 'center', color: '#31a0f5', marginTop: -10 }}>
            { i18n.__('Not Found Any Device ?') }
          </div>
        </div>
      </div>
    )
  }

  renderUserMaint () {
    return (
      <div style={{ width: 320, zIndex: 200, position: 'relative' }} className="paper" >
        <div
          style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 19 }}
          className="title"
        >
          { i18n.__('User Maint Title') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            style={{ width: 207, height: 117 }}
            src="./assets/images/pic-diskchange.png"
            alt=""
          />
        </div>
        <div style={{ width: '100%', textAlign: 'center', color: '#fa5353' }}>
          { i18n.__('User Maint Text')}
        </div>
        <div style={{ height: 70, width: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <div style={{ flexGrow: 1 }} />
          <RSButton label={i18n.__('Got It')} onClick={() => this.setState({ UserMaint: false })} />
        </div>
      </div>
    )
  }

  renderLoading () {
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter">
        <CircularLoading />
      </div>
    )
  }

  render () {
    console.log('DeviceSelect', this.state, this.props)

    const arr = [...this.props.list]

    const title = this.props.type === 'LANTOBIND' ? i18n.__('Select Device To Bind')
      : this.props.type === 'LANTOLOGIN' ? i18n.__('Select LAN Device To Login') : i18n.__('Select Device To Login')

    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#f3f8ff' }}>
        <div style={{ height: 49, width: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 30, display: 'flex', alignItems: 'center' }} className="title">
            {
              this.props.type === 'LANTOBIND' &&
                <LIButton onClick={this.props.refreshStationList} tooltip={i18n.__('Return')}>
                  <BackIcon />
                </LIButton>
            }
            { title }
          </div>
          <div style={{ flexGrow: 1 }} />
          {
            ['BOUNDLIST', 'CHANGEDEVICE'].includes(this.props.type) &&
              <LIButton onClick={this.props.addBindDevice} tooltip={i18n.__('Add Device')}> <AddDeviceIcon /> </LIButton>
          }
          <LIButton onClick={this.props.refresh} tooltip={i18n.__('Refresh')}> <RefreshIcon /> </LIButton>
          <LIButton onClick={() => this.setState({ showHelp: true })} tooltip={i18n.__('Help')}> <HelpIcon /> </LIButton>
          <div style={{ width: 32 }} />
        </div>
        <Divider style={{ marginLeft: 30, width: 'calc(100% - 60px)' }} />

        <div style={{ width: '100%', height: 'calc(100% - 50px)' }} >
          { this.props.loading ? this.renderLoading() : arr.length ? this.renderDevs(arr) : this.renderNoDev() }
        </div>

        {/* Connection Hint */}
        <Dialog open={!!this.state.showHelp} onRequestClose={() => this.setState({ showHelp: false })}>
          { !!this.state.showHelp && <ConnectionHint onRequestClose={() => this.setState({ showHelp: false })} /> }
        </Dialog>

        {/* Confirm Device Bind */}
        <Dialog open={!!this.state.confirm} onRequestClose={() => this.setState({ confirm: false })} modal >
          {
            !!this.state.confirm &&
            <ConfirmBind
              {...this.props}
              dev={this.state.dev}
              onSuccess={() => this.bindVolume(this.state.dev)}
              onFailed={() => this.setState({ confirm: false })}
            />
          }
        </Dialog>

        {/* Device boot failed, due to disk changed */}
        <Dialog open={!!this.state.UserMaint} onRequestClose={() => this.setState({ UserMaint: null })} modal >
          { !!this.state.UserMaint && this.renderUserMaint() }
        </Dialog>

        {/* LANLogin */}
        <Dialog open={!!this.state.LANLogin} onRequestClose={() => this.setState({ LANLogin: null })} modal >
          {
            !!this.state.LANLogin &&
              <LANLogin
                {...this.props}
                dev={this.state.LANLogin}
                onRequestClose={() => this.setState({ LANLogin: null })}
              />
          }
        </Dialog>

        {/* CloudLogin */}
        <Dialog open={!!this.state.cloudLogin} onRequestClose={() => this.setState({ cloudLogin: null })} modal transparent >
          {
            !!this.state.cloudLogin &&
              <CloudLogin
                {...this.props}
                dev={this.state.cloudLogin}
                onRequestClose={() => this.setState({ cloudLogin: null })}
              />
          }
        </Dialog>
      </div>
    )
  }
}

export default DeviceSelect
