import Vue from 'vue'
import moment from 'moment'

export default ({ app, store, req }) => {
  //时间格式化插件
  Vue.prototype.$moment = moment;
  const langCli = 'zh_cn';
  moment.locale(langCli);
}
