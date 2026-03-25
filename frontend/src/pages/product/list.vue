<template>
  <view class="product-list-page">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view
        v-for="(item, index) in filters"
        :key="index"
        class="filter-item"
        :class="{ active: currentFilter === index }"
        @click="currentFilter = index"
      >
        <text>{{ item }}</text>
        <view class="filter-arrow" v-if="index === 2">
          <text :class="{ active: priceOrder === 'asc' }">↑</text>
          <text :class="{ active: priceOrder === 'desc' }">↓</text>
        </view>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view class="product-scroll" scroll-y @scrolltolower="loadMore">
      <view class="product-grid">
        <view
          v-for="(item, index) in products"
          :key="index"
          class="product-card"
          @click="goDetail(item.id)"
          :style="{ animationDelay: (index % 10 * 0.05) + 's' }"
        >
          <view class="product-image-wrap">
            <image :src="item.mainImage || item.image" class="product-image" mode="aspectFill" />
            <view class="product-badge" v-if="item.tag">{{ item.tag }}</view>
          </view>
          <view class="product-info">
            <text class="product-name text-ellipsis-2">{{ item.name }}</text>
            <view class="product-row">
              <text class="product-price">
                <text class="price-symbol">¥</text>
                <text class="price-integer">{{ ((item.price || 0) / 100).toFixed(0) }}</text>
              </text>
              <text class="product-sales">{{ item.sales || 0 }}人付款</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="load-status" v-if="products.length > 0">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">— 没有更多了 —</text>
        <view v-else class="load-more-tip" @click="loadMore">
          <text>加载更多</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProductList } from '@/api';

const products = ref<any[]>([]);
const loading = ref(false);
const currentFilter = ref(0);
const priceOrder = ref('');
const filters = ['综合', '销量', '价格'];
const page = ref(1);
const noMore = ref(false);

const fetchProducts = async (reset = false) => {
  if (loading.value) return;
  if (reset) {
    page.value = 1;
    noMore.value = false;
  }
  if (noMore.value) return;

  loading.value = true;
  try {
    const result = await getProductList({ page: page.value, pageSize: 20 });
    const list = result?.list || result || [];
    if (reset) {
      products.value = list;
    } else {
      products.value = [...products.value, ...list];
    }
    if (list.length < 20) {
      noMore.value = true;
    }
    page.value++;
  } catch (error) {
    console.error('获取商品列表失败', error);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (!noMore.value) {
    fetchProducts();
  }
};

const goDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` });
};

onMounted(() => {
  fetchProducts(true);
});
</script>

<style lang="scss" scoped>
.product-list-page {
  min-height: 100vh;
  background: $bg-page;
  display: flex;
  flex-direction: column;
}

.filter-bar {
  display: flex;
  background: $bg-white;
  padding: 0 24rpx;
  height: 88rpx;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);

  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
    font-size: 28rpx;
    color: $text-secondary;
    font-weight: 500;

    &.active {
      color: $primary-color;
      font-weight: 600;
    }

    .filter-arrow {
      display: flex;
      flex-direction: column;
      gap: -4rpx;

      text {
        font-size: 16rpx;
        color: $text-hint;
        line-height: 1;

        &.active {
          color: $primary-color;
        }
      }
    }
  }
}

.product-scroll {
  flex: 1;
  padding: 20rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-card {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  animation: fadeInUp 0.3s ease both;

  &:active {
    transform: scale(0.98);
    transition: transform 0.15s ease;
  }

  .product-image-wrap {
    position: relative;
    height: 340rpx;
    overflow: hidden;

    .product-image {
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;
    }

    .product-badge {
      position: absolute;
      top: 12rpx;
      left: 12rpx;
      padding: 4rpx 12rpx;
      background: rgba($primary-color, 0.9);
      color: #fff;
      font-size: 20rpx;
      border-radius: $radius-sm;
    }
  }

  .product-info {
    padding: 20rpx;

    .product-name {
      font-size: 26rpx;
      color: $text-primary;
      line-height: 1.4;
      height: 72rpx;
      margin-bottom: 12rpx;
    }

    .product-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .product-price {
        color: $primary-color;
        font-size: 32rpx;
        font-weight: 600;
      }

      .product-sales {
        font-size: 22rpx;
        color: $text-hint;
      }
    }
  }
}

.load-status {
  padding: 32rpx;
  text-align: center;

  text {
    font-size: 24rpx;
    color: $text-hint;
  }

  .load-more-tip {
    padding: 16rpx;
    color: $primary-color;
    font-size: 26rpx;
  }
}
</style>
