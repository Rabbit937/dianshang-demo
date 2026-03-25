import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { response } from '../utils/response';

const auth = new Hono();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

// In-memory verification code store (for development only)
// In production, use Redis or a proper SMS service
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

const DEV_PHONE_CODES: Record<string, string> = {
  '13800138000': '123456',
  '13900139000': '123456',
};

// 微信登录
auth.post('/wx-login', async (c) => {
  const { code, userInfo } = await c.req.json();
  
  if (!code) {
    return response.error(c, '缺少登录凭证');
  }
  
  // TODO: 调用微信 API 获取 openid
  // 开发环境模拟：使用 code 作为模拟 openid
  const mockOpenid = `mock_openid_${code}`;
  
  let user = await db.query.users.findFirst({
    where: eq(users.openid, mockOpenid),
  });
  
  // 自动注册
  if (!user) {
    const [newUser] = await db.insert(users).values({
      openid: mockOpenid,
      nickname: userInfo?.nickName || `微信用户${Date.now().toString().slice(-6)}`,
      avatar: userInfo?.avatarUrl || '',
      gender: userInfo?.gender || 0,
    }).returning();
    user = newUser;
  } else if (userInfo) {
    // 更新用户信息
    const [updatedUser] = await db.update(users)
      .set({
        nickname: userInfo.nickName || user.nickname,
        avatar: userInfo.avatarUrl || user.avatar,
        gender: userInfo.gender ?? user.gender,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();
    user = updatedUser;
  }
  
  // 生成 token
  const secret = JWT_SECRET || 'dev-secret-do-not-use-in-production';
  const token = jwt.sign(
    { userId: user.id, openid: user.openid },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  
  return response.success(c, {
    token,
    userInfo: {
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      avatar: user.avatar,
      level: user.level,
      points: user.points,
    },
  }, '登录成功');
});

// 发送验证码
auth.post('/send-code', async (c) => {
  const { phone } = await c.req.json();

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return response.error(c, '请输入正确的手机号');
  }

  // In production, integrate with a real SMS service (e.g., Tencent, Alibaba Cloud)
  // For development, generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Store in memory (use Redis in production)
  verificationCodes.set(phone, { code, expiresAt });

  console.log(`[SMS] 验证码已发送到 ${phone}: ${code}`);

  return response.success(c, null, '验证码已发送');
});

// 绑定手机号
auth.post('/bind-phone', async (c) => {
  const user = c.get('user');
  const { phone, code } = await c.req.json();

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return response.error(c, '请输入正确的手机号');
  }

  // Check verification code
  const stored = verificationCodes.get(phone);
  if (!stored || stored.code !== code || stored.expiresAt < Date.now()) {
    return response.error(c, '验证码错误或已过期');
  }
  verificationCodes.delete(phone);

  // 检查手机号是否已被使用
  const existUser = await db.query.users.findFirst({
    where: eq(users.phone, phone),
  });

  if (existUser && existUser.id !== user.userId) {
    return response.error(c, '该手机号已被其他账号绑定');
  }

  const [updatedUser] = await db.update(users)
    .set({ phone, updatedAt: new Date() })
    .where(eq(users.id, user.userId))
    .returning();

  return response.success(c, {
    phone: updatedUser.phone,
  }, '绑定成功');
});

// 登录/注册
auth.post('/login', async (c) => {
  const { phone, code, password } = await c.req.json();

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return response.error(c, '请输入正确的手机号');
  }

  let user = await db.query.users.findFirst({
    where: eq(users.phone, phone),
  });

  // 密码登录
  if (password) {
    if (!user) {
      return response.error(c, '账号不存在');
    }

    const valid = await bcrypt.compare(password, user.password || '');
    if (!valid) {
      return response.error(c, '密码错误');
    }
  }
  // 验证码登录/注册
  else if (code) {
    // Check dev phone codes first
    if (DEV_PHONE_CODES[phone] && DEV_PHONE_CODES[phone] === code) {
      // Dev mode auto-login
    } else {
      const stored = verificationCodes.get(phone);
      if (!stored || stored.code !== code || stored.expiresAt < Date.now()) {
        return response.error(c, '验证码错误或已过期');
      }
      verificationCodes.delete(phone);
    }

    // 自动注册
    if (!user) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const [newUser] = await db.insert(users).values({
        phone,
        password: hashedPassword,
        nickname: `用户${phone.slice(-4)}`,
      }).returning();
      user = newUser;
    }
  } else {
    return response.error(c, '请输入密码或验证码');
  }

  const secret = JWT_SECRET || 'dev-secret-do-not-use-in-production';
  // 生成 token
  const token = jwt.sign(
    { userId: user.id, phone: user.phone },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return response.success(c, {
    token,
    userInfo: {
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      avatar: user.avatar,
      level: user.level,
      points: user.points,
    },
  }, '登录成功');
});

// 获取用户信息
auth.get('/user-info', async (c) => {
  const user = c.get('user');
  
  const userInfo = await db.query.users.findFirst({
    where: eq(users.id, user.userId),
    columns: {
      password: false,
    },
  });
  
  if (!userInfo) {
    return response.error(c, '用户不存在', 1, 404);
  }
  
  return response.success(c, userInfo);
});

// 修改密码
auth.post('/change-password', async (c) => {
  const user = c.get('user');
  const { oldPassword, newPassword } = await c.req.json();
  
  if (!oldPassword || !newPassword) {
    return response.error(c, '请输入旧密码和新密码');
  }
  
  const userInfo = await db.query.users.findFirst({
    where: eq(users.id, user.userId),
  });
  
  if (!userInfo) {
    return response.error(c, '用户不存在', 1, 404);
  }
  
  const valid = await bcrypt.compare(oldPassword, userInfo.password);
  if (!valid) {
    return response.error(c, '旧密码错误');
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.userId));
  
  return response.success(c, null, '密码修改成功');
});

export default auth;
