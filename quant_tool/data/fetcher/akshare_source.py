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

        try:
            df = ak.stock_zh_a_hist(
                symbol=symbol,
                period=period,
                start_date=start,
                end_date=end,
                adjust="",
            )
        except Exception:
            # akshare remote API may refuse future dates or stale connections
            # Gracefully return empty DataFrame instead of raising
            df = pd.DataFrame(columns=list(self._COLUMN_MAP.values()))
            return df

        if df.empty:
            # No data for this range — return an empty DataFrame with correct columns
            df = pd.DataFrame(columns=list(self._COLUMN_MAP.values()))
            return df

        df = df.rename(columns=self._COLUMN_MAP)
        df = df[list(self._COLUMN_MAP.values())]
        df["volume"] = df["volume"].fillna(0).astype(int)
        return df
