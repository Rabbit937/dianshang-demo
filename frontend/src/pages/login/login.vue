<template>
  <view class="login-page">
    <!-- Background decoration -->
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>

    <!-- Header -->
    <view class="login-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content" :style="{ height: navBarHeight + 'px' }">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="header-title">登录</text>
        <view class="header-right"></view>
      </view>
    </view>

    <!-- Main Content -->
    <view class="login-content">
      <!-- Logo Section -->
      <view class="logo-section">
        <view class="logo-wrapper">
          <view class="logo-circle">
            <text class="logo-text">红</text>
          </view>
          <view class="logo-glow"></view>
        </view>
        <text class="app-name">好物精选</text>
        <text class="app-slogan">品质生活，从这里开始</text>
      </view>

      <!-- Login Form -->
      <view class="form-section">
        <!-- Phone Input -->
        <view class="input-group">
          <view class="input-wrapper" :class="{ focused: phoneFocused, error: phoneError }">
            <text class="input-icon">📱</text>
            <input
              type="number"
              class="input-field"
              placeholder="请输入手机号"
              v-model="phone"
              :focus="phoneFocused"
              @focus="phoneFocused = true"
              @blur="phoneFocused = false"
              @input="onPhoneInput"
              maxlength="11"
            />
            <text class="input-clear" v-if="phone.length > 0" @click="phone = ''">×</text>
          </view>
          <text class="error-tip" v-if="phoneError">{{ phoneError }}</text>
        </view>

        <!-- Code Input -->
        <view class="input-group">
          <view class="input-wrapper code-wrapper" :class="{ focused: codeFocused, error: codeError }">
            <text class="input-icon">🔐</text>
            <input
              type="number"
              class="input-field"
              placeholder="请输入验证码"
              v-model="code"
              :focus="codeFocused"
              @focus="codeFocused = true"
              @blur="codeFocused = false"
              maxlength="6"
            />
            <view class="code-btn" :class="{ disabled: countdown > 0 }" @click="sendCode">
              <text v-if="countdown === 0">获取验证码</text>
              <text v-else>{{ countdown }}s</text>
            </view>
          </view>
          <text class="error-tip" v-if="codeError">{{ codeError }}</text>
        </view>

        <!-- Agreement -->
        <view class="agreement-row">
          <view class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed">
            <text class="check-icon" v-if="agreed">✓</text>
          </view>
          <text class="agreement-text">我已阅读并同意</text>
          <text class="agreement-link">《用户协议》</text>
          <text class="agreement-text">和</text>
          <text class="agreement-link">《隐私政策》</text>
        </view>

        <!-- Login Button -->
        <button class="login-btn" :class="{ loading: isLoading }" @click="handleLogin" :disabled="isLoading">
          <text class="btn-text" v-if="!isLoading">登 录</text>
          <text class="btn-loading" v-else>登录中...</text>
        </button>

        <!-- Third Party Login -->
        <view class="third-party-section">
          <view class="divider">
            <view class="divider-line"></view>
            <text class="divider-text">其他登录方式</text>
            <view class="divider-line"></view>
          </view>

          <view class="third-party-btns">
            <view class="third-party-btn" @click="handleWxLogin">
              <view class="btn-circle wechat">
                <text class="btn-icon">🍎</text>
              </view>
              <text class="btn-label">微信</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Bottom Tips -->
      <view class="bottom-tips">
        <text class="tips-text">登录即表示同意</text>
        <text class="tips-link">《用户服务协议》</text>
        <text class="tips-text">和</text>
        <text class="tips-link">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores';
import { login, sendCode as sendCodeApi } from '@/api';

const userStore = useUserStore();

const phone = ref('');
const code = ref('');
const agreed = ref(true);
const phoneFocused = ref(false);
const codeFocused = ref(false);
const phoneError = ref('');
const codeError = ref('');
const isLoading = ref(false);
const countdown = ref(0);

const statusBarHeight = ref(20);
const navBarHeight = ref(44);

