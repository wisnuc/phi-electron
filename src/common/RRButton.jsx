import React from 'react'
import { RaisedButton } from 'material-ui'

const borderRadius = 20
/* Raised Button with BorderRadius */
class RRButton extends React.PureComponent {
  render () {
    return (
      <RaisedButton
        labelColor="#FFF"
        labelStyle={{ fontSize: 16, color: '#FFF' }}
        backgroundColor="#00B0FF"
        style={{ borderRadius, width: 240, height: 40, fontWeight: 400 }}
        buttonStyle={{ borderRadius }}
        {...this.props}
      />
    )
  }
}

export default RRButton
