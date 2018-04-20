import React from 'react'
import { CheckedIcon } from '../common/Svg'

export class Button extends React.PureComponent {
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

  render () {
    return <div />
  }
}

/* Raised Button */
export class RSButton extends Button {
  render () {
    const { label, style, labelStyle, disabled, alt } = this.props
    const cursor = disabled ? 'default' : 'pointer'
    const borderRadius = 4
    const color = !alt ? '#FFF'
      : alt && this.state.pressed ? 'var(--dodger-blue)'
        : alt && disabled ? 'var(--light-grey-text)'
          : '#6d7073'

    const backgroundColor = alt ? '#FFF'
      : disabled ? '#c4c5cc'
        : this.state.pressed ? undefined
          : 'var(--dodger-blue)'

    const backgroundBlendMode = !alt && this.state.pressed ? 'overlay' : undefined
    const backgroundImage = alt || disabled || !this.state.pressed
      ? undefined
      : 'linear-gradient(var(--dodger-blue), var(--dodger-blue)), linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))'

    const border = !alt ? undefined
      : this.state.pressed ? 'solid 1px var(--dodger-blue)'
        : disabled ? 'solid 1px var(--light-grey-text)'
          : 'solid 1px #dddddd'

    const boxShadow = disabled
      ? '0px 5px 10px 0 rgba(122, 125, 128, 0.25)'
      : this.state.hover
        ? '0px 10px 15px 0 rgba(33, 110, 209, 0.2)'
        : '0px 5px 10px 0 rgba(33, 110, 209, 0.25)'

    const buttonStyle = Object.assign(
      {
        padding: '0 24px',
        display: 'inline-block',
        cursor,
        border,
        boxShadow,
        borderRadius,
        backgroundColor,
        backgroundImage,
        backgroundBlendMode
      },
      style
    )
    const textStyle = Object.assign({ color, fontSize: 16, height: 31 }, labelStyle)

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
    const { label, style, labelStyle, disabled, alt } = this.props
    const height = 40
    const width = 240
    const cursor = disabled ? 'default' : 'pointer'
    const borderRadius = height / 2
    const backgroundColor = disabled ? '#a8acaf' : this.state.pressed ? undefined : alt ? '#44c468' : 'var(--dodger-blue)'
    const backgroundBlendMode = this.state.pressed ? 'overlay' : undefined
    const backgroundImage = disabled || !this.state.pressed
      ? undefined
      : alt
        ? 'linear-gradient(#44c468, #44c468), linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))'
        : 'linear-gradient(var(--dodger-blue), var(--dodger-blue)), linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))'

    const boxShadow = disabled
      ? '0px 5px 10px 0 rgba(122, 125, 128, 0.25)'
      : this.state.hover
        ? `0px 10px 15px 0 ${alt ? 'rgba(47, 162, 79, 0.2)' : 'rgba(33, 110, 209, 0.2)'}`
        : `0px 5px 10px 0 ${alt ? 'rgba(47, 162, 79, 0.25)' : 'rgba(33, 110, 209, 0.25)'}`

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

/* Mode Select Button */
export class ModeSelect extends Button {
  render () {
    const { label, selected, onClick, disabled } = this.props
    const color = disabled ? 'var(--light-grey-text)' : '#525a60'
    const backgroundColor = disabled || (!this.state.hover && !selected) ? '#FFF' : '#f2f5fa'
    const borderColor = disabled || (!this.state.hover && !selected) ? '#dae0e6' : 'var(--dodger-blue)'

    return (
      <div
        onClick={onClick}
        onMouseMove={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        style={{
          height: 50,
          width: 135,
          color,
          backgroundColor,
          position: 'relative',
          boxSizing: 'border-box',
          border: `solid 1px ${borderColor}`
        }}
        className="flexCenter"
        {...this.funcs}
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
        {
          selected &&
            <div style={{ position: 'absolute', right: 0, top: -4 }} >
              <CheckedIcon style={{ width: 10 }} />
            </div>
        }
      </div>
    )
  }
}

/* Menu Button in Home */
export class MenuButton extends Button {
  render () {
    const { text, selected } = this.props
    const Icon = this.props.icon
    const backgroundColor = selected ? '#627ee5' : this.state.hover ? '#f3f8ff' : '#FFF'
    const textColor = selected ? '#FFF' : 'var(--dark-text)'
    const iconColor = selected ? '#FFF' : 'var(--dark-text)'
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
        <div
          style={{
            position: 'relative',
            width: 190,
            height: 41,
            display: 'flex',
            alignItems: 'center',
            zIndex,
            boxShadow,
            borderRadius,
            backgroundColor
          }}
          {...this.funcs}
        >
          <Icon style={{ margin: '0 30px', width: 24, height: 24, fill: iconColor }} />
          <div style={{ color: textColor }}> { text } </div>
        </div>
      </div>
    )
  }
}
