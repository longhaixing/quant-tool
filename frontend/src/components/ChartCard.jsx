import React from 'react'

function ChartCard({ title, children, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

export default ChartCard
