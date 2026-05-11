"""akshare data source adapter for Chinese A-share stocks."""

import pandas as pd
from .base import DataSource


class AkShareSource(DataSource):
    _INTERVAL_MAP = {
        "1d": "daily",
        "1wk": "weekly",
        "1mo": "monthly",
    }

    _COLUMN_MAP = {
        "日期": "date", "开盘": "open", "最高": "high",
        "最低": "low", "收盘": "close", "成交量": "volume",
    }

    def fetch(self, symbol, start_date, end_date, interval="1d"):
        import akshare as ak

        period = self._INTERVAL_MAP.get(interval, "daily")
        start = start_date.replace("-", "")
        end = end_date.replace("-", "")

        df = ak.stock_zh_a_hist(
            symbol=symbol,
            period=period,
            start_date=start,
            end_date=end,
            adjust="",
        )
        if df.empty:
            raise ValueError(
                f"No data found for symbol {symbol} "
                f"in range {start_date} to {end_date}"
            )

        df = df.rename(columns=self._COLUMN_MAP)
        df = df[list(self._COLUMN_MAP.values())]
        df["volume"] = df["volume"].fillna(0).astype(int)
        return df
