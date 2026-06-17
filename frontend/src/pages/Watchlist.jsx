import React, { useState, useEffect, Fragment } from 'react'
import { Star, Plus, Trash2, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from 'lucide-react'
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api'
import StockDetailPanel from '../components/StockDetailPanel'

function Watchlist() {
  const [symbolInput, setSymbolInput] = useState('')
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState(null)

  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = () => {
    setLoading(true)
    fetchWatchlist().then((result) => {
      setItems(result.items || [])
      setTotal(result.total || 0)
      setLoading(false)
    })
  }

  const handleSelect = (item) => {
    setSelectedSymbol((prev) => (prev?.symbol === item.symbol ? null : item))
  }

  const handleAdd = async () => {
    const sym = symbolInput.trim().toUpperCase()
    if (!sym) return
    setAdding(true)
    setError('')
    try {
      await addToWatchlist(sym)
      setSymbolInput('')
      loadWatchlist()
    } catch (err) {
      setError(err.response?.data?.detail || '添加失败，请检查股票代码')
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (symbol) => {
    try {
      await removeFromWatchlist(symbol)
      loadWatchlist()
    } catch (err) {
      console.warn('删除失败:', err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  const formatChange = (change) => {
    if (change === null || change === undefined) return '--'
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}%`
  }

  const changeColor = (change) => {
    if (change === null || change === undefined) return 'text-gray-400'
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const ChangeIcon = ({ change }) => {
    if (change === null || change === undefined) return <Minus className="w-4 h-4 text-gray-400" />
    return change >= 0
      ? <TrendingUp className="w-4 h-4 text-green-600" />
      : <TrendingDown className="w-4 h-4 text-red-600" />
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">自选股</h2>
        <p className="text-gray-600 mt-2">关注您感兴趣的股票，实时跟踪价格变动</p>
      </div>

      {/* Add Symbol Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">添加自选股</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={symbolInput}
            onChange={(e) => { setSymbolInput(e.target.value); setError('') }}
            onKeyDown={handleKeyDown}
            placeholder="输入股票代码，例如 000001"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !symbolInput.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            {adding ? '添加中...' : '添加'}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Watchlist Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            我的自选列表
            <span className="ml-2 text-sm font-normal text-gray-500">({total} 支)</span>
          </h3>
        </div>

        {loading ? (
          <p className="text-gray-500 py-8 text-center">加载中...</p>
        ) : items.length === 0 ? (
          <div className="py-12 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">还没有自选股</p>
            <p className="text-gray-400 mt-1">在上方输入股票代码开始添加</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">股票代码</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">股票名称</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">最新价</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">涨跌幅</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const isSelected = selectedSymbol?.symbol === item.symbol
                  return (
                    <Fragment key={item.symbol}>
                      <tr
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleSelect(item)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {isSelected
                              ? <ChevronDown className="w-4 h-4 text-blue-500" />
                              : <ChevronRight className="w-4 h-4 text-gray-300" />
                            }
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-gray-900">{item.symbol}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{item.name || '--'}</td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-900">
                          {item.price !== null ? `¥${item.price.toFixed(2)}` : '--'}
                        </td>
                        <td className={`py-4 px-4 text-right font-semibold ${changeColor(item.change)}`}>
                          <div className="flex items-center justify-end gap-1">
                            <ChangeIcon change={item.change} />
                            {formatChange(item.change)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemove(item.symbol) }}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="删除"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                      {isSelected && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <StockDetailPanel
                              symbol={item.symbol}
                              name={item.name}
                              price={item.price}
                              change={item.change}
                              onClose={() => setSelectedSymbol(null)}
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Watchlist