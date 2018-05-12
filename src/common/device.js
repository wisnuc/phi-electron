import request from 'superagent'
import RequestManager from './reqman'

const cloudAddress = 'http://www.siyouqun.com:80'

/**

  it should not emit anything in constructor, for there is no chance to
  add listeners.

  start is necessary for adding listeners before calling start and after
  constructor.

  emission may happen DURING calling start. So functions and observers must
  NOT think some reqs is always there. It may be null.

* */
class Device extends RequestManager {
  // constructor won't emit anything since there is no listeners yet
  // the common way to solve this problem is to use a separate method
  // to trigger actions
  constructor (mdev) {
    super()

    this.mdev = mdev
    this.backoff = 30

    this.firstRefresh = true

    // reqs
    this.device = null
    this.boot = null
    this.storage = null
    this.users = null
    this.mkfs = null
    this.install = null
    this.firstUser = null
    this.token = null

    // immutable
    this.state = {
      // static data
      mdev: this.mdev,

      // methods
      request: this.request.bind(this),
      requestAsync: this.requestAsync.bind(this),
      pureRequest: this.pureRequest.bind(this),
      pureRequestAsync: this.pureRequestAsync.bind(this),
      req: this.req.bind(this),
      reqAsync: this.reqAsync.bind(this),
      clearRequest: this.clearRequest.bind(this),
      initWizard: this.initWizard.bind(this),
      systemStatus: this.systemStatus.bind(this),
      mkFileSystem: this.mkFileSystem.bind(this),
      reInstall: this.reInstall.bind(this),
      refreshSystemState: this.refreshSystemState.bind(this),
      manualBoot: this.manualBoot.bind(this),
      addFirstUser: this.addFirstUser.bind(this)
    }

    this.reqCloud = (type, ep, stationID, token) => {
      const url = `${cloudAddress}/c/v1/stations/${stationID}/json`
      const resource = Buffer.from(`/${ep}`).toString('base64')
      // console.log('this.reqCloud device', type, ep, url, token)
      return request
        .get(url)
        .query({ resource, method: type })
        .set('Authorization', token)
    }
  }

  request (name, args, next) {
    let r

    switch (name) {
      case 'boot':
        r = request
          .get(`http://${this.mdev.address}:3000/boot`)
        break

      case 'device':
        r = request
          .get(`http://${this.mdev.address}:3000/control/system`)
        break

      case 'info':
        r = request
          .get(`http://${this.mdev.address}:3000/station/info`)
        break

      case 'renameStation':
        r = request
          .patch(`http://${this.mdev.address}:3000/station/info`, { name: args.name })
        break

      case 'storage':
        r = request
          .get(`http://${this.mdev.address}:3000/storage`)
        break

      case 'power':
        r = request
          .patch(`http://${this.mdev.address}:3000/boot`)
          .timeout(30000)
          .send(args)
          .set('Accept', 'application/json')
        break

      case 'timedate':
        r = request
          .get(`http://${this.mdev.address}:3000/control/timedate`)
        break

      case 'net':
        r = request
          .get(`http://${this.mdev.address}:3000/control/net/interfaces`)
        break

      case 'fan':
        r = request
          .get(`http://${this.mdev.address}:3000/control/fan`)
        break

      case 'setFanScale':
        r = request
          .patch(`http://${this.mdev.address}:3000/control/fan`)
          .send(args)
          .set('Accept', 'application/json')
        break

      case 'ipaliasing':
        r = request
          .get(`http://${this.mdev.address}:3000/control/net/ipaliasing`)
        break

      case 'setIpaliasing':
        r = request
          .post(`http://${this.mdev.address}:3000/control/net/ipaliasing`)
          .timeout(30000)
          .send(args)
          .set('Accept', 'application/json')
        break

      case 'users':
        r = request
          .get(`http://${this.mdev.address}:3000/users`)
        break

      case 'mkfs':
        r = request
          .post(`http://${this.mdev.address}:3000/storage/volumes`)
          .timeout(30000)
          .send(args)
          .set('Accept', 'application/json')
        break

      case 'install':
        r = request
          .patch(`http://${this.mdev.address}:3000/boot`)
          .timeout(30000)
          .send(args)
          .set('Accept', 'application/json')
        break

      case 'forceBoot':
        r = request
          .patch(`http://${this.mdev.address}:3000/boot`)
          .timeout(30000)
          .send(args)
          .set('Accept', 'application/json')
        break

      case 'firstUser':
        r = request
          .post(`http://${this.mdev.address}:3000/users`)
          .send(args)
          .set('Accept', 'application/json')
        break

      case 'run':
        r = request
          .post(`http://${this.mdev.address}:3000/system/run`)
          .timeout(30000)
          .send(args)
          .set('Accept', 'application/json')
        break

      case 'token':
        r = request
          .get(`http://${this.mdev.address}:3000/token`)
          .auth(args.uuid, args.password)
          .set('Accept', 'application/json')
        break

      /** FirmwareUpdate API * */
      case 'firm':
        r = request
          .get(`http://${this.mdev.address}:3001/v1`)
        break

      default:
        break
    }

    if (!r) console.error(`no request handler found for ${name}`)
    else this.setRequest(name, args, cb => r.end(cb), next)
  }

