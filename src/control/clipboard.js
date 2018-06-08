class Clipboard {
  constructor () {
    this.pos = {}
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
  }

  set (pos) {
    if (pos && pos.type) this.pos = pos
    return pos
  }

  get () {
    return this.pos
  }
}

export default Clipboard
