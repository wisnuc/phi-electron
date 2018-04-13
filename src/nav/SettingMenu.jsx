import React from 'react'
import { Paper } from 'material-ui'

class MenuCard extends React.PureComponent {
  render () {
    const { Icon, name, des, onClick } = this.props
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        <Paper
          style={{ width: 360, height: 120, display: 'flex', alignItems: 'center' }}
          onClick={onClick}
        >
          <div style={{ width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon />
          </div>
          <div style={{ width: 180, display: 'flex', flexDirection: 'column' }} >
            <div style={{ fontWeight: 500 }}>
              { name }
            </div>
            <div style={{ fontSize: 14 }}>
              { des }
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

class Menu extends React.Component {
  render () {
    const { views, navTo } = this.props
    const group = 'settings'
    return (
      <div
        style={{
          padding: 96,
          width: 'calc(100% - 192px)',
          display: 'grid',
          gridGap: 24,
          gridTemplateColumns: '1fr 1fr 1fr'
        }}
      >
        {
          Object.keys(views)
            .filter(key => views[key].navGroup() === group && key !== 'settings')
            .map((key, i) => (
              <MenuCard
                key={key}
                Icon={views[key].menuIcon()}
                name={views[key].menuName()}
                des={views[key].menuDes()}
                onClick={() => navTo(key)}
              />
            ))
        }
      </div>
    )
  }
}

export default Menu
