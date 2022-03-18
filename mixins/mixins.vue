<script>
import {common, commonConfig} from "../utils/api/url";
import {
  deviceType,
  keyType,
  MessageCommonTips,
  openType,
  orderColor,
  orderValue,
  planType,
  sceneType,
  templateType
} from "../utils/utils";

    export default {
      name: "mixins",
      data(){
        return {
          globalDrawerHeight: '40%',
          globalDrawerSheetHeight: '50%',
          globalDrawerBottomHeight: '45%',
          globalDrawerSubSheetHeight: '40%',
          globalTest: '0',
          minxinsScroll: false,
          baseUrl: '',
          envKey: '',
          sessionId: '',
          appType: '',
          globalDeviceType: '',
          userKey: '',
          globalDataKeys: [],
          globalSenceListData: [],
          globalCellWidth: 60,
          globalScal: 1,
          scnenDuration: '',
          globalEditStatus: false,
          globalOprType: '',
          globalInsertTypeData: [
            {name:this.$t('上一行'),value:'up'},
            {name:this.$t('下一行'),value:'down'}
          ],
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
          globalCurtainsDeviceOrderTypeData: [
            {name:this.$t('行程控制'),value:'10'},
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
          colors: {
            hue: 50,
            saturation: 100,
            luminosity: 50,
            alpha: 1
          },
          contentDefaultStyle:{
            'height': '0px',
            'overflow-y': 'hiddle'
          },
          contentStyle:{
            'height': '0px',
            'overflow-y': 'auto'
          },
          contentWidthStyle:{
            'width': '0px',
            'overflow-y': 'auto'
          }
        }
      },
      mounted() {
        this.initBridage();
        window.addEventListener('orientationchange', (e) => {
          if (process.browser) {
            if (window.orientation == 0 || window.orientation == 180){
              this.globalDrawerHeight = '40%';
              this.globalDrawerSheetHeight = '50%';
              this.globalDrawerBottomHeight = '45%';
              this.globalDrawerSubSheetHeight = '40%';
            }else if (window.orientation == 90 || window.orientation == -90){
              this.globalDrawerHeight = '60%';
              this.globalDrawerSheetHeight = '70%';
              this.globalDrawerBottomHeight = '70%';
              this.globalDrawerSubSheetHeight = '40%';
            }
            this.mainStyle();
          }
        });
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
            this.contentWidthStyle.width = window.innerWidth + 'px';
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
        async getAsyncSourceUrl(sourceUrl){
          await this.$axios.get(sourceUrl).then(res => {
            this.scnenDuration = res.data.duration;
          });
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
        openTypeInfo(value){
          return openType(value);
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
        okScene(form,sceneList, func){
          //源码用
          let dataObj = {
            id:form.id,
            room: form.roomId,
            name: form.name,
            icon: 1,
            enable: 1,
            internal: form.internal == false ? 0 : 1,
            duration: form.duration,
            tasks: sceneList
          };
          //云端用
          let codeData = {
            envKey: this.$route.query.envKey != "" && this.$route.query.envKey != undefined ? this.$route.query.envKey : localStorage.getItem("envKey"),
            iconId: 1,
            internal: form.internal,
            openSource: false,
            roomId: form.roomId,
            sceneName: form.name,
            sceneType: 1,
            sourceCode: JSON.stringify(dataObj)
          };
          if (form.id != ""){
            codeData['sceneId'] = form.id;
          }
          codeData = this.$qs.stringify(codeData);

          let url = this.globalOprType == 'add' ? common.createSence : common.editSence;

          this.$axios.post(this.baseUrl + url, codeData, {sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
            if (res.data.code == 200){
              this.installSence(res.data.data.sceneId, dataObj.tasks);
              this.globalOprType = '';
              this.drawerEdit = false;
              if (process.client){
                localStorage.removeItem('taskTempList');
              }
              this.$router.push({
                path: '/',
                replace: true,
                query: {
                  envKey: this.$route.query.envKey,
                  sessionId: this.$route.query.sessionId,
                  role: this.$route.query.role,
                  userKey: this.$route.query.userKey,
                  appType: this.$route.query.appType,
                  deviceType: this.$route.query.deviceType,
                }
              });
            }else {
              MessageCommonTips(res.data.msg);
            }
            this.drawerEdit = false;
          });
        },
        installSence(senceId, tasks, func){
          let params = {
            envKey: this.$route.query.envKey != "" && this.$route.query.envKey != undefined ? this.$route.query.envKey : localStorage.getItem("envKey"),
            sceneId: senceId
          };
          params = this.$qs.stringify(params);
          this.$axios.post(this.baseUrl + common.installSence, params, {sessionId: this.sessionId, userKey: this.userKey}).then(res => {
            if (res.data.code == 200){
              MessageCommonTips(res.data.msg);
              //func();
            }else {
              MessageCommonTips(res.data.msg);
            }
          });
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
              if (data['value'] == 100){//保存场景指令
                alert();
                _self.saveTask();
              }
              if (data['value'] == 200){//添加任务
                _self.addTask();
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
