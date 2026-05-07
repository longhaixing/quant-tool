"""
Data Fetcher module for retrieving market data
"""

import pandas as pd
from typing import Optional, List
from datetime import datetime, timedelta


class DataFetcher:
    """
    Fetches market data from various sources.
    
    Attributes:
        source (str): Data source (e.g., 'yfinance', 'tushare', 'alpha_vantage')
        cache_dir (str): Directory to cache downloaded data
    """
    
    def __init__(self, source: str = "yfinance", cache_dir: str = "./data_cache"):
        """
        Initialize DataFetcher
        
        Args:
            source: Data source name
            cache_dir: Cache directory path
        """
        self.source = source
        self.cache_dir = cache_dir
        
    def fetch_price_data(
        self,
        symbol: str,
        start_date: str,
        end_date: str,
        interval: str = "1d"
    ) -> pd.DataFrame:
        """
        Fetch price data for a given symbol

        Args:
            symbol: Trading symbol (e.g., 'AAPL')
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            interval: Data interval ('1d', '1h', '15m', etc.)

        Returns:
            DataFrame with OHLCV data
        """
        if self.source == "yfinance":
            import yfinance as yf
            ticker = yf.Ticker(symbol)
            df = ticker.history(start=start_date, end=end_date, interval=interval)
            if df.empty:
                raise ValueError(f"No data found for symbol {symbol} in range {start_date} to {end_date}")
            df = df.rename(columns={
                "Open": "open", "High": "high", "Low": "low",
                "Close": "close", "Volume": "volume"
            })
            df.index.name = "date"
            df = df.reset_index()
            df["date"] = df["date"].dt.strftime("%Y-%m-%d")
            return df[["date", "open", "high", "low", "close", "volume"]]
        else:
            raise NotImplementedError(f"Data source '{self.source}' is not supported")

    def fetch_multiple_symbols(
        self,
        symbols: List[str],
        start_date: str,
        end_date: str
    ) -> dict:
        """
        Fetch data for multiple symbols

        Args:
            symbols: List of trading symbols
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)

        Returns:
            Dictionary with symbol as key and DataFrame as value
        """
        result = {}
        for symbol in symbols:
            try:
                result[symbol] = self.fetch_price_data(symbol, start_date, end_date)
            except Exception as e:
                print(f"Warning: Failed to fetch {symbol}: {e}")
        return result