  async requestAsync (name, args) {
    return Promise.promisify(this.request).bind(this)(name, args)
  }

  pureRequest (name, args, next) {
    let r
    let cloud = false
    switch (name) {
      case 'getWechatToken':
        r = request
          .get(`${cloudAddress}/c/v1/token`)
          .query({ code: args.code })
          .query({ platform: 'web' })
        cloud = true
        break

      case 'getStations':
        r = request
          .get(`${cloudAddress}/c/v1/users/${args.guid}/stations`)
          .set('Authorization', args.token)
        cloud = true
        break

      case 'creatTicket':
        r = request
          .post(`http://${this.mdev.address}:3000/station/tickets/`)
          .set('Authorization', `JWT ${this.state.token.data.token}`)
          .send({ type: 'bind' })
        break

      case 'fillTicket':
        r = request
          .post(`${cloudAddress}/c/v1/tickets/${args.ticketId}/users`)
          .set('Authorization', args.token)
        cloud = true
        break

      case 'confirmTicket':
        r = request
          .post(`http://${this.mdev.address}:3000/station/tickets/wechat/${args.ticketId}`)
          .set('Authorization', `JWT ${this.state.token.data.token}`)
          .send({
            guid: args.guid,
            state: args.state
          })
        break

      case 'cloudUsers':
        r = this.reqCloud('GET', 'users', args.stationID, args.token)
        cloud = true
        break

      case 'localTokenByCloud':
        r = this.reqCloud('GET', 'token', args.stationID, args.token)
        cloud = true
        break

      case 'info':
        r = args && args.ip
          ? request.get(`http://${args.ip}:3000/station/info`).timeout(2000)
          : request.get(`http://${this.mdev.address}:3000/station/info`)
        break

      /* bootstrap */
      case 'installAppifi':
        r = request
          .put(`http://${this.mdev.address}:3001/v1/app`)
          .send({ tagName: args.tagName })
        break

      case 'handleAppifi':
        r = request
          .patch(`http://${this.mdev.address}:3001/v1/app`)
          .send({ state: args.state })
        break

      case 'handleRelease':
        r = request
          .patch(`http://${this.mdev.address}:3001/v1/releases/${args.tagName}`)
          .send({ state: args.state })
        break

      case 'checkUpdates':
        r = request
          .patch(`http://${this.mdev.address}:3001/v1/fetch`)
          .send({ state: 'Working' })
        break

      case 'firm':
        r = request
          .get(`http://${this.mdev.address}:3001/v1`)
        break

      default:
        break
    }

    if (!r) console.error(`no request handler found for ${name}`)
    else r.end((err, res) => (typeof next === 'function') && next(err, cloud ? res && res.body && res.body.data : res && res.body))
  }

  async pureRequestAsync (name, args) {
    return Promise.promisify(this.pureRequest).bind(this)(name, args)
  }

