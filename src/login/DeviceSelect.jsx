import React from 'react'
import i18n from 'i18n'
import { Divider, IconButton } from 'material-ui'
import { AutoSizer } from 'react-virtualized'
import ScrollBar from '../common/ScrollBar'
import RRButton from '../common/RRButton'
import { RefreshIcon, HelpIcon } from '../common/Svg'
import { SIButton } from '../common/IconButton'
import ModeSelect from './ModeSelect'
import Dialog from '../common/PureDialog'
import DiskModeGuide from './DiskModeGuide'
import ConnectionHint from './ConnectionHint'

class DeviceSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      list: null,
      dev: null
    }

    this.enterSelectDevice = () => {
      this.setState({ list: this.props.mdns })
    }

    this.slDevice = (dev) => {
      this.setState({ dev })
    }

    this.backToList = () => {
      this.setState({ dev: null })
    }
  }

  renderDev (dev) {
    const [stationName, bindStatus, storage, speed, location] = ['斐迅N2办公', '待绑定', '500GB/2TB', '30Mbps/3Mbps', '上海 电信']
    const data = [
      { des: i18n.__('Device Storage'), val: storage },
      { des: i18n.__('Device Speed'), val: speed },
      { des: i18n.__('Device Location'), val: location }
    ]
    return (
      <div
        style={{
          width: 210,
          height: 340,
          padding: 20,
          margin: '16px 8px',
          cursor: 'pointer',
          backgroundColor: '#FFF',
          boxShadow: '0px 10px 20px 0 rgba(23, 99, 207, 0.1)'
        }}
        key={dev.address}
        onClick={() => this.slDevice(dev)}
      >
        <div style={{ fontSize: 16, color: '#525a60' }}>
          { stationName }
        </div>
        <div style={{ fontSize: 14, color: '#31a0f5', marginTop: 1 }}>
          { bindStatus }
        </div>
        <div style={{ height: 222 }} className="flexCenter">
          <img
            style={{ width: 51, height: 104 }}
            src="./assets/images/ic-n-2.png"
            alt=""
          />
        </div>
        {
          data.map(({ des, val }) => (
            <div style={{ height: 27, display: 'flex', alignItems: 'center' }} key={des}>
              <div style={{ color: '#525a60' }}>
                { des }
              </div>
              <div style={{ flexGrow: 1 }} />
              <div style={{ color: '#888a8c' }}>
                { val }
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  renderDevs (arr) {
    return (
      <AutoSizer>
        {({ height, width }) => {
          const rowRenderer = ({ key, index, style, isScrolling }) => (
            <div key={key} style={style} >
              <div style={{ minWidth: 'min-content', display: 'flex', justifyContent: 'center' }}>
                { arr.slice(index * 4, index * 4 + 4).map(dev => this.renderDev(dev)) }
              </div>
            </div>
          )
          const rowHeight = 412
          const rowCount = Math.ceil(arr.length / 4)
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
            style={{ width: 173, height: 120 }}
            src="./assets/images/pic-nodevice.png"
            alt=""
          />
          <div style={{ width: '100%', textAlign: 'center', color: '#31a0f5', marginTop: 7 }}>
            { i18n.__('Not Found Any Device ?')}
          </div>
        </div>
      </div>
    )
  }

  renderNoBound () {
    return (
      <div
        style={{
          width: 320,
          height: 310,
          backgroundColor: '#FAFAFA',
          overflow: 'hidden',
          zIndex: 200,
          position: 'relative',
          boxShadow: '0px 20px 30px 0 rgba(23, 99, 207, 0.12)'
        }}
      >
        <div
          style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 19 }}
          className="title"
        >
          { i18n.__('Add Device') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            style={{ width: 220, height: 116 }}
            src="./assets/images/pic-login.png"
            alt=""
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RRButton
            label={i18n.__('Add Device')}
            onClick={this.enterSelectDevice}
          />
        </div>
      </div>
    )
  }

  renderFormatDisk (dev) {
    const iconStyle = { width: 14, height: 14, fill: '#31a0f5' }
    const buttonStyle = { width: 22, height: 22, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    const storage = [
      { pos: '磁盘1', model: '希捷', size: '2.0T', serial: 'BYUHYSTYGFG' },
      { pos: '磁盘2', model: '希捷', size: '1.0T', serial: 'DKJHFHJISHF' }
    ]
    return (
      <div className="paper" style={{ width: 320, height: 491, zIndex: 100 }} >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 19 }} className="title">
          { i18n.__('Discover Disk') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 184, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            style={{ width: 220, height: 116 }}
            src="./assets/images/pic-finddisk.png"
            alt=""
          />
        </div>
        <div style={{ height: 8 }} />
        {
          storage.map(disk => (
            <div
              style={{
                height: 22,
                width: 'calc(100% - 40px)',
                marginLeft: 20,
                display: 'flex',
                color: '#888a8c',
                alignItems: 'center'
              }}
              key={disk.pos}
            >
              <div style={{ color: '#525a60' }}> { disk.pos } </div>
              <div style={{ flexGrow: 1 }} />
              <div style={{ width: 32 }}> { disk.model } </div>
              <div style={{ width: 32 }}> { disk.size } </div>
              <div style={{ width: 120 }}> { disk.serial } </div>
            </div>
          ))
        }
        <div style={{ height: 18 }} />
        <div
          style={{
            height: 22,
            width: 'calc(100% - 40px)',
            marginLeft: 20,
            display: 'flex',
            color: '#888a8c',
            alignItems: 'center'
          }}
        >
          <div style={{ color: '#525a60' }}> { i18n.__('Select Disk Mode') } </div>
          <div style={{ flexGrow: 1 }} />
          <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={() => this.setState({ showGuide: true })}>
            <HelpIcon />
          </IconButton>
        </div>
        <div style={{ height: 6 }} />
        <div style={{ height: 50, width: 'calc(100% - 40px)', marginLeft: 20, display: 'flex', alignItems: 'center' }} >
          <ModeSelect
            selected={this.state.mode === 'single'}
            label={i18n.__('Single Mode')}
            onClick={() => this.setState({ mode: this.state.mode === 'single' ? '' : 'single' })}
          />
          <div style={{ width: 10 }} />
          <ModeSelect
            selected={this.state.mode === 'raid1'}
            label={i18n.__('Raid1 Mode')}
            onClick={() => this.setState({ mode: this.state.mode === 'raid1' ? '' : 'raid1' })}
          />
        </div>
        <div style={{ height: 34 }} />
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            disabled={!this.state.mode}
            label={i18n.__('Format Disk in First Boot')}
            onClick={this.login}
          />
        </div>
        <Dialog open={!!this.state.showGuide} onRequestClose={() => this.setState({ showGuide: false })}>
          {
            !!this.state.showGuide &&
            <DiskModeGuide
              onRequestClose={() => this.setState({ showGuide: false })}
              powerOff={() => {}}
            />
          }
        </Dialog>
      </div>
    )
  }

  render () {
    console.log('DeviceSelect', this.state, this.props)
    /* No Bound Device Hint */
    if (!this.state.list) return this.renderNoBound()

    /* Format Disk */
    if (this.state.dev) return this.renderFormatDisk(this.state.dev)
    const arr = this.state.list
    return (
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 150px)',
          left: 0,
          top: 110,
          zIndex: 200,
          overflow: 'hidden',
          position: 'absolute',
          backgroundColor: '#f3f8ff'
        }}
      >
        <div style={{ height: 50, width: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 30 }} className="title">
            { i18n.__('Select Device To Bind') }
          </div>
          <div style={{ flexGrow: 1 }} />
          <SIButton onClick={this.refresh} > <RefreshIcon /> </SIButton>
          <div style={{ width: 10 }} />
          <SIButton onClick={() => this.setState({ showHelp: true })} > <HelpIcon /> </SIButton>
          <div style={{ width: 32 }} />
        </div>
        <Divider style={{ marginLeft: 30, width: 'calc(100% - 60px)' }} />
        <div style={{ width: '100%', height: 'calc(100% - 50px)', overflowY: arr.length < 5 ? 'hidden' : 'auto', overflowX: 'hidden' }}>
          <div style={{ height: (arr.length && (arr.length < 5)) ? 'calc((100% - 412px) / 2)' : 0 }} />
          { arr.length ? this.renderDevs(arr) : this.renderNoDev() }
        </div>

        {/* Connection Hint */}
        <Dialog open={!!this.state.showHelp} onRequestClose={() => this.setState({ showHelp: false })}>
          { !!this.state.showHelp && <ConnectionHint onRequestClose={() => this.setState({ showHelp: false })} /> }
        </Dialog>
      </div>
    )
  }
}

export default DeviceSelect
