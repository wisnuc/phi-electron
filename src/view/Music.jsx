import i18n from 'i18n'
import Photo from './Photo'
import { MyMusicIcon } from '../common/Svg'

class Music extends Photo {
  constructor (ctx) {
    super(ctx)
    this.title = () => i18n.__('Music Menu Name')
    this.type = 'music'
  }

  menuIcon () {
    return MyMusicIcon
  }
}

export default Music