  req (name, args, next) {
    let r
    let cloud = false
    const phiCloudAddress = 'sohon2test.phicomm.com'
    switch (name) {
      case 'authorizationcode':
        r = request
          .get(`http://${phiCloudAddress}/v1/authorization`)
          .query({ client_id: '2149773', client_secret: 'FA35C1A18F830497AF75BD2636E54CBD', response_type: 'code', scope: 'read' })
        cloud = true
        break

      case 'phiToken':
        r = request
          .post(`http://${phiCloudAddress}/v1/login`)
          .query({
            authorizationcode: 'feixun*123.SH_2149773',
            phonenumber: args.phonenumber,
            password: args.password
          })
        cloud = true
        break

      case 'stationList':
        r = request
          .get(`http://${phiCloudAddress}/StationManager/station`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `${args.token}`)
        cloud = true
        break

      case 'bindDevice':
        r = request
          .post(`http://${phiCloudAddress}/StationManager/relation/binding`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `${args.token}`)
          .send({ deviceSN: args.deviceSN })
        cloud = true
        break

      case 'getBindState':
        r = request
          .get(`http://${phiCloudAddress}/StationManager/relation/binding`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `${args.token}`)
          .query({ deviceSN: args.deviceSN })
        cloud = true
        break

      case 'unbindDevice':
        r = request
          .del(`http://${phiCloudAddress}/StationManager/relation/binding`)
          .set('Content-Type', 'application/json')
          .set('Authorization', args.token)
          .send({ deviceSN: args.deviceSN })
        cloud = true
        break

      case 'boundVolume':
        r = request
          .post(`http://${this.mdev.address}:3000/boot/boundVolume`)
          .set('Content-Type', 'application/json')
          .send({ target: args.target, mode: args.mode })
        break

      case 'getLANToken':
        r = request
          .post(`http://${phiCloudAddress}/ResourceManager/app/pipe/command`)
          .set('Content-Type', 'application/json')
          .set('Authorization', args.token)
          .send({
            deviceSN: args.deviceSN,
            data: {
              verb: 'get',
              path: '/token',
              qs: {},
              body: {}
            }
          })
        break

      case 'setLANPassword':
        r = request
          .post(`http://${phiCloudAddress}/ResourceManager/app/pipe/command`)
          .set('Content-Type', 'application/json')
          .set('Authorization', args.token)
          .send({
            deviceSN: args.deviceSN,
            data: {
              verb: 'patch',
              path: `/users/${args.userUUID}`,
              qs: {},
              body: { password: args.password }
            }
          })
        break

      default:
        break
    }

    if (!r) console.error(`no request handler found for ${name}`)
    else {
      r.end((err, res) => {
        console.log('req raw', err, res)
        if (typeof next === 'function') {
          let error = err
          let body
          if (!error) {
            body = res && res.body
            if (cloud && !Object.keys(body).length) {
              try {
                body = JSON.parse(res.text)
              } catch (e) {
                error = new Error('JSON parse error')
              }
            } else {
              body = res && res.body
            }
          }
          next(err, body)
        }
      })
    }
  }

  async reqAsync (name, args) {
    return Promise.promisify(this.req).bind(this)(name, args)
  }

  start () {
    this.refreshSystemState(() => console.log('init refresh done', this))
  }

  refreshSystemState (next) {
    let count = 2
    const done = next ? () => !(count -= 1) && next() : undefined
    this.request('boot', null, done)
    this.request('users', null, done)
  }

  async refreshSystemStateAsync () {
    return Promise.promisify(this.refreshSystemState).bind(this)()
  }

  // *  1. mkfs
  //    2. mkfs failed
  // *  3. update storage
  //    4. update storage failed
  // *  5. install
  //    6. install failed
  // *  7. refreshing boot or boot.fruitmix.state === 'starting'
  //    8. refreshing boot failed or boot.fruitmix.state === 'exited'
  // *  9. refreshing users
  //    10. refreshing users failed
  // *  11. creating first user
  //    12. creating first user failed
  // *  13. retrieving token
  //    14. retrieving token failed

