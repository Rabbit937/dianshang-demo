import { db } from '../db';
import { users, addresses, categories, products, productSkus, cartItems, favorites, orders, orderItems } from '../db/schema';
import { eq } from 'drizzle-orm';

// 清理所有数据
async function cleanDatabase() {
  console.log('🧹 清理现有数据...');
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(cartItems);
  await db.delete(favorites);
  await db.delete(productSkus);
  await db.delete(products);
  await db.delete(addresses);
  await db.delete(categories);
  await db.delete(users);
  console.log('✅ 清理完成');
}

// 创建用户
async function seedUsers() {
  console.log('👤 创建用户...');
  await db.insert(users).values([
    {
      phone: '13800138000',
      nickname: '测试用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      gender: 1,
      level: 1,
      points: 1000,
    },
    {
      phone: '13800138001',
      nickname: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      gender: 1,
      level: 2,
      points: 5000,
    },
    {
      phone: '13800138002',
      nickname: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      gender: 2,
      level: 3,
      points: 10000,
    },
  ]);
  console.log('✅ 用户创建完成');
}

// 创建地址
async function seedAddresses() {
  console.log('📍 创建地址...');
  await db.insert(addresses).values([
    {
      userId: 1,
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      address: '科技园南路 88 号',
      tag: '公司',
      isDefault: true,
    },
    {
      userId: 1,
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '福田区',
      address: '深南大道 1000 号',
      tag: '家',
      isDefault: false,
    },
    {
      userId: 2,
      name: '李四',
      phone: '13800138001',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      address: '建国路 88 号',
      tag: '家',
      isDefault: true,
    },
  ]);
  console.log('✅ 地址创建完成');
}

// 创建分类
async function seedCategories() {
  console.log('📂 创建分类...');
  await db.insert(categories).values([
    { id: 1, parentId: 0, name: '服装', sort: 1 },
    { id: 2, parentId: 0, name: '数码', sort: 2 },
    { id: 3, parentId: 0, name: '食品', sort: 3 },
    { id: 4, parentId: 0, name: '美妆', sort: 4 },
    { id: 5, parentId: 0, name: '家居', sort: 5 },
    // 二级分类
    { id: 11, parentId: 1, name: '男装', sort: 1 },
    { id: 12, parentId: 1, name: '女装', sort: 2 },
    { id: 13, parentId: 1, name: '童装', sort: 3 },
    { id: 21, parentId: 2, name: '手机', sort: 1 },
    { id: 22, parentId: 2, name: '电脑', sort: 2 },
    { id: 23, parentId: 2, name: '配件', sort: 3 },
  ]);
  console.log('✅ 分类创建完成');
}

