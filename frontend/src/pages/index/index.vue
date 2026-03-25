<template>
  <view class="page-wrapper">
    <!-- Mobile Header -->
    <view class="mobile-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content" :style="{ height: navBarHeight + 'px' }">
        <view class="logo-area">
          <text class="logo-text">红</text>
          <text class="logo-subtext">好物</text>
        </view>
        <view class="search-box" @click="goSearch">
          <text class="search-icon">🔍</text>
          <text class="search-placeholder">搜索商品</text>
        </view>
      </view>
    </view>

    <!-- Page Content -->
    <scroll-view
      class="home-content"
      scroll-y
      :style="{ paddingTop: mobileHeaderOffset + 'px' }"
      refresher-enabled
      @refresherrefresh="onRefresh"
      :refresher-triggered="isRefreshing"
    >
      <!-- Hero Banner -->
      <view class="hero-section">
        <swiper class="hero-swiper" :indicator-dots="false" :autoplay="true" :interval="4000" :circular="true" @change="onBannerChange">
          <swiper-item v-for="(banner, index) in banners" :key="index">
            <view class="banner-item" @click="goBannerDetail(banner)">
              <image :src="banner.image" class="banner-image" mode="aspectFill" />
              <view class="banner-overlay">
                <view class="banner-content">
                  <text class="banner-tag">{{ banner.tag }}</text>
                  <text class="banner-title">{{ banner.title }}</text>
                  <text class="banner-subtitle">{{ banner.subtitle }}</text>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <view class="banner-indicators">
          <view
            v-for="(banner, index) in banners"
            :key="index"
            class="indicator-dot"
            :class="{ active: activeBanner === index }"
          ></view>
        </view>
      </view>

      <!-- Quick Categories -->
      <view class="categories-section">
        <view class="categories-scroll">
          <view
            v-for="cat in categories"
            :key="cat.id"
            class="category-item"
            @click="selectCategory(cat.id)"
          >
            <view class="category-icon" :style="{ background: cat.bgColor }">
              <text>{{ cat.icon }}</text>
            </view>
            <text class="category-name">{{ cat.name }}</text>
          </view>
        </view>
      </view>

      <!-- Flash Sale -->
      <view class="flash-sale-section" v-if="flashSaleItems.length > 0">
        <view class="section-header">
          <view class="section-left">
            <text class="section-title">限时秒杀</text>
            <view class="flash-timer">
              <text class="timer-num">{{ flashSaleTime.hours }}</text>
              <text class="timer-sep">:</text>
              <text class="timer-num">{{ flashSaleTime.minutes }}</text>
              <text class="timer-sep">:</text>
              <text class="timer-num">{{ flashSaleTime.seconds }}</text>
            </view>
          </view>
          <view class="section-more" @click="goFlashSale">
            <text>更多</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <scroll-view class="flash-scroll" scroll-x>
          <view
            v-for="item in flashSaleItems"
            :key="item.id"
            class="flash-item"
            @click="goDetail(item.id)"
          >
            <view class="flash-image-wrap">
              <image :src="item.image" class="flash-image" mode="aspectFill" />
              <view class="flash-tag">限时</view>
            </view>
            <text class="flash-price">¥{{ item.price }}</text>
            <text class="flash-original">¥{{ item.originalPrice }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- Featured Banner -->
      <view class="featured-section" v-if="featuredProduct" @click="goDetail(featuredProduct.id)">
        <image :src="featuredProduct.image" class="featured-image" mode="aspectFill" />
        <view class="featured-overlay">
          <view class="featured-badges">
            <text class="featured-tag">精选</text>
            <text class="featured-tag hot">热门</text>
          </view>
          <view class="featured-info">
            <text class="featured-name">{{ featuredProduct.name }}</text>
            <view class="featured-price-row">
              <view class="featured-price-wrap">
                <text class="featured-currency">¥</text>
                <text class="featured-price">{{ featuredProduct.price }}</text>
                <text class="featured-original">¥{{ featuredProduct.originalPrice }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Hot Products -->
      <view class="products-section">
        <view class="section-header">
          <text class="section-title">热门推荐</text>
          <view class="section-more" @click="goProductList">
            <text>查看更多</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="product-grid">
          <view
            v-for="(item, index) in products"
            :key="item.id"
            class="product-card"
            :class="'fade-in'"
            :style="{ animationDelay: (index * 0.05) + 's' }"
            @click="goDetail(item.id)"
          >
            <view class="product-image-wrap">
              <image :src="item.image" class="product-image" mode="aspectFill" />
              <view class="product-tag" v-if="item.tag">{{ item.tag }}</view>
            </view>
            <view class="product-info">
              <text class="product-name">{{ item.name }}</text>
              <view class="product-bottom">
                <view class="price-wrap">
                  <text class="currency">¥</text>
                  <text class="price">{{ item.price }}</text>
                </view>
                <text class="sales">{{ item.sales }}人付款</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- New Arrivals -->
      <view class="new-section" v-if="newArrivals.length > 0">
        <view class="section-header">
          <text class="section-title">新品上架</text>
          <view class="section-more" @click="goNewArrivals">
            <text>更多新品</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="new-grid">
          <view
            v-for="item in newArrivals"
            :key="item.id"
            class="new-card"
            @click="goDetail(item.id)"
          >
            <view class="new-image-wrap">
              <image :src="item.image" class="new-image" mode="aspectFill" />
              <view class="new-badge">NEW</view>
            </view>
            <text class="new-name">{{ item.name }}</text>
            <text class="new-price">¥{{ item.price }}</text>
          </view>
        </view>
      </view>

      <!-- Bottom Space -->
      <view class="bottom-space"></view>
    </scroll-view>

    <!-- Mobile Bottom Tab Bar -->
    <CustomTabBar current="/pages/index/index" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import CustomTabBar from '@/components/CustomTabBar.vue';

const statusBarHeight = ref(20);
const navBarHeight = ref(44);
const safeAreaBottom = ref(0);
const isRefreshing = ref(false);
const activeBanner = ref(0);

let bannerTimer: ReturnType<typeof setInterval> | null = null;
let flashSaleTimer: ReturnType<typeof setInterval> | null = null;

const flashSaleTime = ref({ hours: '00', minutes: '00', seconds: '00' });

const mobileHeaderOffset = computed(() => {
  if (typeof window !== 'undefined' && window.innerWidth >= 768) return 0;
  return statusBarHeight.value + navBarHeight.value + 12;
});

const banners = ref([
  { image: 'https://picsum.photos/seed/banner1/750/400', title: '春季新品上市', subtitle: '全场低至5折起', tag: '新品' },
  { image: 'https://picsum.photos/seed/banner2/750/400', title: '数码科技专场', subtitle: '智能生活从此刻开始', tag: '科技' },
  { image: 'https://picsum.photos/seed/banner3/750/400', title: '家居好物推荐', subtitle: '品质生活点亮每一个角落', tag: '家居' },
]);

const categories = ref([
  { id: 1, name: '女装', icon: '👗', bgColor: 'linear-gradient(135deg, #FF6B6B, #EE5A5A)' },
  { id: 2, name: '男装', icon: '👔', bgColor: 'linear-gradient(135deg, #4ECDC4, #44A08D)' },
  { id: 3, name: '数码', icon: '📱', bgColor: 'linear-gradient(135deg, #667EEA, #764BA2)' },
  { id: 4, name: '美妆', icon: '💄', bgColor: 'linear-gradient(135deg, #F093FB, #F5576C)' },
  { id: 5, name: '家居', icon: '🏠', bgColor: 'linear-gradient(135deg, #4FACFE, #00F2FE)' },
  { id: 6, name: '食品', icon: '🍎', bgColor: 'linear-gradient(135deg, #43E97B, #38F9D7)' },
  { id: 7, name: '运动', icon: '⚡', bgColor: 'linear-gradient(135deg, #FA709A, #FEE140)' },
  { id: 8, name: '母婴', icon: '🍼', bgColor: 'linear-gradient(135deg, #A8EDEA, #FED6E3)' },
]);

const products = ref([
  { id: 1, name: '时尚休闲连衣裙女夏季新款气质显瘦收腰a字裙', image: 'https://picsum.photos/seed/p1/400/400', price: 199, originalPrice: 399, sales: 1280, tag: '热卖' },
  { id: 2, name: '男士纯棉短袖T恤夏季潮流百搭宽松圆领', image: 'https://picsum.photos/seed/p2/400/400', price: 89, originalPrice: 189, sales: 896, tag: '' },
  { id: 3, name: '运动鞋男款透气网面跑步鞋轻便休闲鞋', image: 'https://picsum.photos/seed/p3/400/400', price: 259, originalPrice: 499, sales: 2341, tag: '新品' },
  { id: 4, name: '无线蓝牙耳机降噪运动耳机入耳式', image: 'https://picsum.photos/seed/p4/400/400', price: 159, originalPrice: 299, sales: 5621, tag: '爆款' },
  { id: 5, name: '智能手表多功能运动手环心率监测防水', image: 'https://picsum.photos/seed/p5/400/400', price: 299, originalPrice: 599, sales: 1823, tag: '' },
  { id: 6, name: '真皮女包手提包时尚单肩包斜挎包', image: 'https://picsum.photos/seed/p6/400/400', price: 459, originalPrice: 899, sales: 756, tag: '热卖' },
  { id: 7, name: '护肤套装补水保湿滋润面部护理全套', image: 'https://picsum.photos/seed/p7/400/400', price: 199, originalPrice: 399, sales: 3421, tag: '' },
  { id: 8, name: '家用智能扫地机器人吸尘器自动充电', image: 'https://picsum.photos/seed/p9/400/400', price: 1299, originalPrice: 1999, sales: 2341, tag: '' },
]);

const flashSaleItems = ref([
  { id: 101, name: '小米手环8', image: 'https://picsum.photos/seed/fs1/300/300', price: 199, originalPrice: 299 },
  { id: 102, name: '飞利浦电动牙刷', image: 'https://picsum.photos/seed/fs2/300/300', price: 149, originalPrice: 249 },
  { id: 103, name: 'SK-II护肤精华', image: 'https://picsum.photos/seed/fs3/300/300', price: 699, originalPrice: 999 },
  { id: 104, name: '戴森吹风机', image: 'https://picsum.photos/seed/fs4/300/300', price: 2299, originalPrice: 2999 },
  { id: 105, name: 'AirPods Pro', image: 'https://picsum.photos/seed/fs5/300/300', price: 1599, originalPrice: 1999 },
]);

const newArrivals = ref([
  { id: 201, name: '春季新款韩版宽松卫衣女', image: 'https://picsum.photos/seed/na1/300/300', price: 159 },
  { id: 202, name: '男士工装外套春秋款', image: 'https://picsum.photos/seed/na2/300/300', price: 299 },
  { id: 203, name: '智能无线蓝牙音箱', image: 'https://picsum.photos/seed/na3/300/300', price: 199 },
  { id: 204, name: '轻奢品牌女士手表', image: 'https://picsum.photos/seed/na4/300/300', price: 899 },
]);

const featuredProduct = computed(() => products.value[0]);

const onBannerChange = (e: any) => {
  activeBanner.value = e.detail.current;
};

const onRefresh = async () => {
  isRefreshing.value = true;
  // 模拟刷新
  await new Promise(resolve => setTimeout(resolve, 1000));
  isRefreshing.value = false;
};

const updateFlashSaleTime = () => {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = end.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  flashSaleTime.value = {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
};

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/search' });
};

const selectCategory = (id: number) => {
  uni.switchTab({ url: '/pages/category/category' });
};

const goDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` });
};

const goBannerDetail = (banner: any) => {
  goDetail(featuredProduct.value?.id);
};

const goFlashSale = () => {
  uni.navigateTo({ url: '/pages/product/flash-sale' });
};

const goProductList = () => {
  uni.navigateTo({ url: '/pages/product/list' });
};

const goNewArrivals = () => {
  uni.navigateTo({ url: '/pages/product/list?sort=new' });
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

  // Banner auto-play
  bannerTimer = setInterval(() => {
    activeBanner.value = (activeBanner.value + 1) % banners.value.length;
  }, 4000);

  // Flash sale timer
  updateFlashSaleTime();
  flashSaleTimer = setInterval(updateFlashSaleTime, 1000);
});

onUnmounted(() => {
  if (bannerTimer) clearInterval(bannerTimer);
  if (flashSaleTimer) clearInterval(flashSaleTimer);
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-wrapper {
  min-height: 100vh;
  background: #F5F5F5;
}

/* ========================================
   MOBILE HEADER
   ======================================== */

.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.header-content {
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  gap: 24rpx;
}

.logo-area {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
  flex-shrink: 0;

  .logo-text {
    font-size: 44rpx;
    font-weight: 700;
    color: #FFF;
    text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1);
  }

  .logo-subtext {
    font-size: 24rpx;
    color: rgba(255,255,255,0.9);
    font-weight: 500;
  }
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  height: 72rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 36rpx;
  padding: 0 24rpx;
  gap: 12rpx;

  .search-icon {
    font-size: 28rpx;
    opacity: 0.9;
  }

  .search-placeholder {
    font-size: 26rpx;
    color: rgba(255,255,255,0.85);
  }
}

/* ========================================
   HERO SECTION
   ======================================== */

.hero-section {
  padding: 24rpx;
  position: relative;
}

.hero-swiper {
  width: 100%;
  height: 360rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.banner-item {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.6) 100%);
  display: flex;
  align-items: flex-end;
}

.banner-content {
  padding: 32rpx;
  color: #FFF;
}

.banner-tag {
  display: inline-block;
  padding: 6rpx 16rpx;
  background: $primary-color;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.banner-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.banner-subtitle {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
}

.banner-indicators {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-top: 20rpx;
}

.indicator-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: rgba(0,0,0,0.2);
  transition: all 0.3s ease;

  &.active {
    width: 48rpx;
    border-radius: 8rpx;
    background: $primary-color;
  }
}

/* ========================================
   CATEGORIES SECTION
   ======================================== */

.categories-section {
  padding: 0 24rpx;
  margin-bottom: 24rpx;
}

.categories-scroll {
  display: flex;
  overflow-x: auto;
  gap: 16rpx;
  padding: 24rpx;
  background: #FFF;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);

  &::-webkit-scrollbar {
    display: none;
  }
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  min-width: 120rpx;
  cursor: pointer;
}

.category-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.category-name {
  font-size: 24rpx;
  color: $text-primary;
  font-weight: 500;
}

/* ========================================
   FLASH SALE SECTION
   ======================================== */

.flash-sale-section {
  padding: 0 24rpx;
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
}

.section-more {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 24rpx;
  color: $text-hint;

  .arrow {
    font-size: 28rpx;
  }
}

.flash-timer {
  display: flex;
  align-items: center;
  gap: 6rpx;

  .timer-num {
    padding: 4rpx 10rpx;
    background: $primary-color;
    color: #FFF;
    font-size: 24rpx;
    font-weight: 700;
    border-radius: 6rpx;
    font-family: 'DIN Alternate', monospace;
  }

  .timer-sep {
    color: $primary-color;
    font-weight: 700;
    font-size: 24rpx;
  }
}

.flash-scroll {
  display: flex;
  gap: 20rpx;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
}

.flash-item {
  display: inline-flex;
  flex-direction: column;
  width: 200rpx;
  flex-shrink: 0;
  background: #FFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
}

.flash-image-wrap {
  position: relative;
  width: 200rpx;
  height: 200rpx;

  .flash-image {
    width: 100%;
    height: 100%;
  }

  .flash-tag {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8rpx;
    background: linear-gradient(transparent, rgba($primary-color, 0.9));
    color: #FFF;
    font-size: 20rpx;
    font-weight: 600;
    text-align: center;
  }
}

.flash-price {
  display: block;
  padding: 12rpx 12rpx 4rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: $primary-color;
}

.flash-original {
  display: block;
  padding: 0 12rpx 16rpx;
  font-size: 22rpx;
  color: $text-hint;
  text-decoration: line-through;
}

/* ========================================
   FEATURED SECTION
   ======================================== */

.featured-section {
  position: relative;
  margin: 0 24rpx 32rpx;
  height: 320rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.12);

  .featured-image {
    width: 100%;
    height: 100%;
  }

  .featured-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 40%, rgba(0,0,0,0.7) 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24rpx;
  }

  .featured-badges {
    display: flex;
    gap: 12rpx;
  }

  .featured-tag {
    padding: 6rpx 16rpx;
    background: $primary-color;
    color: #FFF;
    font-size: 22rpx;
    font-weight: 600;
    border-radius: 8rpx;

    &.hot {
      background: linear-gradient(135deg, #FF6B6B, #EE5A24);
    }
  }

  .featured-info {
    .featured-name {
      display: block;
      font-size: 28rpx;
      color: #FFF;
      font-weight: 600;
      margin-bottom: 12rpx;
      line-height: 1.4;
    }

    .featured-price-row {
      display: flex;
      align-items: baseline;
    }

    .featured-price-wrap {
      display: flex;
      align-items: baseline;
      gap: 4rpx;
    }

    .featured-currency {
      font-size: 24rpx;
      color: #FFF;
    }

    .featured-price {
      font-size: 40rpx;
      font-weight: 700;
      color: #FFF;
    }

    .featured-original {
      font-size: 24rpx;
      color: rgba(255,255,255,0.6);
      text-decoration: line-through;
      margin-left: 12rpx;
    }
  }
}

/* ========================================
   PRODUCTS SECTION
   ======================================== */

.products-section {
  padding: 0 24rpx;
  margin-bottom: 32rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-card {
  background: #FFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);

  &.fade-in {
    animation: fadeInUp 0.4s ease forwards;
    opacity: 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;

  .product-image {
    width: 100%;
    height: 100%;
  }

  .product-tag {
    position: absolute;
    top: 12rpx;
    left: 12rpx;
    padding: 4rpx 12rpx;
    background: $primary-color;
    color: #FFF;
    font-size: 20rpx;
    font-weight: 600;
    border-radius: 6rpx;
  }
}

.product-info {
  padding: 16rpx;

  .product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 26rpx;
    color: $text-primary;
    line-height: 1.4;
    margin-bottom: 12rpx;
    min-height: 72rpx;
  }

  .product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price-wrap {
    display: flex;
    align-items: baseline;

    .currency {
      font-size: 24rpx;
      color: $primary-color;
      font-weight: 600;
    }

    .price {
      font-size: 32rpx;
      font-weight: 700;
      color: $primary-color;
    }
  }

  .sales {
    font-size: 22rpx;
    color: $text-hint;
  }
}

/* ========================================
   NEW ARRIVALS SECTION
   ======================================== */

.new-section {
  padding: 0 24rpx;
  margin-bottom: 32rpx;
}

.new-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.new-card {
  background: #FFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
}

.new-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;

  .new-image {
    width: 100%;
    height: 100%;
  }

  .new-badge {
    position: absolute;
    top: 12rpx;
    right: 12rpx;
    padding: 4rpx 12rpx;
    background: linear-gradient(135deg, #4CAF50, #2E7D32);
    color: #FFF;
    font-size: 20rpx;
    font-weight: 700;
    border-radius: 6rpx;
  }
}

.new-name {
  display: block;
  padding: 16rpx 16rpx 8rpx;
  font-size: 26rpx;
  color: $text-primary;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.new-price {
  display: block;
  padding: 0 16rpx 16rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: $primary-color;
}

/* ========================================
   BOTTOM SPACE
   ======================================== */

.bottom-space {
  height: 160rpx;
}
</style>
