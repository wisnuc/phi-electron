import React from 'react'
import i18n from 'i18n'
import MultiSvg from 'material-ui/svg-icons/content/content-copy'
import renderFileIcon from '../common/renderFileIcon'
import { FolderIcon, OpenFolderIcon, TaskDeleteIcon, ArrowIcon } from '../common/Svg'
import { LIButton } from '../common/IconButton'

const svgStyle = { color: '#000', opacity: 0.54 }

class FinishedTask extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isSelected: false
    }

    this.createDate = new Date()

    this.openFileLocation = (task) => {
      if (this.props.task.trsType === 'download') setImmediate(() => this.props.open(task))
      else setImmediate(() => this.props.openInDrive(task))
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.state !== nextState)
  }

  formatSize (s) {
    const size = parseFloat(s, 10)
    if (!size) return `${0} KB`
    if (size < 1024) return `${size.toFixed(2)} B`
    else if (size < (1024 * 1024)) return `${(size / 1024).toFixed(2)} KB`
    else if (size < (1024 * 1024 * 1024)) return `${(size / 1024 / 1024).toFixed(2)} MB`
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  getFinishDate (d) {
    const date = new Date()
    if (typeof d === 'number') {
      date.setTime(d)
    } else {
      return '-'
    }
    const year = date.getFullYear()
    const mouth = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return `${year}-${mouth}-${day} ${hour}:${minute}`
  }

  render () {
    console.log('Finished', this.props)
    const { index, task } = this.props
    const backgroundColor = this.state.isSelected ? '#f4f4f4' : index % 2 ? '#fafbfc' : '#FFF'

    return (
      <div style={{ display: 'flex', alignItems: 'center', height: 60, backgroundColor }} >
        {/* task item type */}
        <div style={{ width: 33, paddingLeft: 17, display: 'flex', alignItems: 'center' }}>
          {
            task.entries.length > 1 ? <MultiSvg style={svgStyle} />
              : task.taskType === 'file' ? renderFileIcon(task.name, null, 30)
                : <FolderIcon style={{ width: 30, height: 30 }} />
          }
        </div>

        {/* task item name */}
        <div style={{ width: 'calc(100% - 683px)', padding: '20px 0 20px 12px', display: 'flex', alignItems: 'center', height: 60 }} >
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#525a60', letterSpacing: 1.4 }}>
            { task.name }
          </div>
        </div>

        <div style={{ width: 200, color: '#888a8c', fontSize: 12 }} >
          { this.formatSize(task.size) }
        </div>

        <div style={{ width: 30 }} className="flexCenter">
          <ArrowIcon
            style={task.trsType === 'upload' ? { color: '#4dbc72', transform: 'rotate(180deg)' } : { color: '#8a69ed' }}
          />
        </div>

        <div style={{ width: 220, color: '#888a8c', fontSize: 12 }} >
          { this.getFinishDate(task.finishDate) }
        </div>

        <div style={{ width: 170, display: 'flex', alignItems: 'center' }} >
          <div style={{ width: 40 }} />
          <LIButton onClick={() => this.openFileLocation(task)} tooltip={task.paused ? i18n.__('Resume') : i18n.__('Pause')} >
            <OpenFolderIcon />
          </LIButton>
          <LIButton
            onClick={() => this.props.handleAll([task], 'DELETE')}
            tooltip={i18n.__('Delete')}
          >
            <TaskDeleteIcon />
          </LIButton>
          <div style={{ width: 30 }} />
        </div>
      </div>
    )
  }
}

export default FinishedTask
