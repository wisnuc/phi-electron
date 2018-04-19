import React from 'react'

class Button extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
      pressed: false
    }

    this.onMouseDown = () => this.setState({ pressed: true })

    this.onMouseMove = () => this.setState({ hover: true })

    this.onMouseLeave = () => this.setState({ pressed: false, hover: false })

    this.onClick = (e) => {
      const { disabled, onClick } = this.props
      if (disabled || typeof onClick !== 'function') return
      onClick(e)
    }

    this.funcs = {
      onMouseDown: this.onMouseDown,
      onMouseMove: this.onMouseMove,
      onMouseLeave: this.onMouseLeave,
      onClick: this.onClick
    }
  }
}

/* Raised Button */
export class RaisedButton extends Button {
  render () {
    const { label, style, labelStyle, disabled } = this.props
    const cursor = disabled ? 'default' : 'pointer'
    const borderRadius = 4
    const backgroundColor = disabled ? '#a8acaf' : this.state.pressed ? undefined : 'var(--dodger-blue)'
    const backgroundBlendMode = this.state.pressed ? 'overlay' : undefined
    const backgroundImage = disabled || !this.state.pressed
      ? undefined
      : 'linear-gradient(var(--dodger-blue), var(--dodger-blue)), linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))'

    const boxShadow = disabled
      ? '0px 5px 10px 0 rgba(122, 125, 128, 0.25)'
      : this.state.hover
        ? '0px 10px 15px 0 rgba(33, 110, 209, 0.2)'
        : '0px 5px 10px 0 rgba(33, 110, 209, 0.25)'

    const buttonStyle = Object.assign(
      {
        padding: '0 8px',
        display: 'inline-block',
        cursor,
        boxShadow,
        borderRadius,
        backgroundColor,
        backgroundImage,
        backgroundBlendMode
      },
      style
    )
    const textStyle = Object.assign({ color: '#FFF', fontSize: 16, height: 31, minWidth: 81 }, labelStyle)

    return (
      <div {...this.funcs} style={buttonStyle} >
        <div style={textStyle} className="flexCenter" > { label } </div>
      </div>
    )
  }
}

/* Raised Button with BorderRadius */
export class RRButton extends Button {
  render () {
    const { label, style, labelStyle, disabled } = this.props
    const height = 40
    const width = 240
    const cursor = disabled ? 'default' : 'pointer'
    const borderRadius = height / 2
    const backgroundColor = disabled ? '#a8acaf' : this.state.pressed ? undefined : 'var(--dodger-blue)'
    const backgroundBlendMode = this.state.pressed ? 'overlay' : undefined
    const backgroundImage = disabled || !this.state.pressed
      ? undefined
      : 'linear-gradient(var(--dodger-blue), var(--dodger-blue)), linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))'

    const boxShadow = disabled
      ? '0px 5px 10px 0 rgba(122, 125, 128, 0.25)'
      : this.state.hover
        ? '0px 10px 15px 0 rgba(33, 110, 209, 0.2)'
        : '0px 5px 10px 0 rgba(33, 110, 209, 0.25)'

    const buttonStyle = Object.assign(
      { width, height, cursor, borderRadius, backgroundColor, boxShadow, backgroundBlendMode, backgroundImage },
      style
    )
    const textStyle = Object.assign({ color: '#FFF', fontSize: 16 }, labelStyle)

    return (
      <div {...this.funcs} style={buttonStyle} className="flexCenter" >
        <div style={textStyle}> { label } </div>
      </div>
    )
  }
}

/* Flat Button */
export class FLButton extends Button {
  render () {
    const { label, style, labelStyle, disabled } = this.props

    const cursor = disabled ? 'default' : 'pointer'
    const color = this.state.hover ? 'var(--dodger-blue)' : ' var(--grey-text)'
    const buttonStyle = Object.assign({ padding: '0 8px', cursor, display: 'inline-block' }, style)
    const textStyle = Object.assign({ height: 36, color, fontSzie: 14 }, labelStyle)

    return (
      <div {...this.funcs} style={buttonStyle} >
        <div style={textStyle} className="flexCenter" > { label } </div>
      </div>
    )
  }
}
