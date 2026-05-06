import React from 'react'

function StatCard({ title, value, change, icon: Icon, color = 'blue' }) {
  const bgColor = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
  }[color] || 'bg-blue-50'

  const textColor = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  }[color] || 'text-blue-600'

  const changeColor = parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 ${changeColor}`}>
            {parseFloat(change) >= 0 ? '+' : ''}{change}%
          </p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-8 h-8 ${textColor}`} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
