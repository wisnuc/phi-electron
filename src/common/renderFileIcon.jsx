import React from 'react'
import { PhotoIcon, TXTIcon, WORDIcon, EXCELIcon, PPTIcon, PDFIcon, VideoIcon, AudioIcon, TypeUnknownIcon } from '../common/Svg'

const renderFileIcon = (name, metadata, setSize, dark, white) => {
  /* PDF, TXT, Word, Excel, PPT */
  let extension = name.replace(/^.*\./, '')
  if (!extension || extension === name) extension = 'OTHER'

  const iconArray = {
    PDF: { Icon: PDFIcon, color: '#db4437' },
    TXT: { Icon: TXTIcon, color: dark ? '#FFFFFF' : 'rgba(0,0,0,0.54)' },
    DOCX: { Icon: WORDIcon, color: '#4285f4' },
    DOC: { Icon: WORDIcon, color: '#4285f4' },
    XLS: { Icon: EXCELIcon, color: '#0f9d58' },
    XLSX: { Icon: EXCELIcon, color: '#0f9d58' },
    PPT: { Icon: PPTIcon, color: '#db4437' },
    PPTX: { Icon: PPTIcon, color: '#db4437' },
    MP3: { Icon: AudioIcon, color: '#00bcd4' },
    APE: { Icon: AudioIcon, color: '#00bcd4' },
    FLAC: { Icon: AudioIcon, color: '#00bcd4' },
    WMA: { Icon: AudioIcon, color: '#00bcd4' },
    MP4: { Icon: VideoIcon, color: '#f44336' },
    MOV: { Icon: VideoIcon, color: '#f44336' },
    AVI: { Icon: VideoIcon, color: '#f44336' },
    MKV: { Icon: VideoIcon, color: '#f44336' },
    FLV: { Icon: VideoIcon, color: '#f44336' },
    JPG: { Icon: PhotoIcon, color: '#ea4335' },
    PNG: { Icon: PhotoIcon, color: '#ea4335' },
    GIF: { Icon: PhotoIcon, color: '#ea4335' },
    OTHER: { Icon: TypeUnknownIcon, color: dark ? '#FFFFFF' : 'rgba(0,0,0,0.54)' }
  }

  let type = extension.toUpperCase()
  // debug('renderFileIcon', name, metadata, extension, iconArray, type)
  if (!iconArray[type]) type = 'OTHER'

  let { color } = iconArray[type]
  const { Icon } = iconArray[type]
  const size = setSize || 24

  /* when background is dark, icon color should adjust to white */
  if (white) color = '#FFFFFF'

  return (<Icon style={{ color, width: size, height: size }} />)
}

export default renderFileIcon
