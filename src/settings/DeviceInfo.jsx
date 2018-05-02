import React from 'react'
import i18n from 'i18n'
import prettysize from 'prettysize'
import { TextField, Divider, IconButton, CircularProgress } from 'material-ui'
import TV from 'material-ui/svg-icons/hardware/tv'
import CPU from 'material-ui/svg-icons/hardware/memory'
import ActionDns from 'material-ui/svg-icons/action/dns'
import DoneIcon from 'material-ui/svg-icons/action/done'
import Memory from 'material-ui/svg-icons/device/sd-storage'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import StorageIcon from 'material-ui/svg-icons/device/storage'

import { RAIDIcon } from '../common/Svg'

const phaseData = value => prettysize(parseInt(value, 10) * 1024)

class DeviceInfo extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      titleHover: false
    }

    this.updateLabel = (value) => {
      this.setState({ label: value, errorText: '', changed: true })
    }

    this.changeDeviceName = () => {
      this.setState({ progress: true }, () => {
        this.props.selectedDevice.request('renameStation', { name: this.state.label }, (err) => {
          if (err) {
            this.props.openSnackBar(i18n.__('Modify Device Name Failed'))
            this.setState({ modify: false, progress: false, label: '' })
          } else {
            this.props.selectedDevice.request('info', null, (e) => {
              if (e) this.props.openSnackBar(i18n.__('Modify Device Name Failed'))
              else this.props.openSnackBar(i18n.__('Modify Device Name Success'))
              this.setState({ modify: false, progress: false, label: '' })
            })
          }
        })
      })
    }

    this.onKeyDown = (e) => {
      if (e.which === 13 && !this.state.errorText && this.state.label && this.state.label.length) this.changeDeviceName()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.info && this.props.info && (nextProps.info.name !== this.props.info.name)) {
      this.currentLabel = nextProps.info.name
      this.setState({
        label: nextProps.info.name,
        modify: false,
        changed: false
      })
    }
  }

  renderSector (color, percent) {
    const stroke = 40
    const normalizedRadius = 20
    const radius = normalizedRadius + 2 * stroke
    const circumference = normalizedRadius * 2 * Math.PI

    return (
      <div style={{ position: 'relative', width: 80, height: 80 }} className="flexCenter">
        <div style={{ position: 'absolute', top: -60, left: -60, width: radius * 2, height: radius * 2 }} >
          <svg
            height={radius * 2}
            width={radius * 2}
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              stroke="#e7e7e7"
              opacity="0.5"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset: circumference - percent * circumference }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
        </div>
      </div>
    )
  }

  renderCard ({ title, model, usage, color }, index) {
    return (
      <div
        style={{
          position: 'relative',
          width: 320,
          height: 140,
          marginRight: index === 2 ? 0 : 20,
          boxSizing: 'border-box',
          border: 'solid 1px #eaeaea',
          padding: 20
        }}
      >
        <div style={{ fontSize: 20, color: '#525a60' }}>
          { title }
        </div>
        <div style={{ width: 180, fontSize: 12, color: '#85868c', marginTop: 10 }}>
          { model }
        </div>
        <div style={{ fontSize: 16, color: '#85868c', marginTop: 10 }}>
          { `${usage * 100}%` }
        </div>
        <div style={{ position: 'absolute', top: 30, right: 20, width: 80, height: 80 }}>
          { this.renderSector(color, usage) }
        </div>
      </div>
    )
  }

  renderDeviceName () {
    return (
      <div>
        <div style={{ height: 24, fontSize: 14, color: '#85868c', display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
          { i18n.__('Device Name') }
        </div>
        <div
          style={{ height: 48, fontSize: 16, color: 'rgba(0, 0, 0, 0.87)', marginTop: -12 }}
          onMouseMove={() => this.setState({ titleHover: true })}
          onMouseLeave={() => this.setState({ titleHover: false })}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ height: 16 }} />
          {
            this.state.modify
              ? (
                <div style={{ marginTop: -8, display: 'flex' }}>
                  {/* FIXME */}
                  <TextField
                    name="deviceName"
                    inputStyle={{ marginLeft: 10, color: '#525a60' }}
                    onChange={e => this.updateLabel(e.target.value)}
                    maxLength={12}
                    value={this.state.modify ? this.state.label : this.props.info.name}
                    errorText={this.state.errorText}
                    ref={(input) => { if (input && this.state.modify) { input.focus() } }}
                    onKeyDown={this.onKeyDown}
                  />
                  {
                    this.state.progress
                      ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                          <CircularProgress size={16} thickness={2} />
                        </div>
                      )
                      : (
                        <IconButton
                          onClick={() => this.state.changed && this.changeDeviceName()}
                          disabled={!!this.state.errorText || !this.state.label || !this.state.label.length}
                        >
                          <DoneIcon color="#31a0f5" />
                        </IconButton>
                      )
                  }
                </div>
              )
              : (
                <div
                  style={{ display: 'flex', alignItems: 'center', height: 32, marginLeft: 10, color: '#525a60' }}
                  onClick={() => this.setState({ modify: true })}
                >
                  { this.state.label ? this.state.label : this.props.info.name }
                  <div style={{ flexGrow: 1 }} />
                  <ModeEdit color="#31a0f5" style={{ marginRight: 24 }} />
                </div>
              )
          }
          {
            <Divider
              color="rgba(0, 0, 0, 0.87)"
              style={{ opacity: !this.state.modify && this.state.titleHover ? 1 : 0, width: 267 }}
            />
          }
        </div>
      </div>
    )
  }

  renderList (data, index) {
    const { title, value } = data
    return (
      <div style={{ width: 320, height: 60 }} key={index.toString()}>
        <div style={{ height: 24, fontSize: 14, color: '#85868c', display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
          { title }
        </div>
        <div style={{ height: 36, fontSize: 16, color: '#525a60', display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
          { value }
        </div>
        <div style={{ height: 1, width: 267, backgroundColor: '#eaeaea', opacity: 0.98 }} />
      </div>
    )
  }

  render () {
    if (!this.props.device || !this.props.storage || !this.props.boot || !this.props.info) return <div />

    const { cpuInfo, memInfo, ws215i } = this.props.device
    const volume = this.props.storage.volumes.find(v => v.fileSystemUUID === this.props.boot.current)

    /* File System */
    const fsIcon = RAIDIcon
    const fsTitles = [
      i18n.__('FileSystem Type'),
      i18n.__('Num of Disks'),
      i18n.__('Disk Array Mode')
    ]
    const fsValues = [
      volume.fileSystemType.toUpperCase(),
      volume.total,
      volume.usage.data.mode.toUpperCase()
    ]

    /* storage */
    const storageIcon = StorageIcon
    const storageTitles = [
      i18n.__('Total Capacity'),
      i18n.__('User Data Size'),
      i18n.__('Avail Size')
    ]

    const storageValues = [
      prettysize(volume.usage.overall.deviceSize),
      prettysize(volume.usage.data.size),
      prettysize(volume.usage.overall.free)
    ]

    /* CPU */
    const cpuIcon = CPU

    const cpuTitles = [
      i18n.__('CPU Num'),
      i18n.__('CPU Name'),
      i18n.__('CPU Cache')
    ]

    const cpuValues = [
      cpuInfo.length,
      cpuInfo[0].modelName,
      phaseData(cpuInfo[0].cacheSize)
    ]

    /* Memory */
    const memTitles = [
      i18n.__('Memory Total'),
      i18n.__('Memory Free'),
      i18n.__('Memory Available')
    ]

    const menIcon = Memory

    const memValues = [
      phaseData(memInfo.memTotal),
      phaseData(memInfo.memFree),
      phaseData(memInfo.memAvailable)
    ]

    const graphData = [
      { title: 'CPU1', model: cpuInfo[0].modelName, usage: 0.33, color: '#31a0f5' },
      { title: 'CPU2', model: cpuInfo[1].modelName, usage: 0.43, color: '#5fc315' },
      { title: i18n.__('Memory'), model: '1GB DDR3 16000MHz', usage: 0.5, color: '#ffb400' }
    ]

    const listData = [
      { title: 'Device Model', value: 'N2' },
      { title: 'Current IP', value: '192.168.2.23' },
      { title: 'MAC Address', value: '20:25:45:31:13' },
      { title: 'Client Version', value: '1.0.13' },
      { title: 'Hardware Version', value: '1.0.0.9' },
      { title: 'Firmware Version', value: '20.2.0.1' }
    ]

    return (
      <div
        style={{ position: 'relative', width: '100%', height: '100%' }}
        onTouchTap={() => !this.state.progress && this.setState({ modify: false, label: '' })}
      >
        <div style={{ height: 20 }} />
        <div style={{ width: 1000, height: 140, margin: '20px auto', display: 'flex', alignItems: 'center' }}>
          { graphData.map((data, index) => this.renderCard(data, index)) }
        </div>
        <div style={{ height: 20 }} />
        <div
          style={{
            width: 1000,
            height: 240,
            margin: '0 auto',
            display: 'grid',
            gridGap: 20,
            gridTemplateColumns: '1fr 1fr 1fr'
          }}
        >
          { this.renderDeviceName() }
          { listData.map((data, index) => this.renderList(data, index))}
        </div>
      </div>
    )
  }
}

export default DeviceInfo
