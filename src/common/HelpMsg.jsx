import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'
import { ArrowIcon, SmallErrorIcon } from '../common/Svg'

class Help extends React.PureComponent {
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
          color: '#85868c',
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

  render () {
    console.log('HelpMsg', this.props)
    let content = null
    switch (this.props.nav) {
      case 'home':
        content = this.renderHome()
        break
      case 'photo':
        break
      default:
        break
    }
    return (
      <div style={{ width: 280 }} >
        <div style={{ height: 60, display: 'flex', alignItems: 'center', paddingLeft: 20 }} className="title">
          { i18n.__('Home Help Title') }
        </div>
        <Divider style={{ marginLeft: 20, width: 280 }} className="divider" />
        <div style={{ height: 20 }} />
        { content }
      </div>
    )
  }
}

export default Help
