import { get, post } from '@/utils/request';

// 认证相关
export const wxLogin = (data: { code: string; userInfo?: any; encryptedData?: string; iv?: string }) => 
  post('/auth/wx-login', data);
export const bindPhone = (data: { phone: string; code: string }) => post('/auth/bind-phone', data);
export const sendCode = (phone: string) => post('/auth/send-code', { phone });
export const login = (data: { phone: string; code?: string; password?: string }) => post('/auth/login', data);
export const getUserInfo = () => get('/auth/user-info');

// 商品相关
export const getCategoryTree = () => get('/products/categories/tree');
export const getProductList = (params: any) => get('/products/list', params);
export const getProductDetail = (id: number) => get(`/products/${id}`);
export const getRecommendProducts = (limit?: number) => get('/products/recommend/list', { limit });
export const getHotProducts = (limit?: number) => get('/products/hot/list', { limit });

// 购物车相关
export const getCartList = () => get('/cart/list');
export const addToCart = (data: { productId: number; skuId?: number; quantity?: number }) => post('/cart/add', data);
export const updateCartQuantity = (id: number, quantity: number) => post('/cart/update', { id, quantity });
export const updateCartItemQty = (id: number, quantity: number) => post('/cart/update', { id, quantity });
export const selectCartItems = (ids: number[], selected: boolean) => post('/cart/select', { ids, selected });
export const selectAllCart = (selected: boolean) => post('/cart/select-all', { selected });
export const removeCartItems = (ids: number[]) => post('/cart/remove', { ids });
export const removeCartItem = (id: number) => post('/cart/remove', { ids: [id] });

// 订单相关
export const createOrder = (data: { addressId: number; cartItemIds?: number[]; buyerNote?: string }) => post('/orders/create', data);
export const getOrderList = (status?: number, page?: number, pageSize?: number) => get('/orders/list', { status, page, pageSize });
export const getOrderDetail = (id: number) => get(`/orders/${id}`);
export const cancelOrder = (id: number) => post(`/orders/${id}/cancel`);
export const confirmOrder = (id: number) => post(`/orders/${id}/confirm`);

// 用户相关
export const getAddressList = () => get('/user/addresses');
export const addAddress = (data: any) => post('/user/addresses', data);
export const updateAddress = (id: number, data: any) => post(`/user/addresses/${id}`, data);
export const deleteAddress = (id: number) => post(`/user/addresses/${id}/delete`);
export const getFavoriteList = (page?: number, pageSize?: number) => get('/user/favorites', { page, pageSize });
export const addFavorite = (productId: number) => post('/user/favorites', { productId });
export const removeFavorite = (productId: number) => post(`/user/favorites/${productId}/delete`);
