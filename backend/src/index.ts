import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import userRoutes from './routes/user';
import { authMiddleware } from './middleware/auth';

const app = new Hono();

// 中间件
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// 健康检查
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: '电商后端服务运行中',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// API 路由
app.route('/api/auth', authRoutes);
app.route('/api/products', productRoutes);
app.route('/api/cart', cartRoutes);
app.route('/api/orders', orderRoutes);
app.route('/api/user', userRoutes);

// 404 处理
app.notFound((c) => {
  return c.json({
    code: 404,
    message: '接口不存在',
    data: null,
  }, 404);
});

// 错误处理
app.onError((err, c) => {
  console.error('Server Error:', err);
  return c.json({
    code: 500,
    message: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误',
    data: null,
  }, 500);
});

// 启动服务
const port = Number(process.env.PORT) || 3000;

console.log(`
🚀 电商后端服务启动成功
📍 地址: http://localhost:${port}
📖 API 文档: http://localhost:${port}/api
🌱 环境: ${process.env.NODE_ENV || 'development'}
`);

export default {
  port,
  fetch: app.fetch,
};
