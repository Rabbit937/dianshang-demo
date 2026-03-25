<template>
  <view class="address-list-page">
    <view class="address-content">
      <view v-for="(item, index) in addressList" :key="index" class="address-item">
        <view class="address-main">
          <view class="address-top">
            <text class="address-name">{{ item.name }}</text>
            <text class="address-phone">{{ item.phone }}</text>
          </view>
          <text class="address-detail">{{ item.address }}</text>
        </view>
        <view class="address-actions">
          <text @click="editAddress(item)">编辑</text>
          <text @click="deleteAddress(item.id)">删除</text>
        </view>
      </view>
    </view>
    <view class="add-btn" @click="addAddress">+ 新增收货地址</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const addressList = ref([
  { id: 1, name: '张三', phone: '13800138000', address: '北京市朝阳区xxx街道xxx小区xxx号' },
  { id: 2, name: '李四', phone: '13900139000', address: '上海市浦东新区xxx路xxx号' },
]);

const editAddress = (item: any) => {
  uni.navigateTo({ url: `/pages/address/edit?id=${item.id}` });
};

const deleteAddress = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该地址吗？',
    success: (res) => {
      if (res.confirm) {
        addressList.value = addressList.value.filter(item => item.id !== id);
      }
    }
  });
};

const addAddress = () => {
  uni.navigateTo({ url: '/pages/address/edit' });
};
</script>

<style lang="scss" scoped>
.address-list-page {
  min-height: 100vh;
  background: $bg-gray;
  padding-bottom: 120rpx;
}

.address-content {
  padding: 24rpx;
}

.address-item {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  
  .address-main {
    padding: 24rpx;
    
    .address-top {
      display: flex;
      gap: 16rpx;
      margin-bottom: 12rpx;
      
      .address-name {
        font-size: 30rpx;
        font-weight: 600;
      }
      
      .address-phone {
        font-size: 28rpx;
        color: $text-secondary;
      }
    }
    
    .address-detail {
      font-size: 26rpx;
      color: $text-secondary;
    }
  }
  
  .address-actions {
    display: flex;
    border-top: 1rpx solid $border-color;
    
    text {
      flex: 1;
      text-align: center;
      padding: 20rpx;
      font-size: 26rpx;
      color: $text-secondary;
      border-right: 1rpx solid $border-color;
      
      &:last-child {
        border-right: none;
      }
    }
  }
}

.add-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 96rpx;
  background: $primary-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
}
</style>
