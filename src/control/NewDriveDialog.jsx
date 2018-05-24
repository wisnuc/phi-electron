import React, { PureComponent } from 'react'
import i18n from 'i18n'
import { TextField, Divider } from 'material-ui'
import sanitize from 'sanitize-filename'
import { Checkbox, RSButton } from '../common/Buttons'

class NewDriveDialog extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      focusOnce: true,
      label: '',
      writelist: (this.props.drive && this.props.drive.writelist) || [],
      errorText: ''
    }

    this.isBuiltIn = this.props.drive && this.props.drive.tag === 'built-in'

    this.newDrive = () => {
      this.setState({ loading: true })
      const apis = this.props.apis
      const args = {
        label: this.state.label,
        writelist: this.state.writelist
      }
      apis.request('adminCreateDrive', args, (err) => {
        if (!err) {
          this.props.refreshDrives()
          this.props.onRequestClose()
          this.props.openSnackBar(i18n.__('Create Drive Success'))
        } else {
          this.setState({ loading: false })
          console.log('adminCreateDrive failed', err)
          this.props.openSnackBar(i18n.__('Create Drive Failed'))
        }
      })
    }

    this.modifyDrive = () => {
      console.log('this.modifyDrive', this.props)
      this.setState({ loading: true })
      const apis = this.props.apis
      const args = {
        uuid: this.props.drive.uuid,
        label: this.state.label,
        writelist: this.isBuiltIn ? undefined : this.state.writelist
      }
      apis.request('adminUpdateDrive', args, (err) => {
        if (!err) {
          this.props.refreshDrives()
          this.props.onRequestClose()
          this.props.openSnackBar(i18n.__('Modify Drive Success'))
        } else {
          this.setState({ loading: false })
          console.log('adminUpdateDrive failed', err)
          this.props.openSnackBar(i18n.__('Modify Drive Failed'))
        }
      })
    }

    this.fire = () => (this.props.type === 'new' ? this.newDrive() : this.modifyDrive())
  }

  updateLabel (value) {
    console.log('updateLabel', value)
    if (!value) {
      this.setState({ label: value, errorText: '' })
      return
    }
    const drives = this.props.drives
    const newValue = sanitize(value)
    if (drives.findIndex(drive => drive.label === value) > -1) {
      this.setState({ label: value, errorText: i18n.__('Drive Name Exist Error') })
    } else if (value !== newValue) {
      this.setState({ label: value, errorText: i18n.__('Drive Name Invalid Error') })
    } else {
      this.setState({ label: value, errorText: '' })
    }
  }

  togglecheckAll () {
    this.setState({ writelist: this.state.writelist === '*' ? [] : '*' })
  }

  handleCheck (userUUID) {
    const wl = this.state.writelist
    const index = wl.indexOf(userUUID)
    if (wl === '*') this.setState({ writelist: [userUUID] })
    else if (index === -1) this.setState({ writelist: [...wl, userUUID] })
    else this.setState({ writelist: [...wl.slice(0, index), ...wl.slice(index + 1)] })
  }

  render () {
    const { type, users } = this.props
    return (
      <div style={{ width: 280, padding: '0 20px 20px 20px', zIndex: 2000 }}>
        <div style={{ height: 59, display: 'flex', alignItems: 'center' }} className="title">
          { type === 'new' ? i18n.__('Create New Public Drive') : i18n.__('Modify Public Drive') }
        </div>
        <Divider style={{ width: 280 }} className="divider" />
        <div style={{ height: 20 }} />
        <div
          style={{
            height: 20,
            fontSize: 14,
            color: this.state.errorText ? '#fa5353' : '#525a60',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          { this.state.errorText || i18n.__('Public Drive Name') }
        </div>

        <div style={{ height: 40 }}>
          <TextField
            fullWidth
            name="shareDiskName"
            value={this.state.label}
            onChange={e => this.updateLabel(e.target.value)}
            style={{ color: '#525a60', fontSize: 14 }}
            hintText={i18n.__('Public Drive Name Hint')}
            ref={(input) => {
              if (input && this.state.focusOnce) {
                input.focus()
                this.setState({ focusOnce: false })
              }
            }}
          />
        </div>

        <div
          style={{
            height: 20,
            marginTop: 10,
            color: '#525a60',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          { i18n.__('Permissions') }
        </div>

        {/*
        <div style={{ width: '100%', height: 40, display: 'flex', alignItems: 'center' }} key="all" >
          <Checkbox
            label={i18n.__('All Users')}
            labelStyle={{ fontSize: 14 }}
            iconStyle={{ fill: this.state.writelist === '*' ? this.props.primaryColor : 'rgba(0, 0, 0, 0.54)' }}
            checked={this.state.writelist === '*'}
            onCheck={() => this.togglecheckAll()}
          />
        </div>
        <Divider style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
        */}
        <div style={{ maxHeight: 40 * 5, overflow: 'auto' }}>
          {
            users.map(user => (
              <div style={{ width: '100%', height: 40, display: 'flex', alignItems: 'center' }} key={user.username} >
                <Checkbox
                  alt
                  label={user.username}
                  checked={this.state.writelist === '*' || (this.state.writelist && this.state.writelist.includes(user.uuid))}
                  onCheck={() => this.handleCheck(user.uuid)}
                  disabled={this.isBuiltIn}
                />
              </div>
            ))
          }
        </div>

        {/* button */}
        <div style={{ height: 40 }} />
        <div style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <RSButton
            alt
            label={i18n.__('Cancel')}
            onClick={this.props.onRequestClose}
          />
          <div style={{ width: 10 }} />
          <RSButton
            label={type === 'new' ? i18n.__('Create') : i18n.__('Modify')}
            disabled={this.state.label.length === 0 || !!this.state.errorText || this.state.loading || !this.state.writelist.length}
            onClick={this.fire}
          />
        </div>
      </div>
    )
  }
}

export default NewDriveDialog
