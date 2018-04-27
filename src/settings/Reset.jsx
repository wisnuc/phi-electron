import i18n from 'i18n'
import React from 'react'
import { RRButton } from '../common/Buttons'

class ResetDevice extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}

    this.reset = () => {
    }
  }

  render () {
    return (
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', paddingBottom: 270 }} className="flexCenter" >
        <div style={{ width: 280 }}>
          <div style={{ color: '#888a8c', marginBottom: 40 }}>
            { i18n.__('ResetDevice Text')}
          </div>
          <div style={{ width: 240, height: 40, margin: '0 auto' }}>
            <RRButton
              label={i18n.__('ResetDevice Menu Name')}
              onClick={this.reset}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default ResetDevice
