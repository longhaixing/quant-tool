import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

function BacktestResults() {
  const backtestData = [
    { month: '01月', 策略收益: 2.5, 基准收益: 1.2 },
    { month: '02月', 策略收益: 3.1, 基准收益: 0.8 },
    { month: '03月', 策略收益: -1.5, 基准收益: 2.1 },
    { month: '04月', 策略收益: 4.2, 基准收益: 1.5 },
    { month: '05月', 策略收益: 2.8, 基准收益: 0.9 },
    { month: '06月', 策略收益: 3.5, 基准收益: 1.3 },
  ]

  const trades = [
    { date: '2024-01-15', type: '买入', price: 120.5, quantity: 100, profit: 450 },
    { date: '2024-01-20', type: '卖出', price: 125.0, quantity: 100, profit: 450 },
    { date: '2024-02-01', type: '买入', price: 122.8, quantity: 80, profit: 280 },
    { date: '2024-02-10', type: '卖出', price: 126.5, quantity: 80, profit: 280 },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">回测结果</h2>
        <p className="text-gray-600 mt-2">查看策略的历史回测表现</p>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总收益率"
          value="28.5%"
          change="15.2"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Sharpe 比率"
          value="1.85"
          change="0.32"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="最大回撤"
          value="-12.5%"
          change="-2.1"
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          title="胜率"
          value="62.5%"
          change="5.8"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Monthly Performance */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">按月收益对比</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={backtestData}>
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

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Column */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">关键指标</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">初始资金</span>
              <span className="font-semibold text-gray-900">¥100,000</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">最终资金</span>
              <span className="font-semibold text-green-600">¥128,500</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">交易次数</span>
              <span className="font-semibold text-gray-900">48</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">获胜次数</span>
              <span className="font-semibold text-green-600">30</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">失败次数</span>
              <span className="font-semibold text-red-600">18</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">平均盈利</span>
              <span className="font-semibold text-green-600">¥850</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">平均亏损</span>
              <span className="font-semibold text-red-600">-¥520</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">风险指标</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">最大回撤</span>
              <span className="font-semibold text-red-600">-12.5%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">风险比率</span>
              <span className="font-semibold text-gray-900">0.85</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">收益/回撤比</span>
              <span className="font-semibold text-green-600">2.28</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">信息比率</span>
              <span className="font-semibold text-blue-600">1.45</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">索提诺比率</span>
              <span className="font-semibold text-blue-600">2.32</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">95% VaR</span>
              <span className="font-semibold text-orange-600">-8.5%</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">条件期望亏损</span>
              <span className="font-semibold text-red-600">-15.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trades History */}
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
                  <td className="py-3 px-4 text-right text-gray-900">¥{trade.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{trade.quantity}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${trade.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
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
