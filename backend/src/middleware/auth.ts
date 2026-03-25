import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function getJwtSecret(): string {
  if (!JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    return 'dev-secret-do-not-use-in-production';
  }
  return JWT_SECRET;
}

export interface JwtPayload {
  userId: number;
  phone: string;
}

// 扩展 Hono 的 Context 类型
declare module 'hono' {
  interface ContextVariableMap {
    user: JwtPayload;
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      code: 401,
      message: '未登录或登录已过期',
      data: null,
    }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({
      code: 401,
      message: '登录已过期，请重新登录',
      data: null,
    }, 401);
  }
};

// 可选认证中间件（不强制登录）
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
      c.set('user', payload);
    } catch (error) {
      // token 无效，但不阻止请求
    }
  }

  await next();
};
