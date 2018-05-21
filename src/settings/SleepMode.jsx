import i18n from 'i18n'
import React from 'react'
import { Toggle, Divider } from 'material-ui'
import { RRButton } from '../common/Buttons'

class SleepMode extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}

    this.save = () => {
    }
  }

  renderRow ({ type, enabled, func }) {
    return (
      <div style={{ height: 56, width: '100%', display: 'flex', alignItems: 'center' }} key={type}>
        <div style={{ width: 150, textAlign: 'right', color: '#525a60' }}>
          { type }
        </div>
        <div style={{ flexGrow: 1 }} />
        <Toggle
          style={{ width: 48 }}
          thumbStyle={{ width: 18, height: 18, marginTop: 2 }}
          trackStyle={{ height: 16, backgroundColor: '#FFF', border: '1px solid #e6e6e6' }}
          trackSwitchedStyle={{ height: 16, backgroundColor: '#FFF', border: '1px solid #e6e6e6' }}
          toggled={enabled}
          onToggle={func}
        />
      </div>
    )
  }

  renderTimeDur () {
    return (
      <div style={{ height: 56, width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 150, textAlign: 'right', color: '#525a60' }}>
          { i18n.__('Sleep Duration') }
        </div>
        <div style={{ width: 30 }} />
        <div style={{ width: 80, height: 30, backgroundColor: '#f5f7fa', color: '#525a60' }} className="flexCenter">
          { '00 : 30' }
        </div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ width: 80, height: 30, backgroundColor: '#f5f7fa', color: '#525a60' }} className="flexCenter">
          { '07 : 30' }
        </div>
      </div>
    )
  }

  render () {
    const settings = [
      {
        type: i18n.__('Sleep Mode'),
        enabled: false,
        func: () => {}
      },
      {
        type: i18n.__('Time Switch'),
        enabled: true,
        func: () => {}
      }
    ]
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter" >
        <div style={{ width: 480, paddingRight: 160, paddingBottom: 60 }}>
          <div style={{ height: 180, width: 320, paddingLeft: 160 }} className="flexCenter">
            <img
              style={{ width: 280, height: 180 }}
              src="./assets/images/pic_unbind.png"
              alt=""
            />
          </div>

          { this.renderRow(settings[0]) }

          <div style={{ width: 320, color: '#888a8c', paddingLeft: 160 }}>
            { i18n.__('Sleep Mode Text') }
          </div>

          <div style={{ height: 10 }} />
          <Divider color="#f2f2f2" style={{ marginLeft: 160 }} />
          <div style={{ height: 10 }} />

          { this.renderRow(settings[1]) }

          { this.renderTimeDur() }

          <div style={{ height: 30 }} />

          <div style={{ width: 240, height: 40, margin: '0 auto', paddingLeft: 160 }}>
            <RRButton
              label={i18n.__('Save')}
              onClick={this.save}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default SleepMode
