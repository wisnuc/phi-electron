import i18n from 'i18n'
import React from 'react'
import { TweenMax } from 'gsap'
import { ipcRenderer } from 'electron'
import { Divider, Avatar } from 'material-ui'

import Base from './Base'
import FileDetail from '../file/FileDetail'
import ListSelect from '../file/ListSelect'
import FileContent from '../file/FileContent'
import NewFolderDialog from '../file/NewFolderDialog'
import FileUploadButton from '../file/FileUploadButton'
import ContextMenu from '../common/ContextMenu'
import DialogOverlay from '../common/PureDialog'
import FlatButton from '../common/FlatButton'
import MenuItem from '../common/MenuItem'
import sortByType from '../common/sort'
import { BreadCrumbItem, BreadCrumbSeparator } from '../common/BreadCrumb'
import { BackwardIcon, ForwardIcon, RefreshAltIcon, DownloadIcon, DeleteIcon, NewFolderIcon, ListIcon, GridIcon, HelpIcon, AllFileIcon, ArrowIcon } from '../common/Svg'
import renderFileIcon from '../common/renderFileIcon'
import { xcopyMsg } from '../common/msg'
import Search from '../common/Search'
import History from '../common/history'
import { LIButton } from '../common/Buttons'
import ConfirmDialog from '../common/ConfirmDialog'

/* Drag Item's Coordinate */
const DRAGLEFT = 180
const DRAGTOP = 344

