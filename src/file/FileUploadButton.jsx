import i18n from 'i18n'
import React from 'react'
import { Popover, Menu, MenuItem } from 'material-ui'
import FlatButton from '../common/FlatButton'
import { UploadFile, UploadFold, UploadIcon } from '../common/Svg'

class FileUploadButton extends React.Component {
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
    const color = '#7d868f'
    const iconStyle = { fill: color, width: 20, height: 20 }
    return (
      <div>
        <FlatButton
          onClick={this.openPop}
          label={i18n.__('Upload')}
          labelStyle={{ fontSize: 14, marginLeft: 4 }}
          icon={<UploadIcon style={iconStyle} />}
        />
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
              primaryText={i18n.__('Upload Folder')}
              leftIcon={<UploadFold />}
              onClick={() => this.upload('directory')}
              style={{ fontSize: 13 }}
            />
            <MenuItem
              primaryText={i18n.__('Upload File')}
              leftIcon={<UploadFile />}
              onClick={() => this.upload('file')}
              style={{ fontSize: 13 }}
            />
          </Menu>
        </Popover>
      </div>
    )
  }
}

export default FileUploadButton
