const startWord = [
  ['ST', '希捷'],
  ['WD', '西数'],
  ['SM', '金士顿'],
  ['MZ', '三星'],
  ['SSD', '英特尔'],
  ['HT', 'HGST'],
  ['AS', '威刚'],
  ['PX', '浦科特'],
  ['PH', 'LITEON'],
  ['CN', '七彩虹'],
  ['SD', '闪迪'],
  ['KE', '金胜'],
  ['VMware', 'VMware'],
  ['VBOX', 'VBOX']
]

const interpretModel = (serial) => {
  const unknownModel = '未知品牌'
  if (typeof serial !== 'string') return unknownModel
  const index = startWord.findIndex(a => serial.startsWith(a[0]))
  if (index > -1) return startWord[index][1]
  return unknownModel
}

export default interpretModel