// 创建商品
async function seedProducts() {
  console.log('🛍️ 创建商品...');
  await db.insert(products).values([
    // 服装 - 男装
    {
      categoryId: 11,
      name: '纯棉休闲衬衫 男款 蓝色',
      mainImage: 'https://picsum.photos/seed/shirt1/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/shirt1/400/400',
        'https://picsum.photos/seed/shirt1b/400/400',
      ]),
      description: '优质纯棉面料，舒适透气，休闲百搭',
      price: 9900, // 99元
      originalPrice: 19900,
      stock: 100,
      sales: 50,
      isRecommend: true,
      isHot: false,
      status: 1,
    },
    {
      categoryId: 11,
      name: '商务直筒西裤 男款 黑色',
      mainImage: 'https://picsum.photos/seed/pants1/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/pants1/400/400',
      ]),
      description: '修身剪裁，优质面料，适合商务场合',
      price: 19900,
      originalPrice: 39900,
      stock: 80,
      sales: 30,
      isRecommend: false,
      isHot: true,
      status: 1,
    },
    // 服装 - 女装
    {
      categoryId: 12,
      name: '蕾丝边连衣裙 女款 白色',
      mainImage: 'https://picsum.photos/seed/dress1/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/dress1/400/400',
        'https://picsum.photos/seed/dress1b/400/400',
      ]),
      description: '优雅蕾丝设计，浪漫气质，适合约会聚会',
      price: 29900,
      originalPrice: 59900,
      stock: 60,
      sales: 100,
      isRecommend: true,
      isHot: true,
      status: 1,
    },
    // 数码 - 手机
    {
      categoryId: 21,
      name: '旗舰智能手机 8GB+256GB',
      mainImage: 'https://picsum.photos/seed/phone1/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/phone1/400/400',
        'https://picsum.photos/seed/phone1b/400/400',
      ]),
      description: '最新款旗舰手机，骁龙处理器，超清摄像头',
      price: 299900,
      originalPrice: 399900,
      stock: 50,
      sales: 200,
      isRecommend: true,
      isHot: true,
      status: 1,
    },
    {
      categoryId: 21,
      name: '入门智能手机 4GB+64GB',
      mainImage: 'https://picsum.photos/seed/phone2/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/phone2/400/400',
      ]),
      description: '性价比之选，日常使用流畅，大电池续航',
      price: 89900,
      originalPrice: 129900,
      stock: 150,
      sales: 500,
      isRecommend: false,
      isHot: true,
      status: 1,
    },
    // 数码 - 电脑
    {
      categoryId: 22,
      name: '轻薄笔记本电脑 14英寸',
      mainImage: 'https://picsum.photos/seed/laptop1/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/laptop1/400/400',
        'https://picsum.photos/seed/laptop1b/400/400',
      ]),
      description: '超薄机身，强效性能，续航持久',
      price: 599900,
      originalPrice: 799900,
      stock: 30,
      sales: 80,
      isRecommend: true,
      isHot: false,
      status: 1,
    },
    // 食品
    {
      categoryId: 3,
      name: '有机新疆红枣 500g',
      mainImage: 'https://picsum.photos/seed/dates1/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/dates1/400/400',
      ]),
      description: '优质有机红枣，补血养颜，自然甜',
      price: 3500,
      originalPrice: 5000,
      stock: 500,
      sales: 1000,
      isRecommend: true,
      isHot: true,
      status: 1,
    },
    {
      categoryId: 3,
      name: '进口坚果礼盒 750g',
      mainImage: 'https://picsum.photos/seed/nuts1/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/nuts1/400/400',
        'https://picsum.photos/seed/nuts1b/400/400',
      ]),
      description: '多种坚果混合，营养健康，送礼佳品',
      price: 12800,
      originalPrice: 19800,
      stock: 200,
      sales: 300,
      isRecommend: false,
      isHot: true,
      status: 1,
    },
    // 美妆
    {
      categoryId: 4,
      name: '保湿滋养面霜 50ml',
      mainImage: 'https://picsum.photos/seed/cream1/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/cream1/400/400',
      ]),
      description: '深层保湿，滋养肌肤，适合干性肌肤',
      price: 19900,
      originalPrice: 29900,
      stock: 150,
      sales: 250,
      isRecommend: true,
      isHot: false,
      status: 1,
    },
    // 家居
    {
      categoryId: 5,
      name: '北欧风格台灯 白色',
      mainImage: 'https://picsum.photos/seed/lamp1/400/400',
      images: JSON.stringify([
        'https://picsum.photos/seed/lamp1/400/400',
        'https://picsum.photos/seed/lamp1b/400/400',
      ]),
      description: '简约设计，温馨灯光，营造舒适氛围',
      price: 15900,
      originalPrice: 25900,
      stock: 80,
      sales: 120,
      isRecommend: true,
      isHot: false,
      status: 1,
    },
  ]);
  console.log('✅ 商品创建完成');
}