class Home extends Base {
  constructor (ctx) {
    super(ctx)

    this.type = 'home'
    this.title = () => i18n.__('Home Title')
    /* handle select TODO */
    this.select = new ListSelect(this)
    this.select.on('updated', next => this.setState({ select: next }))

    this.state = {
      gridView: false, // false: list, true: grid
      sortType: 'nameUp', // nameUp, nameDown, timeUp, timeDown, sizeUp, sizeDown, takenUp, takenDown
      select: this.select.state,
      listNavDir: null, // save a reference
      path: [],
      entries: [], // sorted
      contextMenuOpen: false,
      contextMenuY: -1,
      contextMenuX: -1,

      createNewFolder: false,
      delete: false,
      move: false,
      copy: false,
      share: false,
      loading: true
    }

    /* handle update sortType */
    this.force = false
    this.changeSortType = (sortType) => {
      this.force = true
      if (sortType === 'takenUp' || sortType === 'takenDown') this.setState({ takenTime: true })
      if (sortType === 'timeUp' || sortType === 'timeDown') this.setState({ takenTime: false })
      this.setState({ sortType })
      this.hideContextMenu()
    }

    this.toggleDialog = (type) => {
      if (!window.navigator.onLine) this.ctx.openSnackBar(i18n.__('Offline Text'))
      else this.setState({ [type]: !this.state[type] })
    }

    /* file or dir operations */
    this.upload = (type) => {
      if (!window.navigator.onLine) this.ctx.openSnackBar(i18n.__('Offline Text'))
      else {
        const dirPath = this.state.path
        const dirUUID = dirPath[dirPath.length - 1].uuid
        const driveUUID = dirPath[0].uuid
        ipcRenderer.send('UPLOAD', { dirUUID, driveUUID, type })
      }
    }

    this.download = () => {
      if (!window.navigator.onLine) this.ctx.openSnackBar(i18n.__('Offline Text'))
      else {
        const selected = this.state.select.selected
        const entries = selected.map(index => this.state.entries[index])
        const path = this.state.path
        ipcRenderer.send('DOWNLOAD', { entries, dirUUID: path[path.length - 1].uuid, driveUUID: path[0].uuid })
      }
    }

    this.dupFile = () => {
      if (!window.navigator.onLine) this.ctx.openSnackBar(i18n.__('Offline Text'))
      else {
        const entries = this.state.entries
        const selected = this.state.select.selected
        const path = this.state.path
        const curr = path[path.length - 1]
        const oldName = entries[selected[0]].name
        const reg = /^.*\./
        const extension = oldName.replace(reg, '')
        const nameNoExt = oldName.match(reg) ? oldName.match(reg)[0] : oldName
        let newName = oldName
        const findSame = name => entries.findIndex(e => e.name === name) > -1
        for (let i = 0; findSame(newName); i++) {
          const addText = i ? ` - ${i18n.__('Copy(noun)')} (${i})` : ` - ${i18n.__('Copy(noun)')}`
          if (!extension || extension === oldName || nameNoExt === '.') {
            newName = `${oldName}${addText}`
          } else {
            const pureName = oldName.match(/^.*\./)[0]
            newName = `${pureName.slice(0, pureName.length - 1)}${addText}.${extension}`
          }
        }
        const args = {
          driveUUID: path[0].uuid,
          dirUUID: curr.uuid,
          entryUUID: entries[selected[0]].uuid,
          newName,
          oldName
        }
        this.ctx.props.apis.request('dupFile', args, (err, data) => {
          if (err) this.ctx.openSnackBar(i18n.__('Dup File Failed'))
          else {
            this.refresh()
            this.ctx.openSnackBar(i18n.__('Dup File Success'))
          }
        })
      }
    }

    this.rename = () => {
      this.state.select.setModify(this.state.select.selected[0])
    }

    this.deleteAsync = async () => {
      const entries = this.state.entries
      const selected = this.state.select.selected
      const path = this.state.path
      const dirUUID = path[path.length - 1].uuid
      const driveUUID = this.state.path[0].uuid

      if (this.ctx.props.selectedDevice.token.data.stationID) {
        for (let i = 0; i < selected.length; i++) {
          const entryName = entries[selected[i]].name
          const entryUUID = entries[selected[i]].uuid
          await this.ctx.props.apis.requestAsync('deleteDirOrFile', { driveUUID, dirUUID, entryName, entryUUID })
        }
      } else {
        const op = []
        for (let i = 0; i < selected.length; i++) {
          const entryName = entries[selected[i]].name
          const entryUUID = entries[selected[i]].uuid
          op.push({ driveUUID, dirUUID, entryName, entryUUID })
        }
        for (let j = 0; j <= (op.length - 1) / 512; j++) { // delete no more than 512 files per post
          await this.ctx.props.apis.requestAsync('deleteDirOrFile', op.filter((a, i) => (i >= j * 512) && (i < (j + 1) * 512)))
        }
      }

      if (this.state.path[this.state.path.length - 1].uuid === dirUUID) {
        await this.ctx.props.apis.requestAsync('listNavDir', { driveUUID: this.state.path[0].uuid, dirUUID })
      }
    }

    this.delete = () => {
      if (!window.navigator.onLine) this.ctx.openSnackBar(i18n.__('Offline Text'))
      else {
        this.setState({ deleteLoading: true })
        this.deleteAsync().then(() => {
          this.setState({ deleteLoading: false, delete: false })
          this.ctx.openSnackBar(i18n.__('Delete Success'))
        }).catch((e) => {
          this.setState({ deleteLoading: false, delete: false })
          console.log('delete error', e)
          this.ctx.openSnackBar(i18n.__('Delete Failed'))
        })
      }
    }

    this.fakeOpen = () => {
      const selected = this.state.select && this.state.select.selected
      if (!selected || selected.length !== 1) return
      this.setState({ fakeOpen: { index: selected[0] } })
    }

    this.clearFakeOpen = () => {
      this.setState({ fakeOpen: null })
    }

    /* handle Public Drive */
    this.modifyPublic = () => {
      this.setState({ newDrive: 'edit' })
    }

    this.deletePublic = () => {
      this.setState({ deleteDriveConfirm: true })
    }

    this.fireDeletePublic = () => {
      if (!window.navigator.onLine) this.ctx.openSnackBar(i18n.__('Offline Text'))
      else {
        const { select, entries } = this.state
        const uuid = select && entries && entries[select.selected[0]] && entries[select.selected[0]].uuid
        this.ctx.props.apis.request('adminDeleteDrive', { uuid }, (err, res) => {
          if (err) this.ctx.openSnackBar(i18n.__('Delete Drive Failed'))
          else this.ctx.openSnackBar(i18n.__('Delete Drive Success'))
          this.setState({ deleteDriveConfirm: false })
          this.refresh()
        })
      }
    }

    this.history = new History()

    /* actions */
    this.enter = (pos, cb) => {
      this.ctx.props.apis.request('listNavDir', pos, cb)
    }

    this.listNavBySelect = () => {
      if (!window.navigator.onLine) this.ctx.openSnackBar(i18n.__('Offline Text'))
      else {
        const selected = this.select.state.selected
        if (selected.length !== 1) return

        /* reset jump action of files or drives */
        this.resetScrollTo()

        const entry = this.state.entries[selected[0]]
        if (entry.type === 'directory') {
          const pos = { driveUUID: this.state.path[0].uuid, dirUUID: entry.uuid }
          this.enter(pos, err => err && console.error('listNavBySelect error', err))
          this.history.add(pos)
        }
      }
    }

    this.back = () => {
      const pos = this.history.back()
      this.enter(pos, err => err && console.error('back error', err))
    }

    this.forward = () => {
      const pos = this.history.forward()
      this.enter(pos, err => err && console.error('forward error', err))
    }

    /* op: scrollTo file */
    this.refresh = (op) => {
      if (!window.navigator.onLine) this.ctx.openSnackBar(i18n.__('Offline Text'))
      else {
        const rUUID = this.state.path[0] && this.state.path[0].uuid
        const dUUID = this.state.path[0] && this.state.path[this.state.path.length - 1].uuid
        if (!rUUID || !dUUID) {
          this.setState({ loading: true })
          this.ctx.props.apis.request('drives') // drive root
        } else {
          this.ctx.props.apis.request('listNavDir', { driveUUID: rUUID, dirUUID: dUUID })
        }
        this.resetScrollTo()

        if (op) this.setState({ scrollTo: op.fileName || op.uuid, loading: !op.noloading }) // fileName for files, uuid for drives
        else this.setState({ loading: true })
      }
    }

    this.resetScrollTo = () => Object.assign(this.state, { scrollTo: null })

    this.showContextMenu = (clientX, clientY) => {
      if (this.select.state.ctrl || this.select.state.shift) return
      const containerDom = document.getElementById('content-container')
      const maxLeft = containerDom.offsetLeft + containerDom.clientWidth + 80
      const x = clientX > maxLeft ? maxLeft : clientX
      /* calc positon of menu using height of menu which is related to number of selected items */
      const length = (this.select.state && this.select.state.selected && this.select.state.selected.length) || 0
      const adjust = !length ? 170 : length > 1 ? 140 : 200
      const maxTop = containerDom.offsetTop + containerDom.offsetHeight - adjust + 80
      const y = clientY > maxTop ? maxTop : clientY
      this.setState({
        contextMenuOpen: true,
        contextMenuX: x,
        contextMenuY: y
      })
    }

    this.hideContextMenu = () => {
      this.setState({
        contextMenuOpen: false
        // contextMenuX: -1,
        // contextMenuY: -1,
      })
    }

    /* NavigationMenu animation */
    this.setAnimation = (component, status) => {
      if (component === 'NavigationMenu') {
        /* add animation to NavigationMenu */
        const transformItem = this.refNavigationMenu
        const time = 0.4
        const ease = global.Power4.easeOut
        if (status === 'In') {
          TweenMax.to(transformItem, time, { rotation: 180, opacity: 1, ease })
        }
        if (status === 'Out') {
          TweenMax.to(transformItem, time, { rotation: -180, opacity: 0, ease })
        }
      }
    }

    /* request task state */
    this.getTaskState = async (uuid) => {
      await Promise.delay(500)
      const data = await this.ctx.props.apis.pureRequestAsync('task', { uuid })
      if (data && data.nodes && data.nodes.findIndex(n => n.parent === null && n.state === 'Finished') > -1) return 'Finished'
      if (data && data.nodes && data.nodes.findIndex(n => n.state === 'Conflict') > -1) return 'Conflict'
      return 'Working'
    }

    /* finish post change dialog content to waiting/result */
    this.finish = (error, data) => {
      const type = i18n.__('Move')
      if (error) this.ctx.openSnackBar(type.concat(i18n.__('+Failed')), { showTasks: true })
      else {
        this.getTaskState(data.uuid).asCallback((err, res) => {
          if (err) {
            this.ctx.openSnackBar(type.concat(i18n.__('+Failed')), { showTasks: true })
          } else {
            let text = 'Working'
            if (res === 'Finished') text = xcopyMsg(this.xcopyData)
            if (res === 'Conflict') text = i18n.__('Task Conflict Text')
            this.refresh({ noloading: true })
            this.ctx.openSnackBar(text, res !== 'Finished' ? { showTasks: true } : null)
          }
        })
      }
    }

    this.shouldFire = () => {
      const { select, entries } = this.state
      const { hover } = select
      return hover > -1 && select.rowDrop(hover) && entries[hover].type === 'directory' && this.RDSI !== hover
    }

    this.onHoverHeader = (node) => {
      this.hoverHeader = node
      this.forceUpdate()
    }

    /* verify header node for dropping, return `null` or the node */
    this.dropHeader = () => {
      if (!this.hoverHeader || this.hoverHeader.uuid === this.state.path.slice(-1)[0].uuid) return null
      if (this.hoverHeader.type === 'publicRoot') return null
      return this.hoverHeader
    }

    this.setScrollTop = scrollTop => (this.scrollTop = scrollTop)

    this.setGridData = data => (this.gridData = data)

    this.getPosition = (gridData, index) => {
      const { mapData, indexHeightSum, scrollTop } = gridData
      const lineNum = mapData[index]
      const top = indexHeightSum[lineNum] + 104 - scrollTop
      const left = (index - mapData.findIndex(i => i === lineNum)) * 200 + 123
      return ({ top, left })
    }

    /* drag row */
    this.dragRow = (e) => {
      const s = this.refDragedItems.style
      if (!this.state.select.selected.includes(this.RDSI)) {
        if (this.RDSI > -1) this.state.select.addByArray([this.RDSI], (new Date()).getTime())
      } else if (s.display !== 'flex') {
        s.display = 'flex'
      } else {
        s.width = '180px'
        s.opacity = 1

        const RDTop = `${this.RDSI * 48 + DRAGTOP - (this.scrollTop || 0)}px`
        if (!s.top || s.top === RDTop) s.top = `${e.clientY + 2}px`
        else s.marginTop = `${e.clientY + 2 - parseInt(s.top, 10)}px`

        if (!s.left || s.left === `${DRAGLEFT}px`) s.left = `${e.clientX + 2}px`
        else s.marginLeft = `${e.clientX + 2 - parseInt(s.left, 10)}px`
      }
      if (!this.entry.type) this.forceUpdate()
    }

    this.dragEnd = () => {
      document.removeEventListener('mousemove', this.dragGrid)
      document.removeEventListener('mousemove', this.dragRow)
      document.removeEventListener('mouseup', this.dragEnd)
      if (!this.refDragedItems || this.RDSI < 0) return
      const hover = this.state.select.hover
      const shouldFire = this.shouldFire()
      const dropHeader = this.dropHeader()
      if (shouldFire || dropHeader) {
        const type = 'move'

        const path = this.state.path
        const dir = path[path.length - 1].uuid
        const drive = path[0].uuid
        const src = { drive, dir }
        const dst = { drive, dir: shouldFire ? this.state.entries[hover].uuid : dropHeader.uuid }

        const entries = this.state.select.selected.map(i => this.state.entries[i].uuid)
        const policies = { dir: ['keep', null] }

        this.xcopyData = {
          type,
          srcDir: path[path.length - 1],
          dstDir: shouldFire ? this.state.entries[hover] : dropHeader,
          entries: this.state.select.selected.map(i => this.state.entries[i])
        }

        this.ctx.props.apis.request('copy', { type, src, dst, entries, policies }, this.finish)
      }
      const s = this.refDragedItems.style
      s.transition = 'all 225ms cubic-bezier(.4,0,1,1)'

      if (this.state.gridView) {
        const { top, left } = this.getPosition(this.gridData, this.RDSI)
        s.top = `${top}px`
        s.left = `${left}px`
        s.width = '180px'
      } else {
        s.top = `${this.RDSI * 48 + DRAGTOP - (this.scrollTop || 0)}px`
        s.left = `${DRAGLEFT}px`
        s.width = '100%'
      }
      s.marginTop = '0px'
      s.marginLeft = '0px'
      s.opacity = 0

      this.RDSI = -1
      this.state.select.toggleDrag([])

      setTimeout(() => {
        s.display = 'none'
        s.transition = 'all 225ms cubic-bezier(.4,0,1,1)'
        s.transitionProperty = 'top, left, width, opacity'
      }, shouldFire || dropHeader ? 0 : 225)
    }

    this.rowDragStart = (event, index) => {
      /* only left click */
      if (event.nativeEvent.button !== 0) return
      /* not public */
      if (this.state.entries[index].type === 'public') return
      this.RDSI = index // rowDragStartIndex
      const selected = this.state.select.selected
      this.state.select.toggleDrag(selected.includes(this.RDSI) ? selected : [this.RDSI])

      /* show drag item */
      // console.log('this.scrollTop', this.scrollTop)
      this.refDragedItems.style.top = `${this.RDSI * 48 + DRAGTOP - (this.scrollTop || 0)}px`
      this.refDragedItems.style.left = `${DRAGLEFT}px`

      document.addEventListener('mousemove', this.dragRow)
      document.addEventListener('mouseup', this.dragEnd, true)
    }

    /* drag item in GridView */
    this.dragGrid = (e) => {
      const s = this.refDragedItems.style
      if (!this.state.select.selected.includes(this.RDSI)) {
        if (this.RDSI > -1) this.state.select.addByArray([this.RDSI], (new Date()).getTime())
      } else if (s.display !== 'flex') {
        s.display = 'flex'
      } else {
        s.opacity = 1

        const { top, left } = this.getPosition(this.gridData, this.RDSI)

        if (!s.top || s.top === `${top}px`) s.top = `${e.clientY + 2}px`
        else s.marginTop = `${e.clientY + 2 - parseInt(s.top, 10)}px`

        if (!s.left || s.left === `${left}px`) s.left = `${e.clientX + 2}px`
        else s.marginLeft = `${e.clientX + 2 - parseInt(s.left, 10)}px`
      }
      if (!this.entry.type) this.forceUpdate()
    }

    this.gridDragStart = (event, index) => {
      /* only left click */
      if (event.nativeEvent.button !== 0) return
      /* not public */
      if (this.state.entries[index].type === 'public') return
      this.RDSI = index // rowDragStartIndex
      const selected = this.state.select.selected
      this.state.select.toggleDrag(selected.includes(this.RDSI) ? selected : [this.RDSI])

      /* show drag item */
      const { top, left } = this.getPosition(this.gridData, this.RDSI)
      this.refDragedItems.style.top = `${top}px`
      this.refDragedItems.style.left = `${left}px`
      this.refDragedItems.style.width = '180px'

      document.addEventListener('mousemove', this.dragGrid)
      document.addEventListener('mouseup', this.dragEnd, true)
    }

    ipcRenderer.on('driveListUpdate', (e, dir) => {
      if (this.state.contextMenuOpen) return
      if (this.state.select && this.state.select.selected && this.state.select.selected.length > 1) return
      const path = this.state.path
      if (this.isNavEnter && path && path.length && dir.uuid === path[path.length - 1].uuid) this.refresh({ noloading: true })
    })
  }

