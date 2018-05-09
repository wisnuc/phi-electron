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

    this.onMouseUp = () => this.setState({ pressed: false })

    this.onMouseMove = () => this.setState({ hover: true })

    this.onMouseLeave = () => this.setState({ pressed: false, hover: false })

    this.onClick = (e) => {
      const { disabled, onClick } = this.props
      if (disabled || typeof onClick !== 'function') return
      onClick(e)
    }

    this.funcs = {
      onMouseUp: this.onMouseUp,
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
        : this.state.pressed ? '#2588f2'
          : 'var(--dodger-blue)'

    const border = !alt ? undefined
      : this.state.pressed ? 'solid 1px var(--dodger-blue)'
        : disabled ? 'solid 1px var(--light-grey-text)'
          : 'solid 1px #dddddd'

    const boxShadow = this.state.hover
      ? `0px 2px 4px 0 ${alt ? 'rgba(164, 168, 171, 0.25)' : 'rgba(33, 110, 209, 0.25)'}`
      : undefined

    const buttonStyle = Object.assign(
      {
        padding: '0 24px',
        display: 'inline-block',
        cursor,
        border,
        boxShadow,
        borderRadius,
        backgroundColor
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
    const backgroundColor = disabled ? 'var(--light-grey-text)'
      : alt ? (this.state.pressed ? '#33b54e' : '#44c468')
        : (this.state.pressed ? '#2588f2' : 'var(--dodger-blue)')

    const boxShadow = disabled
      ? '0px 5px 10px 0 rgba(122, 125, 128, 0.25)'
      : this.state.hover
        ? `0px 10px 15px 0 ${alt ? 'rgba(47, 162, 79, 0.2)' : 'rgba(33, 110, 209, 0.2)'}`
        : `0px 5px 10px 0 ${alt ? 'rgba(47, 162, 79, 0.25)' : 'rgba(33, 110, 209, 0.25)'}`

    const buttonStyle = Object.assign({ width, height, cursor, borderRadius, backgroundColor, boxShadow }, style)
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

/* open in local app Button */
export class OLButton extends Button {
  render () {
    const { label, onClick, disabled } = this.props
    const color = disabled ? 'var(--light-grey-text)' : '#525a60'
    const backgroundColor = disabled || (!this.state.hover) ? '#FFF' : '#f2f5fa'
    const borderColor = disabled || (!this.state.hover) ? '#dae0e6' : 'var(--dodger-blue)'

    return (
      <div
        onClick={onClick}
        onMouseMove={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        style={{
          height: 50,
          width: 280,
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
          <Icon style={{ margin: '0 30px', width: 30, height: 30, color: iconColor }} />
          <div style={{ color: textColor }}> { text } </div>
        </div>
      </div>
    )
  }
}

/* Larger Icon Button */
export class LIButton extends Button {
  render () {
    const { style, iconStyle, disabled, children } = this.props

    const cursor = disabled ? 'default' : 'pointer'
    const color = !disabled && (this.state.hover || this.state.pressed) ? 'var(--dodger-blue)' : ' var(--grey-text)'
    const opacity = disabled ? 0.5 : 1
    const buttonStyle = Object.assign({ width: 32, height: 32, padding: 4, cursor }, style)
    const iStyle = Object.assign({ width: 24, height: 24, color, opacity }, iconStyle)

    return (
      <div {...this.funcs} style={buttonStyle} className="flexCenter">
        { React.cloneElement(children, { style: iStyle }) }
      </div>
    )
  }
}

/* Small Icon Button */
export class SIButton extends Button {
  render () {
    const { style, icon, iconStyle, disabled } = this.props

    const cursor = disabled ? 'default' : 'pointer'
    const color = !disabled && (this.state.hover || this.state.pressed) ? 'var(--dodger-blue)' : ' var(--grey-text)'
    const buttonStyle = Object.assign({ width: 24, height: 24, padding: 2, cursor }, style)
    const iStyle = Object.assign({ width: 20, height: 20, color }, iconStyle)

    return (
      <div {...this.funcs} style={buttonStyle} className="flexCenter">
        <icon style={iStyle} />
      </div>
    )
  }
}

/* IconButton with label */
export class ILButton extends Button {
  render () {
    const { style, icon, iconStyle, disabled } = this.props

    const cursor = disabled ? 'default' : 'pointer'
    const color  = this.state.hover || this.state.pressed ? 'var(--dodger-blue)' : ' var(--grey-text)'
    const buttonStyle = Object.assign({ width: 32, height: 32, padding: 4, cursor, display: 'inline-block' }, style)
    const iStyle = Object.assign({ width: 24, height: 24, color }, iconStyle)

    return (
      <div {...this.funcs} style={buttonStyle} >
        <div className="flexCenter">
          <icon style={iStyle} />
        </div>
      </div>
    )
  }
}
