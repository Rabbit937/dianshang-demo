import { pgTable, serial, varchar, integer, timestamp, boolean, text, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 用户表
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  openid: varchar('openid', { length: 100 }).unique(),
  phone: varchar('phone', { length: 20 }).unique(),
  password: varchar('password', { length: 100 }),
  nickname: varchar('nickname', { length: 50 }),
  avatar: varchar('avatar', { length: 500 }),
  gender: integer('gender').default(0), // 0: 未知, 1: 男, 2: 女
  level: integer('level').default(0),
  points: integer('points').default(0),
  birthday: varchar('birthday', { length: 20 }),
  email: varchar('email', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 收货地址表
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  province: varchar('province', { length: 50 }).notNull(),
  city: varchar('city', { length: 50 }).notNull(),
  district: varchar('district', { length: 50 }).notNull(),
  address: varchar('address', { length: 200 }).notNull(),
  tag: varchar('tag', { length: 20 }), // 标签：家、公司、学校
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 用户收藏表
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 商品分类表
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id').default(0),
  name: varchar('name', { length: 50 }).notNull(),
  icon: varchar('icon', { length: 500 }),
  sort: integer('sort').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 商品表
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id),
  name: varchar('name', { length: 200 }).notNull(),
  mainImage: varchar('main_image', { length: 500 }),
  images: jsonb('images').$type<string[]>(), // 多图
  description: text('description'),
  price: integer('price').notNull(), // 价格，单位：分
  originalPrice: integer('original_price'), // 原价，单位：分
  stock: integer('stock').default(0),
  sales: integer('sales').default(0), // 销量
  isRecommend: boolean('is_recommend').default(false),
  isHot: boolean('is_hot').default(false),
  status: integer('status').default(1), // 1: 上架, 0: 下架
  createdAt: timestamp('created_at').defaultNow(),
});

// 商品 SKU 表
export const productSkus = pgTable('product_skus', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  specs: jsonb('specs').$type<Record<string, string>>(), // 规格属性 { "颜色": "红色", "尺码": "M" }
  price: integer('price').notNull(), // 价格，单位：分
  originalPrice: integer('original_price'), // 原价，单位：分
  stock: integer('stock').default(0),
});

// 购物车表
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  skuId: integer('sku_id').references(() => productSkus.id),
  quantity: integer('quantity').default(1),
  selected: boolean('selected').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 订单表
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNo: varchar('order_no', { length: 50 }).unique().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  receiverName: varchar('receiver_name', { length: 50 }).notNull(),
  receiverPhone: varchar('receiver_phone', { length: 20 }).notNull(),
  receiverProvince: varchar('receiver_province', { length: 50 }).notNull(),
  receiverCity: varchar('receiver_city', { length: 50 }).notNull(),
  receiverDistrict: varchar('receiver_district', { length: 50 }).notNull(),
  receiverAddress: varchar('receiver_address', { length: 200 }).notNull(),
  totalAmount: integer('total_amount').notNull(), // 总金额，单位：分
  payAmount: integer('pay_amount').notNull(), // 实付金额，单位：分
  status: integer('status').default(0), // 0: 待付款, 1: 待发货, 2: 待收货, 3: 待评价, 4: 已完成, 5: 已取消
  buyerNote: varchar('buyer_note', { length: 200 }), // 买家备注
  receiveTime: timestamp('receive_time'), // 收货时间
  createdAt: timestamp('created_at').defaultNow(),
});

// 订单商品表
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  skuId: integer('sku_id').references(() => productSkus.id),
  productName: varchar('product_name', { length: 200 }).notNull(),
  productImage: varchar('product_image', { length: 500 }),
  skuSpecs: jsonb('sku_specs').$type<Record<string, string>>(), // 购买时的规格
  price: integer('price').notNull(), // 单价，单位：分
  quantity: integer('quantity').notNull(),
  totalAmount: integer('total_amount').notNull(), // 小计，单位：分
});

// ============ 关系定义 ============

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  favorites: many(favorites),
  cartItems: many(cartItems),
  orders: many(orders),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  skus: many(productSkus),
  cartItems: many(cartItems),
  favorites: many(favorites),
  orderItems: many(orderItems),
}));

export const productSkusRelations = relations(productSkus, ({ one, many }) => ({
  product: one(products, {
    fields: [productSkus.productId],
    references: [products.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  sku: one(productSkus, {
    fields: [cartItems.skuId],
    references: [productSkus.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  sku: one(productSkus, {
    fields: [orderItems.skuId],
    references: [productSkus.id],
  }),
}));
