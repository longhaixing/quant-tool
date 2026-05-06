"""
Simple Moving Average Crossover Strategy Example
"""

import pandas as pd
import numpy as np
from quant_tool.strategy import BaseStrategy


class SimpleMAStrategy(BaseStrategy):
    """
    Simple Moving Average Crossover Strategy
    
    Buys when short MA crosses above long MA
    Sells when short MA crosses below long MA
    """
    
    def __init__(self, short_window: int = 20, long_window: int = 50):
        """
        Initialize strategy
        
        Args:
            short_window: Short moving average window
            long_window: Long moving average window
        """
        super().__init__(
            name="Simple MA Crossover",
            short_window=short_window,
            long_window=long_window
        )
    
    def calculate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate trading signals
        
        Args:
            data: DataFrame with OHLCV data
            
        Returns:
            DataFrame with signals
        """
        # Initialize signal dataframe
        signals = pd.DataFrame(index=data.index)
        signals['price'] = data['close']
        
        # Calculate moving averages
        short_window = self.params['short_window']
        long_window = self.params['long_window']
        
        signals['short_ma'] = data['close'].rolling(window=short_window).mean()
        signals['long_ma'] = data['close'].rolling(window=long_window).mean()
        
        # Generate signals
        signals['signal'] = 0  # 0: no position
        signals.loc[signals['short_ma'] > signals['long_ma'], 'signal'] = 1  # 1: buy
        signals.loc[signals['short_ma'] < signals['long_ma'], 'signal'] = -1  # -1: sell
        
        # Calculate position (previous signal)
        signals['position'] = signals['signal'].shift(1)
        
        return signals


def main():
    """Example usage"""
    # TODO: Implement example usage
    print("Simple MA Strategy Example")


if __name__ == "__main__":
    main()
