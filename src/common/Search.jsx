import React from 'react'
import { TextField } from 'material-ui'
import { Button } from '../common/Buttons'
import { SearchIcon } from '../common/Svg'

class Search extends Button {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      errorText: '',
      list: []
    }

    this.fire = () => {
      this.props.fire(this.state.value)
    }

    this.handleChange = (value) => {
      this.setState({ value, errorText: '' })
    }
  }

  render () {
    const searchHint = '搜索全部文件'
    const color = this.state.hover ? '#31a0f5' : 'rgba(82, 90, 96, 0.5)'

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 34,
          width: 280,
          backgroundColor: '#f0f0f0',
          borderRadius: 17
        }}
      >
        <TextField
          name="search-input"
          style={{ width: 215, marginLeft: 20, color: '#505259' }}
          underlineStyle={{ display: 'none' }}
          hintText={searchHint}
          hintStyle={{ color: 'var(--light-grey-text)', fontSize: 14 }}
          value={this.state.value}
          errorText={this.state.errorText}
          onChange={e => this.handleChange(e.target.value)}
        />
        <SearchIcon
          {...this.funcs}
          style={{ color, cursor: 'pointer', margin: '0 10px' }}
        />
      </div>
    )
  }
}

export default Search
