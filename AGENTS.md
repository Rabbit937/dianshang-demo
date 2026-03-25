# 电商小程序项目 - AGENTS.md

## 项目概述

这是一个完整的电商小程序项目，包含前端、后端和高保真设计图三部分。

- **项目类型**: 全栈电商应用
- **主题色**: 红色系 (`#E53935`)
- **前端框架**: uni-app + Vue 3 + TypeScript + Vite
- **后端框架**: Bun + Hono + Drizzle ORM + PostgreSQL
- **设计风格**: 现代扁平化、卡片式布局、渐变效果

---

## 目录结构

```
dianshang-demo/
├── backend/                    # 后端服务 (Bun + Hono)
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts        # 数据库连接配置
│   │   │   └── schema/         # Drizzle ORM Schema
│   │   │       ├── users.ts    # 用户、地址、收藏
│   │   │       ├── categories.ts # 分类、商品、SKU
│   │   │       └── orders.ts   # 购物车、订单
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT 认证中间件
│   │   ├── routes/
│   │   │   ├── auth.ts         # 认证路由
│   │   │   ├── products.ts     # 商品路由
│   │   │   ├── cart.ts         # 购物车路由
│   │   │   ├── orders.ts       # 订单路由
│   │   │   └── user.ts         # 用户路由
│   │   ├── utils/
│   │   │   └── response.ts     # 统一响应格式
│   │   └── index.ts            # 入口文件
│   ├── docker-compose.yml      # Docker 配置 (PostgreSQL + Redis)
│   ├── drizzle.config.ts       # Drizzle 配置
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                    # 环境变量
│
├── frontend/                   # 前端应用 (uni-app + Vue 3)
│   ├── src/
│   │   ├── api/
│   │   │   └── index.ts        # API 接口定义
│   │   ├── components/
│   │   │   └── CustomTabBar.vue # 自定义底部导航栏
│   │   ├── pages/
│   │   │   ├── index/          # 首页
│   │   │   ├── category/       # 分类页
│   │   │   ├── product/        # 商品列表、详情
│   │   │   ├── cart/           # 购物车
│   │   │   ├── profile/        # 个人中心
│   │   │   ├── login/          # 登录
│   │   │   ├── address/        # 地址管理
│   │   │   └── order/          # 订单管理
│   │   ├── stores/
│   │   │   └── index.ts        # Pinia 状态管理
│   │   ├── styles/
│   │   │   └── variables.scss  # SCSS 变量和混入
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript 类型定义
│   │   ├── utils/
│   │   │   └── request.ts      # 请求封装
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── manifest.json       # uni-app 配置
│   │   └── pages.json          # 页面路由配置
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── pages/                      # 高保真设计图 (HTML)
│   ├── index.html              # 首页
│   ├── category.html           # 分类页
│   ├── product-list.html       # 商品列表
│   ├── product-detail.html     # 商品详情
│   ├── cart.html               # 购物车
│   └── profile.html            # 个人中心
│
├── styles/                     # 设计图公共样式
│   └── common.css
│
└── *.jpg                       # 设计图截图
```

---

## 快速开始

### 1. 启动数据库

```bash
cd backend
docker-compose up -d
```

服务说明:
- PostgreSQL: `localhost:5432` (用户: postgres, 密码: postgres, 数据库: dianshang)
- Redis: `localhost:6379`
- Adminer: `http://localhost:8080`

### 2. 启动后端

```bash
cd backend
bun install
bun run db:push    # 同步数据库表结构
bun run dev        # 启动开发服务器
```

后端服务: `http://localhost:3000`

### 3. 启动前端

```bash
cd frontend
bun install
bun run dev:h5        # H5 开发模式
bun run dev:mp-weixin # 微信小程序开发模式
```

---

## API 接口

