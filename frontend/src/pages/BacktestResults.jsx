import React, { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { fetchBacktestResults } from '../services/api'

function BacktestResults() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBacktestResults({ symbol: 'AAPL', startDate: '2024-01-01', endDate: '2024-06-30' }).then((result) => {
      setData(result)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">加载中...</p>
      </div>
    )
  }

  const { stats, monthlyData, keyMetrics, riskMetrics, trades } = data

  const colorMap = {
    green: TrendingUp,
    blue: TrendingUp,
    red: TrendingDown,
    purple: TrendingUp,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">回测结果</h2>
        <p className="text-gray-600 mt-2">查看策略的历史回测表现</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={colorMap[stat.color] || TrendingUp}
            color={stat.color}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">按月收益对比</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="策略收益" fill="#3b82f6" />
            <Bar dataKey="基准收益" fill="#d1d5db" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">关键指标</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">初始资金</span>
              <span className="font-semibold text-gray-900">{keyMetrics.initialCapital}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">最终资金</span>
              <span className="font-semibold text-green-600">{keyMetrics.finalCapital}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">交易次数</span>
              <span className="font-semibold text-gray-900">{keyMetrics.totalTrades}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">获胜次数</span>
              <span className="font-semibold text-green-600">{keyMetrics.wins}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">失败次数</span>
              <span className="font-semibold text-red-600">{keyMetrics.losses}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">平均盈利</span>
              <span className="font-semibold text-green-600">{keyMetrics.averageProfit}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">平均亏损</span>
              <span className="font-semibold text-red-600">{keyMetrics.averageLoss}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">风险指标</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">最大回撤</span>
              <span className="font-semibold text-red-600">{riskMetrics.maxDrawdown}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">风险比率</span>
              <span className="font-semibold text-gray-900">{riskMetrics.riskRatio}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">收益/回撤比</span>
              <span className="font-semibold text-green-600">{riskMetrics.returnDrawdownRatio}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">信息比率</span>
              <span className="font-semibold text-blue-600">{riskMetrics.informationRatio}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">索提诺比率</span>
              <span className="font-semibold text-blue-600">{riskMetrics.sortinoRatio}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">95% VaR</span>
              <span className="font-semibold text-orange-600">{riskMetrics.var95}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">条件期望亏损</span>
              <span className="font-semibold text-red-600">{riskMetrics.conditionalExpectedLoss}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">交易记录</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">交易日期</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">交易类型</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">交易价格</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">交易数量</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">盈亏</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">状态</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{trade.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        trade.type === '买入'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    ¥{typeof trade.price === 'number' ? trade.price.toFixed(2) : trade.price}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">{trade.quantity}</td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      trade.profit > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {trade.profit > 0 ? '+' : ''}¥{trade.profit}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      已成交
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BacktestResults
