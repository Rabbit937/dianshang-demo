# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 项目概述

全栈电商小程序项目：
- **前端**：uni-app + Vue 3 + TypeScript + Vite（支持 H5、微信小程序、App）
- **后端**：Bun + Hono + Drizzle ORM + PostgreSQL
- **主题色**：红色系（#E53935）

## 常用命令

### 后端
```bash
cd backend
bun install                  # 安装依赖
docker-compose up -d        # 启动 PostgreSQL + Redis + Adminer
bun run db:push              # 同步数据库结构
bun run dev                  # 开发模式（热重载），http://localhost:3000
bun run start                # 生产模式
bun run db:studio            # 打开 Drizzle Studio
bun run db:generate          # 生成迁移文件
bun run db:migrate           # 执行迁移
```

### 前端
```bash
cd frontend
bun install                  # 安装依赖
bun run dev:h5               # H5 开发
bun run dev:mp-weixin        # 微信小程序开发
bun run dev:app              # App 开发
bun run build:h5             # 构建 H5
bun run build:mp-weixin      # 构建微信小程序
```

## 架构

### 后端结构 (`backend/src/`)
- `db/index.ts` - Drizzle ORM 数据库连接配置
- `db/schema/` - 数据库 Schema（users、categories、orders）
- `routes/` - 路由处理器（auth、products、cart、orders、user）
- `middleware/auth.ts` - JWT 认证中间件（含 `authMiddleware` 必填和 `optionalAuthMiddleware` 可选两种）
- `utils/response.ts` - 统一响应格式 `{ code, message, data }`

### 前端结构 (`frontend/src/`)
- `pages/` - 页面组件（index、category、product、cart、profile、login、address、order）
- `stores/index.ts` - Pinia 状态管理（useUserStore、useCartStore）
- `api/index.ts` - API 接口定义
- `utils/request.ts` - 请求封装，自动注入 token

### 数据库
- PostgreSQL：`localhost:5432`（用户/密码：postgres，数据库：dianshang）
- Redis：`localhost:6379`
- Adminer：`http://localhost:8080`

### API 路由
| 路径 | 说明 |
|------|------|
| `/api/auth` | 认证（send-code、login、user-info） |
| `/api/products` | 商品（categories/tree、list、:id、recommend/list、hot/list） |
| `/api/cart` | 购物车（list、add、update、select、select-all、remove） |
| `/api/orders` | 订单（create、list、:id、:id/cancel、:id/confirm） |
| `/api/user` | 用户信息、地址（list、add）、收藏 |

## 关键模式

- **认证**：JWT，token 通过 pinia-plugin-persistedstate 自动持久化
- **401 处理**：前端自动跳转到登录页
- **响应格式**：`{ code: 0, message: '', data: {} }`
- **校验**：后端使用 Zod 进行请求校验
- **CORS**：通过 `ALLOWED_ORIGINS` 环境变量配置

## 数据库表关系
- 用户 → 地址/收藏/订单/购物车 (1:N)
- 分类 → 商品 (1:N)
- 商品 → SKU (1:N)
- 订单 → 订单商品 (1:N)

## 代码风格
- 前端：`<script setup lang="ts">` 语法，SCSS 变量定义在 `src/styles/variables.scss`
- 后端：ESM 模块，统一响应格式 `{ code: 0, message: '', data: {} }`

## 环境变量

后端 `.env`：
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dianshang
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```
