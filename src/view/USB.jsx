import i18n from 'i18n'
import React from 'react'
import { ipcRenderer } from 'electron'

import Home from './Home'
import sortByType from '../common/sort'

class USB extends Home {
  constructor (ctx) {
    super(ctx)
    this.title = () => i18n.__('USB Menu Name')
    this.firstEnter = true

    this.enter = (pos, cb) => {
      const path = pos.path.split('/').map(p => ({ name: p, id: pos.id, data: p, type: 'phy' })).filter(p => !!p.name)
      path.unshift({ name: this.title(), id: this.phyDrive.id, data: '', type: 'phy' })
      this.setState({ loading: true, path })
      this.ctx.props.apis.request('listPhyDir', pos, cb)
    }

    this.listNavBySelect = () => {
      const selected = this.select.state.selected
      if (selected.length !== 1) return

      /* reset jump action of files or drives */
      this.resetScrollTo()

      const entry = this.state.entries[selected[0]]

      if (entry.type === 'directory') {
        const path = [...this.state.path.map(p => p.data).filter(p => !!p), entry.name].join('/')
        const pos = { id: this.phyDrive.id, path }
        this.enter(pos, err => err && console.error('listNavBySelect error', err))
        this.history.add(pos)
      }
    }

    this.refresh = (op) => {
      if (this.phyDrive) {
        this.setState({ loading: true })
        const path = this.state.path.map(p => p.data).filter(p => !!p).join('/')
        this.ctx.props.apis.request('listPhyDir', { id: this.phyDrive.id, path })
      }

      this.resetScrollTo()

      if (op) this.setState({ scrollTo: op.fileName || op.uuid, loading: !op.noloading }) // fileName for files, uuid for drives
      else this.setState({ loading: true })
    }

    /* file or dir operations */
    this.upload = (type) => {
      const path = this.state.path.map(p => p.data).filter(p => !!p).join('/')
      const id = this.phyDrive.id
      ipcRenderer.send('UPLOAD', { dirUUID: path, driveUUID: id, type, domain: 'phy' })
    }

    this.download = () => {
      let path = this.state.path.map(p => p.data).filter(p => !!p).join('/')
      if (path) path = `${path}/`
      const id = this.phyDrive.id
      const selected = this.state.select.selected
      const entries = selected.map(index => this.state.entries[index])
      console.log('this.download', id, path, entries)
      ipcRenderer.send('DOWNLOAD', { entries, dirUUID: path, driveUUID: id, domain: 'phy' })
    }

    this.deleteAsync = async () => {
      let path = this.state.path.map(p => p.data).filter(p => !!p).join('/')
      if (path) path = `${path}/`
      const entries = this.state.select.selected.map(index => this.state.entries[index])
      const queryStrings = entries.map(e => `${path}${e.name}`)
      console.log('this.deleteAsync', path, entries, queryStrings)
      for (let i = 0; i < queryStrings.length; i++) {
        const p = queryStrings[i]
        await this.ctx.props.apis.requestAsync('deletePhyDirOrFile', { id: this.phyDrive.id, qs: { path: p } })
      }
      await this.ctx.props.apis.requestAsync('listPhyDir', { id: this.phyDrive.id, path })
    }

    ipcRenderer.on('driveListUpdate', (e, dir) => {
      console.log('driveListUpdate', dir, this.state.path)
      if (this.state.contextMenuOpen) return
      if (this.state.select && this.state.select.selected && this.state.select.selected.length > 1) return
      const path = this.state.path && this.state.path.map(p => p.data).filter(p => !!p).join('/')
      if (this.isNavEnter && dir.uuid === path) this.refresh({ noloading: true })
    })
  }

  willReceiveProps (nextProps) {
    this.preValue = this.state.listPhyDir
    this.handleProps(nextProps.apis, ['listPhyDir'])

    /* set force === true  to update sortType forcely */
    if (this.preValue === this.state.listPhyDir && !this.force) return

    const entries = this.state.listPhyDir
    const select = this.select.reset(entries.length)

    this.force = false

    const path = [...this.state.path]
    if (!path.length) path.push({ name: this.title(), id: this.phyDrive.id, data: '', type: 'phy' })

    const pos = { id: this.phyDrive.id, path: path.map(p => p.data).filter(p => !!p).join('/') }

    if (this.history.get().curr === -1) this.history.add(pos)

    /* sort entries, reset select, stop loading */
    this.setState({
      path, select, loading: false, entries: [...entries].sort((a, b) => sortByType(a, b, this.state.sortType))
    })
  }

  navEnter (target) {
    this.isNavEnter = true
    const apis = this.ctx.props.apis
    if (!apis || !apis.phyDrives || !apis.phyDrives.data) return
    if (this.firstEnter) {
      this.firstEnter = false
      this.phyDrive = apis.phyDrives.data.filter(d => d.isUSB)[0]
      apis.request('listPhyDir', { id: this.phyDrive.id })
    } else this.refresh()
  }

  menuName () {
    return i18n.__('USB Menu Name')
  }

  menuIcon () {
    const Pic = props => (
      <div {...props}>
        <img src="./assets/images/ic-usbstorage.png" alt="" width={22} height={26} style={{ marginLeft: 4 }} />
      </div>
    )
    return Pic
  }
}

export default USB
