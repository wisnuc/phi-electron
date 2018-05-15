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
  /* the common way to solve this problem is to use a separate method to trigger actions */
  constructor (mdev) {
    super()

    this.mdev = mdev

    this.firstRefresh = true

    this.boot = null

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
      reqAsync: this.reqAsync.bind(this)
      systemStatus: this.systemStatus.bind(this),
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

      case 'users':
        r = request
          .get(`http://${this.mdev.address}:3000/users`)
        break

      case 'token':
        r = request
          .get(`http://${this.mdev.address}:3000/token`)
          .auth(args.uuid, args.password)
          .set('Accept', 'application/json')
        break

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
        console.log('boundVolume', args)
        r = request
          .post(`http://${this.mdev.address}:3000/boot/boundVolume`)
          .set('Content-Type', 'application/json')
          .send({ target: args.target, mode: args.mode })
        break

      case 'LANToken':
        r = request
          .post(`http://${phiCloudAddress}/ResourceManager/app/pipe/command`)
          .set('Content-Type', 'application/json')
          .set('Authorization', args.token)
          .send({
            deviceSN: args.deviceSN,
            data: {
              verb: 'GET',
              urlPath: '/token',
              params: {},
              body: {}
            }
          })
        cloud = true
        break

      case 'cloudUsers':
        r = request
          .post(`http://${phiCloudAddress}/ResourceManager/app/pipe/command`)
          .set('Content-Type', 'application/json')
          .set('Authorization', args.token)
          .send({
            deviceSN: args.deviceSN,
            data: {
              verb: 'GET',
              urlPath: '/users',
              params: {},
              body: {}
            }
          })
        cloud = true
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
        cloud = true
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

  /**
   probing -> wait
   systemError -> error
   noBoundUser -> can bind user
   noBoundVolume -> can format disk and bind volume
   ready -> normal state, can login
   booting -> retry request api
  **/

  systemStatus () {
    if (!this.boot || !this.users || this.boot.isPending() || this.users.isPending()) return 'probing'
    else if (this.boot.isRejected()) return 'systemError'

    const boot = this.boot.value()
    const users = this.users.value()

    const states = ['Probing', 'ProbeFailed', 'Pending', 'Presetting', 'Starting', 'Started',
      'Unavailable', 'Initializing', 'Importing', 'Repairing']

    if (!boot || !states.includes(boot.state)) return 'systemError'

    const { state, boundUser } = boot
    if (state === 'Pending' && boundUser === null) return 'noBoundUser'
    else if (state === 'Unavailable' && boundUser) return 'noBoundVolume'
    else if (state === 'STARTED' && Array.isArray(users)) return 'ready'
    else if (['Pending', 'Unavailable', 'STARTED'].includes(state)) return 'systemError'

    /* treat other state as booting and refresh 2000ms later */
    setTimeout(() => this.refreshSystemState(), 2000)
    return 'booting'
  }
}

export default Device
