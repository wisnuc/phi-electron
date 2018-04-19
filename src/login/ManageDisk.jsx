import i18n from 'i18n'
import React from 'react'
import { Divider, IconButton } from 'material-ui'

import ModeSelect from './ModeSelect'
import DiskModeGuide from './DiskModeGuide'
import DiskFormating from './DiskFormating'

import { HelpIcon, BackIcon } from '../common/Svg'
import { RRButton } from '../common/Buttons'
import Dialog from '../common/PureDialog'

class ManageDisk extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: '',
      showGuide: false,
      format: '' // 'busy', 'success', 'error'
    }

    this.format = () => {
      this.setState({ format: 'busy' })
      setTimeout(() => this.setState({ format: 'error' }), 2000)
      setTimeout(() => this.setState({ format: 'success' }), 4000)
    }

    this.recover = () => {
      this.setState({ recover: 'select' })
    }
  }

  renderInitFormat () {
    const { dev } = this.props
    console.log('ManageDisk', dev)
    const iconStyle = { width: 14, height: 14, fill: '#31a0f5' }
    const buttonStyle = { width: 22, height: 22, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    const storage = [
      { pos: '磁盘1', model: '希捷', size: '2.0T', serial: 'BYUHYSTYGFG' },
      { pos: '磁盘2', model: '希捷', size: '1.0T', serial: 'DKJHFHJISHF' }
    ]
    return (
      <div>
        {
          storage.map(disk => (
            <div
              style={{
                height: 30,
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
        <div
          style={{
            height: 30,
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
        <div style={{ height: 10 }} />
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
        <div style={{ height: 30 }} />
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            disabled={!this.state.mode}
            label={i18n.__('Format Disk in First Boot')}
            onClick={this.format}
          />
        </div>
        <div style={{ height: 30 }} />
      </div>
    )
  }

  renderArrowTips (text, alt) {
    const style = alt ? { fontSize: 14, color: '#fa5353' } : { opacity: 0.7, fontSize: 12, color: '#525a60' }
    return (
      <div style={{ height: 30, width: 'calc(100% - 40px)', marginLeft: 20 }} className="flexCenter">
        <div style={{ height: 19, width: 160 }} className="arrow_box">
          <div style={style}>
            { text }
          </div>
        </div>
      </div>
    )
  }

  renderRecover () {
    const storage = [
      { pos: '磁盘1', posAlt: '磁盘2', model: '希捷', size: '2.0T', mode: 'Single 模式' },
      { pos: '磁盘2', posAlt: '磁盘1', model: '希捷', size: '1.0T', mode: 'Raid 1 模式' }
    ]
    return (
      <div>
        {
          storage.map(disk => (
            <div key={disk.pos} >
              <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
              <div style={{ height: 10 }} />
              <div style={{ height: 30, margin: '0 auto', width: 280, display: 'flex', color: '#888a8c', alignItems: 'center' }} >
                <div style={{ color: '#525a60' }}> { disk.pos } </div>
                <div style={{ flexGrow: 1 }} />
                <div style={{ width: 40 }}> { disk.model } </div>
                <div style={{ width: 32 }}> { disk.size } </div>
              </div>
              <div style={{ height: 30, margin: '0 auto', width: 280, display: 'flex', color: '#888a8c', alignItems: 'center' }} >
                <div style={{ color: '#525a60' }}> { i18n.__('Current Mode') } </div>
                <div style={{ flexGrow: 1 }} />
                <div> { disk.mode } </div>
              </div>
              <div style={{ height: 10 }} />
              { this.renderArrowTips(i18n.__('%s Fortmat Disk Text', disk.posAlt), true) }
              <div style={{ width: 240, height: 40, margin: '0 auto' }}>
                <RRButton
                  label={i18n.__('Import')}
                  onClick={this.format}
                />
              </div>
              <div style={{ height: 30 }} />
            </div>
          ))
        }
      </div>
    )
  }

  renderSelect () {
    return (
      <div>
        { this.renderArrowTips(i18n.__('Format Current Disk')) }
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            label={i18n.__('Create Volume')}
            onClick={this.format}
          />
        </div>
        <div style={{ height: 10 }} />
        { this.renderArrowTips(i18n.__('Recover Volume Text')) }
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            label={i18n.__('Recover Volume')}
            onClick={this.recover}
          />
        </div>
        <div style={{ height: 30 }} />
      </div>
    )
  }

  render () {
    const { dev, backToList, onFormatSuccess } = this.props
    console.log('ManageDisk', dev)
    const init = false
    const recover = !!this.state.recover
    const imgSrc = init ? 'pic-finddisk.png' : 'pic-login.png'
    return (
      <div className="paper" style={{ width: 320, zIndex: 100 }} >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 20 }} className="title">
          <IconButton
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
              height: 32,
              width: 32
            }}
            iconStyle={{ width: 22, height: 22, fill: '#525a60' }}
            onClick={backToList}
          >
            <BackIcon />
          </IconButton>
          { init ? i18n.__('Discover Disk') : recover ? i18n.__('Recover Volume') : i18n.__('Create or Import Disk') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        {
          !recover &&
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                style={{ width: 220, height: 116 }}
                src={`./assets/images/${imgSrc}`}
                alt=""
              />
            </div>
        }

        { init ? this.renderInitFormat() : recover ? this.renderRecover() : this.renderSelect() }

        <Dialog open={!!this.state.showGuide} onRequestClose={() => this.setState({ showGuide: false })}>
          {
            !!this.state.showGuide &&
            <DiskModeGuide
              onRequestClose={() => this.setState({ showGuide: false })}
              powerOff={() => {}}
            />
          }
        </Dialog>

        <Dialog open={!!this.state.format} onRequestClose={() => this.setState({ format: '' })} modal >
          {
            !!this.state.format &&
            <DiskFormating
              status={this.state.format}
              onSuccess={onFormatSuccess}
              onRequestClose={() => this.setState({ format: false })}
            />
          }
        </Dialog>
      </div>
    )
  }
}

export default ManageDisk
