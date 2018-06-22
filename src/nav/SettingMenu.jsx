import React from 'react'
import { Button } from '../common/Buttons'

class MenuCard extends Button {
  render () {
    const { Icon, name, des, onClick, isLAN, view } = this.props
    const disabled = isLAN && view === 'resetDevice'
    const backgroundColor = this.state.hover ? '#f3f8ff' : '#fff'
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          filter: disabled ? 'grayscale(100%)' : '',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        className="flexCenter"
      >
        <div
          {...this.funcs}
          style={{ width: 250, height: 120, display: 'flex', alignItems: 'center', backgroundColor }}
          onClick={() => !disabled && onClick()}
          disabled={disabled}
        >
          <div style={{ width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon />
          </div>
          <div style={{ width: 180, display: 'flex', flexDirection: 'column' }} >
            <div style={{ fontSize: 16, color: '#525a60' }}>
              { name }
            </div>
            <div style={{ height: 10 }} />
            <div style={{ fontSize: 12, color: '#888a8c' }}>
              { des }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Menu extends React.Component {
  render () {
    const { views, navTo } = this.props
    const group = 'settings'
    let list = Object.keys(views).filter(key => views[key].navGroup() === group && key !== 'settings')
    if (!this.props.isAdmin) list = [...list].slice(0, -2)
    return (
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', paddingBottom: 130 }} className="flexCenter" >
        <div
          style={{
            width: 1000,
            height: 360,
            display: 'grid',
            gridGap: 0,
            gridTemplateColumns: '1fr 1fr 1fr 1fr'
          }}
        >
          {
            [...list].map((key, i) => (
              <MenuCard
                key={key + i.toString()}
                Icon={views[key].menuIcon()}
                name={views[key].menuName()}
                des={views[key].menuDes()}
                onClick={() => navTo(key)}
                isLAN={this.props.isLAN}
                view={key}
              />
            ))
          }
        </div>
      </div>
    )
  }
}

export default Menu
