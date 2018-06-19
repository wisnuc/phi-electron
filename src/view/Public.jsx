import React from 'react'
import i18n from 'i18n'
import { ipcRenderer } from 'electron'

import Home from './Home'
import FileContent from '../file/FileContent'
import NewDriveDialog from '../control/NewDriveDialog'
import sortByType from '../common/sort'
import DialogOverlay from '../common/DialogOverlay'
import { PublicIcon } from '../common/Svg'

class Public extends Home {
  constructor (ctx) {
    super(ctx)

    this.title = () => i18n.__('Public Drive')

    this.state = Object.assign(this.state, { inRoot: true })

    this.rootDrive = null

    this.back = () => {
      const pos = this.history.back()
      console.log('this.back', pos)
      if (pos.type === 'publicRoot') {
        this.rootDrive = null
        this.ctx.props.apis.request('drives')
        this.ctx.props.apis.request('users')
      } else {
        this.enter(pos, err => err && console.error('back error', err))
      }
    }

    this.forward = () => {
      const { curr, queue } = this.history.get()
      const pos = this.history.forward()
      console.log('this.forward', queue[curr].type, pos)
      if (queue[curr].type === 'publicRoot') {
        this.rootDrive = { type: 'public', uuid: pos.driveUUID }
        this.enter(pos, err => err && console.error('forward error', err))
      } else {
        this.enter(pos, err => err && console.error('forward error', err))
      }
    }

    this.listNavBySelect = () => {
      const selected = this.select.state.selected
      if (selected.length !== 1) return

      /* reset jump action of files or drives */
      this.resetScrollTo()

      const entry = this.state.entries[selected[0]]
      if (entry.type === 'directory') {
        const pos = { driveUUID: this.state.path[0].uuid, dirUUID: entry.uuid }
        this.enter(pos, err => err && console.error('listNavBySelect error', err))
        this.history.add(pos)
      } else if (entry.type === 'public') {
        const myUUID = this.ctx.props.apis.account.data && this.ctx.props.apis.account.data.uuid
        const writable = entry.writelist === '*' || entry.writelist.findIndex(uuid => uuid === myUUID) > -1
        if (!writable) { // TODO need to define UE
          this.toggleDialog('noAccess')
          this.refresh()
          return
        }
        this.rootDrive = entry

        const pos = { driveUUID: entry.uuid, dirUUID: entry.uuid }
        this.enter(pos, err => err && console.error('listNavBySelect error', err))
        this.history.add(pos)
      }
    }
  }

  willReceiveProps (nextProps) {
    if (!this.rootDrive) {
      this.preDriveValue = this.state.drives
      this.handleProps(nextProps.apis, ['drives', 'users'])
      if (this.preDriveValue === this.state.drives && !this.force) return

      /* process path and entries, in root */
      const path = [{ name: i18n.__('Public Drive'), uuid: null, type: 'publicRoot' }]
      const entries = this.state.drives.filter(drive => drive.type === 'public')
      entries.forEach(item => Object.assign(item, { name: item.label || i18n.__('Public Drive') }))
      const isAdmin = nextProps.apis && nextProps.apis.account &&
        nextProps.apis.account.data && nextProps.apis.account.data.isFirstUser
      if (isAdmin && entries.length < 3) entries.push({ name: i18n.__('Add Public Drive'), type: 'addDrive', uuid: 'addDrive' })
      const select = this.select.reset(entries.length)

      this.force = false

      /* history */
      const pos = { type: 'publicRoot' }
      if (this.history.get().curr === -1) this.history.add(pos)

      this.setState({ path, entries, select, inRoot: true, loading: false })
    } else {
      this.preListValue = this.state.listNavDir
      this.handleProps(nextProps.apis, ['listNavDir'])
      if (this.preListValue === this.state.listNavDir && !this.force) return

      /* process path and entries, not in root */
      const path = [{ name: i18n.__('Public Drive'), uuid: this.rootDrive.uuid, type: 'publicRoot' }, ...this.state.listNavDir.path]
      const drives = this.state.drives || this.ctx.props.apis.drives.value()
      path[1].name = this.rootDrive.name || drives.find(d => d.uuid === this.rootDrive.uuid).label

      const entries = [...this.state.listNavDir.entries].sort((a, b) => sortByType(a, b, this.state.sortType))
      const select = this.select.reset(entries.length)
      const { counter } = this.state.listNavDir

      this.force = false

      this.setState({ path, entries, select, counter, inRoot: false, loading: false })
    }
  }

  navEnter (target) {
    this.isNavEnter = true
    const apis = this.ctx.props.apis
    if (target && target.driveUUID) { // jump to specific dir
      const { driveUUID, dirUUID } = target
      apis.request('listNavDir', { driveUUID, dirUUID })
      this.rootDrive = { uuid: driveUUID }
      this.setState({ loading: true })
    } else this.refresh()
  }

  menuName () {
    return i18n.__('Public Menu Name')
  }

  quickName () {
    return i18n.__('Public Quick Name')
  }

  menuIcon () {
    return PublicIcon
  }

  renderContent ({ toggleDetail, openSnackBar, getDetailStatus }) {
    const selected = this.state.select && this.state.select.selected
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <FileContent
          {...this.state}
          apis={this.ctx.props.apis}
          showUsers={this.ctx.props.showUsers}
          listNavBySelect={this.listNavBySelect}
          showContextMenu={this.showContextMenu}
          setAnimation={this.setAnimation}
          ipcRenderer={ipcRenderer}
          download={this.download}
          changeSortType={this.changeSortType}
          openSnackBar={openSnackBar}
          toggleDialog={this.toggleDialog}
          showTakenTime={!!this.state.takenTime}
          refresh={this.refresh}
          resetScrollTo={this.resetScrollTo}
          rowDragStart={this.rowDragStart}
          gridDragStart={this.gridDragStart}
          setScrollTop={this.setScrollTop}
          setGridData={this.setGridData}
          onPaste={this.onPaste}
          onCopy={this.onCopy}
          onCut={this.onCut}
          inPublicRoot={this.state.inRoot}
          openNewDrive={() => this.setState({ newDrive: 'new' })}
        />

        {
          this.renderMenu(!!this.state.contextMenuOpen &&
            (!this.state.inRoot || (this.state.inRoot && selected && selected.length === 1)))
        }

        { this.renderDialogs(openSnackBar) }

        <DialogOverlay open={!!this.state.newDrive} onRequestClose={() => this.setState({ newDrive: false })}>
          {
            this.state.newDrive && <NewDriveDialog
              type={this.state.newDrive}
              drive={selected && this.state.entries[selected[0]]}
              apis={this.ctx.props.apis}
              users={this.state.users}
              drives={this.state.drives}
              refreshDrives={this.refresh}
              openSnackBar={openSnackBar}
            />
          }
        </DialogOverlay>
      </div>
    )
  }
}

export default Public