### 认证模块 `/api/auth`
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/send-code` | 发送验证码 |
| POST | `/login` | 登录/注册 |
| GET | `/user-info` | 获取用户信息 |

### 商品模块 `/api/products`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/categories/tree` | 获取分类树 |
| GET | `/list` | 商品列表 |
| GET | `/:id` | 商品详情 |
| GET | `/recommend/list` | 推荐商品 |
| GET | `/hot/list` | 热门商品 |

### 购物车模块 `/api/cart`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/list` | 购物车列表 |
| POST | `/add` | 加入购物车 |
| POST | `/update` | 更新数量 |
| POST | `/select` | 选择商品 |
| POST | `/select-all` | 全选/取消全选 |
| POST | `/remove` | 删除商品 |

### 订单模块 `/api/orders`
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/create` | 创建订单 |
| GET | `/list` | 订单列表 |
| GET | `/:id` | 订单详情 |
| POST | `/:id/cancel` | 取消订单 |
| POST | `/:id/confirm` | 确认收货 |

### 用户模块 `/api/user`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/info` | 用户信息 |
| GET | `/addresses` | 地址列表 |
| POST | `/addresses` | 添加地址 |
| GET | `/favorites` | 收藏列表 |
| POST | `/favorites` | 添加收藏 |

---

## 数据库设计

### 核心表

| 表名 | 说明 |
|------|------|
| `users` | 用户表 |
| `addresses` | 收货地址 |
| `favorites` | 用户收藏 |
| `categories` | 商品分类 |
| `products` | 商品 |
| `product_skus` | 商品 SKU |
| `cart_items` | 购物车 |
| `orders` | 订单 |
| `order_items` | 订单商品 |

### 关系
- 用户 → 地址 (1:N)
- 用户 → 收藏 (1:N)
- 用户 → 订单 (1:N)
- 用户 → 购物车 (1:N)
- 分类 → 商品 (1:N)
- 商品 → SKU (1:N)
- 订单 → 订单商品 (1:N)

---

## 开发约定

### 代码风格

**前端 (Vue 3 + TypeScript)**
- 使用 `<script setup lang="ts">` 语法
- 组件命名: PascalCase (如 `CustomTabBar.vue`)
- 样式使用 SCSS，变量定义在 `variables.scss`
- API 统一在 `api/index.ts` 中定义

**后端 (Bun + Hono)**
- 使用 ESM 模块
- 统一响应格式: `{ code: 0, message: '', data: {} }`
- 错误处理使用全局错误中间件
- 数据库操作使用 Drizzle ORM

### 主题色系

```scss
$primary-color: #E53935;   // 主色
$primary-light: #FF6B6B;   // 浅色
$primary-dark: #C62828;    // 深色
```

### 状态管理

使用 Pinia，包含两个主要 Store:

**useUserStore**
- `token`: 用户令牌
- `userInfo`: 用户信息
- `isLoggedIn`: 登录状态

**useCartStore**
- `cartItems`: 购物车商品
- `totalCount`: 商品总数
- `totalAmount`: 总金额

---

## 构建命令

### 后端
```bash
bun run dev          # 开发模式 (热重载)
bun run start        # 生产模式
bun run db:generate  # 生成迁移
bun run db:migrate   # 执行迁移
bun run db:push      # 同步表结构
bun run db:studio    # 打开 Drizzle Studio
```

### 前端
```bash
bun run dev:h5           # H5 开发
bun run dev:mp-weixin    # 微信小程序开发
bun run dev:app          # App 开发
bun run build:h5         # 构建 H5
bun run build:mp-weixin  # 构建微信小程序
bun run build:app        # 构建 App
```

---

## 环境变量

### 后端 `.env`
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dianshang
JWT_SECRET=your-super-secret-key
PORT=3000
NODE_ENV=development
```

---

## 注意事项

1. **数据库**: 首次运行需要先启动 Docker 容器，再执行 `bun run db:push`
2. **跨域**: 后端已配置 CORS，开发环境允许所有来源
3. **认证**: 使用 JWT，token 存储在本地并自动持久化
4. **请求**: 前端请求自动携带 token，401 状态会跳转登录页
5. **主题**: 红色系主题，所有页面需保持一致