  willReceiveProps (nextProps) {
    this.preValue = this.state.listNavDir
    this.handleProps(nextProps.apis, ['listNavDir'])

    /* set force === true  to update sortType forcely */
    if (this.preValue === this.state.listNavDir && !this.force) return

    const { path, entries, counter } = this.state.listNavDir
    const select = this.select.reset(entries.length)

    if (Array.isArray(path) && path[0]) path[0].type = this.type

    this.force = false

    const pos = { driveUUID: path[0].uuid, dirUUID: path[0].uuid }
    if (this.history.get().curr === -1) this.history.add(pos)

    /* sort entries, reset select, stop loading */
    this.setState({
      path, select, loading: false, entries: [...entries].sort((a, b) => sortByType(a, b, this.state.sortType)), counter
    })
  }

  navEnter (target) {
    this.isNavEnter = true
    const apis = this.ctx.props.apis
    if (!apis || !apis.drives || !apis.drives.data) return
    if (target && target.driveUUID) { // jump to specific dir
      const { driveUUID, dirUUID } = target
      apis.request('listNavDir', { driveUUID, dirUUID })
      this.setState({ loading: true })
    } else this.refresh()
  }

  navLeave () {
    this.isNavEnter = false
    this.setState({
      contextMenuOpen: false,
      contextMenuY: -1,
      contextMenuX: -1,
      createNewFolder: false,
      delete: false,
      move: false,
      copy: false,
      share: false,
      loading: false
    })
  }

