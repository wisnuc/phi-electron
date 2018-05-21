import request from 'superagent'
import RequestManager from './reqman'

const phiCloudAddress = 'sohon2test.phicomm.com'

class PhiAPI extends RequestManager {
  constructor () {
    super()
    this.state = {
      req: this.req.bind(this),
      reqAsync: this.reqAsync.bind(this)
    }

    this.setRequest = (name, err, res, next) => {
      console.log('req raw', err, res)
      let error = err
      let body
      if (!error) {
        body = res && res.body

        /* handle response in res.text */
        if (!Object.keys(body).length) {
          try {
            body = JSON.parse(res.text)
          } catch (e) {
            error = new Error('JSON parse error')
          }
        } else {
          body = res && res.body
        }
        /* handle data from pipi command */
        if (body && body.result && body.result.data) {
          error = body.result.data.error
          body = body.result.data.res
        }
      }

      /* save phi token */
      if (name === 'token' && !err && body && body.access_token) this.token = body.access_token

      /* callback next */
      if (typeof next === 'function') next(err, body)
    }
  }

  aget (ep) {
    return request
      .get(`http://${phiCloudAddress}/${ep}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', this.token)
  }

  apost (ep, data) {
    const r = request
      .post(`http://${phiCloudAddress}/${ep}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', this.token)

    return typeof data === 'object' ? r.send(data) : r
  }

  adel (ep, data) {
    const r = request
      .del(`http://${phiCloudAddress}/${ep}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', this.token)

    return typeof data === 'object' ? r.send(data) : r
  }

  command (deviceSN, data) {
    return request
      .post(`http://${phiCloudAddress}/ResourceManager/app/pipe/command`)
      .set('Content-Type', 'application/json')
      .set('Authorization', this.token)
      .send({ deviceSN, data })
  }

  req (name, args, next) {
    let r
    switch (name) {
      case 'authorizationcode':
        r = request
          .get(`http://${phiCloudAddress}/v1/authorization`)
          .query({ client_id: '2149773', client_secret: 'FA35C1A18F830497AF75BD2636E54CBD', response_type: 'code', scope: 'read' })
        break

      case 'token':
        r = request
          .post(`http://${phiCloudAddress}/v1/login`)
          .query({
            authorizationcode: 'feixun*123.SH_2149773',
            phonenumber: args.phonenumber,
            password: args.password
          })
        break

      case 'stationList':
        r = this.aget('StationManager/station')
        break

      case 'bindDevice':
        r = this.apost('StationManager/relation/binding', { deviceSN: args.deviceSN })
        break

      case 'unbindStation':
        r = this.adel('StationManager/relation/binding', { deviceSN: args.deviceSN })
        break

      case 'getBindState':
        r = this.aget('StationManager/relation/binding')
          .query({ deviceSN: args.deviceSN })
        break

      case 'LANToken':
        r = this.command(args.deviceSN, { verb: 'GET', urlPath: '/token', params: {}, body: {} })
        break

      case 'cloudUsers':
        r = this.command(args.deviceSN, { verb: 'GET', urlPath: '/users', params: {}, body: {} })
        break

      case 'setLANPassword':
        r = this.command(args.deviceSN, {
          verb: 'PATCH', urlPath: `/users/${args.userUUID}`, params: {}, body: { password: args.password, encrypted: false }
        })
        break

      default:
        break
    }

    if (!r) console.error(`no request handler found for ${name}`)
    else r.end((err, res) => this.setRequest(name, err, res, next))
  }

  async reqAsync (name, args) {
    return Promise.promisify(this.req).bind(this)(name, args)
  }
}

export default PhiAPI
