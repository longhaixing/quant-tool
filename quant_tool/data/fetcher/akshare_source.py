"""akshare data source adapter for Chinese A-share stocks."""

import logging
import pandas as pd
from .base import DataSource
import akshare as ak

logger = logging.getLogger(__name__)


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

        period = self._INTERVAL_MAP.get(interval, "daily")
        start = start_date.replace("-", "")
        end = end_date.replace("-", "")

        # ── Try East Money source first ──────────────────────────────
        try:
            df = ak.stock_zh_a_hist(
                symbol=symbol,
                period=period,
                start_date=start,
                end_date=end,
                adjust="",
            )
            if df is not None and not df.empty:
                df = df.rename(columns=self._COLUMN_MAP)
                df = df[list(self._COLUMN_MAP.values())]
                df["volume"] = df["volume"].fillna(0).astype(int)
                return df
        except Exception as e:
            logger.warning(
                "East Money API unavailable for %s [%s ~ %s]: %s — trying Sina fallback",
                symbol, start_date, end_date, e,
            )

        # ── Fallback: Sina source ───────────────────────────────────
        # Sina uses exchange prefix: sh600519 / sz000001
        exchange = "sh" if symbol.startswith("6") else "sz"
        sina_symbol = f"{exchange}{symbol}"
        try:
            df = ak.stock_zh_a_daily(
                symbol=sina_symbol,
                start_date=start,
                end_date=end,
                adjust="",
            )
            if df is not None and not df.empty:
                # Sina already returns English columns: date,open,close,high,low,volume
                cols = [c for c in ["date", "open", "high", "low", "close", "volume"]
                        if c in df.columns]
                df = df[cols]
                df["volume"] = df["volume"].fillna(0).astype(int)
                return df
        except Exception as e:
            logger.warning(
                "Sina API also unavailable for %s [%s ~ %s]: %s",
                symbol, start_date, end_date, e,
            )

        # Both sources failed — return empty DataFrame
        return pd.DataFrame(columns=list(self._COLUMN_MAP.values()))
