<template>
  <view class="page-wrapper">
    <!-- Desktop Header -->
    <header class="desktop-header">
      <view class="header-inner">
        <a href="/" class="header-logo">
          <view class="logo-icon">红</view>
          <text class="logo-text">好<span>物</span></text>
        </a>

        <view class="header-search">
          <view class="search-input-wrap">
            <text class="search-icon">🔍</text>
            <input type="text" class="search-input" placeholder="搜索商品、品牌" />
          </view>
        </view>
      </view>
    </header>

    <!-- Desktop Sidebar -->
    <aside class="desktop-sidebar">
      <view class="sidebar-section">
        <text class="sidebar-title">购物导航</text>
        <view class="sidebar-link active">
          <text class="link-icon">🛒</text>
          <text>购物车</text>
        </view>
        <view class="sidebar-link">
          <text class="link-icon">❤️</text>
          <text>我的收藏</text>
        </view>
        <view class="sidebar-link">
          <text class="link-icon">📦</text>
          <text>我的订单</text>
        </view>
      </view>
    </aside>

    <!-- Main Content -->
    <main class="main-content has-sidebar has-fixed-header">
      <view class="container">
        <!-- Mobile Header -->
        <view class="mobile-header" :style="{ paddingTop: statusBarHeight + 'px' }">
          <view class="header-content" :style="{ height: navBarHeight + 'px' }">
            <text class="cart-title">购物车</text>
            <text class="cart-count">共 {{ cartStore.totalCount }} 件商品</text>
          </view>
        </view>

        <!-- Page Content -->
        <view class="cart-content" :style="{ paddingTop: mobileHeaderOffset + 'px' }">

          <!-- Cart with items -->
          <view v-if="cartStore.cartItems.length > 0" class="cart-container">

            <!-- Desktop: Full Width Cart -->
            <view class="cart-main">
              <!-- Cart Header -->
              <view class="cart-header">
                <view class="select-all" @click="toggleSelectAll">
                  <view class="checkbox" :class="{ checked: cartStore.isSelectedAll }">
                    <text class="check-icon" v-if="cartStore.isSelectedAll">✓</text>
                  </view>
                  <text class="select-text">全选</text>
                </view>
                <text class="cart-tip">Shipping offers available</text>
              </view>

              <!-- Cart Items -->
              <view class="cart-list">
                <view
                  v-for="(item, index) in cartStore.cartItems"
                  :key="index"
                  class="cart-item"
                >
                  <view class="item-checkbox" @click="toggleSelect(item.id)">
                    <view class="checkbox" :class="{ checked: item.selected }">
                      <text class="check-icon" v-if="item.selected">✓</text>
                    </view>
                  </view>

                  <view class="item-image-wrap" @click="goDetail(item.productId)">
                    <image :src="item.product?.mainImage || 'https://picsum.photos/200/200'" class="item-image" mode="aspectFill" />
                  </view>

                  <view class="item-details">
                    <view class="item-name text-ellipsis-2" @click="goDetail(item.productId)">
                      {{ item.product?.name || '商品名称' }}
                    </view>
                    <view class="item-sku" v-if="item.sku?.specs">
                      {{ item.sku.specs.map((s: any) => `${s.name}:${s.value}`).join(' / ') }}
                    </view>
                    <view class="item-bottom">
                      <view class="item-price-wrap">
                        <text class="price-symbol">¥</text>
                        <text class="item-price">{{ ((item.sku?.price || item.product?.price) / 100).toFixed(2) }}</text>
                      </view>
                      <view class="item-quantity">
                        <view class="qty-btn" @click="decreaseQty(item)">−</view>
                        <text class="qty-num">{{ item.quantity }}</text>
                        <view class="qty-btn" @click="increaseQty(item)">+</view>
                      </view>
                    </view>
                  </view>

                  <view class="item-delete" @click="removeItem(item.id)">
                    <text>🗑</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- Order Summary (Desktop: Right Sidebar) -->
            <view class="order-summary">
              <view class="summary-card">
                <view class="summary-title">订单摘要</view>

                <view class="summary-row">
                  <text class="summary-label">商品件数</text>
                  <text class="summary-value">{{ cartStore.totalCount }} 件</text>
                </view>

                <view class="summary-row">
                  <text class="summary-label">商品金额</text>
                  <text class="summary-value">¥{{ cartStore.totalAmount.toFixed(2) }}</text>
                </view>

                <view class="summary-row">
                  <text class="summary-label">运费</text>
                  <text class="summary-value summary-free">免运费</text>
                </view>

                <view class="summary-divider"></view>

                <view class="summary-row summary-total">
                  <text class="summary-label">合计</text>
                  <text class="summary-price">
                    <text class="price-symbol">¥</text>
                    <text class="price-value">{{ cartStore.totalAmount.toFixed(2) }}</text>
                  </text>
                </view>

                <view class="checkout-btn" :class="{ disabled: cartStore.totalCount === 0 }">
                  <text>去结算</text>
                  <text class="btn-count" v-if="cartStore.totalCount > 0">({{ cartStore.totalCount }})</text>
                </view>
              </view>

              <!-- Coupon -->
              <view class="coupon-card">
                <view class="coupon-icon">🎫</view>
                <view class="coupon-info">
                  <text class="coupon-title">优惠券</text>
                  <text class="coupon-tip">2 张可用</text>
                </view>
                <text class="coupon-arrow">›</text>
              </view>
            </view>
          </view>

          <!-- Empty Cart -->
          <view v-else class="empty-cart">
            <view class="empty-icon-wrap">
              <text class="empty-icon">🛒</text>
            </view>
            <text class="empty-title">购物车空空如也</text>
            <text class="empty-subtitle">快去挑选心仪的商品吧</text>
            <view class="empty-btn" @click="goHome">去逛逛</view>
          </view>

          <!-- Recommended Section -->
          <view class="recommend-section" v-if="cartStore.cartItems.length > 0">
            <view class="recommend-header">
              <view class="recommend-line"></view>
              <text class="recommend-title">为你推荐</text>
              <view class="recommend-line"></view>
            </view>

            <view class="product-grid">
              <view
                v-for="(item, index) in recommendedProducts"
                :key="index"
                class="product-card fade-in-up"
                :class="'stagger-' + ((index % 6) + 1)"
                @click="goDetail(item.id)"
              >
                <view class="product-image-wrap">
                  <image :src="item.image" class="product-image" mode="aspectFill" />
                </view>
                <view class="product-info">
                  <text class="product-name text-ellipsis-2">{{ item.name }}</text>
                  <view class="product-bottom">
                    <view class="product-price-wrap">
                      <text class="price-symbol">¥</text>
                      <text class="product-price">{{ item.price }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- Footer Space -->
          <view class="footer-space"></view>
        </view>
      </view>
    </main>

    <!-- Mobile Bottom Tab Bar -->
    <CustomTabBar current="/pages/cart/cart" />

    <!-- Mobile Bottom Footer (Fixed) -->
    <view class="mobile-footer" v-if="cartStore.cartItems.length > 0">
      <view class="select-all-mobile" @click="toggleSelectAll">
        <view class="checkbox" :class="{ checked: cartStore.isSelectedAll }">
          <text class="check-icon" v-if="cartStore.isSelectedAll">✓</text>
        </view>
        <text class="select-text">全选</text>
      </view>
      <view class="total-info">
        <text class="total-label">合计</text>
        <text class="total-price">
          <text class="price-symbol">¥</text>
          <text class="price-integer">{{ cartStore.totalAmount.toFixed(2) }}</text>
        </text>
      </view>
      <view class="checkout-btn" :class="{ disabled: cartStore.totalCount === 0 }">
        <text>结算</text>
        <text class="btn-count" v-if="cartStore.totalCount > 0">({{ cartStore.totalCount }})</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores';
import { selectCartItems, selectAllCart, updateCartItemQty, removeCartItem } from '@/api';
import CustomTabBar from '@/components/CustomTabBar.vue';

const cartStore = useCartStore();

const statusBarHeight = ref(20);
const navBarHeight = ref(44);

const mobileHeaderOffset = computed(() => {
  if (typeof window !== 'undefined' && window.innerWidth >= 768) return 0;
  return statusBarHeight.value + navBarHeight.value;
});

const recommendedProducts = ref([
  { id: 101, name: '时尚休闲连衣裙女夏季新款气质显瘦收腰a字裙', image: 'https://picsum.photos/seed/rec1/400/400', price: 199 },
  { id: 102, name: '男士纯棉短袖T恤夏季潮流百搭宽松圆领', image: 'https://picsum.photos/seed/rec2/400/400', price: 89 },
  { id: 103, name: '运动鞋男款透气网面跑步鞋轻便休闲鞋', image: 'https://picsum.photos/seed/rec3/400/400', price: 259 },
  { id: 104, name: '无线蓝牙耳机降噪运动耳机入耳式', image: 'https://picsum.photos/seed/rec4/400/400', price: 159 },
  { id: 105, name: '智能手表多功能运动手环心率监测', image: 'https://picsum.photos/seed/rec5/400/400', price: 299 },
  { id: 106, name: '真皮女包手提包时尚单肩包斜挎包', image: 'https://picsum.photos/seed/rec6/400/400', price: 459 },
  { id: 107, name: '护肤套装补水保湿滋润面部护理全套', image: 'https://picsum.photos/seed/rec7/400/400', price: 199 },
  { id: 108, name: '家用智能扫地机器人吸尘器自动充电', image: 'https://picsum.photos/seed/rec8/400/400', price: 1299 },
  { id: 109, name: '休闲零食大礼包一整箱混合坚果礼盒', image: 'https://picsum.photos/seed/rec9/400/400', price: 68 },
  { id: 110, name: '轻奢品牌女士手表时尚腕表防水', image: 'https://picsum.photos/seed/rec10/400/400', price: 899 },
]);

const toggleSelect = async (id: number) => {
  const item = cartStore.cartItems.find(item => item.id === id);
  if (item) {
    try {
      await selectCartItems([id], !item.selected);
      await cartStore.fetchCartList();
    } catch (error) {
      console.error('Failed to update selection', error);
    }
  }
};

const toggleSelectAll = async () => {
  const newSelected = !cartStore.isSelectedAll;
  try {
    await selectAllCart(newSelected);
    await cartStore.fetchCartList();
  } catch (error) {
    console.error('Failed to update select all', error);
  }
};

const decreaseQty = async (item: any) => {
  if (item.quantity <= 1) return;
  try {
    await updateCartItemQty(item.id, item.quantity - 1);
    await cartStore.fetchCartList();
  } catch (error) {
    console.error('Failed to update quantity', error);
  }
};

const increaseQty = async (item: any) => {
  try {
    await updateCartItemQty(item.id, item.quantity + 1);
    await cartStore.fetchCartList();
  } catch (error) {
    console.error('Failed to update quantity', error);
  }
};

const removeItem = async (id: number) => {
  try {
    await removeCartItem(id);
    await cartStore.fetchCartList();
  } catch (error) {
    console.error('Failed to remove item', error);
  }
};

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' });
};

const goDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` });
};

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 20;
  safeAreaBottom.value = systemInfo.safeAreaInsets?.bottom || 0;

  // #ifdef MP-WEIXIN
  try {
    const menuButton = uni.getMenuButtonBoundingClientRect();
    if (menuButton) {
      navBarHeight.value = menuButton.height + (menuButton.top - statusBarHeight.value) * 2;
    }
  } catch (e) {
    console.log('Getting menu button failed', e);
  }
  // #endif

  cartStore.fetchCartList();
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-wrapper {
  min-height: 100vh;
  background: $bg-page;
}

.main-content {
  min-height: 100vh;
}

@media (min-width: 768px) {
  .main-content {
    margin-left: 240px;
    padding-top: 72px;
  }
}

.cart-content {
  padding: 12px 0;
}

@media (min-width: 768px) {
  .cart-content {
    padding: 24px 0;
  }
}

/* ========================================
   MOBILE HEADER
   ======================================== */

.mobile-header {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 44px;

  .cart-title {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
  }

  .cart-count {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }
}

/* ========================================
   CART CONTAINER (Desktop Layout)
   ======================================== */

.cart-container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 24px;
  }
}

.cart-main {
  flex: 1;
  min-width: 0;
}

/* ========================================
   CART HEADER
   ======================================== */

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    padding: 16px 20px;
    border-radius: 16px;
    margin-bottom: 16px;
  }
}

.select-all {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  .checkbox {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &.checked {
      background: $primary-color;
      border-color: $primary-color;
    }

    .check-icon {
      color: #fff;
      font-size: 12px;
      font-weight: bold;
    }
  }

  .select-text {
    font-size: 14px;
    color: $text-secondary;
    font-weight: 500;

    @media (min-width: 768px) {
      font-size: 15px;
    }
  }
}

.cart-tip {
  font-size: 12px;
  color: $primary-color;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 13px;
  }
}

/* ========================================
   CART LIST
   ======================================== */

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  position: relative;

  @media (min-width: 768px) {
    padding: 16px;
    gap: 16px;
    border-radius: 16px;
  }

  .item-checkbox {
    padding-top: 4px;
    cursor: pointer;

    .checkbox {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid $border-color;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &.checked {
        background: $primary-color;
        border-color: $primary-color;
      }

      .check-icon {
        color: #fff;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }

  .item-image-wrap {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    background: $bg-page;
    flex-shrink: 0;
    cursor: pointer;

    @media (min-width: 768px) {
      width: 100px;
      height: 100px;
      border-radius: 12px;
    }

    .item-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item-details {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .item-name {
      font-size: 13px;
      color: $text-primary;
      line-height: 1.4;
      cursor: pointer;

      @media (min-width: 768px) {
        font-size: 15px;
      }

      &:hover {
        color: $primary-color;
      }
    }

    .item-sku {
      font-size: 11px;
      color: $text-hint;
      background: $bg-page;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      align-self: flex-start;

      @media (min-width: 768px) {
        font-size: 12px;
      }
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    .item-price-wrap {
      display: flex;
      align-items: baseline;

      .price-symbol {
        font-size: 12px;
        color: $primary-color;
      }

      .item-price {
        font-size: 16px;
        font-weight: 600;
        color: $primary-color;

        @media (min-width: 768px) {
          font-size: 18px;
        }
      }
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 8px;

      .qty-btn {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: $bg-page;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: $text-secondary;
        cursor: pointer;
        transition: all 0.15s ease;

        &:active {
          background: $bg-gray;
        }

        @media (min-width: 768px) {
          &:hover {
            background: $border-color;
          }
        }
      }

      .qty-num {
        font-size: 14px;
        font-weight: 600;
        color: $text-primary;
        min-width: 24px;
        text-align: center;
      }
    }
  }

  .item-delete {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: $text-hint;
    cursor: pointer;
    transition: all 0.15s ease;
    border-radius: 50%;

    &:hover {
      background: rgba($primary-color, 0.1);
      color: $primary-color;
    }
  }
}

/* ========================================
   ORDER SUMMARY (Desktop)
   ======================================== */

.order-summary {
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 320px;
    flex-shrink: 0;
  }
}

.summary-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  .summary-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 16px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .summary-label {
      font-size: 14px;
      color: $text-secondary;
    }

    .summary-value {
      font-size: 14px;
      color: $text-primary;
      font-weight: 500;
    }

    .summary-free {
      color: $primary-color;
    }
  }

  .summary-divider {
    height: 1px;
    background: $border-light;
    margin: 16px 0;
  }

  .summary-total {
    margin-bottom: 20px;

    .summary-label {
      font-size: 15px;
      font-weight: 600;
      color: $text-primary;
    }

    .summary-price {
      display: flex;
      align-items: baseline;

      .price-symbol {
        font-size: 14px;
        color: $primary-color;
      }

      .price-value {
        font-size: 22px;
        font-weight: 700;
        color: $primary-color;
      }
    }
  }

  .checkout-btn {
    width: 100%;
    padding: 14px 20px;
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    color: #fff;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba($primary-color, 0.3);
    }

    &.disabled {
      background: $bg-gray;
      color: $text-disabled;
      box-shadow: none;
      cursor: not-allowed;
    }

    .btn-count {
      font-weight: 400;
    }
  }
}

.coupon-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .coupon-icon {
    font-size: 24px;
  }

  .coupon-info {
    flex: 1;

    .coupon-title {
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
      display: block;
    }

    .coupon-tip {
      font-size: 12px;
      color: $primary-color;
    }
  }

  .coupon-arrow {
    font-size: 20px;
    color: $text-hint;
  }
}

/* ========================================
   EMPTY CART
   ======================================== */

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 40px;

  .empty-icon-wrap {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary-pale 0%, rgba($primary-color, 0.1) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;

    .empty-icon {
      font-size: 48px;
    }
  }

  .empty-title {
    font-size: 18px;
    color: $text-primary;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .empty-subtitle {
    font-size: 14px;
    color: $text-hint;
    margin-bottom: 32px;
  }

  .empty-btn {
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    color: #fff;
    padding: 12px 40px;
    border-radius: 24px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba($primary-color, 0.3);
    }
  }
}

/* ========================================
   RECOMMEND SECTION
   ======================================== */

.recommend-section {
  margin-top: 24px;
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0;
    margin-top: 32px;
  }
}

.recommend-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;

  .recommend-line {
    width: 60px;
    height: 1px;
    background: $border-color;
  }

  .recommend-title {
    font-size: 15px;
    color: $text-secondary;
    font-weight: 500;
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }

  .product-image-wrap {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: $bg-page;

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .product-info {
    padding: 10px;

    .product-name {
      font-size: 13px;
      color: $text-primary;
      line-height: 1.4;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 36px;
    }

    .product-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .product-price-wrap {
      display: flex;
      align-items: baseline;
    }

    .price-symbol {
      font-size: 12px;
      color: $primary-color;
    }

    .product-price {
      font-size: 16px;
      font-weight: 600;
      color: $primary-color;
    }
  }
}

@media (min-width: 768px) {
  .product-card {
    border-radius: 14px;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .product-info {
      padding: 12px;

      .product-name {
        font-size: 14px;
      }

      .product-price {
        font-size: 18px;
      }
    }
  }
}

/* ========================================
   MOBILE FOOTER (Fixed Bottom)
   ======================================== */

.mobile-footer {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 12px 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: calc(12px + constant(safe-area-inset-bottom));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));

  @media (min-width: 768px) {
    display: none;
  }
}

.select-all-mobile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  .checkbox {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &.checked {
      background: $primary-color;
      border-color: $primary-color;
    }

    .check-icon {
      color: #fff;
      font-size: 12px;
      font-weight: bold;
    }
  }

  .select-text {
    font-size: 14px;
    color: $text-secondary;
    font-weight: 500;
  }
}

.total-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 12px;

  .total-label {
    font-size: 12px;
    color: $text-secondary;
  }

  .total-price {
    display: flex;
    align-items: baseline;
    color: $primary-color;

    .price-symbol {
      font-size: 12px;
    }

    .price-integer {
      font-size: 20px;
      font-weight: 700;
    }
  }
}

.mobile-footer .checkout-btn {
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  color: #fff;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &.disabled {
    background: $bg-gray;
    color: $text-disabled;
    cursor: not-allowed;
  }

  .btn-count {
    font-weight: 400;
  }
}

/* ========================================
   FOOTER SPACE
   ======================================== */

.footer-space {
  height: 100px;

  @media (min-width: 768px) {
    height: 0;
  }
}
</style>
