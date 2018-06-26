import React from 'react'
import TransCount from './TransCount'
import { Button } from '../common/Buttons'

class MenuItem extends Button {
  render () {
    const { text, selected, type, index } = this.props

    const Icon = this.props.icon

    const backgroundColor = selected ? '#FFF' : this.state.hover ? '#BBDEFB' : undefined

    return (
      <div
        style={{
          width: 220,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor
        }}
        {...this.funcs}
      >
        <div style={{ flexGrow: 1 }} />
        <Icon style={{ width: 30, height: 30 }} />
        <div style={{ flex: '0 0 8px' }} />
        <div style={{ fontSize: 16, color: '#525a60' }}>
          { text }
        </div>
        <div style={{ flex: '0 0 16px' }} />
        <div style={{ flexGrow: 1 }} />
        <div style={{ position: 'absolute', top: 0, left: 220 * index + 150, width: 30, height: 30 }} >
          <TransCount type={type} />
        </div>
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
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%', backgroundColor: '#e1edfe' }}>
        {
          Object.keys(views)
            .filter(key => views[key].navGroup() === group)
            .map((key, index) => (
              <MenuItem
                key={key}
                type={key}
                index={index}
                icon={views[key].menuIcon()}
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
