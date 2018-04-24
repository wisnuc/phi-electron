import i18n from 'i18n'
import React from 'react'

import Home from './Home'

class USB extends Home {
  constructor (ctx) {
    super(ctx)
    this.title = () => i18n.__('USB Menu Name')
  }

  menuName () {
    return i18n.__('USB Menu Name')
  }

  menuIcon () {
    const Pic = props => (
      <div {...props}>
        <img src="./assets/images/ic-usbstorage.png" alt="" width={22} height={26} style={{ marginLeft: 4 }} />
      </div>
    )
    return Pic
  }
}

export default USB
