import React from 'react'
import { BarChart3, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

function Dashboard() {
  // Mock data
  const performanceData = [
    { date: '01/01', 收益: 100, 基准: 100 },
    { date: '01/05', 收益: 105, 基准: 102 },
    { date: '01/10', 收益: 112, 基准: 103 },
    { date: '01/15', 收益: 108, 基准: 104 },
    { date: '01/20', 收益: 115, 基准: 105 },
    { date: '01/25', 收益: 122, 基准: 106 },
    { date: '02/01', 收益: 128, 基准: 108 },
  ]

  const strategyData = [
    { name: 'MA 策略', 收益率: 12.5 },
    { name: 'RSI 策略', 收益率: 8.3 },
    { name: '动量策略', 收益率: 15.2 },
    { name: '均值回归', 收益率: 5.8 },
  ]

  const riskData = [
    { name: '低风险', value: 35, fill: '#10B981' },
    { name: '中风险', value: 45, fill: '#F59E0B' },
    { name: '高风险', value: 20, fill: '#EF4444' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">仪表板</h2>
        <p className="text-gray-600">欢迎回到 Quant Tool 量化交易框架</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总收益率"
          value="28.5%"
          change="5.2"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="已用资本"
          value="¥85,000"
          change="-2.1"
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="活跃策略"
          value="4"
          change="0"
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="最大回撤"
          value="-8.5%"
          change="-1.3"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="投资组合表现"
            subtitle="与基准对比"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="收益"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="基准"
                  stroke="#d1d5db"
                  strokeWidth={2}
                  dot={{ fill: '#d1d5db' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Risk Distribution */}
        <ChartCard title="风险分布">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Strategy Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">策略表现对比</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={strategyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="收益率" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Trades */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最近交易</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">交易时间</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">策略</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">信号</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">数量</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">价格</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">状态</th>
            </tr>
          </thead>
          <tbody>
            {[
              { time: '2024-01-25 14:30', 策略: 'MA 交叉', 信号: '买入', 数量: 100, 价格: '¥125.50', 状态: '成功' },
              { time: '2024-01-25 10:15', 策略: 'RSI 反转', 信号: '卖出', 数量: 50, 价格: '¥124.20', 状态: '成功' },
              { time: '2024-01-24 16:45', 策略: '动量', 信号: '买入', 数量: 75, 价格: '¥123.80', 状态: '成功' },
            ].map((trade, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{trade.time}</td>
                <td className="py-3 px-4 text-gray-900">{trade.策略}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trade.信号 === '买入'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {trade.信号}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-900">{trade.数量}</td>
                <td className="py-3 px-4 text-gray-900">{trade.价格}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {trade.状态}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