// 创建商品 SKU
async function seedProductSkus() {
  console.log('📦 创建商品 SKU...');
  await db.insert(productSkus).values([
    // 衬衫的 SKU
    { productId: 1, specs: JSON.stringify({ '颜色': '蓝色', '尺码': 'S' }), price: 9900, stock: 20 },
    { productId: 1, specs: JSON.stringify({ '颜色': '蓝色', '尺码': 'M' }), price: 9900, stock: 30 },
    { productId: 1, specs: JSON.stringify({ '颜色': '蓝色', '尺码': 'L' }), price: 9900, stock: 25 },
    { productId: 1, specs: JSON.stringify({ '颜色': '蓝色', '尺码': 'XL' }), price: 9900, stock: 25 },
    { productId: 1, specs: JSON.stringify({ '颜色': '白色', '尺码': 'M' }), price: 9900, stock: 15 },
    { productId: 1, specs: JSON.stringify({ '颜色': '白色', '尺码': 'L' }), price: 9900, stock: 10 },
    // 手机 SKU
    { productId: 4, specs: JSON.stringify({ '颜色': '黑色', '内存': '8GB+128GB' }), price: 279900, stock: 20 },
    { productId: 4, specs: JSON.stringify({ '颜色': '黑色', '内存': '8GB+256GB' }), price: 299900, stock: 15 },
    { productId: 4, specs: JSON.stringify({ '颜色': '白色', '内存': '8GB+128GB' }), price: 279900, stock: 10 },
    { productId: 4, specs: JSON.stringify({ '颜色': '白色', '内存': '8GB+256GB' }), price: 299900, stock: 5 },
    // 连衣裙 SKU
    { productId: 3, specs: JSON.stringify({ '颜色': '白色', '尺码': 'S' }), price: 29900, stock: 15 },
    { productId: 3, specs: JSON.stringify({ '颜色': '白色', '尺码': 'M' }), price: 29900, stock: 20 },
    { productId: 3, specs: JSON.stringify({ '颜色': '白色', '尺码': 'L' }), price: 29900, stock: 15 },
    { productId: 3, specs: JSON.stringify({ '颜色': '粉色', '尺码': 'M' }), price: 29900, stock: 10 },
  ]);
  console.log('✅ SKU 创建完成');
}

// 创建收藏
async function seedFavorites() {
  console.log('❤️ 创建收藏...');
  await db.insert(favorites).values([
    { userId: 1, productId: 1 },
    { userId: 1, productId: 4 },
    { userId: 1, productId: 7 },
    { userId: 2, productId: 3 },
    { userId: 2, productId: 6 },
  ]);
  console.log('✅ 收藏创建完成');
}

// 创建购物车
async function seedCartItems() {
  console.log('🛒 创建购物车数据...');
  await db.insert(cartItems).values([
    { userId: 1, productId: 1, skuId: 2, quantity: 2, selected: true },
    { userId: 1, productId: 4, skuId: 7, quantity: 1, selected: true },
    { userId: 1, productId: 7, quantity: 3, selected: false },
    { userId: 2, productId: 3, skuId: 11, quantity: 1, selected: true },
  ]);
  console.log('✅ 购物车创建完成');
}

