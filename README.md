# Titan Timeline Diff Reports

这是一个用于查看和对比泰坦时光服（Titan Timeline）物品数据差异的工具集合。

## 项目概述

本项目包含泰坦时光服（魔兽世界的一个时间线服务器）的物品数据差异报告查看器，可以对比不同游戏版本间的物品变化。

## 文件说明

- `compare-viewer.html` - 交互式的物品数据差异查看器
- `itemsparse_3.80.0.65301_to_3.80.0.65586.zhCN.json` - 版本 3.80.0.65301 到 3.80.0.65586 的物品数据差异

## 功能特性

- 对比不同版本间的物品数据差异
- 支持筛选：新增、修改、删除的物品
- 支持按ID或名称搜索
- 分页显示大量数据
- CSV导出功能
- 详细的字段变更对比
- 中文界面支持

## 绑定类型说明

- `0`: 不绑定 (可交易)
- `1`: 拾取绑定 (BoP - Bind on Pickup)
- `2`: 装备绑定 (BoE - Bind on Equip)
- `3`: 使用绑定 (BoU - Bind on Use)
- `4`: 任务物品

## 部署到 GitHub Pages

### 方法 1: 直接克隆部署

1. Fork 此仓库到你的 GitHub 账户
2. 在仓库设置中启用 GitHub Pages
3. 选择源为 "Deploy from a branch" -> "main" -> "/ (root)"

### 方法 2: 本地部署

1. 下载所有文件
2. 在本地启动 HTTP 服务器
3. 通过浏览器访问

```bash
# 使用 Python 3
python -m http.server 8000

# 或使用 Node.js 的 http-server
npx http-server

# 或使用 PHP
php -S localhost:8000
```

## 数据格式

JSON 文件采用以下格式：

```json
{
  "fromVersion": "源版本号",
  "toVersion": "目标版本号",
  "locale": "zhCN",
  "summary": {
    "added": 数量,
    "modified": 数量,
    "deleted": 数量,
    "total": 总数
  },
  "details": {
    "added": [...],
    "modified": [...],
    "deleted": [...]
  }
}
```

## 使用场景

- 追踪泰坦时光服的物品数据变化
- 分析装备属性调整
- 观察游戏平衡性改动
- 研究绑定类型变更（如装备后绑定改为拾取后绑定）

## 许可证

MIT License