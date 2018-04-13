import React from 'react'
import i18n from 'i18n'
import { ipcRenderer } from 'electron'
import { List, AutoSizer } from 'react-virtualized'
import { Paper, Menu, MenuItem } from 'material-ui'
import DeleteSvg from 'material-ui/svg-icons/action/delete'
import PlaySvg from 'material-ui/svg-icons/av/play-arrow'
import PauseSvg from 'material-ui/svg-icons/av/pause'

import RunningTask from './RunningTask'
import FinishedTask from './FinishedTask'
import ErrorDialogInTrans from './ErrorDialogInTrans'
import FlatButton from '../common/FlatButton'
import DialogOverlay from '../common/DialogOverlay'
import PureDialog from '../common/PureDialog'

class TrsContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      x: 0,
      y: 0,
      ctrl: false,
      shift: false,
      play: true,
      pause: true,
      menuShow: false,
      tasks: [],
      userTasks: [],
      finishTasks: [],
      clearRunningDialog: false,
      clearFinishedDialog: false,
      finished: false,
      errors: null
    }

    this.taskRefs = {}
    this.taskSelected = []
    this.finishSelected = []

    this.toggleDialog = op => this.setState({ [op]: !this.state[op] })

    this.keydown = (event) => {
      if (event.ctrlKey === this.state.ctrl && event.shiftKey === this.state.shift) return
      this.setState({
        ctrl: event.ctrlKey,
        shift: event.shiftKey
      })
    }

    this.keyup = (event) => {
      if (event.ctrlKey === this.state.ctrl && event.shiftKey === this.state.shift) return
      this.setState({
        ctrl: event.ctrlKey,
        shift: event.shiftKey
      })
    }

    this.hideMenu = () => {
      this.setState({
        menuShow: false
      })
    }

    this.openMenu = (event, obj) => {
      const containerDom = document.getElementById('content-container')
      const maxLeft = containerDom.offsetLeft + containerDom.clientWidth - 168
      const x = event.clientX > maxLeft ? maxLeft : event.clientX
      const maxTop = containerDom.offsetTop + containerDom.offsetHeight - (16 + 96 + (obj.play + obj.pause) * 48)
      const y = event.clientY > maxTop ? maxTop : event.clientY
      this.setState({ menuShow: true, x, y, play: obj.play, pause: obj.pause, tasks: obj.tasks })
    }

    this.select = (type, id, isSelected, index, e) => {
      let selectedArray
      /*
        selectedArray is a reference of this.taskSelected or this.finishSelected
        posh/pop selectedArray would alse change vlaue of this.taskSelected or this.finishSelected
      */
      if (type === 'running') {
        selectedArray = this.taskSelected
        this.cleanFinishSelect()
      } else {
        selectedArray = this.finishSelected
        this.cleanTaskSelect()
      }

      /* ctrl */
      if (this.state.ctrl) {
        /* only left click */
        if (e.button === 0) {
          if (isSelected) {
            /* cancel select */
            selectedArray.splice(selectedArray.indexOf(id), 1)
            this.taskRefs[id].updateDom(!isSelected)
          } else {
            /* add select */
            selectedArray.push(id)
            this.taskRefs[id].updateDom(!isSelected)
          }
        }
      } else if (this.state.shift && e.button === 0) {
        /* shift */
        if (selectedArray.length === 0) {
          selectedArray.push(id)
          this.taskRefs[id].updateDom(true)
        } else {
          const userTasks = this.state.userTasks
          const finishTasks = this.state.finishTasks
          const lastSelect = selectedArray[selectedArray.length - 1]
          let lastIndex
          let currentIndex
          if (type === 'running') {
            lastIndex = userTasks.findIndex(task => task.uuid === lastSelect)
            currentIndex = userTasks.findIndex(task => task.uuid === id)
          } else {
            lastIndex = finishTasks.findIndex(task => task.uuid === lastSelect)
            currentIndex = finishTasks.findIndex(task => task.uuid === id)
          }
          let minor = lastIndex
          let major = currentIndex
          if (lastIndex > currentIndex) {
            minor = currentIndex
            major = lastIndex
          }
          if (type === 'running') this.cleanTaskSelect()
          else this.cleanFinishSelect()
          for (let i = minor; i <= major; i++) {
            let uuid
            if (type === 'running') {
              uuid = userTasks[i].uuid
            } else {
              uuid = finishTasks[i].uuid
            }
            selectedArray.push(uuid)
            this.taskRefs[uuid].updateDom(true)
          }
        }
      } else if (!(e.button === 2 && isSelected)) {
        /* select an item: no shift or ctrl, not right click a selected item */
        if (type === 'running') this.cleanTaskSelect()
        else this.cleanFinishSelect()
        selectedArray.push(id)
        this.taskRefs[id].updateDom(true)
        this.setState({ tasks: [this.taskRefs[id].props.task] })
      }

      /* right click: open menu */
      if (e.button === 2) {
        const tasks = []
        let play = false
        let pause = false

        /* get selected tasks */
        selectedArray.forEach((item) => {
          if (this.taskRefs[item]) tasks.push(this.taskRefs[item].props.task)
        })

        /* add play or pause option to running task */
        if (type === 'running') {
          for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].paused) play = true
            else pause = true
          }
        }

        this.openMenu(e, { type, pause, play, tasks })
      }
    }

    this.cleanTaskSelect = () => {
      this.taskSelected.forEach((item) => {
        if (this.taskRefs[item]) {
          this.taskRefs[item].updateDom(false)
        }
      })
      this.taskSelected.length = 0 // need to keep the same reference
    }

    this.cleanFinishSelect = () => {
      this.finishSelected.forEach((item) => {
        if (this.taskRefs[item]) {
          this.taskRefs[item].updateDom(false)
        }
      })
      this.finishSelected.length = 0 // need to keep the same reference
    }

    /* ipc communication */
    this.pause = (uuid) => {
      ipcRenderer.send('PAUSE_TASK', [uuid])
    }

    this.resume = (uuid) => {
      ipcRenderer.send('RESUME_TASK', [uuid])
    }

    this.ignore = (uuid) => {
      ipcRenderer.send('FINISH_TASK', [uuid])
    }

    /* type: 'PAUSE', 'RESUME', 'DELETE' */
    this.handleAll = (tasks, type) => {
      ipcRenderer.send(`${type}_TASK`, tasks.map(t => t.uuid))
    }

    this.open = () => {
      ipcRenderer.send('OPEN_TRANSMISSION', this.state.tasks.map(t => t.downloadPath))
    }

    this.openInDrive = () => {
      const { driveUUID, dirUUID } = this.state.tasks[0]
      this.props.navToDrive(driveUUID, dirUUID)
    }

    this.openErrorDialog = (errors, finished) => {
      this.setState({ errors, finished })
    }

    this.updateTransmission = (e, userTasks, finishTasks) => {
      const { type } = this.props
      console.log('this.updateTransmission', userTasks, finishTasks)
      if (type === 'u') {
        this.setState({ userTasks: userTasks.filter(u => u.trsType === 'upload') })
      } else if (type === 'd') {
        this.setState({ userTasks: userTasks.filter(u => u.trsType === 'download') })
      } else if (type === 'f') {
        this.setState({ finishTasks })
      }
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.keydown)
    document.addEventListener('keyup', this.keyup)
    ipcRenderer.on('UPDATE_TRANSMISSION', this.updateTransmission)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keydown)
    document.removeEventListener('keyup', this.keyup)
    ipcRenderer.removeListener('UPDATE_TRANSMISSION', this.updateTransmission)
  }

  formatSize (s) {
    const size = parseFloat(s, 10)
    if (!size) return `${0} KB`
    if (size < 1024) return `${size.toFixed(2)} B`
    else if (size < (1024 * 1024)) return `${(size / 1024).toFixed(2)} KB`
    else if (size < (1024 * 1024 * 1024)) return `${(size / 1024 / 1024).toFixed(2)} MB`
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  calcTotalProcess () {
    let [completeSize, size, speed] = [0, 0, 0]
    this.state.userTasks.forEach((task) => {
      completeSize += task.completeSize
      size += task.size
      speed += task.speed
    })

    const percent = (Math.min(completeSize / size || 0, 1) * 100).toFixed(2)
    return ({ percent, speed: `${this.formatSize(speed)}/s` })
  }

  renderProcessSum () {
    const pColor = 'rgba(0,0,0,.54)'
    const bColor = 'rgba(0,0,0,.12)'
    const { percent, speed } = this.calcTotalProcess()

    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 200 }}>
          { i18n.__('Transmission Process') }
        </div>
        {/* progress bar */}
        <div style={{ display: 'flex', width: 400, height: 6, borderRadius: 2, backgroundColor: bColor }} >
          <div style={{ backgroundColor: pColor, width: `${percent}%`, borderRadius: 2 }} />
        </div>

        <div style={{ width: 24 }} />
        {/* total speed */}
        <div style={{ fontSize: 14 }}>
          { speed }
        </div>
      </div>
    )
  }

  render () {
    const { type } = this.props
    const userTasks = this.state.userTasks
    const finishTasks = this.state.finishTasks

    const titileStyle = {
      display: 'flex',
      alignItems: 'center',
      padding: '0 88px',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.87)'
    }

    const hrStyle = {
      boxSizing: 'border-box',
      height: '1px',
      backgroundColor: '#b8b8b8',
      margin: '8px 88px 12px 88px'
    }

    /* show resumeAll button when allPaused = true */
    let allPaused = true
    userTasks.forEach((task) => {
      if (!task.paused) {
        allPaused = false
      }
    })

    const list = []

    if (type === 'd' || type === 'u') {
      /* running task title */
      const runningTaskTitle = () => (
        <div>
          <div style={{ height: 24 }} />
          <div style={titileStyle} >
            <div style={{ width: 720, display: 'flex', alignItems: 'center', position: 'relative' }}>
              { this.renderProcessSum() }
            </div>
            <div style={{ flexGrow: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {
                allPaused
                  ? (
                    <FlatButton
                      label={i18n.__('Resume All')}
                      disabled={!userTasks.length}
                      icon={<PlaySvg style={{ color: '#000', opacity: 0.54 }} />}
                      onClick={() => this.handleAll(userTasks, 'RESUME')}
                    />
                  )
                  : (
                    <FlatButton
                      label={i18n.__('Pause All')}
                      disabled={!userTasks.length}
                      icon={<PauseSvg style={{ color: '#000', opacity: 0.54 }} />}
                      onClick={() => this.handleAll(userTasks, 'PAUSE')}
                    />
                  )
              }
              <FlatButton
                label={i18n.__('Clear All')}
                disabled={!userTasks.length}
                icon={<DeleteSvg style={{ color: '#000', opacity: 0.54 }} />}
                onClick={() => this.toggleDialog('clearRunningDialog')}
              />
            </div>
          </div>
        </div>
      )

      list.push(runningTaskTitle())

      /* running task list */
      list.push(...userTasks.map((task, index) => (
        <RunningTask
          ref={ref => (this.taskRefs[task.uuid] = ref)}
          key={task.uuid}
          trsType={task.trsType}
          index={index}
          task={task}
          pause={this.pause}
          resume={this.resume}
          select={this.select}
          delete={() => this.toggleDialog('deleteRunningDialog')}
          openErrorDialog={this.openErrorDialog}
        />
      )))
    } else if (type === 'f') {
      /* finished task title */
      const finishedTaskTitle = () => (
        <div>
          <div style={titileStyle}>
            <div style={{ flexGrow: 1 }}>
              { i18n.__('Finished Task Title %s', finishTasks.length) }
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FlatButton
                label={i18n.__('Clear All Record')}
                disabled={!finishTasks.length}
                icon={<DeleteSvg style={{ color: '#000', opacity: 0.54 }} />}
                onClick={() => this.toggleDialog('clearFinishedDialog')}
              />
            </div>
          </div>
          <div style={hrStyle} />
        </div>
      )

      list.push(finishedTaskTitle())

      /* finished task list */
      list.push(...finishTasks.map((task, index) => (
        <FinishedTask
          ref={ref => (this.taskRefs[task.uuid] = ref)}
          key={task.uuid}
          index={index}
          task={task}
          select={this.select}
          open={this.open}
          openInDrive={this.openInDrive}
          openErrorDialog={this.openErrorDialog}
        />
      )))
    }

    list.push(<div style={{ height: 56 }} />)

    /* rowCount */
    const rowCount = list.length

    /* rowHeight */
    const allHeight = []
    allHeight.length = rowCount
    allHeight.fill(56)
    allHeight[0] = 80
    const rowHeight = ({ index }) => allHeight[index]

    /* rowRenderer */
    const rowRenderer = ({ key, index, style }) => (
      <div key={key} style={style}>
        <div style={{ marginLeft: 20 }}>
          { list[index] }
        </div>
      </div>
    )
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowHeight={rowHeight}
              rowRenderer={rowRenderer}
              rowCount={rowCount}
              overscanRowCount={3}
              style={{ outline: 'none' }}
            />
          )}
        </AutoSizer>

        {/* menu */}
        {
          this.state.menuShow && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
              onClick={this.hideMenu}
            >
              <Paper style={{ position: 'absolute', top: this.state.y, left: this.state.x }}>
                <Menu>
                  {
                    this.state.play &&
                      <MenuItem
                        primaryText={this.state.tasks[0].state === 'failed' ? i18n.__('Retry') : i18n.__('Resume')}
                        onClick={() => this.handleAll(this.state.tasks, 'RESUME')}
                      />
                  }
                  {
                    this.state.pause &&
                      <MenuItem primaryText={i18n.__('Pause')} onClick={() => this.handleAll(this.state.tasks, 'PAUSE')} />
                  }
                  {
                    this.state.tasks.length === 1 && this.state.tasks[0].trsType === 'download' &&
                      <MenuItem primaryText={i18n.__('Open Downloads Folder')} onClick={this.open} />
                  }
                  {
                    this.state.tasks.length === 1 && this.state.tasks[0].trsType === 'upload' &&
                      <MenuItem primaryText={i18n.__('Show in Folder')} onClick={this.openInDrive} />
                  }
                  {
                    this.state.play &&
                      <MenuItem primaryText={i18n.__('Delete')} onClick={() => this.toggleDialog('deleteRunningDialog')} />
                  }
                  {
                    this.state.tasks[0].state === 'finished' &&
                      <MenuItem primaryText={i18n.__('Delete')} onClick={() => this.handleAll(this.state.tasks, 'DELETE')} />
                  }
                </Menu>
              </Paper>
            </div>
          )
        }
        {/* Delete Runing Tasks Dialog */}
        <DialogOverlay open={!!this.state.deleteRunningDialog}>
          <div>
            {
              this.state.deleteRunningDialog &&
                <div style={{ width: 320, padding: '24px 24px 0px 24px' }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: 'rgba(0,0,0,0.87)' }}>
                    { i18n.__('Delete Running Task Dialog Text 1') }
                  </div>
                  <div style={{ height: 20 }} />
                  <div style={{ color: 'rgba(0,0,0,0.54)' }}>
                    { i18n.__('Delete Running Task Dialog Text 2') }
                  </div>
                  <div style={{ height: 24 }} />
                  <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: -24 }}>
                    <FlatButton
                      primary
                      keyboardFocused
                      label={i18n.__('Cancel')}
                      onClick={() => this.toggleDialog('deleteRunningDialog')}
                    />
                    <FlatButton
                      label={i18n.__('Confirm')}
                      primary
                      onClick={() => {
                        this.toggleDialog('deleteRunningDialog')
                        this.handleAll(this.state.tasks, 'DELETE')
                      }}
                    />
                  </div>
                </div>
            }
          </div>
        </DialogOverlay>

        {/* clear Running Tasks dialog */}
        <DialogOverlay open={!!this.state.clearRunningDialog}>
          <div>
            {
              this.state.clearRunningDialog &&
                <div style={{ width: 320, padding: '24px 24px 0px 24px' }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: 'rgba(0,0,0,0.87)' }}>
                    { i18n.__('Clear Running Task Dialog Text 1') }
                  </div>
                  <div style={{ height: 20 }} />
                  <div style={{ color: 'rgba(0,0,0,0.54)' }}>
                    { i18n.__('Clear Running Task Dialog Text 2') }
                  </div>
                  <div style={{ height: 24 }} />
                  <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: -24 }}>
                    <FlatButton
                      primary
                      keyboardFocused
                      label={i18n.__('Cancel')}
                      onClick={() => this.toggleDialog('clearRunningDialog')}
                    />
                    <FlatButton
                      label={i18n.__('Delete')}
                      primary
                      onClick={() => {
                        this.toggleDialog('clearRunningDialog')
                        this.handleAll(userTasks, 'DELETE')
                      }}
                    />
                  </div>
                </div>
            }
          </div>
        </DialogOverlay>

        {/* clear Finished Tasks dialog */}
        <DialogOverlay open={!!this.state.clearFinishedDialog}>
          <div>
            {
              this.state.clearFinishedDialog &&
                <div style={{ width: 320, padding: '24px 24px 0px 24px' }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: 'rgba(0,0,0,0.87)' }}>
                    { i18n.__('Clear Finished Task Dialog Text 1') }
                  </div>
                  <div style={{ height: 20 }} />
                  <div style={{ color: 'rgba(0,0,0,0.54)' }}>
                    { i18n.__('Clear Finished Task Dialog Text 2') }
                  </div>
                  <div style={{ height: 24 }} />
                  <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: -24 }}>
                    <FlatButton
                      label={i18n.__('Cancel')}
                      primary
                      onClick={() => this.toggleDialog('clearFinishedDialog')}
                      keyboardFocused
                    />
                    <FlatButton
                      label={i18n.__('Clear')}
                      primary
                      onClick={() => {
                        this.handleAll(this.state.finishTasks, 'DELETE')
                        this.toggleDialog('clearFinishedDialog')
                      }}
                    />
                  </div>
                </div>
            }
          </div>
        </DialogOverlay>

        {/* error dialog */}
        <PureDialog open={!!this.state.errors} onRequestClose={() => this.setState({ errors: null })} >
          {
            this.state.errors &&
              <ErrorDialogInTrans
                errors={this.state.errors}
                resume={this.resume}
                ignore={this.ignore}
                finished={this.state.finished}
                onRequestClose={() => this.setState({ errors: null })}
              />
          }
        </PureDialog>
      </div>
    )
  }
}

export default TrsContainer
