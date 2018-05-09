import React from 'react'
import { Button } from '../common/Buttons'
import { AddDriveIcon } from '../common/Svg'

class AddDrive extends Button {
  constructor (props) {
    super(props)

    this.onMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.setState({ pressed: true })
    }
  }
  render () {
    const { item } = this.props
    const { entry } = item
    console.log('AddDrive', this.props, this.state)
    return (
      <div
        style={{
          position: 'relative',
          width: 140,
          height: 140,
          marginRight: 4,
          marginBottom: 10,
          backgroundColor: this.state.hover ? '#f9fcfe' : '#FFF'
        }}
        {...this.funcs}
      >
        {/* preview or icon */}
        <div
          draggable={false}
          className="flexCenter"
          style={{ height: 80, width: 108, margin: '16px auto 0 auto', overflow: 'hidden' }}
        >
          <AddDriveIcon style={{ width: 30, height: 30, color: '#7d868f', opacity: 0.5 }} />
        </div>

        {/* file name */}
        <div style={{ height: 40, color: 'var(--dark-text)', paddingBottom: 4 }} className="flexCenter" >
          <div
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontSize: 13,
              width: 130,
              textAlign: 'center',
              fontWeight: 500
            }}
          >
            { entry.name }
          </div>
        </div>
      </div>
    )
  }
}

export default AddDrive