let countdownTimer: ReturnType<typeof setInterval> | null = null;

const goBack = () => {
  uni.navigateBack();
};

const onPhoneInput = () => {
  phoneError.value = '';
};

const sendCode = async () => {
  if (countdown.value > 0) return;

  if (!phone.value || phone.value.length !== 11) {
    phoneError.value = '请输入正确的手机号';
    return;
  }

  try {
    await sendCodeApi(phone.value);
    countdown.value = 60;
    countdownTimer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        countdown.value = 0;
        if (countdownTimer) clearInterval(countdownTimer);
      }
    }, 1000);
    uni.showToast({ title: '验证码已发送', icon: 'success' });
  } catch (error: any) {
    uni.showToast({ title: error.message || '发送失败', icon: 'none' });
  }
};

const validateForm = () => {
  let valid = true;

  if (!phone.value || phone.value.length !== 11) {
    phoneError.value = '请输入正确的手机号';
    valid = false;
  }

  if (!code.value || code.value.length < 4) {
    codeError.value = '请输入6位验证码';
    valid = false;
  }

  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' });
    valid = false;
  }

  return valid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const result = await login({
      phone: phone.value,
      code: code.value,
    });

    userStore.setToken(result.token);
    userStore.setUserInfo(result.userInfo);

    uni.showToast({ title: '登录成功', icon: 'success' });

    setTimeout(() => {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({ url: '/pages/index/index' });
      }
    }, 1000);
  } catch (error: any) {
    uni.showToast({ title: error.message || '登录失败', icon: 'none' });
  } finally {
    isLoading.value = false;
  }
};

const handleWxLogin = async () => {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' });
    return;
  }

  // #ifdef MP-WEIXIN
  try {
    isLoading.value = true;

    const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject,
      });
    });

    // 调用后端微信登录
    const result = await login({
      phone: '',
      code: loginRes.code,
    });

    userStore.setToken(result.token);
    userStore.setUserInfo(result.userInfo);

    uni.showToast({ title: '登录成功', icon: 'success' });

    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' });
    }, 1000);
  } catch (error: any) {
    uni.showToast({ title: error.message || '微信登录失败', icon: 'none' });
  } finally {
    isLoading.value = false;
  }
  // #endif

  // #ifndef MP-WEIXIN
  uni.showToast({ title: '请在微信小程序中使用', icon: 'none' });
  // #endif
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
    console.log('获取胶囊按钮位置失败', e);
  }
  // #endif
});

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.login-page {
  min-height: 100vh;
  background: #FFF;
  position: relative;
  overflow: hidden;
}

/* ========================================
   BACKGROUND DECORATION
   ======================================== */

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500rpx;
  background: linear-gradient(180deg, #E53935 0%, #C62828 50%, #FFEBEE 100%);
  overflow: hidden;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
  }

  .circle-1 {
    width: 400rpx;
    height: 400rpx;
    top: -100rpx;
    right: -100rpx;
  }

  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    top: 200rpx;
    left: -150rpx;
  }

  .circle-3 {
    width: 200rpx;
    height: 200rpx;
    top: 400rpx;
    right: 100rpx;
  }
}

/* ========================================
   HEADER
   ======================================== */

.login-header {
  position: relative;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;

  .back-icon {
    font-size: 44rpx;
    color: #FFF;
    font-weight: 300;
  }
}

.header-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #FFF;
}

.header-right {
  width: 64rpx;
}

/* ========================================
   LOGIN CONTENT
   ======================================== */

.login-content {
  position: relative;
  z-index: 10;
  padding: 0 48rpx;
}

/* ========================================
   LOGO SECTION
   ======================================== */

.logo-section {
  text-align: center;
  padding: 60rpx 0 80rpx;
}

.logo-wrapper {
  position: relative;
  display: inline-block;
}

