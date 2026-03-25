import { Hono } from 'hono';
import { db } from '../db';
import { users, addresses, favorites } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { response } from '../utils/response';
import { authMiddleware } from '../middleware/auth';

const user = new Hono();

user.use('/*', authMiddleware);

// 获取用户信息
user.get('/info', async (c) => {
  const user = c.get('user');
  
  const userInfo = await db.query.users.findFirst({
    where: eq(users.id, user.userId),
    columns: {
      password: false,
    },
  });
  
  return response.success(c, userInfo);
});

// 更新用户信息
user.put('/info', async (c) => {
  const user = c.get('user');
  const { nickname, avatar, gender, birthday, email } = await c.req.json();
  
  await db.update(users)
    .set({ nickname, avatar, gender, birthday, email })
    .where(eq(users.id, user.userId));
  
  return response.success(c, null, '更新成功');
});

// 获取收货地址列表
user.get('/addresses', async (c) => {
  const user = c.get('user');
  
  const list = await db.query.addresses.findMany({
    where: eq(addresses.userId, user.userId),
    orderBy: [desc(addresses.isDefault), desc(addresses.createdAt)],
  });
  
  return response.success(c, list);
});

// 添加收货地址
user.post('/addresses', async (c) => {
  const user = c.get('user');
  const { name, phone, province, city, district, address, tag, isDefault } = await c.req.json();
  
  if (!name || !phone || !province || !city || !district || !address) {
    return response.error(c, '请填写完整地址信息');
  }
  
  // 如果设为默认，先取消其他默认地址
  if (isDefault) {
    await db.update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, user.userId));
  }
  
  const [newAddress] = await db.insert(addresses).values({
    userId: user.userId,
    name,
    phone,
    province,
    city,
    district,
    address,
    tag,
    isDefault: isDefault || false,
  }).returning();
  
  return response.success(c, newAddress, '添加成功');
});

// 更新收货地址
user.put('/addresses/:id', async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  const { name, phone, province, city, district, address, tag, isDefault } = await c.req.json();
  
  const existing = await db.query.addresses.findFirst({
    where: and(eq(addresses.id, id), eq(addresses.userId, user.userId)),
  });
  
  if (!existing) {
    return response.error(c, '地址不存在');
  }
  
  // 如果设为默认，先取消其他默认地址
  if (isDefault) {
    await db.update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, user.userId));
  }
  
  await db.update(addresses)
    .set({ name, phone, province, city, district, address, tag, isDefault })
    .where(eq(addresses.id, id));
  
  return response.success(c, null, '更新成功');
});

// 删除收货地址
user.delete('/addresses/:id', async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  
  await db.delete(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, user.userId)));
  
  return response.success(c, null, '删除成功');
});

// 设置默认地址
user.put('/addresses/:id/default', async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  
  // 取消其他默认
  await db.update(addresses)
    .set({ isDefault: false })
    .where(eq(addresses.userId, user.userId));
  
  // 设置新的默认
  await db.update(addresses)
    .set({ isDefault: true })
    .where(and(eq(addresses.id, id), eq(addresses.userId, user.userId)));
  
  return response.success(c, null, '设置成功');
});

// 获取收藏列表
user.get('/favorites', async (c) => {
  const user = c.get('user');
  const { page = 1, pageSize = 10 } = c.req.query();
  
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);
  const offset = (pageNum - 1) * pageSizeNum;
  
  const list = await db.query.favorites.findMany({
    where: eq(favorites.userId, user.userId),
    limit: pageSizeNum,
    offset,
    orderBy: [desc(favorites.createdAt)],
    with: {
      product: {
        columns: {
          id: true,
          name: true,
          mainImage: true,
          price: true,
          originalPrice: true,
          sales: true,
          status: true,
        },
      },
    },
  });
  
  return response.success(c, list);
});

// 添加收藏
user.post('/favorites', async (c) => {
  const user = c.get('user');
  const { productId } = await c.req.json();
  
  if (!productId) {
    return response.error(c, '请选择商品');
  }
  
  // 检查是否已收藏
  const existing = await db.query.favorites.findFirst({
    where: and(eq(favorites.userId, user.userId), eq(favorites.productId, productId)),
  });
  
  if (existing) {
    return response.error(c, '已收藏该商品');
  }
  
  await db.insert(favorites).values({
    userId: user.userId,
    productId,
  });
  
  return response.success(c, null, '收藏成功');
});

// 取消收藏
user.delete('/favorites/:productId', async (c) => {
  const user = c.get('user');
  const productId = Number(c.req.param('productId'));
  
  await db.delete(favorites)
    .where(and(eq(favorites.userId, user.userId), eq(favorites.productId, productId)));
  
  return response.success(c, null, '取消收藏成功');
});

export default user;
