import i18n from 'i18n'
import React from 'react'
import { TextField } from 'material-ui'
import SearchIcon from 'material-ui/svg-icons/action/search'

class Search extends React.Component {
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
    return (
      <div
        style={{
          height: 24,
          padding: '0px 8px',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #00897B',
          borderRadius: 8
        }}
      >
        <SearchIcon />
        <TextField
          name="search-input"
          fullWidth
          underlineStyle={{ display: 'none' }}
          value={this.state.value}
          errorText={this.state.errorText}
          onChange={e => this.handleChange(e.target.value)}
        />
        <div style={{ cursor: 'pointer' }} onClick={this.fire}>
          { i18n.__('Search') }
        </div>
      </div>
    )
  }
}

export default Search
