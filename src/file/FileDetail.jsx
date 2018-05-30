import i18n from 'i18n'
import React from 'react'
import prettysize from 'prettysize'
import { Divider } from 'material-ui'
import { LIButton } from '../common/Buttons'
import { TypeSmallIcon, LocationSmallIcon, SizeSmallIcon, ContentSmallIcon, MTimeSmallIcon, CloseIcon, AllFileIcon, PublicIcon } from '../common/Svg'
import renderFileIcon from '../common/renderFileIcon'

const phaseDate = (time) => {
  const a = new Date(time)
  const year = a.getFullYear()
  const month = a.getMonth() + 1
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes()
  if (!year) return ''
  return i18n.__('Parse Date Time %s %s %s %s %s', year, month, date, hour, min)
}

const getType = (item) => {
  const type = item && item.type
  if (type === 'public') return i18n.__('Public Drive')
  if (type === 'directory') return i18n.__('Directory')
  if (type === 'file') return i18n.__('File')
  return i18n.__('Unknown File Type')
}

const getPath = (path) => {
  const newPath = []
  path.map((item, index) => {
    if (!index) {
      newPath.push(item.type === 'publicRoot' ? i18n.__('Public Drive') : i18n.__('Home Title'))
    } else {
      newPath.push(item.name)
    }
    return null
  })
  return newPath.join('/')
}

class FileDetail extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: null,
      loading: true
    }

    this.getData = () => {
      const { selected, entries, path } = this.props
      const entry = entries[selected[0]]
      if (!entry) return
      /* directory */
      if (selected.length === 1 && entry.type === 'directory') {
        this.props.apis.pureRequest('listNavDir', { driveUUID: path[0].uuid, dirUUID: entry.uuid }, (err, res) => {
          console.log('this.getData', err, res)
        })
      }
    }
  }

  componentDidMount () {
    this.getData()
  }

  renderList (icons, titles, values) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
        {
          values.map((value, index) => {
            if (!value) return (<div key={index.toString()} />)
            const Icon = icons[index]
            const title = titles[index]
            return (
              <div
                key={index.toString()}
                style={{ height: 40, color: '#525a60', display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <div style={{ margin: '2px 2px 0px -5px' }}> <Icon style={{ color: '#85868c' }} /> </div>
                <div style={{ width: 100 }}> { title } </div>
                <input
                  onChange={() => {}}
                  value={value}
                  style={{
                    width: 200,
                    border: 0,
                    padding: 3,
                    fontSize: 14,
                    color: '#888a8c',
                    textAlign: 'right',
                    backgroundColor: '#FFF'
                  }}
                />
              </div>
            )
          })
        }
      </div>
    )
  }

  render () {
    console.log('detail', this.props)
    const { selected, entries, path } = this.props
    const entry = entries[selected[0]]
    if (!entry) return <div />

    const isFile = selected.length === 1 && entry.type === 'file'
    // const isFolder = selected.length === 1 && entry.type === 'directory'
    const isMultiple = selected.length > 1

    const Icons = [
      TypeSmallIcon,
      LocationSmallIcon,
      SizeSmallIcon,
      ContentSmallIcon,
      MTimeSmallIcon
    ]

    const Titles = [
      i18n.__('Type'),
      i18n.__('Location'),
      i18n.__('Size'),
      i18n.__('Fold Content'),
      i18n.__('Date Modified')
    ]

    const Values = [
      isMultiple ? i18n.__('Multiple Items') : getType(entry),
      getPath(path),
      isFile ? prettysize(entry.size, false, true, 2) : '',
      !isFile ? 'TODO' : '',
      !isMultiple ? phaseDate(entry.mtime) : ''
    ]

    return (
      <div style={{ width: 280, margin: '0 20px 20px 20px' }}>
        <div style={{ height: 59, display: 'flex', alignItems: 'center' }} className="title">
          <div style={{ display: 'flex', alignItems: 'center', height: 59 }} >
            { i18n.__('Properties') }
          </div>
          <div style={{ flexGrow: 1 }} />
          <div style={{ marginRight: -10 }}>
            <LIButton onClick={this.props.onRequestClose} >
              <CloseIcon />
            </LIButton>
          </div>
        </div>
        <Divider style={{ width: 280 }} className="divider" />
        <div style={{ height: 20 }} />

        <div style={{ height: 60, display: 'flex', alignItems: 'center' }} >
          <div style={{ marginRight: 4, marginLeft: -6 }} className="flexCenter">
            {
              entry.type === 'public' ? <PublicIcon style={{ width: 60, height: 60, color: '#ffa93e' }} />
                : entry.type === 'file' ? renderFileIcon(entry.name, entry.metadata, 60)
                  : <AllFileIcon style={{ width: 60, height: 60, color: '#ffa93e' }} />
            }
          </div>
          <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', color: '#525a60' }} >
            <div
              style={{
                maxWidth: selected.length > 1 ? 120 : 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              { entry.name }
            </div>
            <div>
              { selected.length > 1 && i18n.__('And Other %s Items', selected.length)}
            </div>
          </div>
        </div>

        <div style={{ height: 10 }} />
        {/* data */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          { this.renderList(Icons, Titles, Values) }
        </div>
      </div>
    )
  }
}

export default FileDetail