  navGroup () {
    return 'file'
  }

  menuName () {
    return i18n.__('Home Menu Name')
  }

  menuIcon () {
    return AllFileIcon
  }

  /* renderers */
  renderDragItems () {
    this.entry = (this.RDSI > -1 && this.state.entries[this.RDSI]) || {}
    return (
      <div
        ref={ref => (this.refDragedItems = ref)}
        style={{
          position: 'fixed',
          zIndex: 1000,
          top: 0,
          left: 0,
          marginLeft: 0,
          opacity: 0,
          width: '100%',
          height: 48,
          transition: 'all 225ms cubic-bezier(.4,0,1,1)',
          transitionProperty: 'top, left, width, opacity',
          display: 'none',
          alignItems: 'center',
          color: '#FFF',
          boxShadow: '2px 2px 2px rgba(0,0,0,0.27)',
          backgroundColor: this.groupPrimaryColor()
        }}
      >
        <div style={{ flexGrow: 1, maxWidth: 48 }} />
        {/* file type may be: folder, public, directory, file, unsupported */}
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', margin: 12 }}>
          <Avatar style={{ backgroundColor: 'white', width: 36, height: 36 }}>
            {
              this.entry.type === 'directory'
                ? <AllFileIcon style={{ width: 24, height: 24 }} />
                : this.entry.type === 'file'
                  ? renderFileIcon(this.entry.name, this.entry.metadata, 24)
                  : <div />
            }
          </Avatar>
        </div>
        <div
          style={{
            width: 114,
            marginRight: 12,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          { this.entry.name }
        </div>
        {
          this.state.select.selected.length > 1 &&
            <div
              style={{
                position: 'absolute',
                top: -12,
                right: -12,
                width: 24 + Math.floor(Math.log10(this.state.select.selected.length)) * 6,
                height: 24,
                borderRadius: 12,
                boxSizing: 'border-box',
                backgroundColor: this.shouldFire() || this.dropHeader() ? this.groupPrimaryColor() : '#FF4081',
                border: '1px solid rgba(0,0,0,0.18)',
                color: '#FFF',
                fontWeight: 500,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              { this.state.select.selected.length }
            </div>
        }
      </div>
    )
  }

  renderBreadCrumbItem ({ style }) {
    const path = this.state.path

    const touchTap = (node) => {
      this.setState({ loading: true })
      if (node.type === 'publicRoot') {
        this.rootDrive = null
        this.ctx.props.apis.request('drives')
      } else {
        const pos = { driveUUID: path[0].uuid, dirUUID: node.uuid }
        this.enter(pos, err => err && console.error('Jump via breadCrumb error', err))
        this.history.add(pos)
      }
    }

    /*
      each one is preceded with a separator, except for the first one
      each one is assigned an action, except for the last one
    */

    return (
      <div style={Object.assign({}, style, { marginLeft: 20 })}>
        {
          path.reduce((acc, node, index) => {
            const last = index === path.length - 1
            const isDrop = () => this.state.select.isDrop()
            const dropable = () => this.state.select.isDrop() && this.dropHeader()
            const funcs = { node, isDrop, dropable, onHoverHeader: this.onHoverHeader, onClick: () => touchTap(node) }

            if (path.length > 4 && index > 0 && index < path.length - 3) {
              if (index === path.length - 4) {
                acc.push(<BreadCrumbSeparator key={`Separator${node.uuid}`} />)
                acc.push(<BreadCrumbItem key="..." text="..." {...funcs} />)
              }
              return acc
            }

            if (index !== 0) acc.push(<BreadCrumbSeparator key={`Separator${node.uuid}`} />)

            /* the first one is always special */
            if (index === 0) acc.push(<BreadCrumbItem text={this.title()} key="root" {...funcs} last={last} />)
            else acc.push(<BreadCrumbItem text={node.name} key={`Item${node.uuid}`} {...funcs} last={last} />)

            return acc
          }, [])
        }
      </div>
    )
  }

  renderTitle ({ style }) {
    const breadCrumbStyle = { color: 'var(--grey-text)', width: '100%', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }
    // if (!this.state.listNavDir) return (<div />)
    return (
      <div style={style}>
        <div style={{ height: 70 }}>
          <div style={{ fontSize: 20, color: 'var(--dark-text)', marginTop: 12, marginLeft: 24 }}>
            { this.menuName() }
          </div>
          { this.renderBreadCrumbItem({ style: breadCrumbStyle }) }
        </div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ marginRight: 15, height: 51, paddingTop: 19 }}>
          <Search fire={() => {}} />
        </div>
      </div>
    )
  }

  renderToolBar ({ style }) {
    const { curr, queue } = this.history.get()
    const noBack = curr < 1
    const noForward = curr > queue.length - 2
    const { select } = this.state
    const itemSelected = select && select.selected && select.selected.length
    const color = '#7d868f'

    const iconStyle = disabled => ({ color: disabled ? 'rgba(125, 134, 143, 0.5)' : color, width: 30, height: 30 })
    return (
      <div style={style}>
        <div style={{ width: 15 }} />
        <LIButton onClick={this.back} tooltip={i18n.__('Backward')} disabled={noBack}>
          <BackwardIcon color={color} />
        </LIButton>
        <div style={{ width: 5 }} />
        <LIButton onClick={this.forward} tooltip={i18n.__('Forward')} disabled={noForward}>
          <ForwardIcon color={color} />
        </LIButton>
        <div style={{ width: 5 }} />
        <LIButton onClick={() => this.refresh()} tooltip={i18n.__('Refresh')} >
          <RefreshAltIcon color={color} />
        </LIButton>

        <div style={{ flexGrow: 1 }} />

        <FlatButton
          onClick={this.download}
          label={i18n.__('Download')}
          labelStyle={{ fontSize: 14, marginLeft: 4 }}
          disabled={!itemSelected || this.state.inRoot}
          icon={<DownloadIcon style={iconStyle(!itemSelected || this.state.inRoot)} />}
        />

        <FileUploadButton upload={this.upload} disabled={this.state.inRoot} />

        <FlatButton
          onClick={() => this.toggleDialog('delete')}
          label={i18n.__('Delete')}
          labelStyle={{ fontSize: 14, marginLeft: 4 }}
          disabled={!itemSelected || this.state.inRoot}
          icon={<DeleteIcon style={iconStyle(!itemSelected || this.state.inRoot)} />}
        />

        <FlatButton
          label={i18n.__('Create New Folder')}
          labelStyle={{ fontSize: 14, marginLeft: 4 }}
          onClick={() => this.toggleDialog('createNewFolder')}
          disabled={this.state.inRoot}
          icon={<NewFolderIcon style={iconStyle(this.state.inRoot)} />}
        />

        <FlatButton
          onClick={() => this.toggleDialog('gridView')}
          label={this.state.gridView ? i18n.__('List View') : i18n.__('Grid View')}
          labelStyle={{ fontSize: 14, marginLeft: 4 }}
          disabled={this.state.inRoot}
          icon={this.state.gridView
            ? <ListIcon style={iconStyle(this.state.inRoot)} />
            : <GridIcon style={iconStyle(this.state.inRoot)} />
          }
        />

        <FlatButton
          label={i18n.__('Help')}
          labelStyle={{ fontSize: 14, marginLeft: 4 }}
          onClick={() => {}}
          icon={<HelpIcon style={iconStyle()} />}
        />
        <div style={{ width: 10 }} />
      </div>
    )
  }

  renderDialogs (openSnackBar, navTo) {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <DialogOverlay open={!!this.state.createNewFolder} onRequestClose={() => this.toggleDialog('createNewFolder')}>
          { this.state.createNewFolder &&
            <NewFolderDialog
              onRequestClose={() => this.toggleDialog('createNewFolder')}
              apis={this.ctx.props.apis}
              path={this.state.path}
              entries={this.state.entries}
              openSnackBar={openSnackBar}
              refresh={this.refresh}
            /> }
        </DialogOverlay>

        <ConfirmDialog
          open={this.state.delete}
          onCancel={() => this.setState({ delete: false })}
          onConfirm={() => this.delete()}
          title={i18n.__('Confirm Delete Items Title')}
          text={i18n.__('Confirm Delete Items Text')}
        />

        <DialogOverlay open={!!this.state.detail} onRequestClose={() => this.toggleDialog('detail')}>
          {
            this.state.detail &&
            <FileDetail
              {...this.ctx.props}
              path={this.state.path}
              entries={this.state.entries}
              onRequestClose={() => this.toggleDialog('detail')}
              selected={this.select.state && this.select.state.selected}
            />
          }
        </DialogOverlay>

        <ConfirmDialog
          open={this.state.deleteDriveConfirm}
          onCancel={() => this.setState({ deleteDriveConfirm: false })}
          onConfirm={() => this.fireDeletePublic()}
          title={i18n.__('Confirm Delete Public Title')}
          text={i18n.__('Confirm Delete Public Text')}
        />
      </div>
    )
  }

  renderMenu (open) {
    const itemSelected = this.state.select && this.state.select.selected && this.state.select.selected.length
    const multiSelected = this.state.select && this.state.select.selected && (this.state.select.selected.length > 1)
    return (
      <ContextMenu
        open={open}
        top={this.state.contextMenuY}
        left={this.state.contextMenuX}
        onRequestClose={this.hideContextMenu}
      >
        {
          this.state.inRoot
            ? (
              <div>
                <MenuItem
                  primaryText={i18n.__('Modify')}
                  onClick={this.modifyPublic}
                />
                <MenuItem
                  primaryText={i18n.__('Delete')}
                  onClick={this.deletePublic}
                  disabled={itemSelected && !multiSelected && this.state.select.selected[0] === 0}
                />
                <MenuItem
                  primaryText={i18n.__('Properties')}
                  onClick={() => this.setState({ detail: true })}
                />
              </div>
            ) : !itemSelected ? (
              <div>
                <MenuItem
                  primaryText={i18n.__('Upload File')}
                  onClick={() => this.upload('file')}
                />
                <MenuItem
                  primaryText={i18n.__('Upload Folder')}
                  onClick={() => this.upload('directory')}
                />
                <MenuItem
                  primaryText={i18n.__('Create New Folder')}
                  onClick={() => this.toggleDialog('createNewFolder')}
                />
                <Divider style={{ marginLeft: 10, marginTop: 2, marginBottom: 2, width: 'calc(100% - 20px)' }} />
                <MenuItem
                  primaryText={i18n.__('Toggle View Mode')}
                  onClick={() => this.toggleDialog('gridView')}
                />
                <MenuItem
                  primaryText={i18n.__('Refresh')}
                  onClick={() => this.refresh()}
                />
                <MenuItem
                  primaryText={i18n.__('Sort')}
                  onClick={(e) => { e.stopPropagation(); e.preventDefault() }}
                  rightIcon={
                    <ArrowIcon
                      style={{
                        position: 'absolute',
                        color: '#505259',
                        marginTop: 5,
                        right: -16,
                        transform: 'rotate(270deg)'
                      }}
                    />
                  }
                  menuItems={[
                    <MenuItem
                      style={{ marginTop: -8 }}
                      primaryText={i18n.__('Name')}
                      onClick={() => this.changeSortType('nameUp')}
                    />,
                    <MenuItem
                      primaryText={i18n.__('Date Modified')}
                      onClick={() => this.changeSortType('timeUp')}
                    />,
                    <MenuItem
                      style={{ marginBottom: -8 }}
                      primaryText={i18n.__('Size')}
                      onClick={() => this.changeSortType('sizeUp')}
                    />
                  ]}
                />
              </div>
            ) : (
              <div>
                {
                  !multiSelected &&
                    <MenuItem
                      primaryText={i18n.__('Open')}
                      onClick={() => this.fakeOpen()}
                    />
                }
                <MenuItem
                  primaryText={i18n.__('Download')}
                  onClick={this.download}
                />
                <Divider style={{ marginLeft: 10, marginTop: 2, marginBottom: 2, width: 'calc(100% - 20px)' }} />
                <MenuItem
                  primaryText={i18n.__('Copy')}
                  onClick={() => {}}
                />
                <MenuItem
                  primaryText={i18n.__('Cut')}
                  onClick={() => {}}
                />
                {
                  !multiSelected &&
                    <MenuItem
                      primaryText={i18n.__('Rename')}
                      onClick={this.rename}
                    />
                }
                <MenuItem
                  primaryText={i18n.__('Delete')}
                  onClick={() => this.toggleDialog('delete')}
                />
                <Divider style={{ marginLeft: 10, marginTop: 2, marginBottom: 2, width: 'calc(100% - 20px)' }} />
                <MenuItem
                  primaryText={i18n.__('Properties')}
                  onClick={() => this.setState({ detail: true })}
                />
              </div>
            )
        }
      </ContextMenu>
    )
  }

  renderContent ({ openSnackBar, navTo }) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <FileContent
          {...this.state}
          clearFakeOpen={this.clearFakeOpen}
          listNavBySelect={this.listNavBySelect}
          showContextMenu={this.showContextMenu}
          setAnimation={this.setAnimation}
          ipcRenderer={ipcRenderer}
          download={this.download}
          primaryColor={this.groupPrimaryColor()}
          changeSortType={this.changeSortType}
          openSnackBar={openSnackBar}
          toggleDialog={this.toggleDialog}
          showTakenTime={!!this.state.takenTime}
          apis={this.ctx.props.apis}
          refresh={this.refresh}
          resetScrollTo={this.resetScrollTo}
          rowDragStart={this.rowDragStart}
          gridDragStart={this.gridDragStart}
          setScrollTop={this.setScrollTop}
          setGridData={this.setGridData}
        />

        { this.renderMenu(this.state.contextMenuOpen) }

        { this.renderDialogs(openSnackBar, navTo) }

      </div>
    )
  }
}

export default Home
