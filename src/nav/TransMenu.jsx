import React from 'react'
import Radium from 'radium'

const backgroundColor = '#E3F2FD'

@Radium
class MenuItem extends React.PureComponent {
  render () {
    const { text, primaryColor, selected } = this.props

    const iconColor = selected ? primaryColor : 'rgba(0,0,0,0.54)'
    const fontColor = selected ? primaryColor : 'rgba(0,0,0,0.87)'
    const Icon = this.props.icon

    return (
      <div
        style={{
          width: 270,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          ':hover': { backgroundColor: '#BBDEFB' },
          backgroundColor: selected ? '#FFF' : backgroundColor
        }}
        onClick={this.props.onClick}
      >
        <div style={{ flexGrow: 1 }} />
        <Icon style={{ width: 24, height: 24, color: iconColor }} />
        <div style={{ flex: '0 0 8px' }} />
        <div style={{ fontSize: 14, color: fontColor, fontWeight: 500 }}>
          { text }
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

    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%', backgroundColor }}>
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
