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

        # ── Proper trade-level tracking ──────────────────────────────────
        # A trade opens when position goes from 0 → ±1 (entry) or flips
        #   ±1 → ∓1 (close old + open new same day).
        # A trade closes when position goes ±1 → 0 (exit) or flips.
        # Per-trade PnL = sum of strategy_return from day AFTER entry
        #   through day OF exit (inclusive), since strategy_return[i] uses
        #   position[i-1].
        pos = df["position"]
        pos_prev = pos.shift(1).fillna(0)

        entries = (pos != 0) & (pos_prev == 0)    # 0 → ±1 : open
        exits   = (pos == 0) & (pos_prev != 0)    # ±1 → 0  : close
        flips   = (pos * pos_prev < 0)             # ±1 → ∓1 : flip

        # Scan the series to pair entries with exits
        trade_pnls: list[float] = []
        in_trade = False
        entry_idx = -1
        for i in range(len(df)):
            if entries.iloc[i] or flips.iloc[i]:
                if in_trade and entry_idx >= 0:
                    # Close previous trade (includes flip-day return)
                    trade_pnls.append(
                        float(df["strategy_return"].iloc[entry_idx + 1 : i + 1].sum())
                    )
                entry_idx = i
                in_trade = True
            elif exits.iloc[i] and in_trade:
                trade_pnls.append(
                    float(df["strategy_return"].iloc[entry_idx + 1 : i + 1].sum())
                )
                in_trade = False

        # Close any position still open at end of data
        if in_trade and entry_idx >= 0:
            trade_pnls.append(
                float(df["strategy_return"].iloc[entry_idx + 1 :].sum())
            )

        total_trades = len(trade_pnls)
        if total_trades > 0:
            winning_trades = sum(1 for pnl in trade_pnls if pnl > 0)
            losing_trades  = sum(1 for pnl in trade_pnls if pnl < 0)
            win_rate = (winning_trades / total_trades * 100)
            winners = [pnl for pnl in trade_pnls if pnl > 0]
            losers  = [pnl for pnl in trade_pnls if pnl < 0]
            avg_profit = float(np.mean(winners)) if winners else 0.0
            avg_loss   = float(np.mean(losers))  if losers  else 0.0
        else:
            winning_trades = 0
            losing_trades  = 0
            win_rate = 0.0
            avg_profit = 0.0
            avg_loss   = 0.0

        return {
            "total_return": round(float(total_return), 2),
            "sharpe_ratio": round(sharpe, 2),
            "max_drawdown": round(float(max_drawdown), 2),
            "final_value": round(float(final_value), 2),
            "initial_capital": self.initial_capital,
            "total_trades": total_trades,
            "win_rate": round(float(win_rate), 1),
            "winning_trades": winning_trades,
            "losing_trades": losing_trades,
            "avg_profit": round(avg_profit, 6),
            "avg_loss": round(avg_loss, 6),
        }
    
    def get_results(self) -> Dict[str, Any]:
        """Get backtest results"""
        return self.results
