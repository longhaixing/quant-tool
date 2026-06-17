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

    _name_cache: dict[str, str] | None = None

    def get_stock_name(self, symbol: str) -> str | None:
        """Look up the Chinese name for a stock symbol (e.g. '000001' → '平安银行')."""
        if self._name_cache is None:
            try:
                df = ak.stock_info_a_code_name()  # returns all A-share stocks
                self._name_cache = dict(zip(df["code"].astype(str), df["name"].astype(str)))
                logger.info("Loaded %d stock names", len(self._name_cache))
            except Exception as e:
                logger.warning("Failed to load stock name table: %s", e)
                self._name_cache = {}
        return self._name_cache.get(symbol)

    _MINUTE_COLUMN_MAP = {
        "时间": "date", "开盘": "open", "最高": "high",
        "最低": "low", "收盘": "close", "成交量": "volume",
    }

    def fetch_intraday(self, symbol: str, period: str = "60") -> pd.DataFrame:
        """Fetch intraday minute K-line data.
        
        period: '1' | '5' | '15' | '30' | '60' (minutes)
        Returns columns: date, open, high, low, close, volume
        """
        today = pd.Timestamp.now().strftime("%Y-%m-%d 09:30:00")
        try:
            df = ak.stock_zh_a_hist_min_em(
                symbol=symbol,
                start_date=today,
                end_date="2222-01-01 09:32:00",
                period=period,
                adjust="",
            )
            if df is not None and not df.empty:
                df = df.rename(columns=self._MINUTE_COLUMN_MAP)
                cols = [c for c in ["date", "open", "high", "low", "close", "volume"]
                        if c in df.columns]
                df = df[cols]
                df["volume"] = df["volume"].fillna(0).astype(int)
                return df
        except Exception as e:
            logger.warning("Intraday API unavailable for %s: %s", symbol, e)
        return pd.DataFrame(columns=["date", "open", "high", "low", "close", "volume"])
