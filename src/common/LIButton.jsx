import React from 'react'
import { IconButton } from 'material-ui'

const styles = {
  largeIcon: {
    width: 30,
    height: 30
  },
  largeButton: {
    width: 42,
    height: 42,
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  smallIcon: {
    width: 20,
    height: 20
  },
  smallButton: {
    width: 32,
    height: 32,
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

/* Larger Icon Button */
export class LIButton extends React.PureComponent {
  render () {
    const { disabled } = this.props
    const style = Object.assign({}, styles.largeButton, this.props.style)
    const iconStyle = Object.assign({ color: '#7d868f', opacity: disabled ? 0.5 : 1 }, styles.largeIcon, this.props.iconStyle)
    return (
      <IconButton style={style} iconStyle={iconStyle} {...this.props} />
    )
  }
}

/* Small Icon Button */
export class SIButton extends React.PureComponent {
  render () {
    const { disabled } = this.props
    const style = Object.assign({}, styles.smallButton, this.props.style)
    const iconStyle = Object.assign({ color: '#7d868f', opacity: disabled ? 0.5 : 1 }, styles.smallIcon, this.props.iconStyle)
    return (
      <IconButton style={style} iconStyle={iconStyle} {...this.props} />
    )
  }
}
