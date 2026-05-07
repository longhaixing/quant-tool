import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Play, Pause } from 'lucide-react'
import {
  fetchStrategies,
  createStrategy,
  toggleStrategy as toggleStrategyApi,
  deleteStrategy as deleteStrategyApi,
} from '../services/api'

function StrategyManagement() {
  const [strategies, setStrategies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchStrategies().then((data) => {
      setStrategies(data)
      setLoading(false)
    })
  }, [])

  const toggleStrategy = (id) => {
    toggleStrategyApi(id).then((updated) => {
      if (updated) {
        setStrategies((prev) =>
          prev.map((s) => (s.id === id ? updated : s))
        )
      } else {
        setStrategies((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, status: s.status === 'active' ? 'paused' : 'active' }
              : s
          )
        )
      }
    })
  }

  const deleteStrategy = (id) => {
    deleteStrategyApi(id).then(() => {
      setStrategies((prev) => prev.filter((s) => s.id !== id))
    })
  }

  const handleCreate = (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.elements.name.value
    const description = form.elements.description.value
    if (!name) return
    createStrategy({ name, description, type: 'custom' }).then((newStrategy) => {
      setStrategies((prev) => [...prev, newStrategy])
      setShowForm(false)
      form.reset()
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return '运行中'
      case 'paused':
        return '已暂停'
      case 'draft':
        return '草稿'
      default:
        return '未知'
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">加载中...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">策略管理</h2>
          <p className="text-gray-600 mt-2">创建、编辑和管理交易策略</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          新建策略
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">创建新策略</h3>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  策略名称
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="输入策略名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  策略类型
                </label>
                <select
                  name="type"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option>选择类型</option>
                  <option>移动平均线</option>
                  <option>RSI 指标</option>
                  <option>MACD</option>
                  <option>自定义</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                name="description"
                placeholder="输入策略描述"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                创建
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {strategy.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  strategy.status
                )}`}
              >
                {getStatusLabel(strategy.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600">总收益</p>
                <p className="text-lg font-bold text-green-600">{strategy.return}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Sharpe 比率</p>
                <p className="text-lg font-bold text-blue-600">{strategy.sharpe}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">最大回撤</p>
                <p className="text-lg font-bold text-red-600">{strategy.maxDrawdown}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">交易次数</p>
                <p className="text-lg font-bold text-gray-900">{strategy.trades}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => toggleStrategy(strategy.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  strategy.status === 'active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {strategy.status === 'active' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    暂停
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    运行
                  </>
                )}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
                编辑
              </button>
              <button
                onClick={() => deleteStrategy(strategy.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StrategyManagement
