<script>
import {common, commonConfig} from "../utils/api/url";
    export default {
      name: "mixins",
      data(){
        return {
          globalRoomList: [],
          globalRoomObj: {},
          globalDeviceOldList: []
        }
      },
      mounted() {

      },
      created() {
        this.getRoomList();
        this.getDeviceOldList();
      },
      methods: {
        getRoomList(){
          let params = {
            envKey: this.envKey,
            pageNum: 1,
            pageSize: 99999
          };
          this.globalRoomObj = {};
          this.$axios.get(this.baseUrl + common.roomList, {params: params, sessionId: this.sessionId, userKey: this.userKey}).then(res => {
            if (res.data.code == 200) {
              this.globalRoomList = res.data.data;
              for (let i = 0; i < this.globalRoomList.length; i++){
                this.globalRoomObj[this.globalRoomList[i].id] = this.globalRoomList[i].name;
              }
            }
          });
        },
        getDeviceOldList(){
          let data = [];
          let params = {
            envKey: this.envKey,
            pageNum: 1,
            pageSize: 99999
          };
          this.$axios.get(this.baseUrl + common.deviceList, {params: params, sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
            if (res.data.code == 200) {
              this.globalDeviceOldList = res.data.data.list;
            }
          });
        },
        getDeviceName(val){
          for (let i = 0; i < this.globalDeviceOldList.length; i++){
            if (val == this.globalDeviceOldList[i].sn){
              return this.globalDeviceOldList[i].name;
            }
          }
        }
      }
    }
</script>

<style scoped>

</style>
