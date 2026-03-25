<template>
  <view class="order-list-page">
    <view class="order-tabs">
      <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === tab.value }" @click="currentTab = tab.value">
        {{ tab.label }}
      </view>
    </view>

    <view class="order-content">
      <view v-if="loading" class="loading-tip">加载中...</view>
      <view v-else-if="orders.length === 0" class="empty-tip">暂无订单</view>
      <view v-for="(order, index) in orders" :key="index" class="order-item" @click="goDetail(order.id)">
        <view class="order-header">
          <text class="order-no">订单号: {{ order.orderNo }}</text>
          <text class="order-status">{{ getStatusText(order.status) }}</text>
        </view>
        <view class="order-products">
          <image v-for="(item, idx) in order.items?.slice(0, 3)" :key="idx" :src="item.productImage" class="product-image" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ order.items?.[0]?.productName }}</text>
            <text class="product-price">¥{{ (order.payAmount / 100).toFixed(2) }}</text>
          </view>
        </view>
        <view class="order-footer">
          <text class="order-total">共{{ order.items?.length || 0 }}件 合计：¥{{ (order.payAmount / 100).toFixed(2) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getOrderList } from '@/api';

const tabs = [
  { label: '全部', value: -1 },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已完成', value: 4 },
];

const currentTab = ref(-1);
const orders = ref<any[]>([]);
const loading = ref(false);

const fetchOrders = async () => {
  loading.value = true;
  try {
    const status = currentTab.value === -1 ? undefined : currentTab.value;
    const result = await getOrderList(status);
    orders.value = result || [];
  } catch (error) {
    console.error('获取订单列表失败', error);
  } finally {
    loading.value = false;
  }
};

watch(currentTab, () => {
  fetchOrders();
});

const getStatusText = (status: number) => {
  const texts: Record<number, string> = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '待评价', 4: '已完成', 5: '已取消' };
  return texts[status] || '未知';
};

const goDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/order/detail?id=${id}` });
};

// 初始加载
fetchOrders();
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: $bg-gray;
}

.order-tabs {
  display: flex;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 24rpx;
    font-size: 28rpx;
    color: $text-secondary;
    
    &.active {
      color: $primary-color;
      font-weight: 600;
      border-bottom: 4rpx solid $primary-color;
    }
  }
}

.order-content {
  padding: 24rpx;
}

.loading-tip, .empty-tip {
  text-align: center;
  padding: 100rpx 0;
  color: $text-hint;
  font-size: 28rpx;
}

.order-item {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  
  .order-header {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 24rpx;
    border-bottom: 1rpx solid $border-color;
    
    .shop-name {
      font-size: 28rpx;
      font-weight: 500;
    }
    
    .order-status {
      font-size: 26rpx;
      color: $primary-color;
    }
  }
  
  .order-products {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 24rpx;
    
    .product-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
    }
    
    .product-info {
      flex: 1;
      
      .product-name {
        font-size: 28rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      
      .product-price {
        font-size: 28rpx;
        color: $primary-color;
        font-weight: 600;
        margin-top: 12rpx;
      }
    }
  }
  
  .order-footer {
    padding: 16rpx 24rpx;
    border-top: 1rpx solid $border-color;
    text-align: right;
    
    .order-total {
      font-size: 26rpx;
      color: $text-secondary;
    }
  }
}
</style>
