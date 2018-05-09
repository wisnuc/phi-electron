import i18n from 'i18n'
import React from 'react'
import { Popover, MenuItem } from 'material-ui'
import ADD from 'material-ui/svg-icons/navigation/arrow-drop-down'
import { PersonIcon, UsersIcon, LogoutIcon } from '../common/Svg'

class Account extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, show: false }

    this.openPop = (e) => {
      e.preventDefault()
      clearTimeout(this.timer)
      this.setState({ open: true, show: false, anchorEl: e.currentTarget })
      /* hide the status of position move */
      this.timer = setTimeout(() => this.setState({ show: true }))
    }
  }

  componetWillUnmount () {
    clearTimeout(this.timer)
  }

  render () {
    const color = 'rgba(255, 255, 255, 0.7)'

    const iconStyle = { marginLeft: 30, marginTop: 5, width: 30, height: 30, color: '#7d868f' }
    const items = [
      { primaryText: i18n.__('Account Settings'), leftIcon: <PersonIcon style={iconStyle} />, onClick: () => {} },
      { primaryText: i18n.__('Users Management'), leftIcon: <UsersIcon style={iconStyle} />, onClick: () => {} },
      { primaryText: i18n.__('Log Out'), leftIcon: <LogoutIcon style={iconStyle} />, onClick: this.props.logout }
    ]
    return (
      <div
        style={{
          height: 30,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          WebkitAppRegion: 'no-drag'
        }}
        onClick={this.openPop}
      >
        <div>
          <img src="./assets/images/avator-default.png" alt="" width={30} height={30} />
        </div>
        <div style={{ paddingLeft: 10, color }}>
          { 'Brown' }
        </div>

        <div
          style={{
            width: 26,
            height: 26,
            padding: 4,
            margin: '0 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ADD color={color} />
        </div>

        <div style={{ height: 12, width: 1, backgroundColor: color, opacity: 0.3 }} />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={() => this.setState({ open: false })}
          style={{ boxShadow: '0px 10px 20px 0 rgba(23, 99, 207, 0.1)', opacity: this.state.show ? 1 : 0 }}
        >
          <div style={{ width: 125, maxWidth: 125, height: 130, overflow: 'hidden' }} >
            {
              items.map((props, index) => (
                <MenuItem
                  {...props}
                  key={index.toString()}
                  style={{
                    marginLeft: -24,
                    WebkitAppRegion: 'no-drag',
                    marginTop: !index ? 5 : 0,
                    fontSize: 14,
                    color: '#505259',
                    height: 40,
                    minHeight: 40,
                    lineHeight: '40px'
                  }}
                />
              ))
            }
            <div style={{ height: 5, width: '100%' }} />
          </div>
        </Popover>
      </div>
    )
  }
}

export default Account
