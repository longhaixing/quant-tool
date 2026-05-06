import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import StrategyManagement from './pages/StrategyManagement'
import DataViewer from './pages/DataViewer'
import BacktestResults from './pages/BacktestResults'
import RiskAnalysis from './pages/RiskAnalysis'
import Documentation from './pages/Documentation'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/strategies" element={<StrategyManagement />} />
              <Route path="/data" element={<DataViewer />} />
              <Route path="/backtest" element={<BacktestResults />} />
              <Route path="/risk" element={<RiskAnalysis />} />
              <Route path="/docs" element={<Documentation />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
