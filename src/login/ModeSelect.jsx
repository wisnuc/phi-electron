import React from 'react'

class ModeSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hover: false
    }
  }

  render () {
    const { label, selected, onClick } = this.props
    const backgroundColor = selected || this.state.hover ? '#f2f5fa' : '#FFF'
    return (
      <div
        onClick={onClick}
        onMouseMove={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        style={{
          height: 50,
          width: 135,
          color: '#525a60',
          backgroundColor,
          position: 'relative',
          boxSizing: 'border-box',
          border: selected ? 'solid 1px #31a0f5' : 'solid 1px #dae0e6'
        }}
        className="flexCenter"
      >
        { label }
        {
          selected &&
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 0,
                height: 0,
                borderTop: '20px solid #31a0f5',
                borderLeft: '20px solid transparent'
              }}
            />
        }
      </div>
    )
  }
}

export default ModeSelect
