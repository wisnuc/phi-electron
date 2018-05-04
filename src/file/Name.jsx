import i18n from 'i18n'
import React from 'react'
import sanitize from 'sanitize-filename'

class Name extends React.PureComponent {
  constructor (props) {
    super(props)

    this.value = this.props.entry && this.props.entry.name

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
      if (this.fired) return
      this.fired = true
      const { apis, path, entry } = this.props
      const curr = path[path.length - 1]
      const args = {
        driveUUID: path[0].uuid,
        dirUUID: curr.uuid,
        entryUUID: entry.uuid,
        newName: this.state.value,
        oldName: entry.name
      }
      apis.request('renameDirOrFile', args, (err) => {
        if (err) {
          this.setState({ errorText: i18n.__('Rename Failed') })
        } else {
          // this.props.onRequestClose(true)
          // this.props.openSnackBar(i18n.__('Rename Success'))
          this.props.refresh()
        }
      })
    }

    this.onBlur = () => {
      console.log('this.onBlur', this.props, this.state)
      if (this.state.value.length !== 0 && this.state.value !== this.value) this.fire()
      this.props.refresh()
    }

    this.onKeyDown = (e) => {
      if (e.which === 13 && !this.state.errorText && this.state.value.length !== 0 && this.state.value !== this.value) this.fire()
    }

    this.reset = () => {
      this.fired = false
      this.notFirst = false
      Object.assign(this.state, { value: this.props.entry && this.props.entry.name })
    }
  }

  render () {
    const { entry, modify, onMouseDown } = this.props
    const { name } = entry
    if (!modify) {
      this.reset()
      return (
        <div
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#525a60', letterSpacing: 1.4 }}
          onMouseDown={onMouseDown}
        >
          { name }
        </div>
      )
    }
    console.log('Name.jsx', this.props, this.state)
    return (
      <div
        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation() }}
        onDoubleClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
        style={{ height: '100%', width: '100%', position: 'relative', transform: 'none' }}
      >
        <div
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
          onMouseDown={() => this.fire()}
        />
        <input
          name="rename"
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.onBlur}
          style={{
            height: 32,
            width: '100%',
            fontSize: 14,
            color: '#525a60',
            letterSpacing: 1.4,
            backgroundColor: '#FFF'
          }}
          ref={(input) => { // forcus on TextField and autoselect file name without extension
            if (input && !this.notFirst) {
              console.log('input', input)
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