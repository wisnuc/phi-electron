import React from 'react'
import i18n from 'i18n'
import { Divider, CircularProgress } from 'material-ui'
import { AutoSizer } from 'react-virtualized'
import ScrollBar from '../common/ScrollBar'
import { RSButton } from '../common/Buttons'
import { RefreshIcon, HelpIcon } from '../common/Svg'
import { SIButton } from '../common/IconButton'
import Dialog from '../common/PureDialog'
import ConnectionHint from './ConnectionHint'
import ConfirmBind from './ConfirmBind'
import LANLogin from './LANLogin'

class DeviceSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dev: null,
      list: null,
      confirm: false
    }

    this.slDevice = (dev) => {
      if (dev.address === '10.10.9.153') { // LAN Login
        this.setState({ LANLogin: dev })
      } else if (dev.address === '10.10.9.251') { // User Maint
        this.setState({ UserMaint: true })
      } else {
        this.setState({ dev, confirm: true }) // First Boot, Bind Device and Formating Disk
        setTimeout(() => {
          this.setState({ confirm: false })
          this.props.manageDisk(dev)
        }, 2000)
      }
    }

    this.backToList = () => {
      this.setState({ dev: null, LANLogin: null })
    }
  }

  renderDev (dev, index) {
    const [stationName, storage, speed, location] = ['斐迅N2办公', '500GB/2TB', '30Mbps/3Mbps', '上海 电信']
    const data = [
      { des: i18n.__('Device Storage'), val: storage },
      { des: i18n.__('Device Speed'), val: speed },
      { des: i18n.__('Device Location'), val: location }
    ]
    return (
      <div
        style={{
          width: 210,
          padding: '0 20px',
          margin: '30px 7px 0 7px',
          cursor: 'pointer'
        }}
        key={index.toString()}
        className="paper"
        onClick={() => this.slDevice(dev)}
      >
        <div style={{ height: 56, fontSize: 16, color: '#525a60', display: 'flex', alignItems: 'center' }}>
          { stationName }
          { dev.address }
        </div>
        <div style={{ height: 224 }} className="flexCenter">
          <img
            style={{ width: 51, height: 104 }}
            src="./assets/images/ic-n-2.png"
            alt=""
          />
        </div>
        {
          data.map(({ des, val }) => (
            <div style={{ height: 30, display: 'flex', alignItems: 'center' }} key={des}>
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
        <div style={{ height: 10 }} />
      </div>
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
        <CircularProgress size={64} thickness={3} />
      </div>
    )
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render () {
    console.log('DeviceSelect', this.state, this.props)

    const arr = [...this.props.list]

    const title = this.props.type === 'bind' ? i18n.__('Select Device To Bind') : i18n.__('Select Device To Login')

    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#f3f8ff' }}>
        <div style={{ height: 49, width: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 30 }} className="title">
            { title }
          </div>
          <div style={{ flexGrow: 1 }} />
          <SIButton onClick={this.props.refresh} > <RefreshIcon /> </SIButton>
          <div style={{ width: 10 }} />
          <SIButton onClick={() => this.setState({ showHelp: true })} > <HelpIcon /> </SIButton>
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
              backToList={this.backToList}
              onRequestClose={() => this.setState({ confirm: false })}
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
      </div>
    )
  }
}

export default DeviceSelect