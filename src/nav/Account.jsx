import i18n from 'i18n'
import React from 'react'
import { Popover, Menu, MenuItem, IconButton } from 'material-ui'
import AccountIcon from 'material-ui/svg-icons/action/account-circle'
import ADD from 'material-ui/svg-icons/navigation/arrow-drop-down'
import { UploadFile, UploadFold } from '../common/Svg'

class Account extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false }

    this.upload = (type) => {
      this.props.upload(type)
      this.setState({ open: false })
    }

    this.openPop = (e) => {
      e.preventDefault()
      this.setState({ open: true, anchorEl: e.currentTarget })
    }
  }

  render () {
    const color = 'rgba(0,0,0,.54)'
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <AccountIcon />
        </div>
        <div style={{ padding: 4 }}>
          { 'username' }
        </div>

        <IconButton
          onClick={this.openPop}
          iconStyle={{ width: 18, height: 18, color }}
          style={{ width: 26, height: 26, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ADD />}
        </IconButton>
        <Popover
          open={this.state.open}
          animated
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={() => this.setState({ open: false })}
        >
          <Menu style={{ minWidth: 240 }}>
            <MenuItem
              primaryText={i18n.__('Account Settings')}
              leftIcon={<UploadFold />}
              onClick={() => {}}
              style={{ fontSize: 13 }}
            />
            <MenuItem
              primaryText={i18n.__('Users Management')}
              leftIcon={<UploadFile />}
              onClick={() => {}}
              style={{ fontSize: 13 }}
            />
            <MenuItem
              primaryText={i18n.__('Log Out')}
              leftIcon={<UploadFile />}
              onClick={() => {}}
              style={{ fontSize: 13 }}
            />
          </Menu>
        </Popover>
      </div>
    )
  }
}

export default Account
