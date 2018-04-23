import React from 'react'
import FileFolder from 'material-ui/svg-icons/file/folder'
import { AutoSizer } from 'react-virtualized'

import Thumb from './Thumb'
import ScrollBar from '../common/ScrollBar'
import renderFileIcon from '../common/renderFileIcon'

class Row extends React.Component {
  shouldComponentUpdate (nextProps) {
    return (!nextProps.isScrolling)
  }

  render () {
    const { select, list, isScrolling, rowSum } = this.props

    return (
      <div style={{ height: '100%', width: '100%', marginLeft: 10 }} >
        {/* file content */}
        <div style={{ display: 'flex', height: 144 }}>
          {
            list.entries.map((item) => {
              const { index, entry } = item
              const selected = select.selected.findIndex(s => s === index) > -1
              const hover = select.hover === index && !selected
              const backgroundColor = selected ? '#e2f1fd' : hover ? '#FFF' : '#f3f8ff'
              // const onDropping = entry.type === 'directory' && select.rowDrop(index)
              return (
                <div
                  style={{
                    position: 'relative',
                    width: 140,
                    height: 140,
                    marginRight: 4,
                    marginBottom: 10,
                    backgroundColor,
                    boxSizing: 'border-box',
                    border: selected ? '1px solid var(--dodger-blue)' : '',
                    boxShadow: hover ? '0px 5px 10px 0 rgba(97, 107, 120, 0.08)' : ''
                  }}
                  role="presentation"
                  onClick={e => this.props.onRowClick(e, index)}
                  onMouseUp={(e) => { e.preventDefault(); e.stopPropagation() }}
                  onContextMenu={e => this.props.onRowContextMenu(e, index)}
                  onMouseEnter={e => this.props.onRowMouseEnter(e, index)}
                  onMouseLeave={e => this.props.onRowMouseLeave(e, index)}
                  onDoubleClick={e => this.props.onRowDoubleClick(e, index)}
                  onMouseDown={e => e.stopPropagation() || this.props.gridDragStart(e, index)}
                  key={index}
                >
                  {/* preview or icon */}
                  <div
                    draggable={false}
                    className="flexCenter"
                    style={{ height: 80, width: 80, margin: selected ? '11px auto' : '12px auto', overflow: 'hidden' }}
                  >
                    {
                      entry.type === 'file'
                        ? ((rowSum < 500 || !isScrolling) && entry.metadata
                          ? (
                            <Thumb
                              digest={entry.hash}
                              ipcRenderer={this.props.ipcRenderer}
                              height={80}
                              width={80}
                            />
                          ) : renderFileIcon(entry.name, entry.metadata, 50)
                        ) : <FileFolder style={{ width: 50, height: 50, fill: '#ffa93e' }} />
                    }
                  </div>

                  {/* file name */}
                  <div style={{ height: selected ? 38 : 36, color: 'var(--dark-text)' }} className="flexCenter" >
                    <div
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        fontSize: 13,
                        width: 130,
                        textAlign: 'center',
                        fontWeight: 500
                      }}
                    >
                      { entry.name }
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

class GridView extends React.Component {
  constructor (props) {
    super(props)

    this.scrollToRow = index => this.ListRef.scrollToRow(index)

    this.getStatus = () => this.gridData

    this.calcGridData = () => {
      this.gridData = {
        mapData: this.mapData.reduce((acc, val, index) => {
          val.entries.forEach(() => acc.push(index))
          return acc
        }, []),
        allHeight: this.allHeight, // const rowHeight = ({ index }) => allHeight[index]
        indexHeightSum: this.indexHeightSum,
        scrollTop: this.getScrollToPosition(),
        cellWidth: 144
      }

      this.props.setGridData(this.gridData)
    }

    this.getScrollToPosition = () => (this.scrollTop || 0)

    this.onScroll = ({ scrollTop }) => {
      this.scrollTop = scrollTop
      this.props.onScroll(scrollTop)
    }
  }

  componentDidMount () {
    this.calcGridData()
  }

  componentDidUpdate () {
    if (this.props.scrollTo) {
      const index = this.props.entries.findIndex(entry => entry.name === this.props.scrollTo)
      if (index > -1) {
        let rowIndex = 0
        let sum = 0
        /* calc rowIndex */
        for (let i = 0; i < this.mapData.length; i++) {
          sum += this.mapData[i].entries.length
          if (index < sum) break
          rowIndex += 1
        }
        if (rowIndex < this.mapData.length) this.scrollToRow(rowIndex)
        this.props.resetScrollTo()
        this.props.select.touchTap(0, index)
      }
    }
    this.calcGridData()
  }

  render () {
    const calcGridInfo = (height, width, entries) => {
      const MAX = Math.floor((width - 0) / 144) - 1
      let MaxItem = 0
      let lineIndex = 0
      let lastType = 'diriectory'
      this.allHeight = []
      this.rowHeightSum = 0
      this.indexHeightSum = []
      this.maxScrollTop = 0

      const firstFileIndex = entries.findIndex(item => item.type === 'file')
      this.mapData = []
      entries.forEach((entry, index) => {
        if (MaxItem === 0 || lastType !== entry.type) {
          /* add new row */
          this.mapData.push({
            first: (!index || index === firstFileIndex),
            index: lineIndex,
            entries: [{ entry, index }]
          })

          MaxItem = MAX
          lastType = entry.type
          lineIndex += 1
        } else {
          MaxItem -= 1
          this.mapData[this.mapData.length - 1].entries.push({ entry, index })
        }
      })

      /* simulate large list */
      for (let i = 1; i <= 0; i++) {
        this.mapData.push(...this.mapData)
      }
      /* calculate each row's heigth and their sum */
      this.mapData.forEach((list) => {
        const tmp = 150
        this.allHeight.push(tmp)
        this.rowHeightSum += tmp
        this.indexHeightSum.push(this.rowHeightSum)
      })

      this.maxScrollTop = this.rowHeightSum - height

      return {
        mapData: this.mapData,
        allHeight: this.allHeight,
        rowHeightSum: this.rowHeightSum,
        indexHeightSum: this.indexHeightSum,
        maxScrollTop: this.maxScrollTop
      }
    }

    if (!this.props.entries || this.props.entries.length === 0) return (<div />)
    return (
      <div style={{ width: '100%', height: '100%' }} onDrop={this.props.drop}>
        <AutoSizer key={this.props.entries && this.props.entries[0] && this.props.entries[0].uuid}>
          {({ height, width }) => {
            const gridInfo = calcGridInfo(height, width, this.props.entries)
            // const { mapData, allHeight, rowHeightSum, indexHeightSum, maxScrollTop } = gridInfo
            const { mapData, allHeight, rowHeightSum } = gridInfo

            /* To get row index of scrollToRow */
            this.mapData = mapData
            this.allHeight = allHeight

            const estimatedRowSize = rowHeightSum / allHeight.length
            const rowHeight = ({ index }) => allHeight[index]

            const rowRenderer = ({ key, index, style, isScrolling }) => (
              <div key={key} style={style} >
                <Row
                  {...this.props}
                  rowSum={mapData.length}
                  isScrolling={isScrolling}
                  list={mapData[index]}
                />
              </div>
            )

            return (
              <div
                role="presentation"
                onMouseDown={e => this.props.selectStart(e)}
                onMouseUp={e => this.props.onRowClick(e, -1)}
                onContextMenu={e => this.props.onRowContextMenu(e, -1)}
                onMouseMove={e => this.props.selectGrid(e, this.getStatus())}
              >
                <ScrollBar
                  ref={ref => (this.ListRef = ref)}
                  allHeight={rowHeightSum}
                  height={height - 8}
                  width={width}
                  estimatedRowSize={estimatedRowSize}
                  rowHeight={rowHeight}
                  rowRenderer={rowRenderer}
                  rowCount={gridInfo.mapData.length}
                  onScroll={this.onScroll}
                  overscanRowCount={10}
                  style={{ outline: 'none' }}
                />
              </div>
            )
          }}
        </AutoSizer>
      </div>
    )
  }
}

export default GridView
