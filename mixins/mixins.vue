<script>
import {common, commonConfig} from "../utils/api/url";
import {deviceType, sceneType, templateType} from "../utils/utils";

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

      },
      created() {
        this.mainStyle();
        this.defaultStyle();
        this.getUrl();
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
            this.contentStyle.height = window.innerHeight - 40 + 'px';
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
        templateTypeInfo(type){
          return templateType(type);
        },
        sceneTypeInfo(type){
          return sceneType(type);
        },
        deviceTypeInfo(type){
          return deviceType(type);
        }
      }
    }
</script>

<style scoped>

</style>
