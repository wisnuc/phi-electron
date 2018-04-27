import React from 'react'
import i18n from 'i18n'
import Base from './Base'
import SleepMode from '../settings/SleepMode'

class Sleep extends Base {
  navGroup () {
    return 'settings'
  }

  menuName () {
    return i18n.__('SleepMode Menu Name')
  }

  menuDes () {
    return i18n.__('SleepMode Description')
  }

  menuIcon () {
    const Pic = props => (
      <div {...props}>
        <img src="./assets/images/ic-sleepmode.png" alt="" width={44} height={48} />
      </div>
    )
    return Pic
  }

  renderContent ({ openSnackBar }) {
    return (
      <SleepMode
        apis={this.ctx.props.apis}
        openSnackBar={openSnackBar}
      />
    )
  }
}

export default Sleep