// 创建订单
async function seedOrders() {
  console.log('📋 创建订单...');

  // 订单 1 - 待付款
  const orderNo1 = `DD${Date.now()}001`;
  await db.insert(orders).values({
    orderNo: orderNo1,
    userId: 1,
    receiverName: '张三',
    receiverPhone: '13800138000',
    receiverProvince: '广东省',
    receiverCity: '深圳市',
    receiverDistrict: '南山区',
    receiverAddress: '科技园南路 88 号',
    totalAmount: 29800,
    payAmount: 29800,
    status: 0,
    buyerNote: '请尽快发货',
  });

  // 获取刚插入的订单 ID
  const [order1] = await db.select().from(orders).where(eq(orders.orderNo, orderNo1));

  await db.insert(orderItems).values([
    {
      orderId: order1.id,
      productId: 1,
      skuId: 2,
      productName: '纯棉休闲衬衫 男款 蓝色',
      productImage: 'https://picsum.photos/seed/shirt1/400/400',
      skuSpecs: JSON.stringify({ '颜色': '蓝色', '尺码': 'M' }),
      price: 9900,
      quantity: 2,
      totalAmount: 19800,
    },
    {
      orderId: order1.id,
      productId: 7,
      productName: '有机新疆红枣 500g',
      productImage: 'https://picsum.photos/seed/dates1/400/400',
      price: 3500,
      quantity: 2,
      totalAmount: 7000,
    },
    {
      orderId: order1.id,
      productId: 3,
      skuId: 11,
      productName: '蕾丝边连衣裙 女款 白色',
      productImage: 'https://picsum.photos/seed/dress1/400/400',
      skuSpecs: JSON.stringify({ '颜色': '白色', '尺码': 'M' }),
      price: 29900,
      quantity: 1,
      totalAmount: 29900,
    },
  ]);

  // 订单 2 - 待发货
  const orderNo2 = `DD${Date.now()}002`;
  await db.insert(orders).values({
    orderNo: orderNo2,
    userId: 1,
    receiverName: '张三',
    receiverPhone: '13800138000',
    receiverProvince: '广东省',
    receiverCity: '深圳市',
    receiverDistrict: '南山区',
    receiverAddress: '科技园南路 88 号',
    totalAmount: 299900,
    payAmount: 299900,
    status: 1,
    buyerNote: '',
  });

  const [order2] = await db.select().from(orders).where(eq(orders.orderNo, orderNo2));

  await db.insert(orderItems).values([
    {
      orderId: order2.id,
      productId: 4,
      skuId: 7,
      productName: '旗舰智能手机 8GB+256GB',
      productImage: 'https://picsum.photos/seed/phone1/400/400',
      skuSpecs: JSON.stringify({ '颜色': '黑色', '内存': '8GB+128GB' }),
      price: 279900,
      quantity: 1,
      totalAmount: 279900,
    },
    {
      orderId: order2.id,
      productId: 8,
      productName: '进口坚果礼盒 750g',
      productImage: 'https://picsum.photos/seed/nuts1/400/400',
      price: 12800,
      quantity: 2,
      totalAmount: 25600,
    },
  ]);

  // 订单 3 - 待收货
  const orderNo3 = `DD${Date.now()}003`;
  await db.insert(orders).values({
    orderNo: orderNo3,
    userId: 1,
    receiverName: '张三',
    receiverPhone: '13800138000',
    receiverProvince: '广东省',
    receiverCity: '深圳市',
    receiverDistrict: '福田区',
    receiverAddress: '深南大道 1000 号',
    totalAmount: 599900,
    payAmount: 599900,
    status: 2,
    buyerNote: '轻拿轻放',
  });

  const [order3] = await db.select().from(orders).where(eq(orders.orderNo, orderNo3));

  await db.insert(orderItems).values([
    {
      orderId: order3.id,
      productId: 6,
      productName: '轻薄笔记本电脑 14英寸',
      productImage: 'https://picsum.photos/seed/laptop1/400/400',
      price: 599900,
      quantity: 1,
      totalAmount: 599900,
    },
  ]);

  // 订单 4 - 已完成
  const orderNo4 = `DD${Date.now()}004`;
  await db.insert(orders).values({
    orderNo: orderNo4,
    userId: 1,
    receiverName: '张三',
    receiverPhone: '13800138000',
    receiverProvince: '广东省',
    receiverCity: '深圳市',
    receiverDistrict: '南山区',
    receiverAddress: '科技园南路 88 号',
    totalAmount: 19900,
    payAmount: 19900,
    status: 4,
    buyerNote: '',
    receiveTime: new Date(),
  });

  const [order4] = await db.select().from(orders).where(eq(orders.orderNo, orderNo4));

  await db.insert(orderItems).values([
    {
      orderId: order4.id,
      productId: 9,
      productName: '保湿滋养面霜 50ml',
      productImage: 'https://picsum.photos/seed/cream1/400/400',
      price: 19900,
      quantity: 1,
      totalAmount: 19900,
    },
  ]);

  // 订单 5 - 已取消
  const orderNo5 = `DD${Date.now()}005`;
  await db.insert(orders).values({
    orderNo: orderNo5,
    userId: 1,
    receiverName: '张三',
    receiverPhone: '13800138000',
    receiverProvince: '广东省',
    receiverCity: '深圳市',
    receiverDistrict: '南山区',
    receiverAddress: '科技园南路 88 号',
    totalAmount: 15900,
    payAmount: 0,
    status: 5,
    buyerNote: '不想要了',
  });

  const [order5] = await db.select().from(orders).where(eq(orders.orderNo, orderNo5));

  await db.insert(orderItems).values([
    {
      orderId: order5.id,
      productId: 10,
      productName: '北欧风格台灯 白色',
      productImage: 'https://picsum.photos/seed/lamp1/400/400',
      price: 15900,
      quantity: 1,
      totalAmount: 15900,
    },
  ]);

  console.log('✅ 订单创建完成');
}

// 主函数
async function main() {
  try {
    console.log('🚀 开始生成测试数据...\n');
    await cleanDatabase();
    await seedUsers();
    await seedAddresses();
    await seedCategories();
    await seedProducts();
    await seedProductSkus();
    await seedFavorites();
    await seedCartItems();
    await seedOrders();
    console.log('\n🎉 测试数据生成完成！');
  } catch (error) {
    console.error('❌ 生成数据失败:', error);
    process.exit(1);
  }
}

main();
