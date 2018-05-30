import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'
import { MenuButton } from '../common/Buttons'

class NavDrawer extends React.Component {
  constructor (props) {
    super(props)

    this.state = { nav: this.props.nav }

    this.navTo = (nav) => {
      this.setState({ nav })
    }
  }

  componentDidUpdate () {
    if (this.state.nav !== this.props.nav) this.props.navTo(this.state.nav)
  }

  renderUSB () {
    const { views } = this.props
    const { nav } = this.state
    return (
      <div>
        <div style={{ height: 10 }} />
        <Divider style={{ marginLeft: 15, width: 180 }} className="divider" />

        {
          ['usb'].map(v => (
            <MenuButton
              key={v}
              icon={views[v].menuIcon()}
              text={views[v].menuName()}
              selected={nav === v}
              onClick={() => this.navTo(v)}
            />
          ))
        }
      </div>
    )
  }

  render () {
    const { views } = this.props
    const { nav } = this.state

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

        {
          ['home', 'photo', 'music', 'docs', 'video'].map(v => (
            <MenuButton
              key={v}
              icon={views[v].menuIcon()}
              text={views[v].menuName()}
              selected={nav === v}
              onClick={() => this.navTo(v)}
            />
          ))
        }

        <div style={{ height: 10 }} />
        <Divider style={{ marginLeft: 15, width: 180 }} className="divider" />

        {
          ['public'].map(v => (
            <MenuButton
              key={v}
              icon={views[v].menuIcon()}
              text={views[v].menuName()}
              selected={nav === v}
              onClick={() => this.navTo(v)}
            />
          ))
        }

        { !!this.props.hasUSB && this.renderUSB() }
      </div>
    )
  }
}

export default NavDrawer
