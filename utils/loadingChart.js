import { Loading } from 'element-ui';

let loading;
let loadingCount = 0;

const startLoading = () => {
  if (process.browser) {
    loading = Loading.service({
      lock: true,
      text: '数据绘制中,请稍后...',
      spinner: 'el-icon-loading',
      background: 'rgba(221, 221, 221, 0.1)',
      customClass: 'custom-index-loading',
      target: document.querySelector('.default-block-class')//设置加载动画区域
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
export const showChartLoading = () => {
  if (loadingCount === 0){
    startLoading();
  }
  loadingCount += 1;
};

/**
 * 执行关闭，每次执行都-1，一直到等于0，表示所有请求都结束了
 */
export const hideChartLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount === 0) {
    endLoading();
  }
};

