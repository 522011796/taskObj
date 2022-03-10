<script>
import {common, commonConfig} from "../utils/api/url";
import {deviceType, keyType, orderColor, orderValue, planType, sceneType, templateType} from "../utils/utils";

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
          globalDataKeys: [],
          globalSwitchKeyTypeData: [
            {name:this.$t('释放'),value:'0'},
            {name:this.$t('按下'),value:'1'}
          ],
          globalLightOrderTypeData: [
            {name:this.$t('开/关灯控制'),value:'6'},
            {name:this.$t('亮度控制'),value:'7'},
            {name:this.$t('色温控制'),value:'8'},
            {name:this.$t('色彩控制'),value:'9'},
            {name:this.$t('循环操作'),value:'3'},
            {name:this.$t('延时'),value:'2'},
            {name:this.$t('空闲时段'),value:'1'}
          ],
          globalSwitchOrderTypeData: [
            {name:this.$t('继电器'),value:'11'},
            {name:this.$t('延时'),value:'2'},
            {name:this.$t('空闲时段'),value:'1'}
          ],
          globalMusicOrderTypeData: [
            {name:this.$t('音乐播放'),value:'13'},
            {name:this.$t('音乐暂停'),value:'14'},
            {name:this.$t('音乐音量'),value:'12'},
            {name:this.$t('音乐进度'),value:'15'},
            {name:this.$t('延时'),value:'2'}
          ],
          globalSenceOrderTypeData: [
            {name:this.$t('循环操作'),value:'3'},
            {name:this.$t('场景调用(勿使用2级以上嵌套)'),value:'4'},
            {name:this.$t('延时'),value:'2'},
            {name:this.$t('空闲时段'),value:'1'}
          ],
          globalChangeDeviceOrderTypeData: [
            {name:this.$t('串行器数据'),value:'18'},
            {name:this.$t('循环操作'),value:'3'},
            {name:this.$t('延时'),value:'2'},
            {name:this.$t('空闲时段'),value:'1'}
          ],
          globalDeviceTypeData: [
            {name:this.$t('灯'),value:'1'},
            {name:this.$t('开关'),value:'2'},
            {name:this.$t('窗帘'),value:'3'},
            {name:this.$t('音乐'),value:'5'},
            {name:this.$t('串行器'),value:'6'},
            {name:this.$t('场景'),value:'0'}
          ],
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
        converRgbToArgb(r,g,b){
          var color = ((0xFF0000 << 24)|(r << 16)|(g << 8)|b);
          return color;
        },
        converArgbToRgb(argb){
          var rgb = [];
          rgb[0] = (argb & 0xff0000) >> 16;
          rgb[1] = (argb & 0xff00) >> 8;
          rgb[2] = (argb & 0xff);
          return "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
        },
        hsltorgb(h,s,l) {
          var h = h / 360;
          var s = s / 100;
          var l = l / 100;
          var rgb = [];

          if (s == 0) {
            rgb = [Math.round(l * 255), Math.round(l * 255), Math.round(l * 255)];
          } else {
            var q = l >= 0.5 ? (l + s - l * s) : (l * (1 + s));
            var p = 2 * l - q;
            var tr = rgb[0] = h + 1 / 3;
            var tg = rgb[1] = h;
            var tb = rgb[2] = h - 1 / 3;
            for (var i = 0; i < rgb.length; i++) {
              var tc = rgb[i];
              if (tc < 0) {
                tc = tc + 1;
              } else if (tc > 1) {
                tc = tc - 1;
              }
              switch (true) {
                case (tc < (1 / 6)):
                  tc = p + (q - p) * 6 * tc;
                  break;
                case ((1 / 6) <= tc && tc < 0.5):
                  tc = q;
                  break;
                case (0.5 <= tc && tc < (2 / 3)):
                  tc = p + (q - p) * (4 - 6 * tc);
                  break;
                default:
                  tc = p;
                  break;
              }
              rgb[i] = Math.round(tc * 255);
            }
          }
          return rgb;
        },
        colorRGBtoHex(r, g, b) {
          return ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
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
        campareDataTime(data){
          this.globalDataKeys = data;
        },
        returnDataKeys(data){
          return data;
        },
        planTypeInfo(value){
          return planType('set', value);
        },
        concatArray(data) {

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
        orderValueInfo(value, type){
          return orderValue(type, value);
        },
        keyTypeInfo(type){
          return keyType(type);
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
