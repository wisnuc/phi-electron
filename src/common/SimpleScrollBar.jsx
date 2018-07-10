import React from 'react'

class ScrollBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      scrollHeight: 0
    }

    this.onScroll = (e) => {
      if (e.target.scrollHeight) {
        const { scrollTop, scrollHeight } = e.target
        const { height } = this.props
        const barH = Math.max(height * height / scrollHeight, 48) || 48
        const top = (height - barH) * scrollTop / (scrollHeight - height)
        this.refBar.style.top = `${top}px`
      }

      if (e.target.scrollHeight !== this.state.scrollHeight) this.setState({ scrollHeight: e.target.scrollHeight })
    }

    this.updateScrollHeight = () => {
      this.setState({ scrollHeight: this.refRoot.scrollHeight })
    }

    this.scrollTop = 0

    this.mouseDown = false

    this.onMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.mouseDown = true
      this.startY = event.clientY
      this.startScrollTop = this.scrollTop
    }

    this.onMouseUp = () => (this.mouseDown = false)

    this.onMouseMove = (event) => {
      if (!this.refBar || !this.mouseDown || !this.state.scrollHeight) return
      const { height } = this.props
      const { scrollHeight } = this.state
      const barH = Math.max(height * height / scrollHeight, 48)
      const diff = event.clientY - this.startY
      const percent = diff / (height - barH)
      const scrollTop = Math.min(scrollHeight - height, Math.max(0, percent * (scrollHeight - height) + this.startScrollTop))
      this.scrollToPosition(scrollTop)
      this.onHover()
    }

    this.onHover = () => {
      this.setState({ hover: true })
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setState({ hover: false })
      }, 1000)
    }
  }

  componentDidMount () {
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
    this.updateScrollHeight()
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  scrollToPosition (scrollTop) {
    if (this.refRoot) this.refRoot.scrollTop = scrollTop
  }

  render () {
    const { width, height, style } = this.props
    const rootStyle = Object.assign({ position: 'relative', width, height, overflow: 'hidden' }, style)

    const { scrollHeight } = this.state

    const barH = Math.max(height * height / scrollHeight, 48) || 48
    const barStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      width: this.state.hover ? 10 : 3,
      borderRadius: 4,
      transition: 'opacity 225ms',
      display: scrollHeight && (barH < height) ? '' : 'none'
    }

    return (
      <div style={rootStyle}>
        <div
          onScroll={this.onScroll}
          ref={ref => (this.refRoot = ref)}
          style={{ position: 'absolute', width: width + 16, height, overflowY: 'scroll', overflowX: 'hidden', top: 0, left: 0 }}
        >
          { this.props.children }
        </div>

        {/* scrollBar hover area */}
        <div
          onMouseMove={this.onHover}
          style={Object.assign({ backgroundColor: 'transparent', height }, barStyle, { width: 10 })}
        />

        {/* scrollBar background */}
        <div
          onMouseMove={this.onHover}
          style={Object.assign({ backgroundColor: 'rgba(0,0,0,.1)', height }, barStyle)}
        />

        {/* scrollBar */}
        <div
          ref={ref => (this.refBar = ref)}
          onMouseMove={this.onHover}
          onMouseDown={this.onMouseDown}
          style={Object.assign({ backgroundColor: '#4a95f2', height: barH }, barStyle)}
        />
      </div>
    )
  }
}

export default ScrollBar
