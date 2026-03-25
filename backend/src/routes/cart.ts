import { Hono } from 'hono';
import { db } from '../db';
import { cartItems, products, productSkus } from '../db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { response } from '../utils/response';
import { authMiddleware } from '../middleware/auth';

const cart = new Hono();

// 所有购物车接口都需要登录
cart.use('/*', authMiddleware);

// 获取购物车列表
cart.get('/list', async (c) => {
  const user = c.get('user');
  
  const list = await db.query.cartItems.findMany({
    where: eq(cartItems.userId, user.userId),
    with: {
      product: {
        columns: {
          id: true,
          name: true,
          mainImage: true,
          price: true,
          originalPrice: true,
          stock: true,
          status: true,
        },
      },
      sku: true,
    },
    orderBy: [desc(cartItems.createdAt)],
  });
  
  // 过滤掉已下架的商品
  const validItems = list.filter(item => item.product?.status === 1);
  const invalidItems = list.filter(item => !item.product || item.product.status !== 1);
  
  // 计算总金额
  const selectedItems = validItems.filter(item => item.selected);
  const totalAmount = selectedItems.reduce((sum, item) => {
    const price = item.sku?.price || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  
  return response.success(c, {
    validItems,
    invalidItems,
    summary: {
      totalCount: validItems.length,
      selectedCount: selectedItems.length,
      totalAmount: totalAmount / 100, // 分转元
    },
  });
});

// 添加到购物车
cart.post('/add', async (c) => {
  const user = c.get('user');
  const { productId, skuId, quantity = 1 } = await c.req.json();
  
  if (!productId) {
    return response.error(c, '请选择商品');
  }
  
  // 检查商品是否存在
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
  
  if (!product || product.status !== 1) {
    return response.error(c, '商品不存在或已下架');
  }
  
  // 检查SKU
  if (skuId) {
    const sku = await db.query.productSkus.findFirst({
      where: eq(productSkus.id, skuId),
    });
    if (!sku) {
      return response.error(c, '商品规格不存在');
    }
  }
  
  // 检查是否已在购物车
  const existing = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.userId, user.userId),
      eq(cartItems.productId, productId),
      skuId ? eq(cartItems.skuId, skuId) : eq(cartItems.skuId, null)
    ),
  });
  
  if (existing) {
    // 更新数量
    await db.update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    // 新增
    await db.insert(cartItems).values({
      userId: user.userId,
      productId,
      skuId,
      quantity,
    });
  }
  
  return response.success(c, null, '添加成功');
});

// 更新购物车商品数量
cart.put('/update', async (c) => {
  const user = c.get('user');
  const { id, quantity } = await c.req.json();
  
  if (!id || quantity < 1) {
    return response.error(c, '参数错误');
  }
  
  const item = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.id, id), eq(cartItems.userId, user.userId)),
  });
  
  if (!item) {
    return response.error(c, '购物车商品不存在');
  }
  
  await db.update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, id));
  
  return response.success(c, null, '更新成功');
});

// 选择/取消选择
cart.put('/select', async (c) => {
  const user = c.get('user');
  const { ids, selected } = await c.req.json();

  if (!ids || !Array.isArray(ids)) {
    return response.error(c, '参数错误');
  }

  await db.update(cartItems)
    .set({ selected })
    .where(and(inArray(cartItems.id, ids), eq(cartItems.userId, user.userId)));

  return response.success(c, null, '更新成功');
});

// 全选/取消全选
cart.put('/select-all', async (c) => {
  const user = c.get('user');
  const { selected } = await c.req.json();
  
  await db.update(cartItems)
    .set({ selected })
    .where(eq(cartItems.userId, user.userId));
  
  return response.success(c, null, '更新成功');
});

// 删除购物车商品
cart.delete('/remove', async (c) => {
  const user = c.get('user');
  const { ids } = await c.req.json();

  if (!ids || !Array.isArray(ids)) {
    return response.error(c, '参数错误');
  }

  await db.delete(cartItems)
    .where(and(inArray(cartItems.id, ids), eq(cartItems.userId, user.userId)));

  return response.success(c, null, '删除成功');
});

export default cart;
