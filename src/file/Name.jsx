import React from 'react'
import i18n from 'i18n'
import { TextField } from 'material-ui'
import sanitize from 'sanitize-filename'

class Name extends React.PureComponent {
  constructor (props) {
    super(props)

    this.value = this.props.name

    this.state = {
      value: this.value,
      errorText: undefined
    }

    this.handleChange = (e) => {
      const value = e.target.value
      const newValue = sanitize(value)
      const entries = this.props.entries
      if (entries.findIndex(entry => entry.name === value) > -1) {
        this.setState({ value, errorText: i18n.__('Name Exist Error') })
      } else if (value !== newValue) {
        this.setState({ value, errorText: i18n.__('Name Invalid Error') })
      } else {
        this.setState({ value, errorText: '' })
      }
    }

    this.fire = () => {
      const { apis, path, entries, select } = this.props
      const curr = path[path.length - 1]
      const args = {
        driveUUID: path[0].uuid,
        dirUUID: curr.uuid,
        entryUUID: entries[select.selected[0]].uuid,
        newName: this.state.value,
        oldName: entries[select.selected[0]].name
      }
      apis.request('renameDirOrFile', args, (err) => {
        if (err) {
          this.setState({ errorText: i18n.__('Rename Failed') })
        } else {
          this.props.onRequestClose(true)
          this.props.openSnackBar(i18n.__('Rename Success'))
          this.props.refresh()
        }
      })
    }

    this.onKeyDown = (e) => {
      if (e.which === 13 && !this.state.errorText && this.state.value.length !== 0 && this.state.value !== this.value) this.fire()
    }
  }

  render () {
    const { name, modify, onMouseDown } = this.props
    if (!modify) {
      return (
        <div
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#525a60', letterSpacing: 1.4 }}
          onMouseDown={onMouseDown}
        >
          { name }
        </div>
      )
    }
    return (
      <div
        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation() }}
        onDoubleClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
      >
        <input
          name="rename"
          value={this.state.value}
          onChange={this.handleChange}
          ref={(input) => { // forcus on TextField and autoselect file name without extension
            console.log('input ref', input)
            if (input && !this.notFirst) {
              input.focus()
              const end = input.value.lastIndexOf('.')
              input.selectionStart = 0
              input.selectionEnd = end > -1 ? end : input.value.length
              this.notFirst = true
            }
          }}
          onKeyDown={this.onKeyDown}
        />
      </div>
    )
  }
}

export default Name
