import React from 'react'
import Radium from 'radium'

@Radium
class MenuItem extends React.PureComponent {
  render () {
    const { text, dense, primaryColor, selected, disabled } = this.props

    const iconColor = selected ? primaryColor : (disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.54)')
    const fontColor = selected ? primaryColor : (disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)')
    const Icon = this.props.icon

    return (
      <div
        style={{
          width: 270,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          ':hover': { backgroundColor: '#EEEEEE' },
          backgroundColor: selected ? '#F5F5F5' : '#FFF'
        }}
        onClick={this.props.onClick}
      >
        <div style={{ flexGrow: 1 }} />
        <Icon style={{ width: dense ? 18 : 24, height: dense ? 18 : 24, color: iconColor }} />
        <div style={{ flex: '0 0 8px' }} />
        <div style={{ fontSize: 14, color: fontColor, fontWeight: 500 }}>
          {text}
        </div>
        <div style={{ flex: '0 0 16px' }} />
        <div style={{ flexGrow: 1 }} />
      </div>
    )
  }
}

class NavDrawer extends React.Component {
  render () {
    const { views, nav, navTo } = this.props
    const group = 'transmission'
    const primaryColor = views[nav].primaryColor()

    console.log('TransMenu', views, Object.keys(views).filter(key => views[key].navGroup() === group))
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
        {
          Object.keys(views)
            .filter(key => views[key].navGroup() === group)
            .map(key => (
              <MenuItem
                key={key}
                icon={views[key].menuIcon().icon}
                text={views[key].menuName()}
                primaryColor={primaryColor}
                selected={key === nav}
                onClick={() => navTo(key)}
              />
            ))
        }
      </div>
    )
  }
}

export default NavDrawer
