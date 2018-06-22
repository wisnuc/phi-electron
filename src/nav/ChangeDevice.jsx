import i18n from 'i18n'
import React from 'react'

import reqMdns from '../common/mdns'
import SelectDevice from '../login/SelectDevice'
import ConfirmDialog from '../common/ConfirmDialog'

class ChangeDevice extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      loading: true
    }

    this.onMDNSError = (e) => {
      console.error('reqMdns error', e)
      this.setState({ loading: false, list: [] })
      this.props.openSnackBar(i18n.__('MDNS Search Error'))
    }

    this.showDeviceToBind = () => {
      this.setState({ list: [], loading: true, type: 'LANTOBIND', status: 'deviceSelect' })
      reqMdns()
        .then(mdns => this.setState({ loading: false, list: mdns }))
        .catch(this.onMDNSError)
    }

    this.refreshStationList = () => {
      this.setState({ loading: true })
      this.props.phi.req('stationList', null, (e, r) => {
        if (e || !r.result || !Array.isArray(r.result.list) || r.error !== '0') {
          this.setState({ loading: false, list: [], status: 'phiNoBound', error: true }) // TODO Error
        } else {
          const list = r.result.list
          const status = !list.length ? 'phiNoBound' : 'deviceSelect'
          this.setState({ list, loading: false, type: 'BOUNDLIST', status })
        }
      })
    }

    this.addBindDevice = () => {
      this.setState({ confirm: true })
    }

    this.manageDisk = (dev) => {
      console.log('this.manageDisk dev', dev, this.state)
      this.setState({ loading: true })
      dev.refreshSystemState(() => {
        if (dev.systemStatus() === 'noBoundVolume') this.setState({ selectedDevice: dev, status: 'diskManage' })
        else this.setState({ type: 'BOUNDLIST' }, () => this.refresh())
      })
    }

    this.refreshList = () => {
      this.setState({ loading: true, list: [] })
      this.props.phi.req('stationList', null, (e, r) => {
        if (e || !r.result || !Array.isArray(r.result.list) || r.error !== '0') {
          this.setState({ loading: false, list: [], error: true }) // TODO Error
        } else {
          const list = r.result.list
          this.setState({ list, loading: false })
        }
      })
    }
  }

  componentDidMount () {
    this.refreshList()
  }

  render () {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <SelectDevice
          {...this.props}
          {...this.state}
          manageDisk={this.manageDisk}
          addBindDevice={this.addBindDevice}
          refreshStationList={this.refreshStationList}
          refresh={this.refreshList}
          type="CHANGEDEVICE"
        />
        <ConfirmDialog
          open={this.state.confirm}
          onCancel={() => this.setState({ confirm: false })}
          onConfirm={() => this.props.jumpToBindDevice()}
          title={i18n.__('Confirm Logout To Bind Device Title')}
          text={i18n.__('Confirm Logout To Bind Device Text')}
        />
      </div>
    )
  }
}

export default ChangeDevice
