<template>
  <view class="order-detail-page">
    <view class="status-section">
      <text class="status-icon">🚚</text>
      <text class="status-text">待收货</text>
    </view>
    
    <view class="address-section">
      <text class="address-icon">📍</text>
      <view class="address-info">
        <text class="address-name">张三 13800138000</text>
        <text class="address-detail">北京市朝阳区xxx街道xxx小区xxx号</text>
      </view>
    </view>
    
    <view class="products-section">
      <view class="section-header">时尚潮流旗舰店</view>
      <view class="product-item">
        <image src="https://picsum.photos/seed/od1/100/100" class="product-image" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">时尚休闲连衣裙女夏季新款气质显瘦</text>
          <text class="product-spec">黑色 / M</text>
          <text class="product-price">¥199</text>
        </view>
      </view>
    </view>
    
    <view class="info-section">
      <view class="info-item">
        <text class="info-label">订单编号</text>
        <text class="info-value">20240101123456789</text>
      </view>
      <view class="info-item">
        <text class="info-label">创建时间</text>
        <text class="info-value">2024-01-01 12:34:56</text>
      </view>
    </view>
    
    <view class="price-section">
      <view class="price-item">
        <text>商品金额</text>
        <text>¥199.00</text>
      </view>
      <view class="price-item">
        <text>运费</text>
        <text>¥0.00</text>
      </view>
      <view class="price-total">
        <text>实付款</text>
        <text class="total-value">¥199.00</text>
      </view>
    </view>
    
    <view class="bottom-bar">
      <view class="action-btn primary">确认收货</view>
    </view>
  </view>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background: $bg-gray;
  padding-bottom: 120rpx;
}

.status-section {
  background: linear-gradient(135deg, #FF6B6B, #E53935);
  padding: 48rpx;
  text-align: center;
  
  .status-icon {
    font-size: 80rpx;
  }
  
  .status-text {
    display: block;
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
    margin-top: 16rpx;
  }
}

.address-section {
  display: flex;
  gap: 16rpx;
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  
  .address-icon {
    font-size: 40rpx;
  }
  
  .address-info {
    flex: 1;
    
    .address-name {
      font-size: 28rpx;
      font-weight: 600;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .address-detail {
      font-size: 26rpx;
      color: $text-secondary;
    }
  }
}

.products-section {
  background: #fff;
  margin: 0 24rpx 24rpx;
  border-radius: 16rpx;
  
  .section-header {
    padding: 20rpx 24rpx;
    font-size: 28rpx;
    font-weight: 500;
    border-bottom: 1rpx solid $border-color;
  }
  
  .product-item {
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
      
      .product-spec {
        font-size: 24rpx;
        color: $text-hint;
        margin-top: 8rpx;
      }
      
      .product-price {
        font-size: 28rpx;
        color: $primary-color;
        font-weight: 600;
        margin-top: 12rpx;
      }
    }
  }
}

.info-section, .price-section {
  background: #fff;
  margin: 0 24rpx 24rpx;
  border-radius: 16rpx;
  padding: 8rpx 24rpx;
  
  .info-item, .price-item {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 1rpx solid $border-color;
    font-size: 26rpx;
  }
  
  .price-total {
    display: flex;
    justify-content: space-between;
    padding: 24rpx 0;
    font-size: 28rpx;
    font-weight: 500;
    
    .total-value {
      font-size: 36rpx;
      color: $primary-color;
      font-weight: 700;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 96rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24rpx;
  
  .action-btn {
    padding: 16rpx 48rpx;
    border-radius: 32rpx;
    font-size: 28rpx;
    
    &.primary {
      background: $primary-color;
      color: #fff;
    }
  }
}
</style>
