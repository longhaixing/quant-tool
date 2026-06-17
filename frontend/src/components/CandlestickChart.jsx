import React from 'react'
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

/* ── Custom bar shape that renders a candlestick ────────────────── */
const CandlestickShape = (props) => {
  const { x, y, width, height, payload } = props
  if (!payload || !payload.open) return null

  const { open, close, high, low } = payload
  const isUp = close >= open
  const color = isUp ? '#ef4444' : '#22c55e' // 红涨绿跌 (Chinese convention)
  const barWidth = Math.max(width * 0.6, 2)
  const centerX = x + width / 2

  // Body
  const bodyTop = Math.min(open, close)
  const bodyBottom = Math.max(open, close)
  const bodyHeight = Math.max(bodyBottom - bodyTop, 1)

  // Wick (high-low line)
  const toCanvasY = (val) => {
    // We need the chart's Y scale — accessible via props
    // Use the y + height approach: higher price = lower y
    const range = props.yAxisDomain || [low, high]
    const scale = height / (range[1] - range[0] || 1)
    return y + height - (val - range[0]) * scale
  }

  return (
    <g>
      {/* Wick */}
      <line
        x1={centerX}
        y1={toCanvasY(high)}
        x2={centerX}
        y2={toCanvasY(low)}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Body */}
      <rect
        x={centerX - barWidth / 2}
        y={toCanvasY(bodyTop)}
        width={barWidth}
        height={Math.max(toCanvasY(bodyBottom) - toCanvasY(bodyTop), 1)}
        fill={color}
        stroke={color}
        strokeWidth={0.5}
      />
    </g>
  )
}

/* ── Custom tooltip ─────────────────────────────────────────────── */
const CandleTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  const d = payload[0]?.payload
  if (!d) return null

  const isUp = d.close >= d.open
  const color = isUp ? '#ef4444' : '#22c55e'

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm min-w-[130px]">
      <p className="text-gray-500 mb-1.5 font-medium">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">开盘</span>
          <span className="font-semibold" style={{ color }}>¥{d.open.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">最高</span>
          <span className="font-semibold text-gray-900">¥{d.high.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">最低</span>
          <span className="font-semibold text-gray-900">¥{d.low.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">收盘</span>
          <span className="font-semibold" style={{ color }}>¥{d.close.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 pt-1 border-t border-gray-100">
          <span className="text-gray-500">成交量</span>
          <span className="font-semibold text-gray-700">{(d.volume / 10000).toFixed(0)}万</span>
        </div>
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────────── */
function CandlestickChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-gray-400">暂无数据</p>
      </div>
    )
  }

  // Determine price range for Y axis
  let minPrice = Infinity
  let maxPrice = -Infinity
  data.forEach((d) => {
    if (d.low < minPrice) minPrice = d.low
    if (d.high > maxPrice) maxPrice = d.high
  })
  const padding = (maxPrice - minPrice) * 0.08 || 0.5
  const yDomain = [minPrice - padding, maxPrice + padding]

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => {
            // Show time for intraday, MM-DD for daily
            if (v.includes(':')) return v.slice(0, 5)
            return v.slice(5)
          }}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="#6b7280"
          tick={{ fontSize: 11 }}
          domain={yDomain}
          tickFormatter={(v) => `¥${v.toFixed(1)}`}
          width={70}
        />
        <Tooltip content={<CandleTooltip />} />
        <Bar
          dataKey="close"
          shape={<CandlestickShape yAxisDomain={yDomain} />}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default CandlestickChart