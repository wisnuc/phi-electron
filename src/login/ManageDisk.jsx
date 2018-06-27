import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'
import prettysize from 'prettysize'

import DiskModeGuide from './DiskModeGuide'
import DiskFormating from './DiskFormating'

import Dialog from '../common/PureDialog'
import { SmallHelpIcon, BackIcon } from '../common/Svg'
import interpretModel from '../common/diskModel'
import { RRButton, ModeSelect, LIButton, SIButton } from '../common/Buttons'

class ManageDisk extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: '',
      status: this.volumeStatus() === 'init' ? 'init' : 'select', // init, select, recover, repair
      showGuide: false,
      format: '' // 'busy', 'success', 'error'
    }

    this.format = (target) => {
      this.setState({ format: 'busy' })
      const args = { target, mode: this.state.mode }
      console.log('this.format args', args)
      this.props.selectedDevice.request('boundVolume', args, (err, res) => {
        console.log('boundVolume', err, res)
        if (err) this.setState({ format: 'error', error: err })
        else this.setState({ format: 'success' })
      })
    }

    this.recover = (volume) => {
      console.log('recover volume', volume)
      this.setState({ format: 'busy' })
      this.props.selectedDevice.request('importVolume', { volumeUUID: volume.uuid }, (err, res) => {
        console.log('recover volume res', err, res)
        if (err) this.setState({ format: 'error', error: err })
        else this.setState({ format: 'success' })
      })
    }

    this.enterCreate = () => {
      this.setState({ status: 'init' })
    }

    this.enterRecover = () => {
      this.setState({ status: 'recover' })
    }

    this.enterRepair = () => {
      this.setState({ status: 'repair' })
    }
  }

  availableVolumes () {
    const { storage, boundUser } = this.props.selectedDevice.boot.data
    return storage.volumes.filter(v => !v.isMissing && v.isMounted && Array.isArray(v.users) &&
      v.users.find(u => u.isFirstUser && u.phicommUserId === boundUser.phicommUserId))
  }

  brokenVolume () {
    const { boundVolume, storage } = this.props.selectedDevice.boot.data
    if (!boundVolume || !boundVolume.uuid) return false
    const volume = storage && storage.volumes.find(v => v.isMissing && v.isMounted && (v.uuid === boundVolume.uuid))
    if (volume) return volume
    return false
  }

  volumeStatus () {
    const { storage, boundVolume, boundUser } = this.props.selectedDevice.boot.data
    console.log('volumeStatus', storage, boundVolume, boundUser)
    if (!storage || !Array.isArray(storage.volumes) || !boundUser) return 'init'

    /* notMissing && isMounted && adminUser is boundUser => recover(import) */
    if (this.availableVolumes().length) return 'recover'

    /* find broke volume -> repair */
    if (this.brokenVolume()) return 'repair'

    return 'init'
  }

  renderInitFormat () {
    const { storage } = this.props.selectedDevice.boot.data

    const b1 = storage.blocks.find(b => (b.isDisk && !b.unformattable && b.slotNumber === 1))
    const b2 = storage.blocks.find(b => (b.isDisk && !b.unformattable && b.slotNumber === 2))

    const target = []
    if (b1 && b1.name) target.push(b1.name)
    if (b2 && b2.name) target.push(b2.name)

    return (
      <div>
        {
          [b1, b2].map((disk, index) => (
            <div
              style={{
                height: 30,
                width: 'calc(100% - 40px)',
                marginLeft: 20,
                display: 'flex',
                color: '#888a8c',
                alignItems: 'center'
              }}
              key={index.toString()}
            >
              <div style={{ color: '#525a60' }}> { !index ? i18n.__('Disk 1') : i18n.__('Disk 2') } </div>
              <div style={{ flexGrow: 1 }} />
              { disk && <div style={{ marginRight: 10 }}> { interpretModel(disk.model) } </div> }
              { disk && <div> { prettysize(disk.size * 512) } </div> }
              { !disk && <div> { i18n.__('Disk Not Found') } </div> }
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
          <SIButton onClick={() => this.setState({ showGuide: true })} iconStyle={{ color: '#31a0f5' }}>
            <SmallHelpIcon />
          </SIButton>
        </div>
        <div style={{ height: 10 }} />
        <div style={{ height: 50, width: 'calc(100% - 40px)', marginLeft: 20, display: 'flex', alignItems: 'center' }} >
          <ModeSelect
            selected={this.state.mode === 'single'}
            disabled={!target.length}
            label={i18n.__('Single Mode')}
            onClick={() => target.length && this.setState({ mode: this.state.mode === 'single' ? '' : 'single' })}
          />
          <div style={{ width: 10 }} />
          <ModeSelect
            selected={this.state.mode === 'raid1'}
            disabled={target.length !== 2}
            label={i18n.__('Raid1 Mode')}
            onClick={() => target.length === 2 && this.setState({ mode: this.state.mode === 'raid1' ? '' : 'raid1' })}
          />
        </div>
        <div style={{ height: 30 }} />
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            disabled={!this.state.mode || !target.length}
            label={i18n.__('Format Disk in First Boot')}
            onClick={() => this.format(target)}
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
    const blks = this.props.selectedDevice.boot.data.storage.blocks
    const storage = this.availableVolumes().slice(0, 2).map((v, index) => ({
      key: index.toString(),
      size: v.usage && prettysize(v.usage.overall.deviceSize),
      mode: v.usage && v.usage.data.mode === 'raid1' ? i18n.__('Raid1 Mode') : i18n.__('Single Mode'),
      fire: () => this.recover(v),
      devices: v.devices.map((d) => {
        const blk = blks.find(b => b.name === d.name)
        const { model, size } = blk
        return ({ model: interpretModel(model), size: prettysize(size * 512) })
      })
    }))

    return (
      <div>
        {
          storage.map(disk => (
            <div key={disk.key} >
              <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
              <div style={{ height: 10 }} />
              <div style={{ height: 30, margin: '0 auto', width: 280, display: 'flex', color: '#888a8c', alignItems: 'center' }} >
                <div style={{ color: '#525a60' }}> { i18n.__('Current Mode') } </div>
                <div style={{ flexGrow: 1 }} />
                <div> { disk.mode } </div>
              </div>

              <div style={{ height: 30, margin: '0 auto', width: 280, display: 'flex', color: '#888a8c', alignItems: 'center' }} >
                <div style={{ color: '#525a60' }}> { i18n.__('Volume Size') } </div>
                <div style={{ flexGrow: 1 }} />
                <div> { disk.size } </div>
              </div>

              {
                disk.devices.map((d, i) => (
                  <div
                    key={i.toString()}
                    style={{ height: 30, margin: '0 auto', width: 280, display: 'flex', color: '#888a8c', alignItems: 'center' }}
                  >
                    <div style={{ color: '#525a60' }}> { !i ? i18n.__('Disk 1') : i18n.__('Disk 2') } </div>
                    <div style={{ flexGrow: 1 }} />
                    <div> { d.model } </div>
                    <div style={{ width: 10 }} />
                    <div> { d.size } </div>
                  </div>
                ))
              }

              <div style={{ height: 30 }} />
              {/* this.renderArrowTips(i18n.__('%s Fortmat Disk Text', disk.posAlt), true) */}
              <div style={{ width: 240, height: 40, margin: '0 auto' }}>
                <RRButton
                  label={i18n.__('Import')}
                  onClick={disk.fire}
                />
              </div>
              <div style={{ height: 30 }} />
            </div>
          ))
        }
      </div>
    )
  }

  renderRepair () {
    const blks = this.props.selectedDevice.boot.data.storage.blocks
    const b1 = blks.find(b => (b.isDisk && !b.unformattable && b.slotNumber === 1))
    const b2 = blks.find(b => (b.isDisk && !b.unformattable && b.slotNumber === 2))

    const target = []
    if (b1 && b1.name) target.push(b1.name)
    if (b2 && b2.name) target.push(b2.name)

    const volume = this.brokenVolume()
    console.log('renderRepair', b1, b2, volume)
    const disk = { devices: [] }

    return (
      <div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 10 }} />
        <div style={{ height: 30, margin: '0 auto', width: 280, display: 'flex', color: '#888a8c', alignItems: 'center' }} >
          <div style={{ color: '#525a60' }}> { i18n.__('Current Mode') } </div>
          <div style={{ flexGrow: 1 }} />
          <div> { disk.mode } </div>
        </div>

        <div style={{ height: 30, margin: '0 auto', width: 280, display: 'flex', color: '#888a8c', alignItems: 'center' }} >
          <div style={{ color: '#525a60' }}> { i18n.__('Volume Size') } </div>
          <div style={{ flexGrow: 1 }} />
          <div> { disk.size } </div>
        </div>

        {
          disk.devices.map((d, i) => (
            <div
              key={i.toString()}
              style={{ height: 30, margin: '0 auto', width: 280, display: 'flex', color: '#888a8c', alignItems: 'center' }}
            >
              <div style={{ color: '#525a60' }}> { !i ? i18n.__('Disk 1') : i18n.__('Disk 2') } </div>
              <div style={{ flexGrow: 1 }} />
              <div> { d.model } </div>
              <div style={{ width: 10 }} />
              <div> { d.size } </div>
            </div>
          ))
        }

        <div style={{ height: 30 }} />
        {/* this.renderArrowTips(i18n.__('%s Fortmat Disk Text', disk.posAlt), true) */}
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            label={i18n.__('Import')}
            onClick={disk.fire}
          />
        </div>
        <div style={{ height: 30 }} />
      </div>
    )
  }

  renderSelect (status) {
    return (
      <div>
        <div style={{ width: '100%', height: 40, marginTop: -30, color: '#fa5353' }} className="flexCenter">
          { i18n.__('Disk Change Text') }
        </div>
        { this.renderArrowTips(i18n.__('Format Current Disk')) }
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            label={i18n.__('Create Volume')}
            onClick={this.enterCreate}
          />
        </div>
        <div style={{ height: 10 }} />
        { this.renderArrowTips(i18n.__('Recover Volume Text')) }
        <div style={{ width: 240, height: 40, margin: '0 auto' }}>
          <RRButton
            alt
            label={i18n.__('Recover Volume')}
            onClick={() => (status === 'repair' ? this.enterRepair() : this.enterRecover())}
          />
        </div>
        <div style={{ height: 30 }} />
      </div>
    )
  }

  render () {
    const { backToList, onFormatSuccess } = this.props
    console.log('ManageDisk props', this.props)
    let [title, imgSrc, content] = ['', '', null]
    switch (this.state.status) {
      case 'init':
        title = i18n.__('Discover Disk')
        imgSrc = 'pic-finddisk.png'
        content = this.renderInitFormat()
        break

      case 'select':
        title = this.volumeStatus() === 'repair' ? i18n.__('Disk Manage') : i18n.__('Create or Import Disk')
        imgSrc = 'pic-login.png'
        content = this.renderSelect(this.volumeStatus())
        break

      case 'recover':
        title = i18n.__('Recover Volume')
        content = this.renderRecover()
        break

      case 'repair':
        title = i18n.__('Repair Disk')
        imgSrc = 'pic-login.png'
        content = this.renderRepair()
        break

      default:
        break
    }
    return (
      <div className="paper" style={{ width: 320, zIndex: 100 }} >
        <div style={{ height: 59, display: 'flex', alignItems: 'center', paddingLeft: 5 }} className="title">
          <LIButton onClick={backToList} >
            <BackIcon />
          </LIButton>
          { title }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        {
          !!imgSrc &&
            <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
              <img
                style={{ width: 280, height: 150 }}
                src={`./assets/images/${imgSrc}`}
                alt=""
              />
            </div>
        }

        { content }

        <Dialog open={!!this.state.showGuide} onRequestClose={() => this.setState({ showGuide: false })}>
          {
            !!this.state.showGuide &&
            <DiskModeGuide
              onRequestClose={() => this.setState({ showGuide: false })}
              powerOff={() => {}}
            />
          }
        </Dialog>

        <Dialog open={!!this.state.format} onRequestClose={() => this.setState({ format: '' })} modal transparent >
          {
            !!this.state.format &&
            <DiskFormating
              type={this.state.status}
              error={this.state.error}
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
