import { Loading } from 'element-ui';

let loading;
let loadingCount = 0;

const startLoading = () => {
  if (process.browser) {
    loading = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(221, 221, 221, 0.3)',
      customClass: 'custom-g-loading',
      target: document.querySelector('.moon-right-menu')//设置加载动画区域
    });
  }
};

const endLoading = () => {
  if (process.browser) {
    loading.close();
  };
};

/**
 * 每次使用都默认+1，这样可以知道一共请求了多少此
 */
export const showLoading = () => {
  if (loadingCount === 0){
    startLoading();
  }
  loadingCount += 1;
};

/**
 * 执行关闭，每次执行都-1，一直到等于0，表示所有请求都结束了
 */
export const hideLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount === 0) {
    endLoading();
  }
};