  async initWizardAsync (args) {
    const { target, mode, username, password } = args
    const uuid = await this.requestAsync('mkfs', { target, mode })

    // await this.requestAsync('storage', null) // FIXME can't finish ???
    await this.requestAsync('install', { current: uuid.uuid })

    while (true) {
      await Promise.delay(1000)
      await this.requestAsync('boot', null)
      const current = this.boot.value().current
      const state = this.boot.value().state
      if (current) {
        if (state === 'started') {
          // this may be due to worker not started yet
          await Promise.delay(2000)
          break
        }
        if (state === 'stopping') return console.log('device initWizard: fruitmix stopping (unexpected), stop')
      } else console.log('device initWizard: fruitmix is null, legal ???') // NO!!!
    }

    await this.requestAsync('firstUser', { username, password })

    const user = this.firstUser.value()
    await this.requestAsync('users', null)
    await this.requestAsync('token', { uuid: user.uuid, password })
    return null
  }

  async addFirstUserAsync (args) {
    const { username, password } = args

    await this.requestAsync('firstUser', { username, password })

    const user = this.firstUser.value()
    console.log('device initWizard: first user created')

    await this.requestAsync('users', null)
    console.log('device initWizard: users refreshed')

    await this.requestAsync('token', { uuid: user.uuid, password })
    console.log('device initWizard: token retrieved')
  }

  async mkfsAsync (args) {
    const { target, mode } = args
    await this.requestAsync('mkfs', { target, mode })
    await this.requestAsync('storage', null)
  }

  async reInstallAsync (args) {
    const { target, username, password } = args
    await this.requestAsync('install', { current: target })
    while (true) {
      await Promise.delay(1000)
      await this.requestAsync('boot', null)
      const fruitmix = this.boot.value().fruitmix
      if (fruitmix) {
        if (fruitmix.state === 'started') {
          await Promise.delay(2000)
          break
        }
        if (fruitmix.state === 'exited') {
          console.log('device initWizard: fruitmix exited (unexpected), stop')
          break
        }
      } else {
        console.log('device reInstall: fruitmix is null, legal ???') // NO!!!
        break
      }
    }
    await this.requestAsync('firstUser', { username, password })
    // console.log('firstUser', this.firstUser.value())
    await this.requestAsync('users', null)
  }

  async manualBootAsync (args) {
    const { target } = args
    await this.requestAsync('run', { target })
  }

  initWizard (args) {
    this.initWizardAsync(args).asCallback(() => {})
  }

  addFirstUser (args) {
    this.addFirstUserAsync(args).asCallback(() => {})
  }

  mkFileSystem (args) {
    this.mkfsAsync(args).asCallback(() => {})
  }

  reInstall (args) {
    this.reInstallAsync(args).asCallback(() => {})
  }

  manualBoot (args) {
    this.manualBootAsync(args).asCallback(() => {})
  }

  /**
   probing -> wait
   starting -> wait
   systemError -> error
   fruitmixError -> maint
   noUser -> create first user
   ready -> show user list
   userMaint -> maint
   failLast -> maint
   uninitialized -> init
   failNoAlt -> maint
  * */
  systemStatus () {
    if (!this.device || !this.boot || !this.storage || !this.info || !this.users ||
      this.device.isPending() || this.boot.isPending() || this.info.isPending() ||
      this.storage.isPending() || this.users.isPending()) {
      return 'probing'
    } else if (this.boot.isRejected() || this.storage.isRejected()) {
      return 'systemError'
    }

    const boot = this.boot.value()
    const storage = this.storage.value()
    if (!boot || !storage) return 'systemError'

    /* normal mode */
    if (!boot.error && boot.state === 'started' && boot.current) {
      if (this.users.isRejected()) {
        return 'fruitmixError'
      } else if (this.users.value() && !this.users.value().length) {
        return 'noUser'
      }
      return 'ready'
    } else if (!boot.error && boot.state === 'starting' && this.firstRefresh) {
      this.firstRefresh = false
      return setTimeout(() => this.refreshSystemState(), 1000)
    }

    /* no volume */
    if (storage && storage.volumes && storage.volumes.length === 0) {
      return 'uninitialized'
    }

    /* maintenance mode */
    if (boot.error === 'ELASTNOTMOUNT' || boot.error === 'ELASTMISSING' || boot.error === 'ELASTDAMAGED') {
      return 'failLast'
    } else if (boot.error === 'ENOALT') {
      return 'failNoAlt'
    } else if (boot.mode === 'maintenance') {
      return 'userMaint'
    }
    return 'unknownMaint'
  }
}

export default Device
