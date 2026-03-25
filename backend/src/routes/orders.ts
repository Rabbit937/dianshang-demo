import { Hono } from 'hono';
import { db } from '../db';
import { orders, orderItems, cartItems, products, productSkus, addresses } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { response } from '../utils/response';
import { authMiddleware } from '../middleware/auth';

const order = new Hono();

order.use('/*', authMiddleware);

// 创建订单
order.post('/create', async (c) => {
  const user = c.get('user');
  const { addressId, cartItemIds, buyerNote } = await c.req.json();
  
  if (!addressId) {
    return response.error(c, '请选择收货地址');
  }
  
  if (!cartItemIds || cartItemIds.length === 0) {
    return response.error(c, '请选择商品');
  }
  
  // 获取收货地址
  const address = await db.query.addresses.findFirst({
    where: and(eq(addresses.id, addressId), eq(addresses.userId, user.userId)),
  });
  
  if (!address) {
    return response.error(c, '收货地址不存在');
  }
  
  // 获取购物车商品
  const items = await db.query.cartItems.findMany({
    where: and(
      eq(cartItems.userId, user.userId),
      eq(cartItems.selected, true)
    ),
    with: {
      product: true,
      sku: true,
    },
  });
  
  if (items.length === 0) {
    return response.error(c, '请选择商品');
  }
  
  // 计算总金额
  let totalAmount = 0;
  const orderItemsData: any[] = [];
  
  for (const item of items) {
    if (!item.product || item.product.status !== 1) {
      return response.error(c, `商品 ${item.product?.name || '未知'} 已下架`);
    }
    
    const price = item.sku?.price || item.product.price;
    totalAmount += price * item.quantity;
    
    orderItemsData.push({
      productId: item.productId,
      skuId: item.skuId,
      productName: item.product.name,
      productImage: item.product.mainImage,
      skuSpecs: item.sku?.specs ? JSON.stringify(item.sku.specs) : null,
      price,
      quantity: item.quantity,
      totalAmount: price * item.quantity,
    });
  }
  
  // 生成订单号
  const orderNo = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  
  // 创建订单
  const [newOrder] = await db.insert(orders).values({
    orderNo,
    userId: user.userId,
    receiverName: address.name,
    receiverPhone: address.phone,
    receiverProvince: address.province,
    receiverCity: address.city,
    receiverDistrict: address.district,
    receiverAddress: address.address,
    totalAmount,
    payAmount: totalAmount, // 暂无优惠
    buyerNote,
  }).returning();
  
  // 创建订单商品（批量插入）
  await db.insert(orderItems).values(
    orderItemsData.map(itemData => ({
      orderId: newOrder.id,
      ...itemData,
    }))
  );
  
  // 清除购物车已下单商品
  await db.delete(cartItems)
    .where(and(eq(cartItems.userId, user.userId), eq(cartItems.selected, true)));
  
  return response.success(c, {
    orderId: newOrder.id,
    orderNo: newOrder.orderNo,
    payAmount: newOrder.payAmount / 100,
  }, '订单创建成功');
});

// 获取订单列表
order.get('/list', async (c) => {
  const user = c.get('user');
  const { status, page = 1, pageSize = 10 } = c.req.query();
  
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);
  const offset = (pageNum - 1) * pageSizeNum;
  
  const conditions = [eq(orders.userId, user.userId)];
  
  if (status !== undefined && status !== '') {
    conditions.push(eq(orders.status, Number(status)));
  }
  
  const list = await db.query.orders.findMany({
    where: and(...conditions),
    limit: pageSizeNum,
    offset,
    orderBy: [desc(orders.createdAt)],
    with: {
      items: true,
    },
  });
  
  return response.success(c, list);
});

// 获取订单详情
order.get('/:id', async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  
  const orderInfo = await db.query.orders.findFirst({
    where: and(eq(orders.id, id), eq(orders.userId, user.userId)),
    with: {
      items: true,
    },
  });
  
  if (!orderInfo) {
    return response.error(c, '订单不存在', 1, 404);
  }
  
  return response.success(c, orderInfo);
});

// 取消订单
order.post('/:id/cancel', async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  
  const orderInfo = await db.query.orders.findFirst({
    where: and(eq(orders.id, id), eq(orders.userId, user.userId)),
  });
  
  if (!orderInfo) {
    return response.error(c, '订单不存在', 1, 404);
  }
  
  if (orderInfo.status !== 0) {
    return response.error(c, '只能取消待付款订单');
  }
  
  await db.update(orders)
    .set({ status: 4 })
    .where(eq(orders.id, id));
  
  return response.success(c, null, '订单已取消');
});

// 确认收货
order.post('/:id/confirm', async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  
  const orderInfo = await db.query.orders.findFirst({
    where: and(eq(orders.id, id), eq(orders.userId, user.userId)),
  });
  
  if (!orderInfo) {
    return response.error(c, '订单不存在', 1, 404);
  }
  
  if (orderInfo.status !== 2) {
    return response.error(c, '只能确认待收货订单');
  }
  
  await db.update(orders)
    .set({ 
      status: 3,
      receiveTime: new Date(),
    })
    .where(eq(orders.id, id));
  
  return response.success(c, null, '已确认收货');
});

export default order;
