import React from 'react'
import i18n from 'i18n'
import Radium from 'radium'

class SubHeader extends React.PureComponent {
  render () {
    return (
      <div
        style={{ height: 48,
          fontSize: 14,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          color: 'rgba(0,0,0,0.54)' }}
      >
        <div style={{ flex: '0 0 24px' }} />
        { this.props.children }
      </div>
    )
  }
}

@Radium
class MenuItem extends React.PureComponent {
  render () {
    const { text, dense, primaryColor, selected, disabled } = this.props

    const iconColor = selected ? primaryColor : (disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.54)')
    const fontColor = selected ? primaryColor : (disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)')

    return (
      <div
        style={{
          width: '100%',
          height: dense ? 40 : 48,
          display: 'flex',
          alignItems: 'center',
          ':hover': { backgroundColor: '#EEEEEE' },
          backgroundColor: selected ? '#F5F5F5' : '#FFF'
        }}
        onTouchTap={this.props.onTouchTap}
      >
        <div style={{ flex: '0 0 24px' }} />
        <this.props.icon style={{ width: dense ? 18 : 24, height: dense ? 18 : 24, color: iconColor }} />
        <div style={{ flex: '0 0 32px' }} />
        <div style={{ flexGrow: 1, fontSize: dense ? 13 : 14, color: fontColor, fontWeight: 500 }}>
          {text}
        </div>
        <div style={{ flex: '0 0 16px' }} />
      </div>
    )
  }
}

@Radium
class NavDrawer extends React.Component {
  render () {
    console.log(' NavDrawer render', this.props)
    const { views, nav, navTo } = this.props
    const primaryColor = views[nav].primaryColor()

    return (
      <div style={{ width: '100%', height: '100%' }} >
        <SubHeader>{ i18n.__('Box Title') }</SubHeader>

        <MenuItem
          icon={views.home.menuIcon()}
          text={i18n.__('All Files')}
          primaryColor={primaryColor}
          selected={nav === 'home'}
          onTouchTap={() => navTo('home')}
        />

        <MenuItem
          icon={views.media.menuIcon()}
          text={i18n.__('Photos')}
          primaryColor={primaryColor}
          selected={nav === 'media'}
          onTouchTap={() => navTo('media')}
        />

        <MenuItem
          icon={views.media.menuIcon()}
          text={i18n.__('Audio')}
          primaryColor={primaryColor}
          selected={nav === 'audio'}
          onTouchTap={() => navTo('audio')}
        />

        <MenuItem
          icon={views.media.menuIcon()}
          text={i18n.__('Docs')}
          primaryColor={primaryColor}
          selected={nav === 'docs'}
          onTouchTap={() => navTo('docs')}
        />

        <MenuItem
          icon={views.media.menuIcon()}
          text={i18n.__('Video')}
          primaryColor={primaryColor}
          selected={nav === 'video'}
          onTouchTap={() => navTo('video')}
        />
      </div>
    )
  }
}

export default NavDrawer
