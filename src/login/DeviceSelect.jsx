import React from 'react'
import i18n from 'i18n'
import { Divider, IconButton, TextField } from 'material-ui'
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off'
import Visibility from 'material-ui/svg-icons/action/visibility'
import { AutoSizer } from 'react-virtualized'
import ScrollBar from '../common/ScrollBar'
import RRButton from '../common/RRButton'
import { RefreshIcon, HelpIcon } from '../common/Svg'
import { SIButton } from '../common/IconButton'
import Dialog from '../common/PureDialog'
import ConnectionHint from './ConnectionHint'
import ConfirmBind from './ConfirmBind'
import ManageDisk from './ManageDisk'

class DeviceSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dev: null,
      list: null,
      confirm: false,
      format: '' // 'busy', 'success', 'error'
    }

    this.enterSelectDevice = () => {
      this.setState({ list: this.props.mdns })
    }

    this.slDevice = (dev) => {
      this.setState({ dev, confirm: true })
      setTimeout(() => this.setState({ confirm: false }), 2000)
    }

    this.backToList = () => {
      this.setState({ dev: null })
    }

    this.format = () => {
      this.setState({ format: 'busy' })
      setTimeout(() => this.setState({ format: 'error' }), 2000)
      setTimeout(() => this.setState({ format: 'success' }), 4000)
    }

    this.onFormatSuccess = () => {
      this.setState({ LANPwd: true, format: '' })
    }

    this.saveLANPwd = () => {
      this.setState({ LANPwd: false })
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
          cursor: 'pointer'
        }}
        key={dev.address}
        className="paper"
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
          overflow: 'hidden',
          zIndex: 200,
          position: 'relative'
        }}
        className="paper"
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

  renderLANPwd () {
    const iconStyle = { width: 18, height: 18, color: '#31a0f5', padding: 0 }
    const buttonStyle = { width: 26, height: 26, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
      <div
        style={{
          width: 320,
          height: 430,
          overflow: 'hidden',
          zIndex: 200,
          position: 'relative'
        }}
        className="paper"
      >
        <div
          style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 19 }}
          className="title"
        >
          { i18n.__('Set LAN Pwd') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            style={{ width: 218, height: 121 }}
            src="./assets/images/pic-offlinepassword.png"
            alt=""
          />
        </div>
        <div style={{ width: 282, margin: '-20px auto 0px auto', position: 'relative' }}>
          <TextField
            fullWidth
            style={{ marginTop: 12 }}
            hintText={i18n.__('LAN Password Hint')}
            errorStyle={{ position: 'absolute', right: 0, top: 0 }}
            type={this.state.showPwd ? 'text' : 'password'}
            errorText={this.state.pwdError}
            value={this.state.pwd}
            onChange={e => this.onPassword(e.target.value)}
            onKeyDown={this.onKeyDown}
          />
          <TextField
            fullWidth
            style={{ marginTop: 12 }}
            hintText={i18n.__('Password Again Hint')}
            errorStyle={{ position: 'absolute', right: 0, top: 0 }}
            type={this.state.showPwd ? 'text' : 'password'}
            errorText={this.state.pwdError}
            value={this.state.pwd}
            onChange={e => this.onPassword(e.target.value)}
            onKeyDown={this.onKeyDown}
          />
          {/* clear password */}
          <div style={{ position: 'absolute', right: 4, top: 26 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.clearPn}>
              { this.state.showPwd ? <VisibilityOff /> : <Visibility /> }
            </IconButton>
          </div>
          {/* password visibility */}
          <div style={{ position: 'absolute', right: 4, top: 86 }}>
            <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={this.togglePwd}>
              { this.state.showPwd ? <VisibilityOff /> : <Visibility /> }
            </IconButton>
          </div>
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RRButton
            label={i18n.__('Save')}
            onClick={this.saveLANPwd}
          />
        </div>
      </div>
    )
  }

  render () {
    console.log('DeviceSelect', this.state, this.props)
    /* No Bound Device Hint */
    if (!this.state.list) return this.renderNoBound()

    if (this.state.LANPwd) return this.renderLANPwd()

    /* Format Disk */
    if (this.state.dev && !this.state.confirm) {
      return (
        <ManageDisk
          dev={this.state.dev}
          backToList={this.backToList}
          onFormatSuccess={this.onFormatSuccess}
        />
      )
    }

    const arr = [...this.state.list, ...this.state.list].slice(0, 6)

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

        {/* Confirm Device Bind */}
        <Dialog open={!!this.state.confirm} onRequestClose={() => this.setState({ confirm: false })} modal >
          {
            !!this.state.confirm &&
            <ConfirmBind
              backToList={this.backToList}
              onRequestClose={() => this.setState({ confirm: false })}
            />
          }
        </Dialog>
      </div>
    )
  }
}

export default DeviceSelect
