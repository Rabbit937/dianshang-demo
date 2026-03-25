<template>
  <view class="product-detail-page">
    <!-- 顶部区域 - 固定 -->
    <view class="header-area" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content" :style="{ height: navBarHeight + 'px' }">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="header-title">商品详情</text>
        <view class="header-right"></view>
      </view>
    </view>
    
    <!-- 底部区域 - 固定 -->
    <view class="bottom-bar">
      <view class="action-icons">
        <view class="action-icon">💬 客服</view>
        <view class="action-icon" @click="goCart">🛒 购物车</view>
      </view>
      <view class="action-btns">
        <view class="btn-cart" @click="addToCart">加入购物车</view>
        <view class="btn-buy">立即购买</view>
      </view>
    </view>
    
    <!-- 中间滚动区域 -->
    <scroll-view 
      class="scroll-content" 
      scroll-y 
      :style="{ 
        top: (statusBarHeight + navBarHeight) + 'px',
        bottom: (120 + safeAreaBottom) + 'rpx'
      }"
    >
      <swiper class="product-gallery" autoplay circular>
        <swiper-item v-for="(img, index) in images" :key="index">
          <image :src="img" class="gallery-image" mode="aspectFill" />
        </swiper-item>
      </swiper>
      
      <view class="product-info">
        <view class="price-row">
          <text class="price">¥199</text>
          <text class="original-price">¥399</text>
        </view>
        <text class="product-title">时尚休闲连衣裙女夏季新款气质显瘦中长款大码裙子</text>
        <view class="product-tags">
          <text class="tag">🔥 热销爆款</text>
          <text class="tag">🚚 顺丰包邮</text>
        </view>
      </view>
      
      <view class="spec-section" @click="showSpecPopup = true">
        <text class="spec-label">规格</text>
        <text class="spec-value">请选择 颜色 尺码</text>
        <text class="spec-arrow">›</text>
      </view>
    </scroll-view>
    
    <view v-if="showSpecPopup" class="spec-popup" @click="showSpecPopup = false">
      <view class="spec-content" @click.stop>
        <view class="spec-header">
          <image src="https://picsum.photos/seed/detail/100/100" class="spec-image" />
          <view class="spec-info">
            <text class="spec-price">¥199</text>
            <text class="spec-stock">库存: 999件</text>
          </view>
          <text class="spec-close" @click="showSpecPopup = false">×</text>
        </view>
        <view class="spec-body">
          <view class="spec-group">
            <text class="spec-title">颜色</text>
            <view class="spec-options">
              <view class="spec-option active">黑色</view>
              <view class="spec-option">白色</view>
              <view class="spec-option">红色</view>
            </view>
          </view>
          <view class="spec-group">
            <text class="spec-title">尺码</text>
            <view class="spec-options">
              <view class="spec-option">S</view>
              <view class="spec-option active">M</view>
              <view class="spec-option">L</view>
              <view class="spec-option">XL</view>
            </view>
          </view>
        </view>
        <view class="spec-footer" @click="showSpecPopup = false">确定</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores';

const cartStore = useCartStore();

const statusBarHeight = ref(20);
const navBarHeight = ref(44);
const safeAreaBottom = ref(0);

const images = ref([
  'https://picsum.photos/seed/d1/400/400',
  'https://picsum.photos/seed/d2/400/400',
  'https://picsum.photos/seed/d3/400/400',
]);

const showSpecPopup = ref(false);

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
    console.log('获取胶囊按钮位置失败', e);
  }
  // #endif
});

const goBack = () => {
  uni.navigateBack();
};

const goCart = () => {
  uni.switchTab({ url: '/pages/cart/cart' });
};

const addToCart = () => {
  cartStore.addToCart(1);
};
</script>

<style lang="scss" scoped>
.product-detail-page {
  width: 100vw;
  height: 100vh;
  background: $bg-gray;
  overflow: hidden;
}

.header-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, #FF6B6B, #E53935);
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    
    .back-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      
      .back-icon {
        font-size: 40rpx;
        color: #fff;
        font-weight: 300;
      }
    }
    
    .header-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
    }
    
    .header-right {
      width: 60rpx;
    }
  }
}

.scroll-content {
  position: fixed;
  left: 0;
  right: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.product-gallery {
  height: 750rpx;
  
  .gallery-image {
    width: 100%;
    height: 100%;
  }
}

.product-info {
  background: #fff;
  padding: 24rpx;
  
  .price-row {
    display: flex;
    align-items: baseline;
    gap: 16rpx;
    margin-bottom: 16rpx;
    
    .price {
      font-size: 48rpx;
      color: $primary-color;
      font-weight: 700;
    }
    
    .original-price {
      font-size: 28rpx;
      color: $text-hint;
      text-decoration: line-through;
    }
  }
  
  .product-title {
    font-size: 32rpx;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 16rpx;
  }
  
  .product-tags {
    display: flex;
    gap: 16rpx;
    
    .tag {
      font-size: 24rpx;
      color: $primary-color;
      background: #FFEBEE;
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
    }
  }
}

.spec-section {
  display: flex;
  align-items: center;
  background: #fff;
  margin-top: 20rpx;
  padding: 24rpx;
  
  .spec-label {
    font-size: 28rpx;
    color: $text-secondary;
    margin-right: 24rpx;
  }
  
  .spec-value {
    flex: 1;
    font-size: 28rpx;
  }
  
  .spec-arrow {
    color: $text-hint;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  padding-bottom: calc(12rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(12rpx + env(safe-area-inset-bottom));
  
  .action-icons {
    display: flex;
    gap: 32rpx;
    margin-right: 32rpx;
    
    .action-icon {
      font-size: 24rpx;
      color: $text-secondary;
    }
  }
  
  .action-btns {
    flex: 1;
    display: flex;
    gap: 16rpx;
    
    .btn-cart, .btn-buy {
      flex: 1;
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 36rpx;
      font-size: 28rpx;
      font-weight: 600;
    }
    
    .btn-cart {
      background: linear-gradient(135deg, #FFB74D, #FF9800);
      color: #fff;
    }
    
    .btn-buy {
      background: linear-gradient(135deg, #FF6B6B, #E53935);
      color: #fff;
    }
  }
}

.spec-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  
  .spec-content {
    width: 100%;
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .spec-header {
    display: flex;
    gap: 24rpx;
    padding: 24rpx;
    border-bottom: 1rpx solid $border-color;
    position: relative;
    flex-shrink: 0;
    
    .spec-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
    }
    
    .spec-info {
      .spec-price {
        font-size: 36rpx;
        color: $primary-color;
        font-weight: 700;
        margin-bottom: 8rpx;
      }
      
      .spec-stock {
        font-size: 24rpx;
        color: $text-hint;
      }
    }
    
    .spec-close {
      position: absolute;
      top: 24rpx;
      right: 24rpx;
      font-size: 48rpx;
      color: $text-hint;
    }
  }
  
  .spec-body {
    padding: 24rpx;
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    
    .spec-group {
      margin-bottom: 32rpx;
      
      .spec-title {
        font-size: 28rpx;
        margin-bottom: 16rpx;
      }
      
      .spec-options {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;
        
        .spec-option {
          padding: 16rpx 32rpx;
          background: $bg-light;
          border-radius: 8rpx;
          font-size: 26rpx;
          
          &.active {
            background: #FFEBEE;
            color: $primary-color;
            border: 2rpx solid $primary-color;
          }
        }
      }
    }
  }
  
  .spec-footer {
    height: 96rpx;
    background: $primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    flex-shrink: 0;
  }
}
</style>
