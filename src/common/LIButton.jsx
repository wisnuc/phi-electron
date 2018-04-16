import React from 'react'
import { IconButton } from 'material-ui'

const styles = {
  icon: {
    width: 30,
    height: 30
  },
  button: {
    width: 42,
    height: 42,
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

/* Larger Icon Button */
class LIButton extends React.PureComponent {
  render () {
    const { disabled } = this.props
    const style = Object.assign({}, styles.button, this.props.style)
    const iconStyle = Object.assign({ color: '#7d868f', opacity: disabled ? 0.5 : 1 }, styles.icon, this.props.iconStyle)
    return (
      <IconButton style={style} iconStyle={iconStyle} {...this.props} />
    )
  }
}

export default LIButton
