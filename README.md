# 测试场景管理

基于 trip-activity-app 设计的测试场景管理应用，用于管理 MaaS 相关测试场景。

## 场景分类

- **公共交通信息服务**：公交、地铁等公共交通信息相关场景
- **动态交通信息服务**：路况、拥堵、施工等动态交通信息场景
- **感知辅助服务**：感知、辅助决策相关场景

## 场景字段

| 字段     | 说明                             |
|----------|----------------------------------|
| 场景名   | 场景名称                         |
| 服务分类 | 上述三大分类之一                 |
| 触发时间 | 日期 + 时间（可选）               |
| 触发地点 | 场景触发位置                     |
| 备注     | 场景说明、测试要点等             |
| 图片     | 支持多张图片                     |

## 功能

- 首页：今日场景、即将触发的场景
- 场景列表：按分类筛选、编辑、删除
- 新建/编辑：完整表单，支持图片上传
- 详情：查看场景完整信息
- 设置：导出/导入 JSON 备份

## 技术栈

- React 18 + Vite 5
- react-router-dom v6
- localStorage 存储
- PWA 支持（可选）

## 启动

```bash
cd frontend
npm install
npm run dev
```

浏览器访问 http://localhost:5175

## 构建

```bash
cd frontend
npm run build
```

静态文件输出到 `frontend/dist`。

## 项目结构

```
test-scenario-app/
├── frontend/
│   ├── src/
│   │   ├── components/    # DateSelect, TimeSelect
│   │   ├── pages/         # Dashboard, ScenarioList, ScenarioForm, ScenarioDetail, Settings
│   │   ├── utils/         # storage, uuid, image, constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/                   # 构建产物（若使用 build:pages）
└── README.md
```
