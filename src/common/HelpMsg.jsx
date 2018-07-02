import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'
import { ArrowIcon, SmallErrorIcon } from '../common/Svg'

class Help extends React.PureComponent {
  renderHeader (text) {
    return (
      <div>
        <div style={{ height: 60, display: 'flex', alignItems: 'center', paddingLeft: 20 }} className="title">
          { text }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 20 }} />
      </div>
    )
  }

  renderTitle (text) {
    return (
      <div
        style={{
          width: 240,
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          lineHeight: '30px',
          letterSpacing: '0.4px',
          color: '#505259',
          marginBottom: 5
        }}
      >
        <ArrowIcon style={{ transform: 'rotate(-90deg) scaleY(1.5)', color: '#85868c', opacity: 0.5 }} />
        <span style={{ marginLeft: -5 }}> { text } </span>
      </div>
    )
  }

  renderText (text) {
    return (
      <div
        style={{
          width: 240,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          letterSpacing: '0.4px',
          color: '#85868c'
        }}
      >
        { text }
      </div>
    )
  }

  renderWarning (text) {
    return (
      <div
        style={{
          position: 'relative',
          width: 240,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          letterSpacing: '0.4px',
          color: '#85868c'
        }}
      >
        <span style={{ height: 30, top: -5, left: 12, display: 'inline', position: 'absolute' }}>
          <SmallErrorIcon style={{ color: '#85868c' }} />
        </span>
        <span style={{ textIndent: 20 }}>
          { text }
        </span>
      </div>
    )
  }

  renderHome () {
    return (
      <div>
        { this.renderHeader(i18n.__('Home Help Header')) }
        { this.renderText(i18n.__('Home Help Summary Text')) }
        <div style={{ height: 20 }} />
        { this.renderTitle(i18n.__('Upload')) }
        { this.renderText(i18n.__('Home Help Upload Text')) }
        <div style={{ height: 20 }} />
        { this.renderTitle(i18n.__('Download')) }
        { this.renderText(i18n.__('Home Help Download Text')) }
        <div style={{ height: 20 }} />
        { this.renderWarning(i18n.__('Home Help Warning Text')) }
      </div>
    )
  }

  renderPhoto () {
    return (
      <div>
        { this.renderHeader(i18n.__('Photo Help Header')) }
        { this.renderText(i18n.__('Photo Help Summary Text')) }
        <div style={{ height: 20 }} />
        { this.renderWarning(i18n.__('Photo Help Warning Text')) }
      </div>
    )
  }

  renderMusic () {
    return (
      <div>
        { this.renderHeader(i18n.__('Music Help Header')) }
        { this.renderText(i18n.__('Music Help Summary Text')) }
        <div style={{ height: 20 }} />
        { this.renderWarning(i18n.__('Music Help Warning Text')) }
      </div>
    )
  }

  renderDocs () {
    return (
      <div>
        { this.renderHeader(i18n.__('Docs Help Header')) }
        { this.renderText(i18n.__('Docs Help Summary Text')) }
        <div style={{ height: 20 }} />
        { this.renderWarning(i18n.__('Docs Help Warning Text')) }
      </div>
    )
  }

  renderVideo () {
    return (
      <div>
        { this.renderHeader(i18n.__('Video Help Header')) }
        { this.renderText(i18n.__('Video Help Summary Text')) }
        <div style={{ height: 20 }} />
        { this.renderWarning(i18n.__('Video Help Warning Text')) }
      </div>
    )
  }

  renderPublicContent () {
    return (
      <div>
        { this.renderHeader(i18n.__('Public Help Header')) }
        { this.renderText(i18n.__('Public Help Summary Text')) }
        <div style={{ height: 20 }} />
        { this.renderTitle(i18n.__('Upload')) }
        { this.renderText(i18n.__('Public Help Upload Text')) }
        <div style={{ height: 20 }} />
        { this.renderTitle(i18n.__('Download')) }
        { this.renderText(i18n.__('Public Help Download Text')) }
        <div style={{ height: 20 }} />
        { this.renderWarning(i18n.__('Public Help Warning Text')) }
      </div>
    )
  }

  renderAdminPublic () {
    return (
      <div>
        { this.renderHeader(i18n.__('Public Help Header For Admin User')) }

        { this.renderText(i18n.__('Public Summary Text For Admin User')) }

        <div style={{ height: 20 }} />
        { this.renderTitle(i18n.__('Add New Public Title')) }
        { this.renderText(i18n.__('Add New Public Text')) }
        { this.renderText(i18n.__('Add New Public Tip 1')) }
        { this.renderText(i18n.__('Add New Public Tip 2')) }
        { this.renderText(i18n.__('Add New Public Tip 3')) }

        <div style={{ height: 20 }} />
        { this.renderTitle(i18n.__('Modify Public Title')) }
        { this.renderText(i18n.__('Modify Public Text'))}

        <div style={{ height: 20 }} />
        { this.renderTitle(i18n.__('Delete Public Title')) }
        { this.renderText(i18n.__('Delete Public Text'))}

        <div style={{ height: 20 }} />
        { this.renderWarning(i18n.__('Public Warning Text For Admin User')) }
        { this.renderText(i18n.__('Public Warning Tip 1')) }
        { this.renderText(i18n.__('Public Warning Tip 2')) }
        { this.renderText(i18n.__('Public Warning Tip 3')) }
        <div style={{ height: 20 }} />
      </div>
    )
  }

  renderNormalPublic () {
    return (
      <div>
        { this.renderHeader(i18n.__('Public Help Header For Normal User')) }
        { this.renderText(i18n.__('Public Summary Text For Normal User')) }
      </div>
    )
  }

  renderUSB () {
    return (
      <div>
        { this.renderHeader(i18n.__('USB Help Header')) }
        { this.renderText(i18n.__('USB Help Summary Text')) }
        <div style={{ height: 20 }} />
        { this.renderTitle(i18n.__('Upload')) }
        { this.renderText(i18n.__('USB Help Upload Text')) }
        <div style={{ height: 20 }} />
        { this.renderTitle(i18n.__('Download')) }
        { this.renderText(i18n.__('USB Help Download Text')) }
        <div style={{ height: 20 }} />
        { this.renderWarning(i18n.__('USB Help Warning Text')) }
      </div>
    )
  }

  render () {
    let content = null
    switch (this.props.nav) {
      case 'home':
        content = this.renderHome()
        break
      case 'photo':
        content = this.renderPhoto()
        break
      case 'music':
        content = this.renderMusic()
        break
      case 'docs':
        content = this.renderDocs()
        break
      case 'video':
        content = this.renderVideo()
        break
      case 'public':
        if (this.props.isPublicContent) content = this.renderPublicContent()
        else if (this.props.isAdmin) content = this.renderAdminPublic()
        else content = this.renderNormalPublic()
        break
      case 'usb':
        content = this.renderUSB()
        break
      default:
        break
    }
    return (
      <div style={{ width: 280 }}>
        { content }
      </div>
    )
  }
}

export default Help