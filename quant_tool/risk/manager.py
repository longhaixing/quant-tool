"""
Risk Management module
"""

import pandas as pd
import numpy as np
from typing import Dict, Any


class RiskManager:
    """
    Risk management for trading strategies.
    
    Handles position sizing, stop-loss, take-profit, and risk metrics.
    """
    
    def __init__(
        self,
        max_position_size: float = 0.1,
        max_loss_percentage: float = 0.02
    ):
        """
        Initialize RiskManager
        
        Args:
            max_position_size: Maximum position size as fraction of portfolio
            max_loss_percentage: Maximum loss percentage before stopping
        """
        self.max_position_size = max_position_size
        self.max_loss_percentage = max_loss_percentage
        
    def calculate_position_size(
        self,
        capital: float,
        entry_price: float,
        stop_loss_price: float
    ) -> float:
        """
        Calculate position size based on risk parameters

        Args:
            capital: Available capital
            entry_price: Entry price
            stop_loss_price: Stop loss price

        Returns:
            Position size (number of shares)
        """
        risk_per_unit = abs(entry_price - stop_loss_price)
        if risk_per_unit == 0:
            return 0.0
        max_risk = capital * self.max_loss_percentage
        return float(round(max_risk / risk_per_unit, 0))

    def calculate_var(self, returns: pd.Series, confidence: float = 0.95) -> float:
        """
        Calculate Value at Risk (VaR) using historical method

        Args:
            returns: Series of returns
            confidence: Confidence level (0.95 = 95%)

        Returns:
            VaR value as a decimal (e.g., -0.02 = -2%)
        """
        if len(returns) == 0:
            return 0.0
        return float(round(returns.quantile(1 - confidence), 4))

    def calculate_cvar(self, returns: pd.Series, confidence: float = 0.95) -> float:
        """
        Calculate Conditional Value at Risk (CVaR / Expected Shortfall)

        Args:
            returns: Series of returns
            confidence: Confidence level (0.95 = 95%)

        Returns:
            CVaR value as a decimal
        """
        var = self.calculate_var(returns, confidence)
        tail = returns[returns <= var]
        if len(tail) == 0:
            return var
        return float(round(tail.mean(), 4))

    def calculate_volatility(self, returns: pd.Series) -> float:
        """Calculate annualized volatility"""
        if len(returns) == 0:
            return 0.0
        return float(round(returns.std() * np.sqrt(252), 4))

    def calculate_correlation_matrix(
        self, returns_dict: Dict[str, pd.Series]
    ) -> pd.DataFrame:
        """Calculate correlation matrix from multiple return series"""
        df = pd.DataFrame(returns_dict)
        return df.corr()

    def should_stop(self, current_loss_percentage: float) -> bool:
        """
        Determine if trading should stop based on loss

        Args:
            current_loss_percentage: Current loss percentage

        Returns:
            True if should stop, False otherwise
        """
        return current_loss_percentage <= -self.max_loss_percentage
