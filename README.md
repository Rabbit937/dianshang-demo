# 电商小程序

全栈电商小程序项目，支持 H5、微信小程序、App 多端运行。

## 技术栈

### 前端
- **框架**：uni-app + Vue 3 + TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia（支持持久化）
- **样式**：SCSS

### 后端
- **运行时**：Bun
- **框架**：Hono
- **ORM**：Drizzle ORM
- **数据库**：PostgreSQL
- **认证**：JWT

## 项目结构

```
dianshang-demo/
├── frontend/                 # 前端项目
│   └── src/
│       ├── pages/           # 页面组件
│       │   ├── index/        # 首页
│       │   ├── category/     # 分类页
│       │   ├── product/      # 商品详情
│       │   ├── cart/         # 购物车
│       │   ├── order/        # 订单
│       │   ├── profile/      # 个人中心
│       │   ├── login/        # 登录
│       │   └── address/      # 地址管理
│       ├── components/      # 公共组件
│       ├── stores/           # Pinia 状态管理
│       ├── api/              # API 接口
│       ├── utils/            # 工具函数
│       └── styles/           # 全局样式
├── backend/                  # 后端项目
│   └── src/
│       ├── db/               # 数据库配置和 Schema
│       ├── routes/           # 路由处理器
│       ├── middleware/       # 中间件
│       └── utils/            # 工具函数
└── docker-compose.yml       # Docker 配置
```

## 快速开始

### 1. 启动数据库服务

```bash
docker-compose up -d
```

服务地址：
- PostgreSQL：`localhost:5432`
- Redis：`localhost:6379`
- Adminer：`http://localhost:8080`

### 2. 后端开发

```bash
cd backend

bun install
bun run db:push      # 同步数据库结构
bun run dev          # 启动开发服务器 http://localhost:3000
```

### 3. 前端开发

```bash
cd frontend

bun install
bun run dev:h5           # H5 开发 http://localhost:5173
bun run dev:mp-weixin    # 微信小程序开发
bun run dev:app           # App 开发
```

## API 接口

| 路径 | 说明 |
|------|------|
| `POST /api/auth/send-code` | 发送验证码 |
| `POST /api/auth/login` | 用户登录 |
| `GET /api/auth/user-info` | 获取用户信息 |
| `GET /api/products/categories/tree` | 分类树 |
| `GET /api/products/list` | 商品列表 |
| `GET /api/products/:id` | 商品详情 |
| `GET /api/products/recommend/list` | 推荐商品 |
| `GET /api/products/hot/list` | 热门商品 |
| `GET /api/cart/list` | 购物车列表 |
| `POST /api/cart/add` | 添加购物车 |
| `PUT /api/cart/update` | 更新购物车 |
| `PUT /api/cart/select` | 选择商品 |
| `PUT /api/cart/select-all` | 全选 |
| `DELETE /api/cart/remove` | 删除商品 |
| `POST /api/orders/create` | 创建订单 |
| `GET /api/orders/list` | 订单列表 |
| `GET /api/orders/:id` | 订单详情 |
| `PUT /api/orders/:id/cancel` | 取消订单 |
| `PUT /api/orders/:id/confirm` | 确认收货 |
| `GET /api/user/addresses` | 地址列表 |
| `POST /api/user/addresses` | 添加地址 |

## 环境变量

### 后端 `.env`
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dianshang
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 数据库

PostgreSQL 数据库配置：
- 用户名：`postgres`
- 密码：`postgres`
- 数据库：`dianshang`

使用 Drizzle Studio 查看和编辑数据：
```bash
cd backend
bun run db:studio
```

## 构建

### 前端构建

```bash
cd frontend

bun run build:h5           # 构建 H5
bun run build:mp-weixin    # 构建微信小程序
bun run build:app          # 构建 App
```

## 许可证

MIT
