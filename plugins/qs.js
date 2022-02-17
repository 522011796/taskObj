import Vue from 'vue'
import qs from 'qs'

export default ({ app, store, req }) => {
  Vue.prototype.$qs = qs;
}
