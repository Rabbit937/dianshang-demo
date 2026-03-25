import { Hono } from 'hono';
import { db } from '../db';
import { products, categories, productSkus } from '../db/schema';
import { eq, like, desc, asc, and, sql } from 'drizzle-orm';
import { response } from '../utils/response';

const productRoutes = new Hono();

// 获取分类列表
productRoutes.get('/categories', async (c) => {
  const { parentId } = c.req.query();
  
  const list = await db.query.categories.findMany({
    where: parentId ? eq(categories.parentId, Number(parentId)) : eq(categories.parentId, 0),
    orderBy: [desc(categories.sort)],
  });
  
  return response.success(c, list);
});

// 获取分类树
productRoutes.get('/categories/tree', async (c) => {
  const allCategories = await db.query.categories.findMany({
    orderBy: [desc(categories.sort)],
  });
  
  // 构建树形结构
  const tree = allCategories
    .filter(item => item.parentId === 0)
    .map(parent => ({
      ...parent,
      children: allCategories.filter(item => item.parentId === parent.id),
    }));
  
  return response.success(c, tree);
});

// 获取商品列表
productRoutes.get('/list', async (c) => {
  const { 
    categoryId, 
    keyword, 
    sort = 'default', 
    page = 1, 
    pageSize = 10 
  } = c.req.query();
  
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);
  const offset = (pageNum - 1) * pageSizeNum;
  
  // 构建查询条件
  const conditions = [eq(products.status, 1)];
  
  if (categoryId) {
    conditions.push(eq(products.categoryId, Number(categoryId)));
  }
  
  if (keyword) {
    conditions.push(like(products.name, `%${keyword}%`));
  }
  
  // 排序
  let orderBy: any = desc(products.createdAt);
  if (sort === 'sales') {
    orderBy = desc(products.sales);
  } else if (sort === 'price_asc') {
    orderBy = asc(products.price);
  } else if (sort === 'price_desc') {
    orderBy = desc(products.price);
  }
  
  // 查询总数
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(and(...conditions));
  
  const total = countResult[0]?.count || 0;
  
  // 查询列表
  const list = await db.query.products.findMany({
    where: and(...conditions),
    limit: pageSizeNum,
    offset,
    orderBy: [orderBy],
    with: {
      category: {
        columns: { id: true, name: true },
      },
    },
  });
  
  return response.paginate(c, list, Number(total), pageNum, pageSizeNum);
});

// 获取商品详情
productRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      skus: true,
    },
  });
  
  if (!product) {
    return response.error(c, '商品不存在', 1, 404);
  }
  
  // 格式化价格（分转元）
  const formatProduct = {
    ...product,
    price: product.price / 100,
    originalPrice: product.originalPrice ? product.originalPrice / 100 : null,
    skus: product.skus.map(sku => ({
      ...sku,
      price: sku.price / 100,
      originalPrice: sku.originalPrice ? sku.originalPrice / 100 : null,
    })),
  };
  
  return response.success(c, formatProduct);
});

// 获取推荐商品
productRoutes.get('/recommend/list', async (c) => {
  const { limit = 10 } = c.req.query();
  
  const list = await db.query.products.findMany({
    where: eq(products.isRecommend, true),
    limit: Number(limit),
    orderBy: [desc(products.sales)],
  });
  
  return response.success(c, list);
});

// 获取热门商品
productRoutes.get('/hot/list', async (c) => {
  const { limit = 10 } = c.req.query();
  
  const list = await db.query.products.findMany({
    where: eq(products.isHot, true),
    limit: Number(limit),
    orderBy: [desc(products.sales)],
  });
  
  return response.success(c, list);
});

// 搜索商品
productRoutes.get('/search', async (c) => {
  const { keyword, page = 1, pageSize = 10 } = c.req.query();
  
  if (!keyword) {
    return response.error(c, '请输入搜索关键词');
  }
  
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);
  const offset = (pageNum - 1) * pageSizeNum;
  
  const conditions = and(
    eq(products.status, 1),
    like(products.name, `%${keyword}%`)
  );
  
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(conditions);
  
  const total = countResult[0]?.count || 0;
  
  const list = await db.query.products.findMany({
    where: conditions,
    limit: pageSizeNum,
    offset,
    orderBy: [desc(products.sales)],
  });
  
  return response.paginate(c, list, Number(total), pageNum, pageSizeNum);
});

export default productRoutes;
