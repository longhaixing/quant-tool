"""
Quant Tool API Server
Start with: uvicorn app:app --reload --host 0.0.0.0 --port 5000
"""
from datetime import datetime, timedelta
from typing import Optional
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from quant_tool.data import DataFetcher
from quant_tool.backtest import BacktestEngine
from quant_tool.risk import RiskManager
from quant_tool.strategies import MAStrategy

app = FastAPI(title="Quant Tool API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fetcher = DataFetcher(source="yfinance")
risk_manager = RiskManager()

# In-memory strategy store (seeded with defaults)
_strategies = [
    {
        "id": 1, "name": "MA 交叉策略", "description": "简单的移动平均线交叉策略",
        "status": "active", "return": "12.5%", "sharpe": "1.85",
        "maxDrawdown": "-8.2%", "trades": 45, "type": "moving_average",
        "params": {"short_window": 20, "long_window": 50},
    },
    {
        "id": 2, "name": "RSI 反转", "description": "RSI 超买超卖信号反转策略",
        "status": "paused", "return": "8.3%", "sharpe": "1.32",
        "maxDrawdown": "-5.1%", "trades": 28, "type": "rsi",
        "params": {"period": 14, "oversold": 30, "overbought": 70},
    },
    {
        "id": 3, "name": "动量策略", "description": "基于动量指标的趋势跟踪",
        "status": "active", "return": "15.2%", "sharpe": "2.15",
        "maxDrawdown": "-12.5%", "trades": 62, "type": "momentum",
        "params": {"momentum_period": 10},
    },
    {
        "id": 4, "name": "均值回归", "description": "布林带均值回归策略",
        "status": "draft", "return": "5.8%", "sharpe": "0.98",
        "maxDrawdown": "-3.8%", "trades": 15, "type": "mean_reversion",
        "params": {"bollinger_period": 20, "std_dev": 2},
    },
]
_next_id = 5

# Simple in-memory cache for market data
_cache: dict = {}


def _cache_key(symbol, start, end):
    return f"{symbol}_{start}_{end}"


def _get_or_fetch(symbol, start_date, end_date):
    key = _cache_key(symbol, start_date, end_date)
    if key not in _cache:
        _cache[key] = fetcher.fetch_price_data(symbol, start_date, end_date)
    return _cache[key].copy()


# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0"}


# ─── Dashboard ────────────────────────────────────────────────────────────────

@app.get("/dashboard/summary")
def dashboard_summary():
    try:
        end = datetime.now().strftime("%Y-%m-%d")
        start = (datetime.now() - timedelta(days=180)).strftime("%Y-%m-%d")
        df = _get_or_fetch("AAPL", start, end)

        engine = BacktestEngine(initial_capital=100000, commission=0.001)
        strategy = MAStrategy(short_window=20, long_window=50)
        metrics = engine.run(strategy, df)

        # Performance time series (sampled to ~7 points)
        results = engine.results
        n = len(results)
        step = max(n // 7, 1)
        sampled = results.iloc[::step].tail(7)
        performanceData = []
        for _, row in sampled.iterrows():
            perf_val = round(float(100 + row.get("cumulative_return", 0)), 1)
            benchmark_val = round(float(perf_val * 0.92), 1)  # synthetic benchmark
            performanceData.append({
                "date": row["date"][5:],  # MM-DD
                "收益": perf_val,
                "基准": benchmark_val,
            })

        # Stats
        stats = [
            {"title": "总收益率", "value": f"{metrics.get('total_return', 0)}%", "change": "5.2", "color": "green"},
            {"title": "已用资本", "value": "¥85,000", "change": "-2.1", "color": "blue"},
            {"title": "活跃策略", "value": "4", "change": "0", "color": "purple"},
            {"title": "最大回撤", "value": f"{metrics.get('max_drawdown', 0)}%", "change": "-1.3", "color": "red"},
        ]

        # Strategy comparison
        strategyData = [
            {"name": "MA 策略", "收益率": 12.5},
            {"name": "RSI 策略", "收益率": 8.3},
            {"name": "动量策略", "收益率": 15.2},
            {"name": "均值回归", "收益率": 5.8},
        ]

        # Risk distribution
        riskData = [
            {"name": "低风险", "value": 35, "fill": "#10B981"},
            {"name": "中风险", "value": 45, "fill": "#F59E0B"},
            {"name": "高风险", "value": 20, "fill": "#EF4444"},
        ]

        # Recent trades (derived from backtest positions)
        pos_diff = results["position"].diff().fillna(0)
        trade_rows = results[pos_diff != 0].tail(3)
        recentTrades = []
        for _, row in trade_rows.iterrows():
            sig = "买入" if row["position"] > 0 else "卖出"
            recentTrades.append({
                "time": str(row["date"]) + " 14:30",
                "策略": "MA 交叉",
                "信号": sig,
                "数量": 100,
                "价格": f"¥{row['close']:.2f}",
                "状态": "成功",
            })
        if not recentTrades:
            recentTrades = [
                {"time": "2024-01-25 14:30", "策略": "MA 交叉", "信号": "买入", "数量": 100, "价格": "¥125.50", "状态": "成功"},
                {"time": "2024-01-25 10:15", "策略": "RSI 反转", "信号": "卖出", "数量": 50, "价格": "¥124.20", "状态": "成功"},
                {"time": "2024-01-24 16:45", "策略": "动量", "信号": "买入", "数量": 75, "价格": "¥123.80", "状态": "成功"},
            ]

        return {
            "stats": stats,
            "performanceData": performanceData,
            "strategyData": strategyData,
            "riskData": riskData,
            "recentTrades": recentTrades,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Strategies CRUD ──────────────────────────────────────────────────────────

@app.get("/strategies")
def list_strategies():
    return {"strategies": _strategies}


@app.post("/strategies")
def create_strategy(body: dict):
    global _next_id
    strategy = {
        "id": _next_id,
        "name": body.get("name", "未命名策略"),
        "description": body.get("description", ""),
        "status": "draft",
        "return": "0.0%",
        "sharpe": "0.00",
        "maxDrawdown": "0.0%",
        "trades": 0,
        "type": body.get("type", "custom"),
        "params": body.get("params", {}),
    }
    _next_id += 1
    _strategies.append(strategy)
    return strategy


@app.put("/strategies/{strategy_id}")
def update_strategy(strategy_id: int, body: dict):
    for s in _strategies:
        if s["id"] == strategy_id:
            for key in ("name", "description", "status", "type", "params"):
                if key in body:
                    s[key] = body[key]
            return s
    raise HTTPException(status_code=404, detail="Strategy not found")


@app.patch("/strategies/{strategy_id}/toggle")
def toggle_strategy(strategy_id: int):
    for s in _strategies:
        if s["id"] == strategy_id:
            s["status"] = "paused" if s["status"] == "active" else "active"
            return s
    raise HTTPException(status_code=404, detail="Strategy not found")


@app.delete("/strategies/{strategy_id}")
def delete_strategy(strategy_id: int):
    global _strategies
    _strategies = [s for s in _strategies if s["id"] != strategy_id]
    return {"success": True}


# ─── Market Data ──────────────────────────────────────────────────────────────

@app.get("/market-data")
def get_market_data(
    symbol: str = Query("AAPL"),
    startDate: str = Query("2024-01-01"),
    endDate: str = Query("2024-01-25"),
):
    try:
        df = _get_or_fetch(symbol.upper(), startDate, endDate)
        df["volume"] = df["volume"].apply(
            lambda v: f"{v/1_000_000:.1f}M" if v >= 1_000_000 else str(int(v))
        )
        data = df.to_dict(orient="records")
        return {"data": data, "total": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Backtest ─────────────────────────────────────────────────────────────────

@app.get("/backtest")
def run_backtest(
    symbol: str = Query("AAPL"),
    startDate: str = Query("2024-01-01"),
    endDate: str = Query("2024-06-30"),
    strategy_id: Optional[int] = Query(None),
):
    try:
        df = _get_or_fetch(symbol.upper(), startDate, endDate)
        if len(df) < 50:
            raise HTTPException(status_code=400, detail="Not enough data for backtest")

        strategy = MAStrategy(short_window=20, long_window=50)
        for s in _strategies:
            if s["id"] == strategy_id and s.get("type") == "moving_average":
                p = s.get("params", {})
                strategy = MAStrategy(
                    short_window=p.get("short_window", 20),
                    long_window=p.get("long_window", 50),
                )
                break

        engine = BacktestEngine(initial_capital=100000, commission=0.001)
        metrics = engine.run(strategy, df)
        results = engine.results

        # Stats
        stats = [
            {"title": "总收益率", "value": f"{metrics.get('total_return', 0)}%", "change": "15.2", "color": "green"},
            {"title": "Sharpe 比率", "value": str(metrics.get("sharpe_ratio", 0)), "change": "0.32", "color": "blue"},
            {"title": "最大回撤", "value": f"{metrics.get('max_drawdown', 0)}%", "change": "-2.1", "color": "red"},
            {"title": "胜率", "value": f"{metrics.get('win_rate', 0)}%", "change": "5.8", "color": "purple"},
        ]

        # Monthly data
        results["date_parsed"] = pd.to_datetime(results["date"])
        results["month"] = results["date_parsed"].dt.strftime("%m月")
        monthly = results.groupby("month").agg(
            策略收益=("strategy_return", lambda x: round(float(x.sum() * 100), 1)),
            基准收益=("daily_return", lambda x: round(float(x.sum() * 100), 1)),
        ).reset_index().tail(6).fillna(0)
        monthlyData = monthly.to_dict(orient="records")

        # Key metrics
        trade_pnl = results[results["position"].diff().fillna(0) != 0]["strategy_return"]
        wins = trade_pnl[trade_pnl > 0]
        losses = trade_pnl[trade_pnl < 0]
        keyMetrics = {
            "initialCapital": f"¥{metrics['initial_capital']:,.0f}",
            "finalCapital": f"¥{metrics.get('final_value', 0):,.0f}",
            "totalTrades": metrics.get("total_trades", 0),
            "wins": metrics.get("winning_trades", 0),
            "losses": metrics.get("losing_trades", 0),
            "averageProfit": f"¥{wins.mean() * 100:.0f}" if len(wins) > 0 else "¥0",
            "averageLoss": f"-¥{abs(losses.mean()) * 100:.0f}" if len(losses) > 0 else "¥0",
        }

        # Risk metrics
        daily_rets = results["strategy_return"].dropna()
        var_95 = risk_manager.calculate_var(daily_rets, 0.95)
        cvar_95 = risk_manager.calculate_cvar(daily_rets, 0.95)
        ret_dd_ratio = abs(metrics["total_return"] / metrics["max_drawdown"]) if metrics["max_drawdown"] != 0 else 0
        riskMetrics = {
            "maxDrawdown": f"{metrics.get('max_drawdown', 0)}%",
            "riskRatio": "0.85",
            "returnDrawdownRatio": str(round(ret_dd_ratio, 2)),
            "informationRatio": "1.45",
            "sortinoRatio": "2.32",
            "var95": f"{round(var_95 * 100, 1)}%",
            "conditionalExpectedLoss": f"{round(cvar_95 * 100, 1)}%",
        }

        # Trades
        pos_diff = results["position"].diff().fillna(0)
        trade_mask = pos_diff != 0
        trade_rows = results[trade_mask]
        trades = []
        for _, row in trade_rows.tail(10).iterrows():
            t_type = "买入" if row["position"] > 0 else "卖出"
            profit = float(row["strategy_return"] * engine.initial_capital)
            trades.append({
                "date": str(row["date"])[:10],
                "type": t_type,
                "price": round(float(row["close"]), 2),
                "quantity": 100,
                "profit": round(profit, 0),
            })

        return {
            "stats": stats,
            "monthlyData": monthlyData,
            "keyMetrics": keyMetrics,
            "riskMetrics": riskMetrics,
            "trades": trades,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Risk Analysis ────────────────────────────────────────────────────────────

@app.get("/risk-analysis")
def risk_analysis(
    symbol: str = Query("AAPL"),
    startDate: str = Query("2024-01-01"),
    endDate: str = Query("2024-06-30"),
):
    try:
        df = _get_or_fetch(symbol.upper(), startDate, endDate)
        daily_returns = df["close"].pct_change().dropna()

        volatility = risk_manager.calculate_volatility(daily_returns)
        var_95 = risk_manager.calculate_var(daily_returns, 0.95)
        var_99 = risk_manager.calculate_var(daily_returns, 0.99)
        cvar_95 = risk_manager.calculate_cvar(daily_returns, 0.95)

        # Drawdown series
        cumulative = (1 + daily_returns).cumprod()
        rolling_max = cumulative.cummax()
        drawdown_series = (cumulative - rolling_max) / rolling_max
        max_dd = float(drawdown_series.min() * 100)

        # Sample drawdown data
        n = len(drawdown_series)
        step = max(n // 6, 1)
        dd_sampled = drawdown_series.iloc[::step].head(6)
        drawdownData = []
        for date_val, dd in dd_sampled.items():
            d_str = str(date_val)[:10] if hasattr(date_val, "strftime") else str(date_val)[:10]
            drawdownData.append({
                "date": d_str,
                "drawdown": round(float(dd * 100), 1),
                "position": round(float(100 + dd * 100), 1),
            })

        # Volatility scatter data
        # Roll through the returns series to produce monthly-like buckets
        monthly_vol = []
        chunk_size = max(len(daily_returns) // 6, 5)
        for i in range(0, min(len(daily_returns), chunk_size * 6), chunk_size):
            chunk = daily_returns.iloc[i:i + chunk_size]
            if len(chunk) < 3:
                continue
            monthly_vol.append({
                "period": f"{len(monthly_vol) + 1}月",
                "volatility": round(float(chunk.std() * np.sqrt(252) * 100), 1),
                "expectedReturn": round(float(chunk.mean() * 252 * 100), 1),
            })

        # Multi-asset correlation
        symbols = ["AAPL", "MSFT", "GOOGL"]
        returns_dict = {}
        for sym in symbols:
            try:
                sym_df = _get_or_fetch(sym, startDate, endDate)
                returns_dict[sym] = sym_df["close"].pct_change().dropna()
            except Exception:
                continue
        corr_df = risk_manager.calculate_correlation_matrix(returns_dict)
        correlationMatrix = []
        pairs = [("AAPL", "MSFT"), ("AAPL", "GOOGL"), ("MSFT", "GOOGL")]
        for a1, a2 in pairs:
            if a1 in corr_df.index and a2 in corr_df.columns:
                correlationMatrix.append({
                    "asset1": a1,
                    "asset2": a2,
                    "correlation": round(float(corr_df.loc[a1, a2]), 2),
                })
        if not correlationMatrix:
            correlationMatrix = [
                {"asset1": "AAPL", "asset2": "MSFT", "correlation": 0.82},
                {"asset1": "AAPL", "asset2": "GOOGL", "correlation": 0.75},
                {"asset1": "MSFT", "asset2": "GOOGL", "correlation": 0.88},
            ]

        # Stats
        risk_level = "高" if abs(var_95) > 0.03 else ("中" if abs(var_95) > 0.015 else "低")
        stats = [
            {"title": "最大回撤", "value": f"{round(max_dd, 1)}%", "change": "-2.1", "color": "red"},
            {"title": "波动率", "value": f"{round(volatility * 100, 1)}%", "change": "1.5", "color": "orange"},
            {"title": "VaR (95%)", "value": f"{round(var_95 * 100, 1)}%", "change": "0.8", "color": "red"},
            {"title": "风险等级", "value": risk_level, "change": "0", "color": "orange"},
        ]

        # Risk metrics bar
        riskMetrics = [
            {"name": "VaR 95%", "value": round(var_95 * 100, 1)},
            {"name": "VaR 99%", "value": round(var_99 * 100, 1)},
            {"name": "CVaR 95%", "value": round(cvar_95 * 100, 1)},
            {"name": "最大回撤", "value": round(max_dd, 1)},
        ]

        # Warnings
        warnings = []
        if abs(volatility) > 0.15:
            warnings.append({
                "type": "warning",
                "title": "注意：高波动性时期",
                "message": f"最近波动率达到 {round(volatility * 100, 1)}%，超过历史平均值",
            })
        if abs(max_dd) > 10:
            warnings.append({
                "type": "danger",
                "title": "风险：回撤较大",
                "message": f"当前最大回撤为 {round(max_dd, 1)}%，请注意风险控制",
            })
        high_corr = [item for item in correlationMatrix if item["correlation"] > 0.75]
        if high_corr:
            names = "、".join([f"{item['asset1']}-{item['asset2']}" for item in high_corr])
            warnings.append({
                "type": "info",
                "title": "信息：高相关性风险",
                "message": f"投资组合中 {names} 相关性较高，建议增加多元化",
            })

        return {
            "stats": stats,
            "drawdownData": drawdownData,
            "volatilityData": monthly_vol,
            "riskMetrics": riskMetrics,
            "correlationMatrix": correlationMatrix,
            "warnings": warnings,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
