'use strict'

const Indicator = require('./indicator')

class VWAP extends Indicator {

  constructor () {
    super({
      args: [],
      id: VWAP.id,
      name: 'VWAP',
      seedPeriod: 0,
      dataType: 'candle',
      dataKey: '*',
    })

    this._totalNum = 0
    this._totalDen = 0
    this._lastNum = 0
    this._lastDen = 0
  }

  reset () {
    super.reset()

    this._totalNum = 0
    this._totalDen = 0
    this._lastNum = 0
    this._lastDen = 0
  }

  update (candle) {
    const { high, low, close, vol } = candle
    const typ = (high + low + close) / 3

    this._totalDen = this._lastDen
    this._totalNum = this._lastNum

    this._totalNum += typ * vol
    this._totalDen += vol

    super.update(this._totalNum / this._totalDen)
  }

  add (candle) {
    const { high, low, close, vol } = candle
    const typ = (high + low + close) / 3

    this._lastNum = this._totalNum
    this._lastDen = this._totalDen

    this._totalNum += typ * vol
    this._totalDen += vol

    super.add(this._totalNum / this._totalDen)
  }
}

VWAP.id = 'vwap'
VWAP.label = 'VWAP'
VWAP.humanLabel = 'Volume Weighted Average Price'
VWAP.ui = {
  position: 'overlay',
  type: 'line'
}

VWAP.args = []

module.exports = VWAP
