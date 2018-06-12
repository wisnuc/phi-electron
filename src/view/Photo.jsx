import i18n from 'i18n'
import React from 'react'

import Home from './Home'
import Search from '../common/Search'
import sortByType from '../common/sort'
import { MyPicIcon } from '../common/Svg'

class Photo extends Home {
  constructor (ctx) {
    super(ctx)

    this.state = Object.assign(this.state, { gridView: true, isMedia: true })

    this.title = () => i18n.__('Photo Menu Name')

    this.isMedia = true // flag to disable toolbars or menuItems

    this.type = 'photos'

    this.types = 'JPEG.PNG.JPG.GIF.BMP.RAW'

    this.refresh = (op) => {
      const apis = this.ctx.props.apis
      const places = apis && apis.drives && apis.drives.data && apis.drives.data.map(d => d.uuid).join('.')
      this.ctx.props.apis.request(this.type, { places })
      if (op) this.setState({ scrollTo: op.fileName || op.uuid, loading: !op.noloading }) // fileName for files, uuid for drives
      else this.setState({ loading: true })
    }

    this.handleMediaProps = (nextProps, type) => {
      this.preValue = this.state[type]
      this.handleProps(nextProps.apis, [type])

      /* set force === true  to update sortType forcely */
      if (this.preValue === this.state[type] && !this.force) return

      const entries = this.state[type].map((entry) => {
        if (!entry || !entry.hash) return null
        // const { metadata } = entry
        // if (!metadata) return entry
        const newEntry = {
          type: 'file',
          size: 0,
          mtime: 1182376418760
          // size: metadata.size,
          // mtime: toTimeSecond(metadata.date || '')
        }
        return Object.assign({}, newEntry, entry)
      }).filter(e => !!e)
      const path = [{ name: this.title(), uuid: null, type: 'mediaRoot' }]
      const select = this.select.reset(entries.length)

      this.force = false

      /* sort entries, reset select, stop loading */
      this.setState({
        path, select, loading: false, entries: [...entries].sort((a, b) => sortByType(a, b, this.state.sortType))
      })
    }
  }

  willReceiveProps (nextProps) {
    this.handleMediaProps(nextProps, this.type)
  }

  navEnter (target) {
    this.isNavEnter = true
    const apis = this.ctx.props.apis
    if (!apis || !apis.drives || !apis.drives.data) return
    this.refresh()
  }

  menuName () {
    return this.title()
  }

  menuIcon () {
    return MyPicIcon
  }

  renderTitle ({ style }) {
    return (
      <div style={style}>
        <div style={{ fontSize: 20, color: 'var(--dark-text)', height: 70, marginLeft: 30, display: 'flex', alignItems: 'center' }}>
          { this.menuName() }
        </div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ marginRight: 15, height: 51, paddingTop: 19 }}>
          <Search fire={this.search} hint={i18n.__('Search') + this.title()} key={this.menuName()} clear={this.clearSearch} />
        </div>
      </div>
    )
  }
}

export default Photo
