import React, { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts'
import StatCard from '../components/StatCard'
import { AlertTriangle, TrendingDown, Zap } from 'lucide-react'
import { fetchRiskAnalysis } from '../services/api'

function RiskAnalysis() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRiskAnalysis({ symbol: 'AAPL', startDate: '2024-01-01', endDate: '2024-06-30' }).then((result) => {
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

  const { stats, drawdownData, volatilityData, riskMetrics, correlationMatrix, warnings } = data

  const colorMap = {
    red: TrendingDown,
    orange: AlertTriangle,
    green: TrendingDown,
  }

  const warningConfig = {
    warning: { bg: 'bg-yellow-50 border-yellow-200', icon: 'text-yellow-600', title: 'text-yellow-900', msg: 'text-yellow-700' },
    danger: { bg: 'bg-red-50 border-red-200', icon: 'text-red-600', title: 'text-red-900', msg: 'text-red-700' },
    info: { bg: 'bg-blue-50 border-blue-200', icon: 'text-blue-600', title: 'text-blue-900', msg: 'text-blue-700' },
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">风险分析</h2>
        <p className="text-gray-600 mt-2">全面的风险评估和监控</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={colorMap[stat.color] || Zap}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
              <Scatter name="月度数据" data={volatilityData} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">风险指标对比</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={riskMetrics}
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
                        item.correlation > 0.75 ? 'bg-red-500' : 'bg-yellow-500'
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

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">风险警告</h3>
        <div className="space-y-3">
          {warnings.map((w, idx) => {
            const cfg = warningConfig[w.type] || warningConfig.info
            return (
              <div key={idx} className={`flex gap-4 p-4 border rounded-lg ${cfg.bg}`}>
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${cfg.icon}`} />
                <div>
                  <p className={`font-medium ${cfg.title}`}>{w.title}</p>
                  <p className={`text-sm mt-1 ${cfg.msg}`}>{w.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RiskAnalysis
