<script>
import {common, commonConfig} from "../utils/api/url";
import {deviceType, orderColor, sceneType, templateType} from "../utils/utils";

    export default {
      name: "mixins",
      data(){
        return {
          globalTest: '0',
          minxinsScroll: false,
          baseUrl: '',
          envKey: '',
          sessionId: '',
          appType: '',
          globalDeviceType: '',
          userKey: '',
          contentDefaultStyle:{
            'height': '0px',
            'overflow-y': 'hiddle'
          },
          contentStyle:{
            'height': '0px',
            'overflow-y': 'auto'
          }
        }
      },
      mounted() {
        this.initBridage();
      },
      created() {
        this.getUrl();
        this.mainStyle();
        this.defaultStyle();
      },
      methods: {
        defaultStyle(){
          if (process.browser) {
            let screenWidth = window.innerWidth;
            this.contentDefaultStyle.height = window.innerHeight + 'px';
          }
        },
        mainStyle(){
          if (process.browser) {
            let screenWidth = window.innerWidth;
            let headHeight = this.appType == "app" ? 0 : 40;
            this.contentStyle.height = window.innerHeight - headHeight + 'px';
          }
        },
        getUrl(){
          this.baseUrl = commonConfig.baseUrl;
          this.sessionId = this.$route.query.sessionId;
          this.userKey = this.$route.query.userKey;
          this.appType = this.$route.query.appType;
          this.globalDeviceType = this.$route.query.deviceType;
          if (process.client){
            this.envKey = this.$route.query.envKey != "" && this.$route.query.envKey != undefined ? this.$route.query.envKey : localStorage.getItem("envKey");
            localStorage.setItem("envKey", this.envKey);

            this.sessionId = this.$route.query.sessionId != "" && this.$route.query.sessionId != undefined ? this.$route.query.sessionId : localStorage.getItem("sessionId");
            localStorage.setItem("sessionId", this.sessionId);

            this.userKey = this.$route.query.userKey != "" && this.$route.query.userKey != undefined ? this.$route.query.userKey : localStorage.getItem("userKey");
            localStorage.setItem("userKey", this.userKey);

            if (this.appType == "app" && this.$route.query.role != 'ROLE_ADMIN'){
              localStorage.removeItem("accountRole");
            }
            if (this.appType == "app" && this.$route.query.role == 'ROLE_ADMIN'){
              localStorage.setItem("accountRole", 'ROLE_ADMIN');
            }
          }
        },
        changeTime(time, num) {
          let hour = 0
          let minute = 0
          let second = 0
          second = time / 1000
          if (second >= 3600) {
            minute = (second - (second % 60)) / 60
            hour = parseInt((minute / 60).toString())
            minute = minute % 60
            /* eslint-disable */
            hour >= 10 ? hour : hour = '0' + hour
            minute >= 10 ? minute : minute = '0' + minute
            second = second % 60
            second >= 10 ? second : second = '0' + second
            /* eslint-enable */
            return hour + ':' + minute + ':' + second
          }
          if (second < 3600 && second >= 60) {
            hour = '00'
            minute = parseInt((second / 60).toString())
            /* eslint-disable */
            minute >= 10 ? minute : minute = '0' + minute
            second = second % 60
            second >= 10 ? second : second = '0' + second
            /* eslint-enable */
            return hour + ':' + minute + ':' + second
          }
          if (second < 60) {
            hour = '00'
            minute = '00'
            second = parseInt(second)
            /* eslint-disable */
            second >= 10 ? second : second = '0' + second
            /* eslint-enable */
            return hour + ':' + minute + ':' + second
          }
        },
        compareValue(value1,value2){
          if (value1 < value2){
            return -1;
          }else if (value1 > value2){
            return 1;
          }else{
            return 0;
          }
        },
        templateTypeInfo(type){
          return templateType(type);
        },
        sceneTypeInfo(type){
          return sceneType(type);
        },
        deviceTypeInfo(type){
          return deviceType(type);
        },
        orderColorInfo(type){
          return orderColor(type);
        },
        setPageStatus(value){
          /**
           * value: 1:首页，2:场景列表
           */
          let _self = this;
          this.setupWebViewJavascriptBridge(function(bridge) {
            //JS 调用 OC 的方法，方法名就是 OC 中提前注册的方法
            bridge.callHandler('setPageStatus', {'key': value}, function responseCallback(responseData) {

            });
          })
        },
        showDialogStatus(){
          let _self = this;
          this.setupWebViewJavascriptBridge(function(bridge) {
            //JS 调用 OC 的方法，方法名就是 OC 中提前注册的方法
            bridge.callHandler('showDialogStatus', null, function responseCallback(responseData) {

            });
          })
        },
        dismissDialogStatus(){
          let _self = this;
          this.setupWebViewJavascriptBridge(function(bridge) {
            //JS 调用 OC 的方法，方法名就是 OC 中提前注册的方法
            bridge.callHandler('dismissDialogStatus', null, function responseCallback(responseData) {

            });
          })
        },
        setupWebViewJavascriptBridge(callback) {
          if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
          if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
          window.WVJBCallbacks = [callback];
          var WVJBIframe = document.createElement('iframe');
          WVJBIframe.style.display = 'none';
          WVJBIframe.src = 'https://__bridge_loaded__';
          //WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
          document.documentElement.appendChild(WVJBIframe);
          setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
        },
        initBridage(){
          let _self = this;
          this.setupWebViewJavascriptBridge(function(bridge) {
            bridge.registerHandler('JS Echo', function(data, responseCallback) {
              if (data['value'] == 1){//任务列表
                _self.$router.push({
                  path: '/',
                  query: {
                    envKey: _self.$route.query.envKey,
                    sessionId: _self.$route.query.sessionId,
                    role: _self.$route.query.role,
                    userKey: _self.$route.query.userKey,
                    appType: _self.$route.query.appType,
                    deviceType: _self.$route.query.deviceType,
                  }
                });
              }
              if (data['value'] == 2){//模版列表
                _self.$router.push({
                  path: '/',
                  query: {
                    envKey: _self.$route.query.envKey,
                    sessionId: _self.$route.query.sessionId,
                    role: _self.$route.query.role,
                    userKey: _self.$route.query.userKey,
                    appType: _self.$route.query.appType,
                    deviceType: _self.$route.query.deviceType,
                  }
                });
              }
              if (data['value'] == 300){//任务列表
                _self.setPageStatus(1);
                _self.$router.push({
                  path: '/orderList',
                  query: {
                    envKey: _self.$route.query.envKey,
                    sessionId: _self.$route.query.sessionId,
                    role: _self.$route.query.role,
                    userKey: _self.$route.query.userKey,
                    appType: _self.$route.query.appType,
                    deviceType: _self.$route.query.deviceType,
                  }
                });
              }
              if (data['value'] == 400){//模版列表
                _self.setPageStatus(2);
                _self.$router.push({
                  path: '/templateList',
                  query: {
                    envKey: _self.$route.query.envKey,
                    sessionId: _self.$route.query.sessionId,
                    role: _self.$route.query.role,
                    userKey: _self.$route.query.userKey,
                    appType: _self.$route.query.appType,
                    deviceType: _self.$route.query.deviceType,
                  }
                });
              }
              responseCallback(data);
            });
          })
        }
      }
    }
</script>

<style scoped>

</style>
