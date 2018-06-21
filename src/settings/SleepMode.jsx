import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'
import { RRButton, Toggle } from '../common/Buttons'

class SleepMode extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}

    this.save = () => {
      this.setState({ loading: true })
      let args = { status: this.state.sleep }
      if (this.state.switch) args = Object.assign({ start: this.state.start, end: this.state.end }, args)
      else args = Object.assign({ start: '00:00', end: '23:59' }, args)
      this.props.apis.pureRequest('modifySleep', args, (err, res) => {
        if (!err) {
          this.props.openSnackBar(i18n.__('Operation Success'))
          this.props.apis.request('sleep')
        } else {
          this.props.openSnackBar(i18n.__('Operation Failed'))
        }
        this.setState({ loading: false })
      })
    }

    this.onStartVal = (value) => {
      const start = value
      this.setState({ start })
    }

    this.onEndVal = (value) => {
      const end = value
      this.setState({ end })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.sleep) {
      this.setState({
        sleep: !!nextProps.sleep.start,
        switch: !(nextProps.sleep.start === '00:00' && nextProps.sleep.end === '23:59'),
        start: nextProps.sleep.start || '00:00',
        end: nextProps.sleep.end || '23:59',
      })
    }
  }

  isNumberAndBetween (v, min, max) {
    return Number(v) >= min && Number(v) <= max
  }

  shouldFire () {
    if (!this.state.sleep || !this.state.switch) return true
    if ([this.state.start, this.state.end].some(v => !v || typeof v !== 'string' || v.length !== 5)) return false
    if ([this.state.start, this.state.end].every(v => v.slice(2,3) === ':' && this.isNumberAndBetween(v.slice(0, 2), 0, 23) &&
      this.isNumberAndBetween(v.slice(3, 5), 0, 60))) return true
    return false
  }

  renderRow ({ type, enabled, func }) {
    const grey = !this.state.sleep && (type !== i18n.__('Sleep Mode'))
    return (
      <div
        style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center', filter: grey ? 'grayscale(100%)' : '' }}
        key={type}
      >
        <div style={{ width: 130, textAlign: 'right', color: grey ? '#c4c5cc' : '#525a60' }}>
          { type }
        </div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ opacity: grey ? 0.5 : 1 }}>
          <Toggle
            toggled={enabled}
            onToggle={func}
          />
        </div>
      </div>
    )
  }

  renderTimeDur () {
    const disabled = !this.state.sleep || !this.state.switch
    return (
      <div
        style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center', opacity: disabled ? 0.5 : 1 }}
      >
        <div style={{ width: 130, textAlign: 'right', color: disabled ? '#c4c5cc' : '#525a60' }}>
          { i18n.__('Sleep Duration') }
        </div>
        <div style={{ width: 30 }} />
        <input
          style={{
            position: 'relative',
            zIndex: 11,
            height: 32,
            width: 80,
            fontSize: 14,
            color: '#525a60',
            letterSpacing: 1.8,
            backgroundColor: '#f5f7fa',
            textAlign: 'center'
          }}
          value={this.state.start}
          onChange={e => this.onStartVal(e.target.value)}
        />
        <div style={{ flexGrow: 1 }} />
        <input
          style={{
            position: 'relative',
            zIndex: 11,
            height: 32,
            width: 80,
            fontSize: 14,
            color: '#525a60',
            letterSpacing: 1.8,
            backgroundColor: '#f5f7fa',
            textAlign: 'center'
          }}
          value={this.state.end}
          onChange={e => this.onEndVal(e.target.value)}
        />
      </div>
    )
  }

  render () {
    const settings = [
      {
        type: i18n.__('Sleep Mode'),
        enabled: this.state.sleep,
        func: () => this.setState({ sleep: !this.state.sleep })
      },
      {
        type: i18n.__('Time Switch'),
        enabled: this.state.switch,
        func: () => this.state.sleep && this.setState({ switch: !this.state.switch })
      }
    ]
    console.log('sleep', this.props, this.state)
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter" >
        <div style={{ width: 480, paddingRight: 160, paddingBottom: 60 }}>
          <div style={{ height: 180, width: 320, paddingLeft: 160 }} className="flexCenter">
            <img
              style={{ width: 320, height: 180 }}
              src="./assets/images/pic_sleepmode.png"
              alt=""
            />
          </div>

          { this.renderRow(settings[0]) }

          <div style={{ width: 320, color: '#888a8c', paddingLeft: 160, height: 60, display: 'flex', alignItems: 'center' }}>
            { i18n.__('Sleep Mode Text') }
          </div>

          <Divider color="#f2f2f2" style={{ marginLeft: 160 }} />

          { this.renderRow(settings[1]) }

          <div style={{ height: 30 }} />

          { this.renderTimeDur() }

          <div style={{ height: 40 }} />

          <div style={{ width: 240, height: 40, margin: '0 auto', paddingLeft: 160 }}>
            <RRButton
              label={this.state.loading ? i18n.__('Saving') : i18n.__('Save')}
              onClick={this.save}
              disabled={!this.shouldFire()}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default SleepMode
