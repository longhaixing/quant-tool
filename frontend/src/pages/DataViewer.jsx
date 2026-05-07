import React, { useState, useEffect } from 'react'
import { Calendar, Download } from 'lucide-react'
import { fetchMarketData } from '../services/api'

function DataViewer() {
  const [symbol, setSymbol] = useState('AAPL')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-01-25')
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    fetchMarketData({ symbol, startDate, endDate }).then((result) => {
      setRows(result.data)
      setTotal(result.total)
      setLoading(false)
    })
  }

  const handleExport = () => {
    if (rows.length === 0) return
    const headers = ['日期,开盘价,最高价,最低价,收盘价,成交量']
    const csvRows = rows.map((r) =>
      `${r.date},${r.open},${r.high},${r.low},${r.close},${r.volume}`
    )
    const csv = headers.concat(csvRows).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${symbol}_${startDate}_${endDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">数据查看</h2>
        <p className="text-gray-600 mt-2">查看市场数据和历史价格</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">查询条件</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              交易代码
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="输入交易代码 (如 AAPL)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              开始日期
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              结束日期
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              查询
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {symbol} - OHLCV 数据
          </h3>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            导出 CSV
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 py-8 text-center">加载中...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">日期</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">开盘价</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">最高价</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">最低价</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">收盘价</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">成交量</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">涨跌幅</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const change = row.open
                    ? (((row.close - row.open) / row.open) * 100).toFixed(2)
                    : '0.00'
                  const changeColor =
                    parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'
                  const displayOpen = typeof row.open === 'number' ? row.open.toFixed(2) : row.open
                  const displayHigh = typeof row.high === 'number' ? row.high.toFixed(2) : row.high
                  const displayLow = typeof row.low === 'number' ? row.low.toFixed(2) : row.low
                  const displayClose = typeof row.close === 'number' ? row.close.toFixed(2) : row.close

                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">{row.date}</td>
                      <td className="py-3 px-4 text-right text-gray-900">¥{displayOpen}</td>
                      <td className="py-3 px-4 text-right text-gray-900">¥{displayHigh}</td>
                      <td className="py-3 px-4 text-right text-gray-900">¥{displayLow}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-semibold">¥{displayClose}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{row.volume}</td>
                      <td className={`py-3 px-4 text-right font-semibold ${changeColor}`}>
                        {parseFloat(change) >= 0 ? '+' : ''}{change}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">共 {total.toLocaleString()} 条记录</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">上一页</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataViewer
