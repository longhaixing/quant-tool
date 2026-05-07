// Fallback mock data — used when the backend API is unavailable

export const DASHBOARD_MOCK = {
  stats: [
    { title: '总收益率', value: '28.5%', change: '5.2', color: 'green' },
    { title: '已用资本', value: '¥85,000', change: '-2.1', color: 'blue' },
    { title: '活跃策略', value: '4', change: '0', color: 'purple' },
    { title: '最大回撤', value: '-8.5%', change: '-1.3', color: 'red' },
  ],
  performanceData: [
    { date: '01/01', 收益: 100, 基准: 100 },
    { date: '01/05', 收益: 105, 基准: 102 },
    { date: '01/10', 收益: 112, 基准: 103 },
    { date: '01/15', 收益: 108, 基准: 104 },
    { date: '01/20', 收益: 115, 基准: 105 },
    { date: '01/25', 收益: 122, 基准: 106 },
    { date: '02/01', 收益: 128, 基准: 108 },
  ],
  strategyData: [
    { name: 'MA 策略', 收益率: 12.5 },
    { name: 'RSI 策略', 收益率: 8.3 },
    { name: '动量策略', 收益率: 15.2 },
    { name: '均值回归', 收益率: 5.8 },
  ],
  riskData: [
    { name: '低风险', value: 35, fill: '#10B981' },
    { name: '中风险', value: 45, fill: '#F59E0B' },
    { name: '高风险', value: 20, fill: '#EF4444' },
  ],
  recentTrades: [
    { time: '2024-01-25 14:30', 策略: 'MA 交叉', 信号: '买入', 数量: 100, 价格: '¥125.50', 状态: '成功' },
    { time: '2024-01-25 10:15', 策略: 'RSI 反转', 信号: '卖出', 数量: 50, 价格: '¥124.20', 状态: '成功' },
    { time: '2024-01-24 16:45', 策略: '动量', 信号: '买入', 数量: 75, 价格: '¥123.80', 状态: '成功' },
  ],
}

export const STRATEGIES_MOCK = [
  { id: 1, name: 'MA 交叉策略', description: '简单的移动平均线交叉策略', status: 'active', return: '12.5%', sharpe: '1.85', maxDrawdown: '-8.2%', trades: 45 },
  { id: 2, name: 'RSI 反转', description: 'RSI 超买超卖信号反转策略', status: 'paused', return: '8.3%', sharpe: '1.32', maxDrawdown: '-5.1%', trades: 28 },
  { id: 3, name: '动量策略', description: '基于动量指标的趋势跟踪', status: 'active', return: '15.2%', sharpe: '2.15', maxDrawdown: '-12.5%', trades: 62 },
  { id: 4, name: '均值回归', description: '布林带均值回归策略', status: 'draft', return: '5.8%', sharpe: '0.98', maxDrawdown: '-3.8%', trades: 15 },
]

export const MARKET_DATA_MOCK = [
  { date: '2024-01-25', open: 125.43, high: 126.12, low: 125.20, close: 125.89, volume: '125.5M' },
  { date: '2024-01-24', open: 124.88, high: 125.50, low: 124.50, close: 125.25, volume: '108.2M' },
  { date: '2024-01-23', open: 125.15, high: 125.80, low: 124.90, close: 125.12, volume: '98.5M' },
  { date: '2024-01-22', open: 124.20, high: 125.15, low: 123.90, close: 124.85, volume: '112.3M' },
  { date: '2024-01-19', open: 123.50, high: 124.50, low: 123.20, close: 124.30, volume: '95.8M' },
]

export const BACKTEST_MOCK = {
  stats: [
    { title: '总收益率', value: '28.5%', change: '15.2', color: 'green' },
    { title: 'Sharpe 比率', value: '1.85', change: '0.32', color: 'blue' },
    { title: '最大回撤', value: '-12.5%', change: '-2.1', color: 'red' },
    { title: '胜率', value: '62.5%', change: '5.8', color: 'purple' },
  ],
  monthlyData: [
    { month: '01月', 策略收益: 2.5, 基准收益: 1.2 },
    { month: '02月', 策略收益: 3.1, 基准收益: 0.8 },
    { month: '03月', 策略收益: -1.5, 基准收益: 2.1 },
    { month: '04月', 策略收益: 4.2, 基准收益: 1.5 },
    { month: '05月', 策略收益: 2.8, 基准收益: 0.9 },
    { month: '06月', 策略收益: 3.5, 基准收益: 1.3 },
  ],
  keyMetrics: {
    initialCapital: '¥100,000',
    finalCapital: '¥128,500',
    totalTrades: 48,
    wins: 30,
    losses: 18,
    averageProfit: '¥850',
    averageLoss: '-¥520',
  },
  riskMetrics: {
    maxDrawdown: '-12.5%',
    riskRatio: '0.85',
    returnDrawdownRatio: '2.28',
    informationRatio: '1.45',
    sortinoRatio: '2.32',
    var95: '-8.5%',
    conditionalExpectedLoss: '-15.2%',
  },
  trades: [
    { date: '2024-01-15', type: '买入', price: 120.5, quantity: 100, profit: 450 },
    { date: '2024-01-20', type: '卖出', price: 125.0, quantity: 100, profit: 450 },
    { date: '2024-02-01', type: '买入', price: 122.8, quantity: 80, profit: 280 },
    { date: '2024-02-10', type: '卖出', price: 126.5, quantity: 80, profit: 280 },
  ],
}

export const RISK_ANALYSIS_MOCK = {
  stats: [
    { title: '最大回撤', value: '-12.5%', change: '-2.1', color: 'red' },
    { title: '波动率', value: '13.2%', change: '1.5', color: 'orange' },
    { title: 'VaR (95%)', value: '-8.5%', change: '0.8', color: 'red' },
    { title: '风险等级', value: '中', change: '0', color: 'orange' },
  ],
  drawdownData: [
    { date: '2024-01-01', drawdown: 0, position: 100 },
    { date: '2024-01-05', drawdown: -2.5, position: 97.5 },
    { date: '2024-01-10', drawdown: -5.2, position: 94.8 },
    { date: '2024-01-15', drawdown: -3.8, position: 96.2 },
    { date: '2024-01-20', drawdown: -8.5, position: 91.5 },
    { date: '2024-01-25', drawdown: -5.1, position: 94.9 },
  ],
  volatilityData: [
    { period: '1月', volatility: 12.5, expectedReturn: 2.8 },
    { period: '2月', volatility: 14.2, expectedReturn: 3.1 },
    { period: '3月', volatility: 11.8, expectedReturn: -1.5 },
    { period: '4月', volatility: 13.5, expectedReturn: 4.2 },
    { period: '5月', volatility: 12.1, expectedReturn: 2.8 },
    { period: '6月', volatility: 13.8, expectedReturn: 3.5 },
  ],
  riskMetrics: [
    { name: 'VaR 95%', value: -8.5 },
    { name: 'VaR 99%', value: -12.3 },
    { name: 'CVaR 95%', value: -15.2 },
    { name: '最大回撤', value: -12.5 },
  ],
  correlationMatrix: [
    { asset1: 'AAPL', asset2: 'MSFT', correlation: 0.82 },
    { asset1: 'AAPL', asset2: 'GOOGL', correlation: 0.75 },
    { asset1: 'MSFT', asset2: 'GOOGL', correlation: 0.88 },
    { asset1: 'AAPL', asset2: '沪深 300', correlation: 0.45 },
  ],
  warnings: [
    {
      type: 'warning',
      title: '注意：高波动性时期',
      message: '最近 7 天内波动率达到 15.2%，超过历史平均值（13.2%）',
    },
    {
      type: 'danger',
      title: '风险：回撤接近最大值',
      message: '当前回撤为 -12.1%，接近历史最大回撤 -12.5%',
    },
    {
      type: 'info',
      title: '信息：高相关性风险',
      message: '您的投资组合中 AAPL、MSFT、GOOGL 相关性较高，建议增加多元化',
    },
  ],
}
