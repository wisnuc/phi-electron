import React from 'react'
import i18n from 'i18n'
// import prettysize from 'prettysize'
import { IconButton } from 'material-ui'
import DiskModeGuide from '../login/DiskModeGuide'
import Dialog from '../common/PureDialog'
import { HelpIcon, DiskIcon, DiskAltIcon } from '../common/Svg'
import { RSButton } from '../common/Buttons'
import ConfirmDialog from '../common/ConfirmDialog'

class Disk extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showGuide: false
    }
    this.removeData = () => {
      const uuid = this.props.apis.drives.data.find(d => d.type === 'private').uuid
      this.props.apis.pureRequest('removeData', { driveUUID: uuid }, (err, res) => {
        if (!err) {
          this.props.openSnackBar(i18n.__('Operation Success'))
          this.setState({ confirmRemoveData: false })
        } else {
          this.props.openSnackBar(i18n.__('Operation Failed'))
          this.setState({ confirmRemoveData: false })
        }
      })
    }

    this.fireEject = () => {
      // if (!this.shouldEject()) return
      const id = this.props.apis.phyDrives.data.filter(d => d.isUSB)[0].id
      console.log('id', id, this.props)
      this.props.apis.pureRequest('ejectUSB', { id }, (err, res) => {
        if (!err) {
          this.props.openSnackBar(i18n.__('Operation Success'))
          this.setState({ ejectUSB: false })
        } else {
          this.props.openSnackBar(i18n.__('Operation Failed'))
          this.setState({ ejectUSB: false })
        }
      })
    }
  }

  shouldEject () {
    const phyDrives = this.props.apis.phyDrives && this.props.apis.phyDrives.data 
    if (!Array.isArray(phyDrives) || !phyDrives.filter(d => d.isUSB).length) return false
    return true
  }

  /* data: [{ title, percent, color }]  */
  renderCircularProgress (title, text, data) {
    const stroke = 30
    const normalizedRadius = 135
    const radius = normalizedRadius + 2 * stroke
    const circumference = normalizedRadius * 2 * Math.PI
    // const strokeDashoffset = circumference - progress / 100 * circumference

    const d = [
      { strokeColor: '#f5f7fa', progress: 100 },
      { strokeColor: '#7597bf', progress: 45 },
      { strokeColor: '#f48c12', progress: 35 },
      { strokeColor: '#f2497d', progress: 20 },
      { strokeColor: '#37a7f4', progress: 15 },
      { strokeColor: '#8a69ed', progress: 10 }
    ]
    return (
      <div style={{ position: 'relative', width: 360, height: 360 }} className="flexCenter">
        <div style={{ height: 50 }}>
          <div style={{ height: 20, color: '#505259', fontSize: 16 }} className="flexCenter">
            { title }
          </div>
          <div style={{ height: 20, color: '#85868c' }} className="flexCenter">
            { text }
          </div>
        </div>
        <div style={{ position: 'absolute', top: -15, left: -15, width: radius * 2, height: radius * 2 }} >
          <svg
            height={radius * 2}
            width={radius * 2}
            style={{ transform: 'rotate(-90deg)' }}
          >
            {
              d.map(({ strokeColor, progress }) => (
                <circle
                  key={progress.toString()}
                  stroke={strokeColor}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference} ${circumference}`}
                  style={{ strokeDashoffset: circumference - progress / 100 * circumference }}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
              ))
            }
          </svg>
        </div>
      </div>
    )
  }

  render () {
    const data = [
      { color: '#8a69ed', progress: 10, title: i18n.__('Video') },
      { color: '#37a7f4', progress: 15, title: i18n.__('Picture') },
      { color: '#f2497d', progress: 20, title: i18n.__('Music') },
      { color: '#f48c12', progress: 35, title: i18n.__('Document') },
      { color: '#7597bf', progress: 45, title: i18n.__('Others') }
    ]

    const disks = [
      { pos: i18n.__('Disk 1'), status: i18n.__('Disk Found'), model: '希捷', size: '1T' },
      { pos: i18n.__('Disk 2'), status: i18n.__('Disk Not Found'), model: i18n.__('Unknown Model'), size: i18n.__('Unknown Size') }
    ]
    const progressTitle = i18n.__('Storage Space')
    const storageUsage = i18n.__('Storage Usage %s %s', '500GB', '1024GB')
    const USBUsage = i18n.__('Storage Usage %s %s', '2.5GB', '8GB')
    const iconStyle = { width: 20, height: 20, color: '#31a0f5' }
    const buttonStyle = { width: 24, height: 24, padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ height: 20 }} />
        <div style={{ width: 1000, height: 360, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          { this.renderCircularProgress(progressTitle, storageUsage, data) }
          <div style={{ width: 10 }} />
          <div style={{ width: 100, height: 300, padding: '30px 0' }}>
            {
              data.map(({ color, title }) => (
                <div style={{ width: 100, height: 60, display: 'flex', alignItems: 'center' }} key={title}>
                  <div style={{ width: 8, height: 8, backgroundColor: color }} />
                  <div style={{ fontSize: 12, color: '#505259', marginLeft: 8 }}>
                    { title }
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ width: 30 }} />
          <div style={{ width: 500, height: 300, padding: '30px 0', position: 'relative' }}>
            <div style={{ width: '100%', height: 40, color: '#888a8c', display: 'flex', alignItems: 'center' }}>
              { i18n.__('Current Mode %s', 'RAID 1') }
              <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={() => this.setState({ showGuide: true })}>
                <HelpIcon />
              </IconButton>
              <div style={{ flexGrow: 1 }} />
              <div style={{ width: 150, height: 40 }}>
                <RSButton
                  alt
                  style={{ width: 100 }}
                  label={i18n.__('Remove Data')}
                  onClick={() => this.setState({ confirmRemoveData: true })}
                />
              </div>
            </div>
            {
              disks.map(({ pos, status, model, size }, index) => (
                <div
                  style={{
                    width: 500,
                    height: 110,
                    marginTop: index ? 20 : 10,
                    backgroundColor: '#f5f7fa',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  key={index.toString()}
                >
                  {
                    status === i18n.__('Disk Found')
                      ? <DiskIcon style={{ height: 54, width: 40, marginLeft: 15 }} />
                      : <DiskAltIcon style={{ height: 54, width: 40, marginLeft: 15 }} />
                  }
                  <div style={{ height: 40, marginLeft: 12 }} >
                    <div style={{ height: 20, display: 'flex', alignItems: 'center', color: '#505259' }} >
                      { pos }
                    </div>
                    <div style={{ height: 20, display: 'flex', alignItems: 'center', color: '#85868c' }} >
                      {status}
                      <div style={{ height: 12, width: 1, backgroundColor: '#85868c', margin: '0 10px' }} />
                      {model}
                      <div style={{ height: 12, width: 1, backgroundColor: '#85868c', margin: '0 10px' }} />
                      {size}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div style={{ height: 20 }} />
        <div style={{ width: 1000, height: 110, margin: '0 auto' }}>
          <div style={{ width: '100%', height: 40, color: '#888a8c', display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <div style={{ height: 40 }}>
              <div style={{ height: 20, display: 'flex', alignItems: 'center', color: '#505259' }} >
                { i18n.__('USB Storage Title') }
              </div>
              <div style={{ height: 20, display: 'flex', alignItems: 'center', color: '#85868c' }} >
                { USBUsage }
              </div>
            </div>
            <div style={{ flexGrow: 1 }} />
            <div style={{ width: 150, height: 40 }}>
              <RSButton
                alt
                style={{ width: 100 }}
                label={i18n.__('Eject USB')}
                onClick={() => this.setState({ ejectUSB: true })}
              />
            </div>
          </div>
          {/* USB usage */}
          <div
            style={{
              width: '100%',
              height: 20,
              marginTop: 10,
              backgroundColor: '#f5f7fa'
            }}
          >
            <div style={{ height: '100%', width: '30%', backgroundColor: '#7597bf' }} />
          </div>
        </div>
        <Dialog open={!!this.state.showGuide} onRequestClose={() => this.setState({ showGuide: false })}>
          {
            !!this.state.showGuide &&
            <DiskModeGuide
              onRequestClose={() => this.setState({ showGuide: false })}
              powerOff={() => {}}
            />
          }
        </Dialog>

        <ConfirmDialog
          open={this.state.confirmRemoveData}
          onCancel={() => this.setState({ confirmRemoveData: false })}
          onConfirm={() => this.removeData()}
          title={i18n.__('Confirm Clear Data Title')}
          text={i18n.__('Confirm Clear Data Text')}
        />

        <ConfirmDialog
          open={this.state.ejectUSB}
          onCancel={() => this.setState({ ejectUSB: false })}
          onConfirm={() => this.fireEject()}
          title={i18n.__('Confirm Eject USB Title')}
          text={i18n.__('Confirm Eject USB Text')}
        />
      </div>
    )
  }
}

export default Disk
