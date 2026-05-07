import axios from 'axios'
import {
  DASHBOARD_MOCK,
  STRATEGIES_MOCK,
  MARKET_DATA_MOCK,
  BACKTEST_MOCK,
  RISK_ANALYSIS_MOCK,
} from './mockData'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

async function fetchWithFallback(url, mockData, params = {}) {
  try {
    const response = await api.get(url, { params })
    return response.data
  } catch (error) {
    console.warn(`API ${url} unavailable, using mock data:`, error.message)
    return mockData
  }
}

// ─── Dashboard ───────────────────────────────────────────────────────

export async function fetchDashboardSummary() {
  return fetchWithFallback('/dashboard/summary', DASHBOARD_MOCK)
}

// ─── Strategies ──────────────────────────────────────────────────────

export async function fetchStrategies() {
  try {
    const res = await api.get('/strategies')
    return res.data.strategies
  } catch (error) {
    console.warn('API /strategies unavailable, using mock data:', error.message)
    return STRATEGIES_MOCK
  }
}

export async function createStrategy(data) {
  try {
    const res = await api.post('/strategies', data)
    return res.data
  } catch (error) {
    console.warn('API create strategy failed:', error.message)
    const newStrategy = {
      id: Date.now(),
      name: data.name || '未命名策略',
      description: data.description || '',
      status: 'draft',
      return: '0.0%',
      sharpe: '0.00',
      maxDrawdown: '0.0%',
      trades: 0,
    }
    return newStrategy
  }
}

export async function updateStrategy(id, data) {
  try {
    const res = await api.put(`/strategies/${id}`, data)
    return res.data
  } catch (error) {
    console.warn('API update strategy failed:', error.message)
    return { id, ...data }
  }
}

export async function toggleStrategy(id) {
  try {
    const res = await api.patch(`/strategies/${id}/toggle`)
    return res.data
  } catch (error) {
    console.warn('API toggle strategy failed:', error.message)
    return null
  }
}

export async function deleteStrategy(id) {
  try {
    await api.delete(`/strategies/${id}`)
    return true
  } catch (error) {
    console.warn('API delete strategy failed:', error.message)
    return true
  }
}

// ─── Market Data ─────────────────────────────────────────────────────

export async function fetchMarketData(params = {}) {
  const p = {
    symbol: params.symbol || 'AAPL',
    startDate: params.startDate || '2024-01-01',
    endDate: params.endDate || '2024-01-25',
  }
  try {
    const res = await api.get('/market-data', { params: p })
    return { data: res.data.data, total: res.data.total }
  } catch (error) {
    console.warn('API /market-data unavailable, using mock data:', error.message)
    return { data: MARKET_DATA_MOCK, total: MARKET_DATA_MOCK.length }
  }
}

// ─── Backtest ────────────────────────────────────────────────────────

export async function fetchBacktestResults(params = {}) {
  const p = {
    symbol: params.symbol || 'AAPL',
    startDate: params.startDate || '2024-01-01',
    endDate: params.endDate || '2024-06-30',
    strategy_id: params.strategy_id,
  }
  return fetchWithFallback('/backtest', BACKTEST_MOCK, p)
}

// ─── Risk Analysis ───────────────────────────────────────────────────

export async function fetchRiskAnalysis(params = {}) {
  const p = {
    symbol: params.symbol || 'AAPL',
    startDate: params.startDate || '2024-01-01',
    endDate: params.endDate || '2024-06-30',
  }
  return fetchWithFallback('/risk-analysis', RISK_ANALYSIS_MOCK, p)
}
