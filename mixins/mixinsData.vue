<script>
import {common, commonConfig} from "../utils/api/url";
import {inArray, MessageError, MessageWarning, orderValue} from "../utils/utils";
    export default {
      name: "mixins",
      data(){
        return {
          globalRoomList: [],
          globalRoomObj: {},
          globalDeviceOldList: [],
          globalDeviceList: [],
          globalGroupDeviceList: [],
          globalLightGroupList: [],
          globalCurtainsGroupList: [],
        }
      },
      mounted() {

      },
      created() {
        this.getRoomList();
        this.getDeviceOldList();
        this.getCurtainsGroupList();
        this.getLightGroupList();
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
        async getDeviceList(type){
          let data = [];
          let params = {
            envKey: this.envKey,
            pageNum: 1,
            pageSize: 99999
          };
          await this.$axios.get(this.baseUrl + common.deviceList, {params: params, sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
            if (res.data.code == 200) {
              let list = res.data.data.list;
              let listArr = [];
              //type不为空，过滤掉非type设备
              if (type || type === 0) {
                for (let i = 0; i < list.length; i++) {
                  if (list[i].devType === type) {
                    listArr.push(list[i]);
                  }
                }
                list = listArr;
              }
              this.globalDeviceList = list;
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
        getLightGroupList(){
          let params = {
            envKey: this.envKey,
            pageNum: 1,
            pageSize: 99999
          };
          this.$axios.get(this.baseUrl + common.lightGrouplist, {params: params, sessionId: this.sessionId, userKey: this.userKey}).then(res => {
            if (res.data.code == 200) {
              //console.log("lightgroup", res.data.data);
              this.globalLightGroupList = res.data.data;
            }
          });
        },
        getCurtainsGroupList(){
          let params = {
            envKey: this.envKey,
            pageNum: 1,
            pageSize: 99999
          };
          this.$axios.get(this.baseUrl + common.curtainsGrouplist, {params: params, sessionId: this.sessionId, userKey: this.userKey}).then(res => {
            if (res.data.code == 200) {
              this.globalCurtainsGroupList = res.data.data;
            }
          });
        },
        async getGroupDeviceList(type){
          if (!type){
            return;
          }
          let data = [];
          let params = {
            envKey: this.envKey,
            pageNum: 1,
            pageSize: 99999
          };
          await this.$axios.get(this.baseUrl + common.deviceList, {params: params, sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
            if (res.data.code == 200) {
              let list = res.data.data.list;
              let listArr = [];
              //type不为空，过滤掉非type设备
              if (type || type === 0){
                for (let i =0; i < list.length; i++){
                  if (parseInt(type)===parseInt(list[i].devType)){
                    listArr.push(list[i]);
                  }
                }
                list = listArr;
              }
              let subGroupArr = [];
              let subRoomArr = [];
              let roomArr = [];
              let roomChild = [];
              let att = [];
              //将分组的字段单独保存到数组中
              list.map((e) => {
                if (e['subgroup']) {
                  subGroupArr.push(e['subgroup']);
                }
                roomArr.push(e['room']);
              });
              //数组去重
              subGroupArr = subGroupArr.filter((e, i, self) => {
                return self.indexOf(e) == i
              });
              roomArr = roomArr.filter((e, i, self) => {
                return self.indexOf(e) == i
              });
              for (let j = 0; j < roomArr.length; j++) {
                //过滤出匹配到的数据
                let arr = list.filter((e) => {
                  e['label'] = e.name;
                  return e.room == roomArr[j];
                });

                let room = arr[0].room;
                let roomName = "";
                //匹配房间名称
                this.globalRoomList.filter(function (item, index) {
                  if (item.id == room){
                    roomName = item.name;
                  }
                });
                if (room == 0){
                  roomName = this.$t("全屋");
                }

                att.push({
                  type: 'room',
                  label: roomName,
                  value: roomName,
                  room: room
                });
                att[j]['children'] = [];

                let arrTemp;
                for(let i = 0;i < arr.length;i++) {
                  //过滤出匹配到的数据
                  if (arr[i].subgroup != null){
                    arrTemp = arr.filter((e) => {
                      let subGroupName = "";
                      //匹配设备组名称
                      if (e.devType == 1){
                        this.globalLightGroupList.filter(function (item, index) {
                          if (item.id == e.subgroup){
                            subGroupName = item.name;
                          }
                        });
                      }else if (e.devType == 3){
                        this.globalCurtainsGroupList.filter(function (item, index) {
                          if (item.id == e.subgroup){
                            subGroupName = item.name;
                          }
                        });
                      }

                      e['label'] = subGroupName;
                      e['value'] = subGroupName;
                      e['subGroupName'] = subGroupName;
                      e['devType'] = e.devType;
                      e['type'] = 'device';
                      return e.subgroup == arr[i].subgroup;
                    });

                    let child = {
                      type: 'subGroup',
                      label: arrTemp[0].subGroupName,
                      value: arrTemp[0].subGroupName,
                      subGroup: arrTemp[0].subgroup,
                      children: arrTemp
                    };

                    let sel = inArray(child, att[j]['children'], 'subGroup');
                    if (sel == -1){
                      att[j]['children'].push(child);
                    }
                  }else {
                    let child = {
                      type: 'device',
                      label: arr[i].name,
                      value: arr[i].sn,
                      sn: arr[i].sn,
                      devType: arr[i].devType,
                      subGroup: arr[i].subgroup
                    };
                    let sel = inArray(child, att[j]['children'], 'subGroup');
                    if (sel == -1){
                      att[j]['children'].push(child);
                    }
                  }
                }
              }
              this.globalGroupDeviceList = att;
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
