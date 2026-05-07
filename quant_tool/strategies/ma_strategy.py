import pandas as pd
from ..strategy import BaseStrategy


class MAStrategy(BaseStrategy):
    """Moving Average Crossover Strategy"""

    def __init__(self, short_window: int = 20, long_window: int = 50):
        super().__init__(
            name="MA Crossover",
            short_window=short_window,
            long_window=long_window,
        )

    def calculate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        signals = pd.DataFrame(index=data.index)
        signals["price"] = data["close"]
        signals["short_ma"] = data["close"].rolling(
            window=self.params["short_window"]
        ).mean()
        signals["long_ma"] = data["close"].rolling(
            window=self.params["long_window"]
        ).mean()
        signals["signal"] = 0
        signals.loc[signals["short_ma"] > signals["long_ma"], "signal"] = 1
        signals.loc[signals["short_ma"] < signals["long_ma"], "signal"] = -1
        signals["position"] = signals["signal"].shift(1)
        return signals
