<template>
  <view class="page-wrapper">
    <!-- Mobile Header -->
    <view class="mobile-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content" :style="{ height: navBarHeight + 'px' }">
        <text class="header-title">全部分类</text>
      </view>
    </view>

    <!-- Page Content -->
    <view class="category-content" :style="{ paddingTop: mobileHeaderOffset + 'px' }">
      <!-- Left Category Nav -->
      <view class="category-nav">
        <scroll-view class="nav-scroll" scroll-y>
          <view
            v-for="(cat, index) in categories"
            :key="index"
            class="nav-item"
            :class="{ active: currentCategory === index }"
            @click="selectCategory(index)"
          >
            <view class="nav-icon" :style="{ background: cat.bgColor }">
              <text>{{ cat.icon }}</text>
            </view>
            <text class="nav-name">{{ cat.name }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- Right Content -->
      <view class="category-main">
        <scroll-view class="main-scroll" scroll-y @scrolltolower="loadMore">
          <!-- Category Banner -->
          <view class="category-banner" v-if="currentCategory">
            <image :src="currentCategory.banner" class="banner-image" mode="aspectFill" />
            <view class="banner-overlay">
              <text class="banner-title">{{ currentCategory.name }}</text>
              <text class="banner-subtitle">{{ currentCategory.desc }}</text>
            </view>
          </view>

          <!-- Subcategories -->
          <view class="subcategory-section">
            <view class="section-title">
              <text>{{ currentCategory?.name }}分类</text>
            </view>
            <view class="subcategory-grid">
              <view
                v-for="item in subCategories"
                :key="item.id"
                class="subcategory-item"
                @click="goProductList(item.id)"
              >
                <view class="subcategory-icon-wrap">
                  <image :src="item.image" class="subcategory-icon" mode="aspectFill" />
                </view>
                <text class="subcategory-name">{{ item.name }}</text>
              </view>
            </view>
          </view>

          <!-- Hot Products -->
          <view class="hot-section">
            <view class="section-title">
              <text>热门推荐</text>
              <view class="title-more" @click="goProductList()">
                <text>查看更多</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view class="product-list">
              <view
                v-for="item in products"
                :key="item.id"
                class="product-item"
                @click="goDetail(item.id)"
              >
                <view class="item-image-wrap">
                  <image :src="item.image" class="item-image" mode="aspectFill" />
                </view>
                <view class="item-info">
                  <text class="item-name">{{ item.name }}</text>
                  <view class="item-bottom">
                    <view class="item-price-wrap">
                      <text class="currency">¥</text>
                      <text class="price">{{ item.price }}</text>
                    </view>
                    <text class="sales">{{ item.sales }}人付款</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- Bottom Space -->
          <view class="bottom-space"></view>
        </scroll-view>
      </view>
    </view>

    <!-- Mobile Bottom Tab Bar -->
    <CustomTabBar current="/pages/category/category" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import CustomTabBar from '@/components/CustomTabBar.vue';

const currentCategory = ref(0);
const statusBarHeight = ref(20);
const navBarHeight = ref(44);

const mobileHeaderOffset = computed(() => {
  if (typeof window !== 'undefined' && window.innerWidth >= 768) return 0;
  return statusBarHeight.value + navBarHeight.value + 12;
});

const categories = ref([
  {
    name: '女装',
    icon: '👗',
    bgColor: 'linear-gradient(135deg, #FF6B6B, #EE5A5A)',
    desc: '时尚优雅，引领潮流',
    banner: 'https://picsum.photos/seed/women/750/300',
    subcats: ['连衣裙', 'T恤', '衬衫', '裤子', '裙子', '外套', '毛衣', '针织衫']
  },
  {
    name: '男装',
    icon: '👔',
    bgColor: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
    desc: '品质男装，商务休闲',
    banner: 'https://picsum.photos/seed/men/750/300',
    subcats: ['T恤', '衬衫', '裤子', '外套', '西装', '夹克', '卫衣', '毛衣']
  },
  {
    name: '运动',
    icon: '⚡',
    bgColor: 'linear-gradient(135deg, #F093FB, #F5576C)',
    desc: '运动健身，活力无限',
    banner: 'https://picsum.photos/seed/sport/750/300',
    subcats: ['运动鞋', '运动服', '健身器材', '球类', '户外用品', '泳装', '瑜伽']
  },
  {
    name: '数码',
    icon: '📱',
    bgColor: 'linear-gradient(135deg, #667EEA, #764BA2)',
    desc: '科技数码，智能生活',
    banner: 'https://picsum.photos/seed/digital/750/300',
    subcats: ['手机', '电脑', '耳机', '相机', '智能设备', '配件', '平板']
  },
  {
    name: '家居',
    icon: '🏠',
    bgColor: 'linear-gradient(135deg, #4FACFE, #00F2FE)',
    desc: '品质家居，舒适生活',
    banner: 'https://picsum.photos/seed/home/750/300',
    subcats: ['床上用品', '灯具', '收纳', '装饰', '家具', '餐厨', '布艺']
  },
  {
    name: '美妆',
    icon: '💄',
    bgColor: 'linear-gradient(135deg, #FA709A, #FEE140)',
    desc: '美妆护肤，精致每一天',
    banner: 'https://picsum.photos/seed/beauty/750/300',
    subcats: ['护肤', '彩妆', '香水', '美容仪器', '面膜', '卸妆', '护发']
  },
  {
    name: '母婴',
    icon: '🍼',
    bgColor: 'linear-gradient(135deg, #A8EDEA, #FED6E3)',
    desc: '母婴用品，关爱成长',
    banner: 'https://picsum.photos/seed/baby/750/300',
    subcats: ['奶粉', '尿裤', '童装', '玩具', '孕产', '喂养', '洗护']
  },
  {
    name: '食品',
    icon: '🍎',
    bgColor: 'linear-gradient(135deg, #43E97B, #38F9D7)',
    desc: '健康美食，美味生活',
    banner: 'https://picsum.photos/seed/food/750/300',
    subcats: ['水果', '零食', '粮油', '茶叶', '海鲜', '肉类', '饮料']
  },
]);

const selectedCategoryData = computed(() => categories.value[currentCategory.value]);

const subCategories = computed(() => {
  const cats = selectedCategoryData.value?.subcats || [];
  return cats.map((name, index) => ({
    id: index + 1,
    name,
    image: `https://picsum.photos/seed/${currentCategory.value}${index}/200/200`,
  }));
});

const products = ref([
  { id: 1, name: '时尚休闲连衣裙女夏季新款气质显瘦收腰a字裙', image: 'https://picsum.photos/seed/p1/300/300', price: 199, sales: 1280 },
  { id: 2, name: '男士纯棉短袖T恤夏季潮流百搭宽松圆领', image: 'https://picsum.photos/seed/p2/300/300', price: 89, sales: 896 },
  { id: 3, name: '运动鞋男款透气网面跑步鞋轻便休闲鞋', image: 'https://picsum.photos/seed/p3/300/300', price: 259, sales: 2341 },
  { id: 4, name: '无线蓝牙耳机降噪运动耳机入耳式', image: 'https://picsum.photos/seed/p4/300/300', price: 159, sales: 5621 },
  { id: 5, name: '智能手表多功能运动手环心率监测防水', image: 'https://picsum.photos/seed/p5/300/300', price: 299, sales: 1823 },
  { id: 6, name: '真皮女包手提包时尚单肩包斜挎包', image: 'https://picsum.photos/seed/p6/300/300', price: 459, sales: 756 },
]);

const selectCategory = (index: number) => {
  currentCategory.value = index;
};

const goProductList = (id?: number) => {
  if (id) {
    uni.navigateTo({ url: `/pages/product/list?categoryId=${id}` });
  } else {
    uni.navigateTo({ url: `/pages/product/list?categoryId=${currentCategory.value + 1}` });
  }
};

const goDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` });
};

const loadMore = () => {
  // 加载更多商品
};

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 20;

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
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
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
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24rpx;

  .header-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #FFF;
    letter-spacing: 2rpx;
  }
}

/* ========================================
   CATEGORY CONTENT
   ======================================== */

.category-content {
  flex: 1;
  display: flex;
  padding-top: 12rpx;
}

/* ========================================
   LEFT CATEGORY NAV
   ======================================== */

.category-nav {
  width: 180rpx;
  flex-shrink: 0;
  background: #FFF;
  border-right: 1rpx solid #EEEEEE;
}

.nav-scroll {
  height: 100%;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 16rpx;
  gap: 12rpx;
  transition: all 0.2s ease;
  position: relative;

  &.active {
    background: linear-gradient(135deg, rgba($primary-color, 0.08), rgba($primary-color, 0.04));

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 48rpx;
      background: $primary-color;
      border-radius: 0 4rpx 4rpx 0;
    }

    .nav-icon {
      transform: scale(1.1);
    }

    .nav-name {
      color: $primary-color;
      font-weight: 600;
    }
  }
}

.nav-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
  transition: transform 0.2s ease;
}

.nav-name {
  font-size: 24rpx;
  color: $text-secondary;
  font-weight: 500;
  text-align: center;
}

/* ========================================
   RIGHT MAIN CONTENT
   ======================================== */

.category-main {
  flex: 1;
  overflow: hidden;
}

.main-scroll {
  height: 100%;
}

/* ========================================
   CATEGORY BANNER
   ======================================== */

.category-banner {
  position: relative;
  height: 200rpx;
  margin: 0 24rpx 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);

  .banner-image {
    width: 100%;
    height: 100%;
  }

  .banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($primary-color, 0.85), rgba($primary-dark, 0.9));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8rpx;
  }

  .banner-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #FFF;
  }

  .banner-subtitle {
    font-size: 24rpx;
    color: rgba(255,255,255,0.9);
  }
}

/* ========================================
   SUBCATEGORY SECTION
   ======================================== */

.subcategory-section {
  padding: 0 24rpx;
  margin-bottom: 32rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  text {
    font-size: 30rpx;
    font-weight: 700;
    color: $text-primary;
  }

  .title-more {
    display: flex;
    align-items: center;
    gap: 4rpx;
    font-size: 24rpx;
    color: $text-hint;

    .arrow {
      font-size: 28rpx;
    }
  }
}

.subcategory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
}

.subcategory-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.subcategory-icon-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background: #FFF;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);

  .subcategory-icon {
    width: 100%;
    height: 100%;
  }
}

.subcategory-name {
  font-size: 24rpx;
  color: $text-secondary;
  font-weight: 500;
  text-align: center;
}

/* ========================================
   HOT PRODUCTS SECTION
   ======================================== */

.hot-section {
  padding: 0 24rpx;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-item {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

.item-image-wrap {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  overflow: hidden;
  flex-shrink: 0;
  background: #F5F5F5;

  .item-image {
    width: 100%;
    height: 100%;
  }
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8rpx 0;
}

.item-name {
  font-size: 28rpx;
  color: $text-primary;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price-wrap {
  display: flex;
  align-items: baseline;

  .currency {
    font-size: 24rpx;
    color: $primary-color;
    font-weight: 600;
  }

  .price {
    font-size: 36rpx;
    font-weight: 700;
    color: $primary-color;
  }
}

.sales {
  font-size: 22rpx;
  color: $text-hint;
}

/* ========================================
   BOTTOM SPACE
   ======================================== */

.bottom-space {
  height: 160rpx;
}
</style>
