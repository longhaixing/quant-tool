"""Data-fetcher package — akshare A-share stock data."""

from typing import List

from .base import DataSource
from .akshare_source import AkShareSource


class DataFetcher:
    """Fetch A-share price data via akshare.

        fetcher = DataFetcher()
        df = fetcher.fetch_price_data("000001", "2025-01-01", "2025-05-10")
    """

    def __init__(self, cache_dir: str = "./data_cache"):
        self.cache_dir = cache_dir
        self._adapter = AkShareSource()

    def fetch_price_data(
        self, symbol: str, start_date: str, end_date: str, interval: str = "1d",
    ):
        return self._adapter.fetch(symbol, start_date, end_date, interval)

    def fetch_multiple_symbols(
        self, symbols: List[str], start_date: str, end_date: str,
    ) -> dict:
        result = {}
        for symbol in symbols:
            try:
                result[symbol] = self.fetch_price_data(symbol, start_date, end_date)
            except Exception as e:
                print(f"Warning: Failed to fetch {symbol}: {e}")
        return result
