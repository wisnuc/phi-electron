import i18n from 'i18n'
import Photo from './Photo'
import { MyVideoIcon } from '../common/Svg'

class Video extends Photo {
  constructor (ctx) {
    super(ctx)
    this.title = () => i18n.__('Video Menu Name')
    this.type = 'videos'
  }

  menuIcon () {
    return MyVideoIcon
  }
}

export default Video
