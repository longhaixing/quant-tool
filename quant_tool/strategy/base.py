"""
Base Strategy class for all trading strategies
"""

from abc import ABC, abstractmethod
import pandas as pd
from typing import Dict, Any


class BaseStrategy(ABC):
    """
    Abstract base class for trading strategies.
    All strategies should inherit from this class.
    """
    
    def __init__(self, name: str, **kwargs):
        """
        Initialize strategy
        
        Args:
            name: Strategy name
            **kwargs: Additional parameters
        """
        self.name = name
        self.params = kwargs
        self.signals = None
        self.positions = None
        
    @abstractmethod
    def calculate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate trading signals based on market data
        
        Args:
            data: DataFrame with OHLCV data
            
        Returns:
            DataFrame with signals (1: buy, 0: hold, -1: sell)
        """
        pass
    
    def generate_orders(self, signals: pd.DataFrame) -> pd.DataFrame:
        """
        Generate orders from signals
        
        Args:
            signals: DataFrame with trading signals
            
        Returns:
            DataFrame with orders
        """
        # TODO: Implement order generation logic
        pass
    
    def get_params(self) -> Dict[str, Any]:
        """Get strategy parameters"""
        return self.params
    
    def set_param(self, key: str, value: Any):
        """Set a parameter value"""
        self.params[key] = value
