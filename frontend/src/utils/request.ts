// API 基础配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// 请求拦截
interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  showLoading?: boolean;
  showError?: boolean;
  timeout?: number;
}

// 获取存储的 token
const getToken = (): string => {
  const userInfo = uni.getStorageSync('user-store');
  return userInfo?.state?.token || '';
};

// 请求封装
export const request = <T = any>(options: RequestOptions): Promise<T> => {
  const { url, method = 'GET', data, header = {}, showLoading = true, showError = true, timeout = 30000 } = options;

  // 显示加载
  if (showLoading) {
    uni.showLoading({ title: '加载中...', mask: true });
  }

  // 设置请求头
  const token = getToken();
  if (token) {
    header['Authorization'] = `Bearer ${token}`;
  }
  header['Content-Type'] = 'application/json';

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header,
      timeout,
      success: (res: any) => {
        if (showLoading) {
          uni.hideLoading();
        }
        
        const result = res.data;
        
        // 请求成功
        if (result.code === 0) {
          resolve(result.data);
        }
        // 未登录
        else if (result.code === 401) {
          uni.removeStorageSync('user-store');
          uni.showToast({ title: '请先登录', icon: 'none' });
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/login' });
          }, 1000);
          reject(result);
        }
        // 其他错误
        else {
          if (showError) {
            uni.showToast({ title: result.message || '请求失败', icon: 'none' });
          }
          reject(result);
        }
      },
      fail: (err) => {
        if (showLoading) {
          uni.hideLoading();
        }
        if (showError) {
          uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' });
        }
        reject(err);
      },
    });
  });
};

// GET 请求
export const get = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
  return request<T>({ url, method: 'GET', data, ...options });
};

// POST 请求
export const post = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
  return request<T>({ url, method: 'POST', data, ...options });
};

// PUT 请求
export const put = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
  return request<T>({ url, method: 'PUT', data, ...options });
};

// DELETE 请求
export const del = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
  return request<T>({ url, method: 'DELETE', data, ...options });
};

export default { request, get, post, put, del };
