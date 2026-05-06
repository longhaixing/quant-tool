# Quant Tool 完整指南

这是一个完整的量化交易框架项目，包含后端服务和现代化的 React 前端应用。

## 项目结构

```
quant-tool/
├── quant_tool/              # Python 后端核心包
│   ├── data/                # 数据获取模块
│   ├── strategy/            # 策略开发模块
│   ├── backtest/            # 回测引擎
│   ├── risk/                # 风险管理模块
│   └── visualization/       # 可视化工具
├── frontend/                # React 前端应用
│   ├── src/
│   ├── public/
│   └── package.json
├── examples/                # 示例策略
├── tests/                   # 单元测试
├── docs/                    # 文档
├── requirements.txt         # Python 依赖
├── setup.py                # Python 包配置
└── README.md               # 项目说明
```

## 快速开始

### 后端设置

1. **安装 Python 依赖**

```bash
pip install -r requirements.txt
```

2. **安装项目包**

```bash
pip install -e .
```

3. **运行测试**

```bash
pytest tests/
```

### 前端设置

1. **进入前端目录**

```bash
cd frontend
```

2. **安装 Node 依赖**

```bash
npm install
```

3. **启动开发服务器**

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 默认配置

### 前端
- 开发服务器: `http://localhost:3000`
- API 代理: `http://localhost:5000`

### 后端 (需要自己创建)
- 建议端口: `http://localhost:5000`

## 完整工作流程

### 1. 开发策略

```python
from quant_tool.strategy import BaseStrategy
from quant_tool.data import DataFetcher
import pandas as pd

class MyStrategy(BaseStrategy):
    def calculate_signals(self, data):
        signals = pd.DataFrame(index=data.index)
        # 你的策略逻辑
        return signals
```

### 2. 获取数据

```python
fetcher = DataFetcher()
data = fetcher.fetch_price_data('AAPL', '2023-01-01', '2024-01-01')
```

### 3. 运行回测

```python
from quant_tool.backtest import BacktestEngine

engine = BacktestEngine(initial_capital=100000)
strategy = MyStrategy()
results = engine.run(strategy, data)
```

### 4. 分析风险

```python
from quant_tool.risk import RiskManager

risk_mgr = RiskManager()
position_size = risk_mgr.calculate_position_size(
    capital=100000,
    entry_price=125.0,
    stop_loss_price=120.0
)
```

### 5. 在前端查看结果

- 打开仪表板查看性能
- 在回测结果页面查看详细指标
- 在风险分析页面查看风险评估

## Docker 部署

使用 Docker 一键启动完整应用：

```bash
cd frontend
docker-compose up
```

这将启动：
- 前端应用 (端口 3000)
- 后端服务 (端口 5000)

## 系统要求

### 后端
- Python >= 3.8
- pip 包管理器

### 前端
- Node.js >= 14.0
- npm 或 yarn

## 功能清单

### 后端
- ✅ 数据获取模块框架
- ✅ 基础策略类定义
- ✅ 回测引擎框架
- ✅ 风险管理工具
- ✅ 可视化基础

### 前端 (已完成)
- ✅ 现代化仪表板
- ✅ 策略管理界面
- ✅ 数据查看器
- ✅ 回测结果分析
- ✅ 风险分析工具
- ✅ 文档页面
- ✅ 响应式设计
- ✅ 暗色模式支持 (可选)

## 下一步

1. **实现数据获取** - 集成 yfinance 或其他数据源
2. **实现回测引擎** - 完成订单执行和收益计算
3. **创建后端 API** - 使用 Flask/FastAPI 暴露 REST 接口
4. **添加策略示例** - 完善 MA 策略和其他示例
5. **增加单元测试** - 提高代码覆盖率
6. **性能优化** - 并行回测等优化

## 贡献指南

欢迎通过以下方式参与贡献：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 常见问题

**Q: 如何添加新的数据源？**
A: 在 `quant_tool/data/fetcher.py` 中添加新的 fetch 方法。

**Q: 如何自定义策略？**
A: 创建继承 `BaseStrategy` 的新类，实现 `calculate_signals` 方法。

**Q: 如何部署到生产环境？**
A: 
1. 使用 Gunicorn 部署后端
2. 使用 Nginx 部署前端
3. 配置数据库 (Redis 用于缓存)
4. 设置监控和日志

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

- 提交 Issue：GitHub Issues
- 讨论：GitHub Discussions
- 电子邮件：your-email@example.com

---

**最后更新**: 2024 年 1 月
**版本**: 0.1.0
