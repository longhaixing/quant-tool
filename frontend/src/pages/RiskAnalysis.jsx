import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts'
import StatCard from '../components/StatCard'
import { AlertTriangle, TrendingDown, Zap } from 'lucide-react'

function RiskAnalysis() {
  const drawdownData = [
    { date: '2024-01-01', drawdown: 0, position: 100 },
    { date: '2024-01-05', drawdown: -2.5, position: 97.5 },
    { date: '2024-01-10', drawdown: -5.2, position: 94.8 },
    { date: '2024-01-15', drawdown: -3.8, position: 96.2 },
    { date: '2024-01-20', drawdown: -8.5, position: 91.5 },
    { date: '2024-01-25', drawdown: -5.1, position: 94.9 },
  ]

  const volatilityData = [
    { period: '1月', volatility: 12.5, expectedReturn: 2.8 },
    { period: '2月', volatility: 14.2, expectedReturn: 3.1 },
    { period: '3月', volatility: 11.8, expectedReturn: -1.5 },
    { period: '4月', volatility: 13.5, expectedReturn: 4.2 },
    { period: '5月', volatility: 12.1, expectedReturn: 2.8 },
    { period: '6月', volatility: 13.8, expectedReturn: 3.5 },
  ]

  const riskDistribution = [
    { name: 'VaR 95%', value: -8.5 },
    { name: 'VaR 99%', value: -12.3 },
    { name: 'CVaR 95%', value: -15.2 },
    { name: '最大回撤', value: -12.5 },
  ]

  const correlationMatrix = [
    { asset1: 'AAPL', asset2: 'MSFT', correlation: 0.82 },
    { asset1: 'AAPL', asset2: 'GOOGL', correlation: 0.75 },
    { asset1: 'MSFT', asset2: 'GOOGL', correlation: 0.88 },
    { asset1: 'AAPL', asset2: '沪深 300', correlation: 0.45 },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">风险分析</h2>
        <p className="text-gray-600 mt-2">全面的风险评估和监控</p>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="最大回撤"
          value="-12.5%"
          change="-2.1"
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          title="波动率"
          value="13.2%"
          change="1.5"
          icon={Zap}
          color="orange"
        />
        <StatCard
          title="VaR (95%)"
          value="-8.5%"
          change="0.8"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="风险等级"
          value="中"
          change="0"
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Drawdown Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">回撤分析</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={drawdownData}>
              <defs>
                <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorDrawdown)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Volatility Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">风险-收益散点</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                dataKey="volatility"
                name="波动率 (%)"
                stroke="#6b7280"
              />
              <YAxis
                type="number"
                dataKey="expectedReturn"
                name="期望收益率 (%)"
                stroke="#6b7280"
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Scatter
                name="月度数据"
                data={volatilityData}
                fill="#3b82f6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* VaR Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">风险指标对比</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={riskDistribution}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis type="category" dataKey="name" stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Correlation Matrix */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">资产相关性</h3>
          <div className="space-y-3">
            {correlationMatrix.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  {item.asset1} - {item.asset2}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        item.correlation > 0.75
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${item.correlation * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">
                    {item.correlation.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Warnings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">风险警告</h3>
        <div className="space-y-3">
          <div className="flex gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">注意：高波动性时期</p>
              <p className="text-sm text-yellow-700 mt-1">
                最近 7 天内波动率达到 15.2%，超过历史平均值（13.2%）
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">风险：回撤接近最大值</p>
              <p className="text-sm text-red-700 mt-1">
                当前回撤为 -12.1%，接近历史最大回撤 -12.5%
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">信息：高相关性风险</p>
              <p className="text-sm text-blue-700 mt-1">
                您的投资组合中 AAPL、MSFT、GOOGL 相关性较高，建议增加多元化
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskAnalysis
