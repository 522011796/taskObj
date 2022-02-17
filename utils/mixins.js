import global from "~/utils/global";
import {common} from "~/utils/api/url";

export default {
  data (){
    return {
      value: ''
    }
  },
  mounted(){
    window.addEventListener("resize", () => {
      this.g_HH();
    });
  },
  created() {
    this.g_HH();
  },
  methods: {
    //*****以下函数为公共调用，主要用于封装，全部用两个__开头命名，（后期增加，前期未统一处理，所以前期是分别再不同的页面中）****/
    /**
     * 设置下拉数据选择
     * @param data 传递过来的选择数据
     * @param attr 传递过来需要重新设置的字段
     * @param obj 传递过来需要重新设置的数据对象，这里适用$set进行更新，实时更新数据和视图
     * @private
     */
    __selFunc(data, attr, obj){
      if (obj && typeof obj == 'object'){
        this.$set(obj, attr, data);
      }else {
        this[attr] = data;
      }
    },
    /**
     * 点击分页
     * @param event 页码
     * @param func 需要执行的函数
     * @param pageAttr 需要改变的属性，默认page
     * @private
     */
    __currentPage(event, func, pageAttr){
      if (pageAttr){
        this[pageAttr] = event;
      }else {
        this.page = event;
      }
      if(typeof func == 'function'){
        func();
      }
    },
    /**
     * 分页总条数
     * @param event 总条数
     * @param func 需要执行的函数
     * @param pageAttr 需要改变的当前page属性，默认page = 1
     * @param numAttr 需要改变的属性，默认num
     * @private
     */
    __sizeChange(event, func, pageAttr, numAttr){
      if (pageAttr){
        this[pageAttr] = 1;
      }else {
        this.page = 1;
      }
      if (numAttr){
        this[numAttr] = event;
      }else {
        this.num = event;
      }
      if(typeof func == 'function'){
        func();
      }
    },
    /**
     * 点击跳转分页
     * @param event 页码
     * @param func 需要执行的函数
     * @param pageAttr 需要改变的属性，默认page
     * @private
     */
    __jumpPage(event, func, pageAttr){
      if (pageAttr){
        this[pageAttr] = event;
      }else {
        this.page = event;
      }
      if(typeof func == 'function'){
        func();
      }
    },
    /**
     * 搜索--仅支持单一属性
     * @param event 所搜框数据
     * @param func 需要执行的函数
     * @param pageAttr 需要改变的属性，默认page=1
     * @param attr 传递过来需要重新设置的字段
     * @param obj 传递过来需要重新设置的数据对象，这里适用$set进行更新，实时更新数据和视图
     * @private
     */
    __search(event, func, pageAttr, attr, obj){
      if (event['input']){
        if (obj && typeof obj == 'object'){
          this.$set(obj, attr, event.input);
        }else {
          this[attr] = event.input;
        }
      }else {
        if (obj && typeof obj == 'object'){
          this.$set(obj, attr, event);
        }else {
          this[attr] = event;
        }
      }
      if (pageAttr){
        this[pageAttr] = 1;
      }else {
        this.page = 1;
      }
      if(typeof func == 'function'){
        func();
      }
    },
    /**
     * 关闭弹层或者抽屉
     * @param attr 需要关闭的弹层或者抽屉
     * @private
     */
    __cancelDialog(attr){
      this[attr] = false;
    },
    //*****以下函数为公共调用，主要用于获取系统数据****/
    test() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.testDefault = 1111;
          resolve(this.testDefault);
        }, 3000)
      })
    },
    g_HH(){
      if (process.browser) {
        this.tableHeight.height = window.innerHeight - 230 + 'px';
      }
    }
  }
}
