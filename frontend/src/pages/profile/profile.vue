<template>
  <view class="profile-page">
    <!-- 顶部区域 - 固定 -->
    <view class="header-area" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-nav" :style="{ height: navBarHeight + 'px' }"></view>
      <view class="user-section" :style="{ paddingRight: capsuleWidth + 'px' }">
        <view class="user-info" @click="goLogin">
          <image :src="userInfo?.avatar || 'https://picsum.photos/seed/avatar/100/100'" class="user-avatar" />
          <view class="user-detail">
            <text class="user-name">{{ userInfo?.nickname || '点击登录' }}</text>
            <text class="user-level">{{ userInfo?.level ? 'VIP会员' : '登录享受更多权益' }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部 TabBar - 固定 -->
    <CustomTabBar current="/pages/profile/profile" />
    
    <!-- 中间滚动区域 -->
    <scroll-view 
      class="scroll-content" 
      scroll-y 
      :style="{ 
        top: (statusBarHeight + navBarHeight + 80) + 'px',
        bottom: (100 + safeAreaBottom) + 'rpx'
      }"
    >
      <view class="order-section">
        <view class="section-header">
          <text class="section-title">我的订单</text>
          <text class="section-more">全部订单 ›</text>
        </view>
        <view class="order-status">
          <view class="status-item" @click="goOrder(0)">
            <text class="status-icon">💳</text>
            <text class="status-label">待付款</text>
          </view>
          <view class="status-item" @click="goOrder(1)">
            <text class="status-icon">📦</text>
            <text class="status-label">待发货</text>
          </view>
          <view class="status-item" @click="goOrder(2)">
            <text class="status-icon">🚚</text>
            <text class="status-label">待收货</text>
          </view>
          <view class="status-item" @click="goOrder(3)">
            <text class="status-icon">⭐</text>
            <text class="status-label">待评价</text>
          </view>
        </view>
      </view>
      
      <view class="menu-section">
        <view class="menu-item" @click="goAddress">
          <text class="menu-icon">📍</text>
          <text class="menu-label">收货地址</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item">
          <text class="menu-icon">❤️</text>
          <text class="menu-label">我的收藏</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item">
          <text class="menu-icon">🎫</text>
          <text class="menu-label">优惠券</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item">
          <text class="menu-icon">💬</text>
          <text class="menu-label">客服中心</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useUserStore } from '@/stores';
import CustomTabBar from '@/components/CustomTabBar.vue';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 状态栏高度
const statusBarHeight = ref(20);
// 导航栏高度
const navBarHeight = ref(44);
// 胶囊按钮占用的宽度
const capsuleWidth = ref(0);
// 安全区域底部高度
const safeAreaBottom = ref(0);

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 20;
  safeAreaBottom.value = systemInfo.safeAreaInsets?.bottom || 0;
  
  // #ifdef MP-WEIXIN
  try {
    const menuButton = uni.getMenuButtonBoundingClientRect();
    if (menuButton) {
      navBarHeight.value = menuButton.height + (menuButton.top - statusBarHeight.value) * 2;
      capsuleWidth.value = systemInfo.windowWidth - menuButton.left + 16;
    }
  } catch (e) {
    console.log('获取胶囊按钮位置失败', e);
  }
  // #endif
});

const goLogin = () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/login' });
  }
};

const goOrder = (status: number) => {
  uni.navigateTo({ url: `/pages/order/list?status=${status}` });
};

const goAddress = () => {
  uni.navigateTo({ url: '/pages/address/list' });
};
</script>

<style lang="scss" scoped>
.profile-page {
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
  
  .header-nav {
    display: flex;
    align-items: center;
    padding-left: 24rpx;
  }
  
  .user-section {
    padding: 20rpx 24rpx 40rpx;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 24rpx;
    }
    
    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 6rpx solid rgba(255,255,255,0.3);
    }
    
    .user-detail {
      .user-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #fff;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .user-level {
        font-size: 24rpx;
        color: rgba(255,255,255,0.8);
      }
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

.order-section {
  background: #fff;
  margin: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    padding: 24rpx;
    border-bottom: 1rpx solid $border-color;
    
    .section-title {
      font-size: 30rpx;
      font-weight: 600;
    }
    
    .section-more {
      font-size: 24rpx;
      color: $text-hint;
    }
  }
  
  .order-status {
    display: flex;
    justify-content: space-around;
    padding: 24rpx;
    
    .status-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      
      .status-icon {
        font-size: 48rpx;
      }
      
      .status-label {
        font-size: 24rpx;
        color: $text-secondary;
      }
    }
  }
}

.menu-section {
  background: #fff;
  margin: 0 24rpx 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid $border-color;
    
    &:last-child {
      border-bottom: none;
    }
    
    .menu-icon {
      font-size: 36rpx;
      margin-right: 20rpx;
    }
    
    .menu-label {
      flex: 1;
      font-size: 28rpx;
    }
    
    .menu-arrow {
      color: $text-hint;
      font-size: 28rpx;
    }
  }
}
</style>
