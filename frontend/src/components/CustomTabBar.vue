<template>
  <view class="custom-tabbar-wrapper">
    <!-- Desktop Sidebar (handled in App.vue, but keeping for reference) -->
    <view class="desktop-tabbar-indicator">
      <!-- This is handled by .desktop-sidebar in App.vue -->
    </view>

    <!-- Mobile Bottom Tab Bar -->
    <view class="mobile-tabbar">
      <view
        v-for="(item, index) in tabs"
        :key="index"
        class="tabbar-item"
        :class="{ active: current === item.path }"
        @click="switchTab(item.path)"
      >
        <view class="tabbar-icon-wrap">
          <text class="tabbar-icon" v-if="item.path === '/pages/index/index'">🏠</text>
          <text class="tabbar-icon" v-else-if="item.path === '/pages/category/category'">📦</text>
          <text class="tabbar-icon" v-else-if="item.path === '/pages/cart/cart'">🛒</text>
          <text class="tabbar-icon" v-else>👤</text>
          <view v-if="item.path === '/pages/cart/cart' && item.badge > 0" class="tabbar-badge">
            {{ item.badge > 99 ? '99+' : item.badge }}
          </view>
        </view>
        <text class="tabbar-text">{{ item.text }}</text>
        <view v-if="current === item.path" class="tabbar-active-dot"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '@/stores';

const cartStore = useCartStore();

const props = defineProps<{
  current: string;
}>();

const tabs = computed(() => [
  { path: '/pages/index/index', text: '首页', badge: 0 },
  { path: '/pages/category/category', text: '分类', badge: 0 },
  { path: '/pages/cart/cart', text: '购物车', badge: cartStore.totalCount },
  { path: '/pages/profile/profile', text: '我的', badge: 0 },
]);

const switchTab = (path: string) => {
  if (props.current !== path) {
    uni.switchTab({ url: path });
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.custom-tabbar-wrapper {
  display: none; /* Hidden on desktop, handled by sidebar */
}

/* Mobile Tabbar - shown only on mobile */
.mobile-tabbar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 1000;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Show mobile tabbar, hide on tablet/desktop */
@media (max-width: 767px) {
  .custom-tabbar-wrapper {
    display: block;
  }
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  gap: 3px;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
  color: $text-hint;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.7;
  }

  &.active {
    color: $primary-color;

    .tabbar-icon {
      transform: scale(1.1);
    }
  }

  .tabbar-icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tabbar-icon {
    font-size: 22px;
    line-height: 1;
    transition: transform 0.2s ease;
  }

  .tabbar-text {
    font-size: 11px;
    font-weight: 500;
  }

  .tabbar-badge {
    position: absolute;
    top: -4px;
    right: -10px;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    background: $primary-color;
    color: #fff;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    padding: 0 4px;
    box-shadow: 0 1px 3px rgba($primary-color, 0.4);
  }

  .tabbar-active-dot {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 3px;
    background: $primary-color;
    border-radius: 0 0 3px 3px;
  }
}
</style>
