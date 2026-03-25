import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getCartList, addToCart as addToCartApi } from '@/api';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('');
  const userInfo = ref<any>(null);

  const isLoggedIn = computed(() => !!token.value);

  const setToken = (newToken: string) => {
    token.value = newToken;
  };

  const setUserInfo = (info: any) => {
    userInfo.value = info;
  };

  const logout = () => {
    token.value = '';
    userInfo.value = null;
  };

  return { token, userInfo, isLoggedIn, setToken, setUserInfo, logout };
}, {
  persist: {
    key: 'user-store',
    paths: ['token', 'userInfo'],
  },
});

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<any[]>([]);
  const totalCount = ref(0);
  const selectedCount = ref(0);
  const totalAmount = ref(0);

  const isSelectedAll = computed(() => {
    return cartItems.value.length > 0 && cartItems.value.every((item) => item.selected);
  });

  const fetchCartList = async () => {
    try {
      const result = await getCartList();
      cartItems.value = result.validItems || [];
      totalCount.value = result.summary?.totalCount || 0;
      selectedCount.value = result.summary?.selectedCount || 0;
      totalAmount.value = result.summary?.totalAmount || 0;
    } catch (error) {
      console.error('获取购物车失败', error);
    }
  };

  const addToCart = async (productId: number, skuId?: number, quantity = 1) => {
    try {
      await addToCartApi({ productId, skuId, quantity });
      uni.showToast({ title: '添加成功', icon: 'success' });
      await fetchCartList();
      return true;
    } catch (error) {
      console.error('添加购物车失败', error);
      return false;
    }
  };

  return {
    cartItems,
    totalCount,
    selectedCount,
    totalAmount,
    isSelectedAll,
    fetchCartList,
    addToCart,
  };
}, {
  persist: {
    key: 'cart-store',
    paths: ['totalCount'],
  },
});
