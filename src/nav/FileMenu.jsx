import i18n from 'i18n'
import React from 'react'
import { RaisedButton } from 'material-ui'

class MenuItem extends React.PureComponent {
  render () {
    const { text, selected } = this.props
    const Icon = this.props.icon

    const iconColor = selected ? '#FFF' : '#505259'
    const fontColor = selected ? '#FFF' : '#505259'
    const buttonColor = selected ? '#627ee5' : ''
    const boxShadow = selected ? '0px 3px 10px 0 rgba(98, 126, 229, 0.35)' : ''
    const zIndex = selected ? 100 : 1

    const borderRadius = 4

    return (
      <div
        style={{
          width: 220,
          height: 50,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <RaisedButton
          label={text}
          labelColor={fontColor}
          labelStyle={{ position: 'absolute', top: 0, left: 65 }}
          backgroundColor={buttonColor}
          style={{ borderRadius, width: 190, height: 41, boxShadow, zIndex }}
          buttonStyle={{ borderRadius }}
          onClick={this.props.onClick}
        >
          <Icon style={{ position: 'absolute', top: 9, left: 33, width: 24, height: 24, color: iconColor }} />
        </RaisedButton>
      </div>
    )
  }
}

class NavDrawer extends React.Component {
  render () {
    const { views, nav, navTo } = this.props
    const primaryColor = views[nav].primaryColor()

    return (
      <div style={{ width: '100%', height: '100%' }} >
        <div
          style={{
            height: 50,
            fontSize: 16,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#505259'
          }}
        >
          { i18n.__('File Menu Title') }
        </div>

        <MenuItem
          icon={views.home.menuIcon()}
          text={i18n.__('All Files')}
          primaryColor={primaryColor}
          selected={nav === 'home'}
          onClick={() => navTo('home')}
        />

        <MenuItem
          icon={views.media.menuIcon()}
          text={i18n.__('Photos')}
          primaryColor={primaryColor}
          selected={nav === 'media'}
          onClick={() => navTo('media')}
        />

        <MenuItem
          icon={views.media.menuIcon()}
          text={i18n.__('Audio')}
          primaryColor={primaryColor}
          selected={nav === 'audio'}
          onClick={() => navTo('audio')}
        />

        <MenuItem
          icon={views.media.menuIcon()}
          text={i18n.__('Docs')}
          primaryColor={primaryColor}
          selected={nav === 'docs'}
          onClick={() => navTo('docs')}
        />

        <MenuItem
          icon={views.media.menuIcon()}
          text={i18n.__('Video')}
          primaryColor={primaryColor}
          selected={nav === 'video'}
          onClick={() => navTo('video')}
        />
      </div>
    )
  }
}

export default NavDrawer
