import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, TrendingUp, Database, LineChart, AlertTriangle, Book, X } from 'lucide-react'

function Sidebar({ open, onToggle }) {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: BarChart3, label: '仪表板' },
    { path: '/strategies', icon: TrendingUp, label: '策略管理' },
    { path: '/data', icon: Database, label: '数据查看' },
    { path: '/backtest', icon: LineChart, label: '回测结果' },
    { path: '/risk', icon: AlertTriangle, label: '风险分析' },
    { path: '/docs', icon: Book, label: '文档' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          open ? 'w-64' : 'w-0'
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">Quant Tool</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          <p>v0.1.0</p>
          <p>© 2024 Quant Tool</p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}
    </>
  )
}

export default Sidebar
