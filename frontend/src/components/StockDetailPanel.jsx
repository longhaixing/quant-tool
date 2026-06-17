import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, X, Clock } from 'lucide-react'
import { fetchSymbolChart } from '../services/api'
import CandlestickChart from './CandlestickChart'

const RANGES = [
  { key: '1d', label: '1天' },
  { key: '1w', label: '1周' },
  { key: '1m', label: '1月' },
  { key: '1y', label: '1年' },
]

function StockDetailPanel({ symbol, name, price, change, onClose }) {
  const [range, setRange] = useState('1m')
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchSymbolChart(symbol, range).then((result) => {
      setChartData(result.data || [])
      setLoading(false)
    })
  }, [symbol, range])

  const changeColor = change === null || change === undefined ? 'text-gray-400'
    : change >= 0 ? 'text-green-600' : 'text-red-600'

  const ChangeIcon = change === null || change === undefined ? Minus
    : change >= 0 ? TrendingUp : TrendingDown

  // Compute K-line summary stats from chart data
  const first = chartData[0]
  const last = chartData[chartData.length - 1]
  let highMax = -Infinity
  let lowMin = Infinity
  chartData.forEach((d) => {
    if (d.high > highMax) highMax = d.high
    if (d.low < lowMin) lowMin = d.low
  })

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {price !== null ? `¥${price.toFixed(2)}` : '--'}
            </p>
            <div className={`flex items-center gap-1 ${changeColor}`}>
              <ChangeIcon className="w-4 h-4" />
              <span className="font-semibold">
                {change !== null && change !== undefined
                  ? `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
                  : '--'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* K-line Summary Stats */}
      {!loading && chartData.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">
              {range === '1d' ? '开盘价' : '起始价'}
            </p>
            <p className="text-lg font-bold text-gray-900">
              ¥{first?.open?.toFixed(2) ?? '--'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">最高价</p>
            <p className="text-lg font-bold text-red-600">
              ¥{highMax > -Infinity ? highMax.toFixed(2) : '--'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">最低价</p>
            <p className="text-lg font-bold text-green-600">
              ¥{lowMin < Infinity ? lowMin.toFixed(2) : '--'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">
              {range === '1d' ? '最新价' : '收盘价'}
            </p>
            <p className="text-lg font-bold text-gray-900">
              ¥{last?.close?.toFixed(2) ?? '--'}
            </p>
          </div>
        </div>
      )}

      {/* Range Selector */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-400" />
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              range === r.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Candlestick Chart */}
      {loading ? (
        <div className="h-[320px] flex items-center justify-center">
          <p className="text-gray-400">加载中...</p>
        </div>
      ) : (
        <CandlestickChart data={chartData} />
      )}
    </div>
  )
}

export default StockDetailPanel