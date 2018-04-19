import i18n from 'i18n'
import React from 'react'
import { RaisedButton, Divider } from 'material-ui'

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
          paddingTop: 10,
          height: 40,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <RaisedButton
          disableTouchRipple
          label={text}
          labelColor={fontColor}
          labelStyle={{ position: 'absolute', top: 0, left: 65 }}
          backgroundColor={buttonColor}
          style={{ borderRadius, width: 190, height: 40, boxShadow, zIndex }}
          buttonStyle={{ borderRadius }}
          onClick={this.props.onClick}
        >
          <Icon style={{ position: 'absolute', top: 9, left: 33, width: 24, height: 24, fill: iconColor }} />
        </RaisedButton>
      </div>
    )
  }
}

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

  render () {
    const { views } = this.props
    const { nav } = this.state
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

        {
          ['home', 'photo', 'music', 'docs', 'video'].map(v => (
            <MenuItem
              key={v}
              icon={views[v].menuIcon()}
              text={views[v].menuName()}
              primaryColor={primaryColor}
              selected={nav === v}
              onClick={() => this.navTo(v)}
            />
          ))
        }

        <div style={{ height: 10 }} />
        <Divider style={{ marginLeft: 15, width: 180 }} className="divider" />

        {
          ['public'].map(v => (
            <MenuItem
              key={v}
              icon={views[v].menuIcon()}
              text={views[v].menuName()}
              primaryColor={primaryColor}
              selected={nav === v}
              onClick={() => this.navTo(v)}
            />
          ))
        }

        <div style={{ height: 10 }} />
        <Divider style={{ marginLeft: 15, width: 180 }} className="divider" />

        {
          ['usb'].map(v => (
            <MenuItem
              key={v}
              icon={views[v].menuIcon()}
              text={views[v].menuName()}
              primaryColor={primaryColor}
              selected={nav === v}
              onClick={() => this.navTo(v)}
            />
          ))
        }
      </div>
    )
  }
}

export default NavDrawer
