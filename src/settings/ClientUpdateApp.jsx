import React from 'react'
import i18n from 'i18n'
import { shell } from 'electron'
import { CircularProgress } from 'material-ui'
import { orange500 } from 'material-ui/styles/colors'
import NewReleases from 'material-ui/svg-icons/av/new-releases'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import InfoIcon from 'material-ui/svg-icons/action/info'
import FlatButton from '../common/FlatButton'
import ErrorBox from '../common/ErrorBox'
import { RRButton } from '../common/Buttons'

const compareVerison = (a, b) => {
  const aArray = a.split('.')
  const bArray = b.split('.')

  const len = Math.min(aArray.length, bArray.length)
  for (let i = 0; i < len; i++) {
    if (parseInt(aArray[i], 10) > parseInt(bArray[i], 10)) return 1
    if (parseInt(aArray[i], 10) < parseInt(bArray[i], 10)) return -1
  }
  if (aArray.length > bArray.length) return 1
  if (aArray.length < bArray.length) return -1
  return 0
}

class Update extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      status: 'checking',
      confirm: false,
      error: null,
      rel: null
    }

    this.toggleDialog = op => this.setState({ [op]: !this.state[op] })

    this.moreVersion = () => {
      const platform = global.config.platform
      const type = platform === 'win32'
        ? 'wisnuc-desktop-windows/releases'
        : platform === 'darwin'
          ? 'wisnuc-desktop-mac/releases'
          : 'fruitmix-desktop'
      shell.openExternal(`https://github.com/wisnuc/${type}`)
    }

    this.openOfficial = () => {
      shell.openExternal('http://www.wisnuc.com/download')
    }

    this.newRelease = (event, result) => {
      const { rel, filePath, error } = result
      if (!rel || error) return this.setState({ status: 'error', error })
      let status = 'needUpdate'
      if (compareVerison(global.config.appVersion, rel.name) >= 0) status = 'latest'
      return this.setState({ rel, filePath, status, error: null })
    }

    this.sendCheck = () => {
      this.setState({ status: 'checking' }, () => this.props.ipcRenderer.send('CHECK_UPDATE'))
    }
  }

  componentDidMount () {
    this.sendCheck()
    this.props.ipcRenderer.on('NEW_RELEASE', this.newRelease)
  }

  componentWillUnmount () {
    this.props.ipcRenderer.removeListener('NEW_RELEASE', this.newRelease)
  }

  renderCheckUpdate () {
    const rel = this.state.rel
    const date = rel.published_at.split('T')[0]
    return (
      <div style={{ marginTop: -4 }}>
        <div>
          { i18n.__('New Version Detected %s', rel.name) }
          <FlatButton style={{ marginLeft: 16 }} primary label={i18n.__('Official Download')} onClick={this.openOfficial} />
          <FlatButton primary label={i18n.__('Github Download')} onClick={this.moreVersion} />
        </div>
        <div style={{ height: 16 }} />
        <div> { i18n.__('Publish Date %s', date) } </div>
        <div style={{ height: 16 }} />
        <div> { i18n.__('Updates') } </div>
        <div style={{ height: 8 }} />
        {
          rel.body ? rel.body.split(/[1-9]\./).map(list => list && (
            <div style={{ marginLeft: 24, height: 40, display: 'flex', alignItems: 'center' }} key={list}>
              { '*' }
              <div style={{ width: 16 }} />
              { list }
            </div>
          ))
            : (
              <div style={{ marginLeft: 24, height: 40, display: 'flex', alignItems: 'center' }}>
                { '*' }
                <div style={{ width: 16 }} />
                { i18n.__('Bug Fixes') }
              </div>
            )
        }
      </div>
    )
  }

  renderReleases () {
    const platform = global.config.platform
    // const platform = 'darwin'
    const unSupport = platform !== 'darwin' && platform !== 'win32'
    return (
      <div style={{ display: 'flex', width: '100%', marginTop: 12 }}>
        <div style={{ flex: '0 0 24px' }} />
        <div style={{ flex: '0 0 56px' }} >
          {
            unSupport ? <InfoIcon color={this.props.primaryColor} />
              : this.state.status === 'checking' ? <CircularProgress color={this.props.primaryColor} size={24} thickness={2} />
                : this.state.status === 'needUpdate' ? <NewReleases color={this.props.primaryColor} />
                  : this.state.status === 'latest' ? <CheckIcon color={this.props.primaryColor} />
                    : <CloseIcon color={this.props.primaryColor} />
          }
        </div>
        {
          unSupport ? i18n.__('Unsupported to Update')
            : this.state.status === 'checking' ? i18n.__('Checking Update')
              : this.state.status === 'needUpdate' ? this.renderCheckUpdate()
                : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', height: 48, marginTop: -12 }}>
                      { this.state.status === 'latest' && i18n.__('Already LTS Text') }
                      { this.state.status === 'error' && i18n.__('Check Update Failed Text') }
                      { !!this.state.error && <ErrorBox error={this.state.error} iconStyle={{ color: orange500 }} /> }
                    </div>
                    <div style={{ margin: '8px 0 0 -8px' }}>
                      <FlatButton primary label={i18n.__('Check Update')} onClick={this.sendCheck} disabled={this.state.loading} />
                    </div>
                  </div>
                )
        }
      </div>
    )
  }

  render () {
    const currentVersion = global.config.appVersion
    const status = '版本检查中...'
    const ltsValue = '检测中...'
    return (
      <div style={{ width: '100%', height: '100%' }} className="flexCenter" >
        <div style={{ width: 480, paddingRight: 160, paddingBottom: 60 }}>

          <div style={{ width: 320, height: 180, marginLeft: 160 }}>
            <img
              style={{ width: 320, height: 180 }}
              src="./assets/images/pic-login.png"
              alt=""
            />
          </div>

          <div style={{ width: 240, height: 40, margin: '0 auto', paddingLeft: 160 }} className="flexCenter">
            { status }
          </div>

          <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 150, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('Current Version') }
            </div>
            <div style={{ width: 10 }} />
            <div style={{ width: 150, color: '#525a60', fontSize: 16 }}>
              { currentVersion }
            </div>
          </div>

          <div style={{ height: 1, width: 320, marginLeft: 160, marginTop: -1, backgroundColor: '#bfbfbf', opacity: 0.5 }} />
          <div style={{ height: 40 }} />

          <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 150, textAlign: 'right', color: '#525a60' }}>
              { i18n.__('Latest Version') }
            </div>
            <div style={{ width: 10 }} />
            <div style={{ width: 150, color: '#525a60', opacity: 0.5 }}>
              { ltsValue }
            </div>
          </div>

          <div style={{ height: 1, width: 320, marginLeft: 160, marginTop: -1, backgroundColor: '#bfbfbf', opacity: 0.5 }} />
          <div style={{ height: 20 }} />

          <div style={{ width: 240, height: 40, margin: '0 auto', paddingLeft: 160 }}>
            <RRButton
              label={i18n.__('Checking...')}
              onClick={this.save}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Update
