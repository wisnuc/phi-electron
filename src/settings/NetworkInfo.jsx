import i18n from 'i18n'
import React from 'react'
import { Popover, MenuItem } from 'material-ui'
import { RRButton, TextField } from '../common/Buttons'
import { ArrowIcon, DropDownIcon } from '../common/Svg'

class NetworkInfo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}

    this.save = () => {
    }

    this.openPop = (e) => {
      e.preventDefault()
      clearTimeout(this.timer)
      this.setState({ open: true, show: false, anchorEl: e.currentTarget })
      /* hide the status of position move */
      this.timer = setTimeout(() => this.setState({ show: true }))
    }
  }

  render () {
    const tStyle = { height: 18, color: '#525a60', fontSize: 12, opacity: 0.7, marginLeft: 27, display: 'flex', alignItems: 'center' }

    const items = [
      {
        primaryText: i18n.__('Automatic Mode'),
        onClick: () => this.setState({ mode: 'auto', open: false, show: false })
      },
      {
        primaryText: i18n.__('Manual Mode'),
        onClick: () => this.setState({ mode: 'manu', open: false, show: false })
      }
    ]
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter" >
        <div style={{ width: 480, paddingRight: 160, paddingBottom: 60 }}>
          <div style={{ width: 300, marginLeft: 160, height: 100, padding: '40px 10px', border: 'solid 1px #eaeaea' }}>
            <div style={{ height: 70, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 70 }} className="flexCenter">
                <img
                  style={{ height: 70 }}
                  src="./assets/images/pic-network-n2.png"
                  alt=""
                />
              </div>
              <div style={{ width: 160, height: 70 }}>
                <div style={{ height: 16 }} />
                <div style={tStyle}>
                  <ArrowIcon style={{ color: '#4dbc72', transform: 'rotate(180deg)' }} />
                  <div style={{ marginLeft: -5 }}> 566 K/s </div>
                </div>
                <div style={{ height: 1, width: 140, backgroundColor: '#31a0f5' }} />
                <div style={{ height: 2 }} />
                <div style={tStyle}>
                  <ArrowIcon style={{ color: '#8a69ed' }} />
                  <div style={{ marginLeft: -5 }}> 15.5 M/s </div>
                </div>
              </div>
              <div style={{ width: 70 }} className="flexCenter">
                <img
                  style={{ height: 70 }}
                  src="./assets/images/pic-network-net.png"
                  alt=""
                />
              </div>
            </div>
            <div style={{ height: 20, marginTop: 10, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 70, fontSize: 12 }} className="flexCenter">
                N2
              </div>
              <div style={{ width: 160, color: '#525a60', fontSize: 12, opacity: 0.7 }} className="flexCenter">
                { i18n.__('Internet Connected Text') }
              </div>
              <div style={{ width: 70, fontSize: 12 }} className="flexCenter">
                { i18n.__('Network')}
              </div>
            </div>
          </div>
          <div style={{ height: 50 }} />

          <div style={{ position: 'relative', height: 30, width: 480, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('Network Mode') }
            </div>
            <div style={{ width: 30 }} />
            <div
              style={{ width: 320, borderBottom: '1px solid #31a0f5', color: '#505259', paddingBottom: 2, cursor: 'pointer' }}
              onClick={this.openPop}
            >
              { this.state.mode === 'auto' ? i18n.__('Automatic Mode') : i18n.__('Manual Mode') }
            </div>
            <div style={{ position: 'absolute', right: -8, cursor: 'pointer' }} onClick={this.openPop} >
              <DropDownIcon style={{ color: '#31a0f5' }} />
            </div>
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              onRequestClose={() => this.setState({ open: false })}
              style={{ boxShadow: '0 0 20px 0 rgba(23, 99, 207, 0.1)', opacity: this.state.show ? 1 : 0 }}
            >
              <div style={{ width: 94, maxWidth: 94, height: items.length * 40, overflow: 'hidden' }} >
                {
                  items.map((props, index) => (
                    <MenuItem
                      {...props}
                      key={index.toString()}
                      style={{
                        marginTop: 0,
                        fontSize: 14,
                        color: '#505259',
                        height: 40,
                        minHeight: 40,
                        lineHeight: '40px'
                      }}
                    />
                  ))
                }
                <div style={{ height: 5, width: '100%' }} />
              </div>
            </Popover>
          </div>

          <div style={{ height: 30 }} />
          <div style={{ height: 30, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('IP Address') }
            </div>
            <div style={{ width: 30 }} />
            <TextField
              style={{ width: 320 }}
              disabled={this.state.mode !== 'manu'}
              hintText={'0.0.0.0'}
            />
          </div>

          <div style={{ height: 30 }} />
          <div style={{ height: 30, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 130, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('DNS Address') }
            </div>
            <div style={{ width: 30 }} />
            <TextField
              style={{ width: 320 }}
              disabled={this.state.mode !== 'manu'}
              hintText={'0.0.0.0'}
            />
          </div>

          <div style={{ height: 40 }} />
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

export default NetworkInfo
