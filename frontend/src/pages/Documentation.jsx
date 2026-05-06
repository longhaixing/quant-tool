import React, { useState } from 'react'
import { Book, ChevronDown } from 'lucide-react'

function Documentation() {
  const [expandedSection, setExpandedSection] = useState('getting-started')

  const sections = [
    {
      id: 'getting-started',
      title: '快速开始',
      content: `
        <h4 class="font-semibold mb-2">安装 Quant Tool</h4>
        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 text-sm overflow-x-auto">
pip install -r requirements.txt
pip install -e .
        </pre>
        
        <h4 class="font-semibold mb-2 mt-4">创建第一个策略</h4>
        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 text-sm overflow-x-auto">
from quant_tool.strategy import BaseStrategy
import pandas as pd

class MyStrategy(BaseStrategy):
    def calculate_signals(self, data):
        signals = pd.DataFrame(index=data.index)
        signals['signal'] = 0
        # 你的策略逻辑
        return signals
        </pre>
      `,
    },
    {
      id: 'strategies',
      title: '策略开发',
      content: `
        <h4 class="font-semibold mb-2">BaseStrategy 类</h4>
        <p class="mb-4">所有策略必须继承 BaseStrategy 类。主要方法：</p>
        <ul class="list-disc list-inside mb-4 space-y-2">
          <li><code class="bg-gray-100 px-2 py-1 rounded">calculate_signals(data)</code> - 计算交易信号</li>
          <li><code class="bg-gray-100 px-2 py-1 rounded">generate_orders(signals)</code> - 生成订单</li>
          <li><code class="bg-gray-100 px-2 py-1 rounded">get_params()</code> - 获取参数</li>
        </ul>
        
        <h4 class="font-semibold mb-2">示例：移动平均线策略</h4>
        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 text-sm overflow-x-auto">
class MAStrategy(BaseStrategy):
    def __init__(self, short_window=20, long_window=50):
        super().__init__('MA Strategy', 
                        short_window=short_window, 
                        long_window=long_window)
    
    def calculate_signals(self, data):
        signals = pd.DataFrame(index=data.index)
        signals['short_ma'] = data['close'].rolling(self.params['short_window']).mean()
        signals['long_ma'] = data['close'].rolling(self.params['long_window']).mean()
        signals['signal'] = 0
        signals.loc[signals['short_ma'] > signals['long_ma'], 'signal'] = 1
        signals.loc[signals['short_ma'] < signals['long_ma'], 'signal'] = -1
        return signals
        </pre>
      `,
    },
    {
      id: 'backtest',
      title: '回测',
      content: `
        <h4 class="font-semibold mb-2">运行回测</h4>
        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 text-sm overflow-x-auto">
from quant_tool.backtest import BacktestEngine
from quant_tool.data import DataFetcher

# 获取数据
fetcher = DataFetcher()
data = fetcher.fetch_price_data('AAPL', '2020-01-01', '2023-01-01')

# 创建策略
strategy = MyStrategy()

# 运行回测
engine = BacktestEngine(initial_capital=100000, commission=0.001)
results = engine.run(strategy, data)
metrics = engine.calculate_metrics()
        </pre>
        
        <h4 class="font-semibold mb-2 mt-4">性能指标</h4>
        <ul class="list-disc list-inside space-y-2">
          <li>总收益率 - 投资的总回报率</li>
          <li>Sharpe 比率 - 风险调整后的收益</li>
          <li>最大回撤 - 从峰值到谷值的最大下跌</li>
          <li>胜率 - 获胜交易的百分比</li>
        </ul>
      `,
    },
    {
      id: 'risk',
      title: '风险管理',
      content: `
        <h4 class="font-semibold mb-2">RiskManager 使用</h4>
        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 text-sm overflow-x-auto">
from quant_tool.risk import RiskManager

risk_mgr = RiskManager(
    max_position_size=0.1,  # 最大头寸为资本的 10%
    max_loss_percentage=0.02  # 最大亏损 2% 时停止交易
)

# 计算头寸大小
position_size = risk_mgr.calculate_position_size(
    capital=100000,
    entry_price=125.0,
    stop_loss_price=120.0
)

# 计算风险价值 (VaR)
var = risk_mgr.calculate_var(returns_series, confidence=0.95)
        </pre>
      `,
    },
    {
      id: 'data',
      title: '数据获取',
      content: `
        <h4 class="font-semibold mb-2">DataFetcher 类</h4>
        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 text-sm overflow-x-auto">
from quant_tool.data import DataFetcher

fetcher = DataFetcher(source='yfinance', cache_dir='./data_cache')

# 获取单个股票数据
data = fetcher.fetch_price_data(
    symbol='AAPL',
    start_date='2023-01-01',
    end_date='2024-01-01',
    interval='1d'
)

# 获取多个股票数据
data_dict = fetcher.fetch_multiple_symbols(
    symbols=['AAPL', 'MSFT', 'GOOGL'],
    start_date='2023-01-01',
    end_date='2024-01-01'
)
        </pre>
      `,
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">文档</h2>
        <p className="text-gray-600">
          Quant Tool 框架的完整文档和示例
        </p>
      </div>

      {/* Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Side Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">文档目录</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setExpandedSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    expandedSection === section.id
                      ? 'bg-blue-100 text-blue-900 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`${expandedSection === section.id ? 'block' : 'hidden'}`}
            >
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {section.title}
                </h3>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200">
        <div className="flex gap-4">
          <Book className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              需要帮助？
            </h3>
            <p className="text-blue-800 mb-4">
              查看更多文档、提交问题或贡献代码。
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                查看完整文档
              </a>
              <a
                href="#"
                className="inline-block bg-white hover:bg-gray-50 text-blue-600 px-4 py-2 rounded-lg border border-blue-300 transition-colors"
              >
                GitHub 仓库
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Documentation
