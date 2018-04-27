import React from 'react'
import { MenuItem } from 'material-ui'

export default (props) => {
  let style = { fontSize: 14, minHeight: 30, height: 30, lineHeight: '30px', padding: '0 4px', color: '#505259' }
  if (props.style) style = Object.assign({}, style, props.style)

  return <MenuItem {...props} style={style} />
}
