# Quant Tool - 量化交易框架

A Python-based quantitative trading framework built for strategy development, backtesting, and risk management.

## Features

- 📊 **Data Fetching**: Support for multiple data sources
- 📈 **Strategy Development**: Easy-to-use base classes for building trading strategies
- 🧪 **Backtesting**: Comprehensive backtesting engine with metrics calculation
- 🛡️ **Risk Management**: Position sizing, VaR calculation, stop-loss management
- 📉 **Visualization**: Chart and result visualization tools

## Project Structure

```
quant-tool/
├── quant_tool/           # Main package
│   ├── data/             # Data fetching module
│   ├── strategy/         # Strategy development module
│   ├── backtest/         # Backtesting engine
│   ├── risk/             # Risk management module
│   └── visualization/    # Visualization tools
├── examples/             # Example strategies
├── tests/                # Unit tests
├── docs/                 # Documentation
└── README.md            # This file
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quant-tool
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install the package in development mode:
   ```bash
   pip install -e .
   ```

## Quick Start

```python
from quant_tool.strategy import BaseStrategy
from quant_tool.backtest import BacktestEngine
from quant_tool.data import DataFetcher

# Fetch data
fetcher = DataFetcher()
data = fetcher.fetch_price_data('AAPL', '2020-01-01', '2023-01-01')

# Create your strategy
class MyStrategy(BaseStrategy):
    def calculate_signals(self, data):
        # Your strategy logic here
        pass

# Run backtest
engine = BacktestEngine(initial_capital=100000)
strategy = MyStrategy()
results = engine.run(strategy, data)
```

## Documentation

See [docs/](docs/) for detailed documentation.

## Examples

Check out [examples/](examples/) for example strategies:
- Simple Moving Average Crossover

## Testing

Run tests with:
```bash
pytest tests/
```

## Requirements

- Python >= 3.8
- numpy >= 1.21.0
- pandas >= 1.3.0
- matplotlib >= 3.4.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Roadmap

- [ ] Implement data fetching from various sources
- [ ] Complete backtest engine implementation
- [ ] Add more example strategies
- [ ] Real-time trading support
- [ ] Performance optimization
- [ ] Advanced visualization tools

## Contact

For questions or suggestions, please open an issue.
