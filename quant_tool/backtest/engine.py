"""
Backtest Engine for running strategy backtests
"""

import pandas as pd
import numpy as np
from typing import Dict, Any
from ..strategy import BaseStrategy


class BacktestEngine:
    """
    Backtest engine for testing trading strategies.
    
    Attributes:
        initial_capital (float): Initial capital for backtest
        commission (float): Trading commission rate
    """
    
    def __init__(
        self,
        initial_capital: float = 100000,
        commission: float = 0.001
    ):
        """
        Initialize BacktestEngine
        
        Args:
            initial_capital: Initial capital
            commission: Commission rate (0.001 = 0.1%)
        """
        self.initial_capital = initial_capital
        self.commission = commission
        self.results = None
        self.portfolio_value = None
        
    def run(
        self,
        strategy: BaseStrategy,
        data: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Run backtest for a strategy

        Args:
            strategy: Strategy instance
            data: DataFrame with OHLCV data

        Returns:
            Dictionary with backtest results
        """
        signals = strategy.calculate_signals(data)
        df = data.copy()
        df["signal"] = signals["signal"].values
        df["position"] = signals["signal"].diff().fillna(0).clip(lower=-1, upper=1)
        df["position"] = df["position"].cumsum()

        df["daily_return"] = df["close"].pct_change()
        df["strategy_return"] = df["position"].shift(1) * df["daily_return"]
        df["strategy_return"] = df["strategy_return"].fillna(0)

        trade_mask = df["position"].diff().fillna(0) != 0
        trade_prices = df.loc[trade_mask, "close"].abs()
        commission_cost = self.commission * trade_prices
        idx = trade_mask[trade_mask].index
        if len(idx) > 0:
            df.loc[idx, "strategy_return"] -= (
                commission_cost.values / self.initial_capital
            )

        df["portfolio_value"] = self.initial_capital * (
            1 + df["strategy_return"]
        ).cumprod()
        df["cumulative_return"] = (
            df["portfolio_value"] / self.initial_capital - 1
        ) * 100

        self.portfolio_value = df["portfolio_value"]
        self.results = df
        return self.calculate_metrics()

    def calculate_metrics(self) -> Dict[str, float]:
        """
        Calculate performance metrics

        Returns:
            Dictionary with metrics (Sharpe ratio, max drawdown, return, etc.)
        """
        df = self.results
        if df is None or len(df) == 0:
            return {}

        final_value = df["portfolio_value"].iloc[-1]
        total_return = (final_value / self.initial_capital - 1) * 100
        daily_returns = df["strategy_return"]
        std = daily_returns.std()
        sharpe = float(np.sqrt(252) * daily_returns.mean() / std) if std and std > 0 else 0.0

        cumulative = df["portfolio_value"]
        rolling_max = cumulative.cummax()
        drawdown = (cumulative - rolling_max) / rolling_max
        max_drawdown = drawdown.min() * 100

        trade_signals = df["position"].diff().fillna(0)
        total_trades = int((trade_signals != 0).sum())
        winning_trades = int((df.loc[trade_signals[df["position"] == 1].index, "strategy_return"] > 0).sum()) if total_trades > 0 else 0
        win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0.0

        return {
            "total_return": round(float(total_return), 2),
            "sharpe_ratio": round(sharpe, 2),
            "max_drawdown": round(float(max_drawdown), 2),
            "final_value": round(float(final_value), 2),
            "initial_capital": self.initial_capital,
            "total_trades": total_trades,
            "win_rate": round(float(win_rate), 1),
            "winning_trades": winning_trades,
            "losing_trades": int(total_trades - winning_trades),
        }
    
    def get_results(self) -> Dict[str, Any]:
        """Get backtest results"""
        return self.results
