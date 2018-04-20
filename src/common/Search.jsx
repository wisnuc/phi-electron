import i18n from 'i18n'
import React from 'react'
import { TextField } from 'material-ui'
import SearchIcon from 'material-ui/svg-icons/action/search'
import { Button } from '../common/Buttons'

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
    const backgroundBlendMode = this.state.hover ? 'normal, overlay' : undefined
    const backgroundImage = this.state.hover
      ? 'linear-gradient(135deg, #c29fff, #7a7afc), linear-gradient(rgba(0, 0, 0, 0.33), rgba(0, 0, 0, 0.33))'
      : 'linear-gradient(135deg, #c29fff, #7a7afc)'

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 34,
          width: 280,
          backgroundColor: '#edf2fa',
          borderRadius: 17
        }}
      >
        <SearchIcon style={{ fill: '#525a60', opacity: 0.5, margin: '0 10px' }} />
        <TextField
          name="search-input"
          style={{ width: 170 }}
          underlineStyle={{ display: 'none' }}
          hintText={searchHint}
          hintStyle={{ color: 'var(--light-grey-text)', fontSize: 14 }}
          value={this.state.value}
          errorText={this.state.errorText}
          onChange={e => this.handleChange(e.target.value)}
        />
        <div
          {...this.funcs}
          style={{
            width: 66,
            height: 34,
            color: '#FFF',
            cursor: 'pointer',
            borderRadius: '0 17px 17px 0',
            boxSizing: 'border-box',
            backgroundImage,
            backgroundBlendMode
          }}
          className="flexCenter"
        >
          { i18n.__('Search') }
        </div>
      </div>
    )
  }
}

export default Search
