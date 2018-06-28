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

    this.onCopy = () => {
      if (this.isMedia || this.state.inRoot) return
      const selected = this.state.select.selected
      if (!selected && !selected.length) return
      const entries = selected.map(index => this.state.entries[index])
      const drive = this.state.path[0].id
      const srcPath = this.state.path.slice(-1)[0]
      let dir = this.state.path.map(p => p.data).filter(p => !!p).join('/')
      if (dir) dir = `${dir}/`
      this.ctx.props.clipboard.set({ action: 'copy', loc: 'phy', drive, dir, entries, srcPath })
    }

    this.onCut = () => {
      if (this.isMedia || this.state.inRoot) return
      const selected = this.state.select.selected
      if (!selected && !selected.length) return
      const entries = selected.map(index => this.state.entries[index])
      const drive = this.state.path[0].id
      const srcPath = this.state.path.slice(-1)[0]
      let dir = this.state.path.map(p => p.data).filter(p => !!p).join('/')
      if (dir) dir = `${dir}/`
      this.ctx.props.clipboard.set({ action: 'move', loc: 'phy', drive, dir, entries, srcPath })
    }

    this.onPaste = () => {
      if (this.isMedia || this.state.inRoot) return
      const pos = this.ctx.props.clipboard.get()
      const drive = this.state.path[0].id
      let dir = this.state.path.map(p => p.data).filter(p => !!p).join('/')
      if (dir) dir = `${dir}/`
      const entries = pos.entries.map(e => e.name)
      const args = {
        entries,
        type: pos.loc === 'phy' ? `n${pos.action}` : pos.loc === 'drive' ? `e${pos.action}` : '',
        src: { drive: pos.drive, dir: pos.dir },
        dst: { drive, dir }
      }
      this.xcopyData = {
        type: pos.action,
        entries: pos.entries,
        srcDir: pos.srcPath,
        dstDir: this.state.path.slice(-1)[0]
      }
      this.ctx.props.apis.pureRequest('copy', args, (err, res) => this.finish(err, res, pos.action))
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
      const selected = this.state.select.selected
      const entries = selected.map(index => this.state.entries[index])
      this.setState({ onDownload: { selected, entries, path } })
    }

    this.downloadFire = ({ selected, entries, path }) => {
      const id = this.phyDrive.id
      ipcRenderer.send('DOWNLOAD', { entries, dirUUID: path, driveUUID: id, domain: 'phy' })
      this.setState({ onDownload: null })
    }

    this.deleteAsync = async () => {
      let path = this.state.path.map(p => p.data).filter(p => !!p).join('/')
      if (path) path = `${path}/`
      const entries = this.state.select.selected.map(index => this.state.entries[index])
      const queryStrings = entries.map(e => `${path}${e.name}`)
      for (let i = 0; i < queryStrings.length; i++) {
        const p = queryStrings[i]
        await this.ctx.props.apis.requestAsync('deletePhyDirOrFile', { id: this.phyDrive.id, qs: { path: p } })
      }
      await this.ctx.props.apis.requestAsync('listPhyDir', { id: this.phyDrive.id, path })
    }

    ipcRenderer.on('driveListUpdate', (e, dir) => {
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
