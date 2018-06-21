import i18n from 'i18n'
import React from 'react'
import { Divider } from 'material-ui'
import { AutoSizer } from 'react-virtualized'

import Dialog from '../common/PureDialog'
import ScrollBar from '../common/ScrollBar'
import { isPhoneNumber } from '../common/validate'
import { CloseIcon, BackIcon } from '../common/Svg'
import CircularLoading from '../common/CircularLoading'
import { RSButton, LIButton, Checkbox, TextField } from '../common/Buttons'

class AdminUsersApp extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      users: null,
      checkList: [],
      pn: '',
      pnError: '',
      nickName: '',
      nickNameError: '',
      status: 'view' // view, modify, add, confirm
    }

    this.reqUsersAsync = async () => {
      const { phi, device } = this.props
      const deviceSN = device.mdev.deviceSN
      const cloudUsers = (await phi.reqAsync('cloudUsers', { deviceSN })).result.users
      const localUsers = await phi.reqAsync('localUsers', { deviceSN })
      const drives = await phi.reqAsync('drives', { deviceSN })

      console.log('this.reqUsersAsync', cloudUsers, localUsers, drives)
      /* public drives */
      const builtIn = drives.find(d => d.tag === 'built-in')
      const publicDrives = drives.filter(d => d.type === 'public' && d.tag !== 'built-in')

      /* service users */
      const users = cloudUsers.filter(u => u.type === 'service').map((u) => {
        const localUser = localUsers.find(user => user.phicommUserId === u.uid)
        if (!localUser) return null
        const { uuid, username } = localUser
        const driveList = []
        driveList.push(builtIn.label || i18n.__('Public Drive'))
        publicDrives.filter(p => p.writelist === '*' || p.writelist.includes(uuid)).forEach(d => driveList.push(d.label))
        return Object.assign({ username, driveList, uuid }, u)
      }).filter(u => !!u)

      return users
    }

    this.reqUsers = () => {
      this.setState({ loading: true, users: null, status: 'view', invited: false })
      this.reqUsersAsync().then(users => this.setState({ users, loading: false })).catch((e) => {
        console.error('this.reqUsers error', e)
        this.setState({ error: true, loading: false })
      })
    }

    this.deleteUserAsync = async () => {
      console.log('this.deleteUser', this.state.checkList)
      const { phi, device } = this.props
      const deviceSN = device.mdev.deviceSN
      for (let i = 0; i < this.state.checkList.length; i++) {
        const uuid = this.state.checkList[i]
        await phi.req('deleteUser', { deviceSN, uuid })
      }
    }

    this.deleteUser = () => {
      this.deleteUserAsync().then(() => this.reqUsers()).catch((e) => {
        console.error('this.delete error', e)
        this.props.openSnackBar(i18n.__('Delete User Failed'))
      })
    }

    this.addUser = () => {
      this.setState({ status: 'addUser', loading: false, invited: false, pn: '', pnError: '', nickName: '', nickNameError: '' })
    }

    this.backToView = () => {
      this.setState({ status: 'view', loading: false, invited: false, pn: '', pnError: '', nickName: '', nickNameError: '' })
    }

    this.inviteAsync = async () => {
      const { phi, device } = this.props
      const deviceSN = device.mdev.deviceSN
      const args = { deviceSN, phoneNumber: this.state.pn, nickName: this.state.nickName }
      const phicommUserId = (await phi.reqAsync('registerPhiUser', args)).result.uid
      console.log('this.inviteAsync phicommUserId', phicommUserId)
      const user = await phi.reqAsync('newUser', { deviceSN, username: this.state.pn, phoneNumber: this.state.pn, phicommUserId })
      console.log('this.inviteAsync res', user)
      if (!user || user.phicommUserId !== phicommUserId) throw Error('add local user error')
      const cloudUsers = (await phi.reqAsync('cloudUsers', { deviceSN })).result.users
      console.log('this.inviteAsync cloudUsers', cloudUsers)
      if (!cloudUsers.find(u => u.uid === phicommUserId)) throw Error('req cloud user error')
    }

    this.invite = () => {
      if (!this.shouldAddUser()) return
      this.setState({ invited: true })
      this.inviteAsync().then(() => this.reqUsers()).catch((e) => {
        console.error('this.invite error', e)
        this.setState({ invited: false })
        this.props.openSnackBar(i18n.__('Invite User Error'))
      })
    }

    this.onCheck = (uuid) => {
      const checkList = [...this.state.checkList]
      const index = checkList.findIndex(u => u === uuid)
      if (index > -1) checkList.splice(index, 1)
      else checkList.push(uuid)
      this.setState({ checkList })
    }

    this.updateNickName = nickName => this.setState({ nickName, nickNameError: '' })

    this.updatePn = (pn) => {
      if (isPhoneNumber(pn)) this.setState({ pn, pnError: '' })
      else this.setState({ pn, pnError: i18n.__('Invalid Phone Number') })
    }

    this.confirmDelete = () => {
      this.setState({ status: 'confirm' })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.open && nextProps.open) this.reqUsers()
  }

  shouldAddUser () {
    return this.state.status === 'addUser' && this.state.nickName && !this.state.nickNameError &&
      this.state.pn.length === 11 && !this.state.pnError && isPhoneNumber(this.state.pn) && !this.state.invited
  }

  renderUser (driveList) {
    return (
      <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#31a0f5' }}> { i18n.__('User') } </div>
        <div style={{ backgroundColor: '#c4c5cc', height: 10, width: 1, margin: '0 8px' }} />
        <div style={{ color: '#888a8c' }}> { driveList.join(', ') } </div>
      </div>
    )
  }

  renderAddUser () {
    return (
      <div style={{ width: 280 }}>
        <div
          style={{
            height: 20,
            fontSize: 14,
            color: this.state.nickNameError ? '#fa5353' : '#525a60',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          { this.state.nickNameError || i18n.__('Nick Name') }
        </div>
        <div style={{ marginTop: -30 }}>
          <TextField
            value={this.state.nickName}
            maxLength={20}
            onChange={e => this.updateNickName(e.target.value)}
            hintText={i18n.__('Add User Nick Name Hint')}
            disabled={this.state.invited}
          />
        </div>
        <div style={{ height: 10 }} />
        <div
          style={{
            height: 20,
            fontSize: 14,
            color: this.state.pnError ? '#fa5353' : '#525a60',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          { this.state.pnError || i18n.__('Phone Number') }
        </div>
        <div style={{ marginTop: -30 }}>
          <TextField
            value={this.state.pn}
            maxLength={11}
            onChange={e => this.updatePn(e.target.value)}
            hintText={i18n.__('Add User Phone Number Hint')}
            disabled={this.state.invited}
          />
        </div>
      </div>
    )
  }

  renderLoading () {
    return (
      <div style={{ width: 320, padding: '0 30px' }} >
        <div style={{ width: '100%', height: '100%' }} className="flexCenter">
          <CircularLoading />
        </div>
        <div style={{ height: 20, color: '#31a0f5' }} className="flexCenter">
          { i18n.__('Loading Users Text') }
        </div>
      </div>
    )
  }

  renderNoUser () {
    return (
      <div style={{ width: 320, padding: '0 30px' }} >
        <img src="./assets/images/pic_nouser.png" alt="nouser" width={320} height={180} />
        <div style={{ height: 80, color: '#85868c', marginTop: 20, lineHeight: '26px' }} >
          { i18n.__('No User Text') }
        </div>
      </div>
    )
  }

  renderRow ({ style, key, user }) {
    const { driveList, inviteStatus, nickname, username, uuid } = user
    const isModify = this.state.status === 'modify'
    return (
      <div style={style} key={key}>
        <div style={{ height: 60, display: 'flex' }}>
          {
            isModify &&
            (
              <div style={{ marginTop: -2 }}>
                <Checkbox
                  onCheck={() => this.onCheck(uuid)}
                  checked={this.state.checkList.includes(uuid)}
                />
              </div>
            )
          }

          <div style={{ height: 60 }}>
            <div
              style={{
                height: 20,
                color: '#505259',
                display: 'flex',
                alignItems: 'center',
                cursor: isModify ? 'pointer' : 'default'
              }}
              onClick={() => isModify && this.onCheck(uuid)}
            >
              { `${nickname} (${username})` }
            </div>
            <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
              {
                inviteStatus === 'accept' ? this.renderUser(driveList)
                  : (
                    <div style={{ color: inviteStatus === 'reject' ? '#f53131' : '#31a0f5' }}>
                      { inviteStatus === 'reject' ? i18n.__('Invite Rejected') : i18n.__('Invite Pending') }
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderUsers (users) {
    const rowCount = users.length
    const rowHeight = 60
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <AutoSizer>
          {({ height, width }) => (
            <ScrollBar
              allHeight={rowHeight * rowCount}
              height={height}
              width={width}
              rowHeight={rowHeight}
              rowRenderer={({ style, key, index }) => this.renderRow({ style, key, user: users[index] })}
              rowCount={rowCount}
              overscanRowCount={3}
              style={{ outline: 'none' }}
            />
          )}
        </AutoSizer>
      </div>
    )
  }

  render () {
    const { open, onCancel } = this.props
    const isModify = this.state.status === 'modify'
    const isAddUser = this.state.status === 'addUser'
    const isConfirm = this.state.status === 'confirm'
    const height = isConfirm ? 60
      : !isAddUser && this.state.users && this.state.users.length > 0 ? Math.min(this.state.users.length * 60, 180)
        : undefined

    return (
      <Dialog open={open} onRequestClose={onCancel} modal >
        {
          open && (
            <div style={{ width: (isAddUser || isConfirm) ? 320 : 420, transition: 'all 175ms' }} >
              <div
                className="title"
                style={{ height: 60, display: 'flex', alignItems: 'center', paddingLeft: isAddUser || isConfirm ? 0 : 20 }}
              >
                { (isAddUser || isConfirm) && <LIButton onClick={this.backToView}> <BackIcon /> </LIButton>}
                { isAddUser ? i18n.__('Add User') : isConfirm ? i18n.__('Confirm Delete User Title')
                  : isModify ? i18n.__('Modify Users') : i18n.__('User Management') }
                <div style={{ flexGrow: 1 }} />
                { (!isAddUser && !isConfirm) && <LIButton onClick={onCancel}> <CloseIcon /> </LIButton> }
                <div style={{ width: 10 }} />
              </div>
              <Divider
                style={{ marginLeft: 20, width: (isAddUser || isConfirm) ? 280 : 380, transition: 'all 175ms' }}
                className="divider"
              />
              <div style={{ height: 30 }} />
              <div
                style={{
                  height,
                  lineHeight: '30px',
                  color: '#888a8c',
                  padding: '0 20px'
                }}
              >
                {
                  this.state.loading ? this.renderLoading()
                    : isAddUser ? this.renderAddUser()
                      : isConfirm ? i18n.__('Confirm Delete User Text')
                        : this.state.users.length ? this.renderUsers(this.state.users) : this.renderNoUser()
                }
              </div>
              <div style={{ height: 20 }} />
              <div style={{ height: 34, width: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', padding: 20 }}>
                <div style={{ flexGrow: 1 }} />
                {
                  (!isAddUser && !isConfirm) && (
                    <RSButton
                      alt
                      disabled={!isModify && (!this.state.users || !this.state.users.length)}
                      label={isModify ? i18n.__('Cancel') : i18n.__('Modify Users')}
                      onClick={() => this.setState({ status: isModify ? 'view' : 'modify', checkList: [] })}
                    />
                  )
                }
                <div style={{ width: 10 }} />
                <RSButton
                  label={isAddUser ? i18n.__('Send Invite') : isConfirm ? i18n.__('Confirm')
                    : isModify ? i18n.__('Delete') : i18n.__('Add User')}
                  disabled={(isModify && !this.state.checkList.length) || (isAddUser && !this.shouldAddUser())}
                  onClick={() => (isAddUser ? this.invite() : isConfirm ? this.deleteUser()
                    : isModify ? this.confirmDelete() : this.addUser())}
                />
              </div>
            </div>
          )
        }
      </Dialog>
    )
  }
}

export default AdminUsersApp
