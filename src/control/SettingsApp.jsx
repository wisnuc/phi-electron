import React from 'react'
import { Toggle } from 'material-ui'
import InfoIcon from 'material-ui/svg-icons/action/info-outline'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import i18n from 'i18n'
import FlatButton from '../common/FlatButton'
import DialogOverlay from '../common/DialogOverlay'

class SettingsApp extends React.Component {
  renderCard ({ type, enabled, func }) {
    return (
      <div style={{ height: 56, width: '100%', display: 'flex', alignItems: 'center', marginLeft: 24 }} key={type}>
        <div style={{ width: 40, display: 'flex', alignItems: 'center', marginRight: 8 }}>
          <InfoIcon color={this.props.primaryColor} />
        </div>
        <div style={{ width: 560, display: 'flex', alignItems: 'center' }}>
          { type }
        </div>
        <Toggle
          style={{ width: 480 }}
          toggled={enabled}
          onToggle={func}
        />
      </div>
    )
  }

  renderDownloadPath () {
    const path = global.config.global.downloadPath || global.config.defaultDownload
    return (
      <div style={{ height: 56, width: '100%', display: 'flex', alignItems: 'center', marginLeft: 24 }}>
        <div style={{ width: 40, display: 'flex', alignItems: 'center', marginRight: 8 }}>
          <DownloadIcon color={this.props.primaryColor} />
        </div>
        <div style={{ width: 560, display: 'flex', alignItems: 'center' }}>
          { i18n.__('Download Path:') }
          <div style={{ width: 8 }} />
          <input
            value={path}
            onChange={() => {}}
            style={{ width: 360, border: '1px solid #bfbfbf', borderRadius: '2px', color: '#444', padding: 3 }}
          />
        </div>
        <div style={{ width: 480, display: 'flex', alignItems: 'center', marginLeft: -8 }}>
          <FlatButton
            primary
            disabled={this.state.loading}
            label={i18n.__('Set Download Path')}
            onClick={() => this.openDialog()}
          />
        </div>
      </div>
    )
  }

  render () {
    if (!global.config) return <div />
    const { noCloseConfirm, enableSleep } = global.config.global
    const settings = [
      {
        type: i18n.__('Client Close Text'),
        enabled: !noCloseConfirm,
        func: () => this.toggle('noCloseConfirm')
      },
      {
        type: i18n.__('Prevent Sleep Text'),
        enabled: !enableSleep,
        func: () => this.toggle('enableSleep')
      }
    ]
    return (
      <div style={{ height: '100%', margin: 16 }}>
        {/*
        <div style={{ fontSize: 20 }}>
          { i18n.__('Global Settings') }
        </div>
        */}
        <div style={{ height: 16 }} />
        { this.renderLanguage() }
        { this.renderCacheClean() }
        { this.renderDownloadPath() }
        { settings.map(op => this.renderRow(op)) }

        {/* dialog */}
        <DialogOverlay open={this.state.confirm} >
          {
            this.state.confirm &&
              <div style={{ width: 560, padding: '24px 24px 0px 24px' }}>
                <div style={{ fontSize: 21, fontWeight: 500 }}>
                  { i18n.__('Clean Cache') }
                </div>
                <div style={{ height: 20 }} />
                <div style={{ color: 'rgba(0,0,0,0.54)', fontSize: 14 }}>
                  { i18n.__('Clean Cache Text') }
                </div>
                <div style={{ height: 24 }} />
                <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: -24 }}>
                  <FlatButton
                    label={i18n.__('Cancel')}
                    primary
                    onClick={() => this.toggleDialog('confirm')}
                  />
                  <FlatButton
                    label={i18n.__('Clean')}
                    primary
                    onClick={this.cleanCache}
                  />
                </div>
              </div>
          }
        </DialogOverlay>
      </div>
    )
  }
}

export default SettingsApp
