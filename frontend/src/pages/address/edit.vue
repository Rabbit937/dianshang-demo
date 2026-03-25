<template>
  <view class="address-edit-page">
    <view class="edit-content">
      <view class="edit-item">
        <text class="edit-label">收货人</text>
        <input v-model="form.name" placeholder="请输入收货人姓名" />
      </view>
      <view class="edit-item">
        <text class="edit-label">手机号</text>
        <input v-model="form.phone" type="number" placeholder="请输入手机号" />
      </view>
      <view class="edit-item">
        <text class="edit-label">所在地区</text>
        <text class="edit-value placeholder">请选择省市区</text>
      </view>
      <view class="edit-item">
        <text class="edit-label">详细地址</text>
        <textarea v-model="form.address" placeholder="请输入详细地址" />
      </view>
    </view>
    <view class="save-btn" @click="saveAddress">保存地址</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  name: '',
  phone: '',
  address: '',
});

const saveAddress = () => {
  if (!form.value.name) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' });
    return;
  }
  if (!form.value.phone || !/^1[3-9]\d{9}$/.test(form.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  if (!form.value.address) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' });
    return;
  }
  
  uni.showToast({ title: '保存成功', icon: 'success' });
  setTimeout(() => uni.navigateBack(), 1000);
};
</script>

<style lang="scss" scoped>
.address-edit-page {
  min-height: 100vh;
  background: $bg-gray;
  padding-bottom: 120rpx;
}

.edit-content {
  background: #fff;
  margin: 24rpx;
  border-radius: 16rpx;
}

.edit-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid $border-color;
  
  &:last-child {
    border-bottom: none;
  }
  
  .edit-label {
    width: 160rpx;
    font-size: 28rpx;
    color: $text-primary;
  }
  
  input, .edit-value {
    flex: 1;
    font-size: 28rpx;
    text-align: right;
    
    &.placeholder {
      color: $text-hint;
    }
  }
  
  textarea {
    flex: 1;
    font-size: 28rpx;
    min-height: 120rpx;
    text-align: right;
  }
}

.save-btn {
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
