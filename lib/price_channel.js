'use strict'

const Indicator = require('./indicator')
const _min = require('lodash/min')
const _max = require('lodash/max')

class PC extends Indicator {
  constructor (args = []) {
    const [ period, offset ] = args

    super({
      args,
      id: PC.id,
      name: `PC(${period}, ${offset})`,
      seedPeriod: period,
      dataType: 'candle',
      dataKey: '*',
    })

    this._p = period
    this._offset = offset
    this._l = period + offset
    this._buffer = []
  }

  reset () {
    super.reset()
    this._buffer = []
  }

  update (candle) {
    if (this._buffer.length === 0) {
      this._buffer.push(candle)
    } else {
      this._buffer[this._buffer.length - 1] = candle
    }
  
    if (this._buffer.length < this._l) {
      return super.update(0)
    }

    const upper = _max(this._buffer.slice(0, this._p).map(c => c.high))
    const lower = _min(this._buffer.slice(0, this._p).map(c => c.low))

    super.update({
      upper,
      lower,
      center: (upper + lower) / 2,
    })
  }

  add (candle) {
    this._buffer.push(candle)

    if (this._buffer.length > this._l) {
      this._buffer.splice(0, 1)
    } else if (this._buffer.length < this._l) {
      return
    }

    const upper = _max(this._buffer.slice(0, this._p).map(c => c.high))
    const lower = _min(this._buffer.slice(0, this._p).map(c => c.low))

    super.add({
      upper,
      lower,
      center: (upper + lower) / 2,
    })
  }

  ready () {
    return _isObject(this.v())
  }
}

PC.id = 'pc'
PC.label = 'PC'
PC.humanLabel = 'Price Channel'
PC.ui = {
  position: 'external',
  type: 'lines',
  lines: ['upper', 'center', 'lower']
}

PC.args = [{
  label: 'Period',
  default: 20,
}, {
  label: 'Offset',
  default: 1
}]

module.exports = PC