.logo-circle {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #FFF, #F5F5F5);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.2);

  .logo-text {
    font-size: 72rpx;
    font-weight: 700;
    background: linear-gradient(135deg, #E53935, #C62828);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.logo-glow {
  position: absolute;
  inset: -20rpx;
  background: radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

.app-name {
  display: block;
  font-size: 52rpx;
  font-weight: 700;
  color: $text-primary;
  margin-top: 32rpx;
  letter-spacing: 4rpx;
}

.app-slogan {
  display: block;
  font-size: 28rpx;
  color: $text-secondary;
  margin-top: 16rpx;
}

/* ========================================
   FORM SECTION
   ======================================== */

.form-section {
  background: #FFF;
  border-radius: 32rpx;
  padding: 48rpx;
  box-shadow: 0 -16rpx 48rpx rgba(0,0,0,0.08);
}

.input-group {
  margin-bottom: 32rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  height: 100rpx;
  background: #F8F8F8;
  border-radius: 50rpx;
  padding: 0 32rpx;
  border: 4rpx solid transparent;
  transition: all 0.3s ease;

  &.focused {
    background: #FFF;
    border-color: $primary-color;
    box-shadow: 0 4rpx 16rpx rgba($primary-color, 0.1);
  }

  &.error {
    border-color: #FF3B30;
  }
}

.code-wrapper {
  padding-right: 8rpx;
}

.input-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.input-field {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
  color: $text-primary;

  &::placeholder {
    color: $text-hint;
  }
}

.input-clear {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: $text-hint;
  background: #E0E0E0;
  border-radius: 50%;
}

.code-btn {
  padding: 16rpx 24rpx;
  background: $primary-color;
  border-radius: 32rpx;
  font-size: 24rpx;
  color: #FFF;
  font-weight: 600;
  white-space: nowrap;

  &.disabled {
    background: #E0E0E0;
    color: $text-hint;
  }
}

.error-tip {
  display: block;
  font-size: 24rpx;
  color: #FF3B30;
  margin-top: 12rpx;
  padding-left: 32rpx;
}

.agreement-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
  flex-wrap: wrap;
  gap: 8rpx;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid $border-color;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8rpx;

  &.checked {
    background: $primary-color;
    border-color: $primary-color;
  }

  .check-icon {
    font-size: 22rpx;
    color: #FFF;
    font-weight: 700;
  }
}

.agreement-text {
  font-size: 24rpx;
  color: $text-secondary;
}

.agreement-link {
  font-size: 24rpx;
  color: $primary-color;
  font-weight: 500;
}

/* ========================================
   LOGIN BUTTON
   ======================================== */

.login-btn {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(135deg, #E53935, #C62828);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba($primary-color, 0.4);
  border: none;

  &::after {
    border: none;
  }

  &.loading {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.98);
  }

  .btn-text {
    font-size: 34rpx;
    font-weight: 700;
    color: #FFF;
    letter-spacing: 4rpx;
  }

  .btn-loading {
    font-size: 28rpx;
    color: #FFF;
  }
}

/* ========================================
   THIRD PARTY SECTION
   ======================================== */

.third-party-section {
  margin-top: 64rpx;
}

.divider {
  display: flex;
  align-items: center;
  gap: 24rpx;

  .divider-line {
    flex: 1;
    height: 2rpx;
    background: $border-color;
  }

  .divider-text {
    font-size: 24rpx;
    color: $text-hint;
    white-space: nowrap;
  }
}

.third-party-btns {
  display: flex;
  justify-content: center;
  margin-top: 48rpx;
  gap: 80rpx;
}

.third-party-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;

  .btn-circle {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;

    &.wechat {
      background: #07C160;
    }
  }

  .btn-label {
    font-size: 24rpx;
    color: $text-secondary;
  }
}

/* ========================================
   BOTTOM TIPS
   ======================================== */

.bottom-tips {
  text-align: center;
  margin-top: 64rpx;
  padding-bottom: 48rpx;
}

.tips-text {
  font-size: 22rpx;
  color: $text-hint;
}

.tips-link {
  font-size: 22rpx;
  color: $primary-color;
}
</style>
