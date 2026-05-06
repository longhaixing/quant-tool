# Quant Tool Frontend

现代化的 React 前端应用，为量化交易框架提供可视化用户界面。

## 功能特性

- 📊 **仪表板** - 实时投资组合监控和性能展示
- 🎯 **策略管理** - 创建、编辑和管理交易策略
- 📈 **数据查看** - 查看历史价格数据和技术指标
- 🔍 **回测结果** - 详细的策略性能分析
- ⚠️ **风险分析** - 综合的风险评估和监控
- 📚 **文档** - 框架使用文档和示例

## 技术栈

- **React 18** - 用户界面框架
- **React Router** - 页面路由
- **Tailwind CSS** - 样式和主题
- **Recharts** - 数据可视化
- **Lucide React** - 图标库
- **Vite** - 构建工具

## 安装和运行

### 前置要求

- Node.js >= 14.0
- npm 或 yarn

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式运行

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 生产构建

```bash
npm run build
```

构建输出在 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
frontend/
├── public/
│   └── index.html          # HTML 入口
├── src/
│   ├── components/         # 可复用组件
│   │   ├── Header.jsx      # 顶部导航栏
│   │   ├── Sidebar.jsx     # 侧边栏导航
│   │   ├── StatCard.jsx    # 统计卡片
│   │   └── ChartCard.jsx   # 图表卡片
│   ├── pages/              # 页面组件
│   │   ├── Dashboard.jsx   # 仪表板
│   │   ├── StrategyManagement.jsx
│   │   ├── DataViewer.jsx
│   │   ├── BacktestResults.jsx
│   │   ├── RiskAnalysis.jsx
│   │   └── Documentation.jsx
│   ├── App.jsx             # 主应用组件
│   ├── index.jsx           # 入口点
│   └── index.css           # 全局样式
├── package.json
├── vite.config.js          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
├── postcss.config.js       # PostCSS 配置
└── README.md
```

## 主要页面说明

### 仪表板 (Dashboard)
- 显示投资组合的关键指标
- 实时性能对比图表
- 风险分布饼图
- 最近交易记录表

### 策略管理 (Strategy Management)
- 浏览所有策略
- 创建新策略表单
- 启动/暂停策略
- 编辑和删除策略
- 查看策略性能指标

### 数据查看 (Data Viewer)
- 条件查询市场数据
- OHLCV 数据表展示
- 数据导出功能
- 分页浏览

### 回测结果 (Backtest Results)
- 详细的性能指标统计
- 按月份收益对比柱状图
- 关键风险指标展示
- 交易记录详表

### 风险分析 (Risk Analysis)
- 回撤分析图表
- 风险-收益散点图
- VaR 等风险指标
- 资产相关性矩阵
- 实时风险警告

### 文档 (Documentation)
- 快速开始指南
- API 使用文档
- 示例代码
- 常见问题

## API 接口配置

默认 API 代理配置在 `vite.config.js` 中：

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

修改 `target` 以连接到你的后端 API 服务。

## 功能开发 Tips

### 添加新页面

1. 在 `src/pages/` 中创建新组件
2. 在 `src/App.jsx` 中添加路由
3. 在 `src/components/Sidebar.jsx` 中添加菜单项

### 添加新组件

将可复用的组件放在 `src/components/` 目录。

### 样式指南

- 使用 Tailwind CSS 类名
- 颜色方案：
  - 主色 (Primary): Blue (#3b82f6)
  - 成功 (Success): Green (#10B981)
  - 警告 (Warning): Orange (#F59E0B)
  - 错误 (Danger): Red (#EF4444)

## 与后端集成

前端通过 REST API 与后端通信。示例：

```javascript
// 获取策略列表
fetch('/api/strategies')
  .then(res => res.json())
  .then(data => console.log(data))
```

## 构建和部署

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### 静态文件部署

将 `dist/` 目录部署到任何静态文件服务器（如 Nginx）。

## 常见问题

**Q: 如何修改主题颜色？**
A: 编辑 `tailwind.config.js` 中的 `theme.extend.colors` 部分。

**Q: 如何添加更多图表类型？**
A: Recharts 支持多种图表类型，详见 [Recharts 文档](https://recharts.org/)。

**Q: 如何处理响应式设计？**
A: 使用 Tailwind 的响应式前缀（`md:`, `lg:` 等）。

## 许可证

MIT License

## 贡献

欢迎提交 Pull Request 和 Issue！
