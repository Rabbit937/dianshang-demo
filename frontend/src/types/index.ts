// 用户信息
export interface User {
  id: number;
  phone: string;
  nickname: string;
  avatar: string;
  gender: number;
  level: number;
  points: number;
  createdAt: string;
}

// 收货地址
export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  fullAddress?: string;
  tag?: string;
  isDefault: boolean;
}

// 商品分类
export interface Category {
  id: number;
  name: string;
  parentId?: number;
  image?: string;
  children?: Category[];
}

// 商品
export interface Product {
  id: number;
  name: string;
  mainImage: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  description?: string;
  detail?: string;
  stock: number;
  sales: number;
  categoryId: number;
  categoryIdList?: number[];
  specs?: Record<string, string[]>;
  skus?: ProductSku[];
}

// 商品 SKU
export interface ProductSku {
  id: number;
  productId: number;
  skuSpecs: Record<string, string>;
  price: number;
  originalPrice?: number;
  stock: number;
  image?: string;
}

// 购物车项
export interface CartItem {
  id: number;
  productId: number;
  skuId?: number;
  quantity: number;
  selected: boolean;
  product?: Product;
  sku?: ProductSku;
}

// 订单
export interface Order {
  id: number;
  orderNo: string;
  status: number;
  totalAmount: number;
  shippingFee?: number;
  discountAmount?: number;
  payAmount: number;
  payType?: string;
  address?: {
    name: string;
    phone: string;
    fullAddress: string;
  };
  items: OrderItem[];
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  completedAt?: string;
}

// 订单商品项
export interface OrderItem {
  id: number;
  productId: number;
  skuId?: number;
  productName: string;
  productImage: string;
  skuSpecs?: string;
  price: number;
  quantity: number;
}

// 分页数据
export interface PaginateData<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// API 响应
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
