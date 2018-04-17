import React from 'react'
import i18n from 'i18n'
import { Divider } from 'material-ui'
import { AutoSizer } from 'react-virtualized'
import ScrollBar from '../common/ScrollBar'
import RRButton from '../common/RRButton'
import { RefreshIcon, HelpIcon } from '../common/Svg'
import { SIButton } from '../common/IconButton'

class DeviceSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      list: null
    }

    this.enterSelectDevice = () => {
      this.setState({ list: this.props.mdns })
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
          backgroundColor: '#FFF',
          boxShadow: '0px 10px 20px 0 rgba(23, 99, 207, 0.1)'
        }}
      >
        <div style={{ fontSize: 16, color: '#525a60' }}>
          { stationName }
        </div>
        <div style={{ fontSize: 14, color: '#31a0f5', marginTop: 1 }}>
          { bindStatus }
        </div>
        <div style={{ height: 222 }} />
        {
          data.map(({ des, val }) => (
            <div style={{ height: 27, display: 'flex', alignItems: 'center' }}>
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
        <Divider width={280} />
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

  render () {
    console.log('DeviceSelect', this.state, this.props)
    if (!this.state.list) return this.renderNoBound()
    const arr = [...this.state.list, ...this.state.list]
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
          <div style={{ fontSize: 20, marginLeft: 30, color: '#525a60' }}>
            { i18n.__('Select Device To Bind') }
          </div>
          <div style={{ flexGrow: 1 }} />
          <SIButton onClick={this.refresh} > <RefreshIcon /> </SIButton>
          <div style={{ width: 10 }} />
          <SIButton onClick={this.refresh} > <HelpIcon /> </SIButton>
          <div style={{ width: 32 }} />
        </div>
        <Divider style={{ marginLeft: 30, width: 'calc(100% - 60px)' }} />
        <div style={{ width: '100%', height: 'calc(100% - 50px)', overflowY: arr.length < 5 ? 'hidden' : 'auto', overflowX: 'hidden' }}>
          <div style={{ height: arr.length < 5 ? 'calc((100% - 412px) / 2)' : 0 }} />
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
        </div>
      </div>
    )
  }
}

export default DeviceSelect
