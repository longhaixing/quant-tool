"""Abstract base for data-source adapters."""

from abc import ABC, abstractmethod
import pandas as pd


class DataSource(ABC):
    """Every source adapter must implement `fetch`. Output columns are always:
    date, open, high, low, close, volume.
    """

    @abstractmethod
    def fetch(
        self,
        symbol: str,
        start_date: str,
        end_date: str,
        interval: str = "1d",
    ) -> pd.DataFrame:
        ...
