<template>
  <div>
    <el-drawer
      custom-class="drawer-block"
      :modal="false"
      :show-close="false"
      size="90%"
      :visible.sync="drawer_"
      direction="btt"
      :before-close="handleClose">
      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="4">
              <div class="textCenter">
                <el-button v-if="type == 'device'" type="text" class="color-666666" @click="returnGroup">{{$t('返回')}}</el-button>
                <el-button v-else type="text" class="color-666666" @click="cancelGroup">{{$t('取消')}}</el-button>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="textCenter">
                <span>{{$t('设备设置')}}</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="textCenter">
                <el-button v-if="type == 'device'" type="text" class="color-success" @click="okDevice">{{$t('确定')}}</el-button>
                <el-button v-else type="text" class="color-666666" @click="okGroup">{{$t('确定')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="padding-full10">
        <template>
          <div v-if="type == 'group'" class="item-list-block" v-for="(item, index) in data_" :key="index" v-loading="item.loading" @click="itemClick($event, item, index)">
            <el-row>
              <el-col :span="18">
                <label>
                  {{ deviceTypeInfo(item.t) }}
                </label>
              </el-col>
              <el-col :span="6" class="textRight">
                <span>{{item.extraCount}}</span>
                /
                <span class="color-success">{{item.d.length}}</span>
              </el-col>
            </el-row>
          </div>

          <div v-if="type == 'device'" class="item-list-block" v-for="(item, index) in deviceList" :key="index">
            <el-row>
              <el-col :span="12">
                <a href="javascript:;" class="color-warning" @click="editName($event, item, index)">
                  {{ item.name }}
                  <i class="fa fa-edit"></i>
                </a>
              </el-col>
              <el-col :span="12" class="textRight">
                <a href="javascript:;" class="color-success" @click="editDevice($event, item, index)">
                  {{ item.extraSn ? item.extraName : $t('请设置') }}
                  <i v-if="!item.extraSn" class="fa fa-edit"></i>
                  <i v-if="item.extraSn" class="fa fa-times" @click.stop="removeDeviceItem($event, item, index)"></i>
                </a>
              </el-col>
            </el-row>
          </div>
        </template>
      </div>
    </el-drawer>

    <DialogInput :dialog-input="dialogInput" :message="inputValue" @cancel="cancelDialog" @okClick="okDialog"></DialogInput>

    <DrawerDeviceList :drawer-device-list="drawerDeviceList" :data="deviceBottomList" @click="itemDeviceClick" @handleClose="handleDeviceClose"></DrawerDeviceList>
  </div>
</template>

<script>
import DialogInput from "./DialogInput";
import DrawerDeviceList from "./DrawerDeviceList";
import mixins from "../mixins/mixins";
export default {
  components: {DrawerDeviceList, DialogInput},
  mixins: [mixins],
  props:{
    drawerDeviceGroup: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: function (){
        return []
      }
    }
  },
  computed: {
    drawer_:{
      get(){
        return this.drawerDeviceGroup
      },
      set(v){
        this.$emit("changeDialog",v)
      }
    },
    data_:{
      get(){
        this.groupList = this.data;
        return this.groupList;
      },
      set(v){

      }
    }
  },
  data() {
    return {
      inputValue: '',
      type: 'group',
      loading: false,
      dialogInput: false,
      drawerDeviceList: false,
      editIndex: '',
      groupIndex: '',
      extraCount: 0,
      groupList: [],
      deviceList: [],
      deviceBakList: [],
      deviceBottomList: [],
      deviceBottomBakList: [],
      deviceItemAllList: []
    }
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      for (let i = 0; i < this.groupList.length; i++){
        this.groupList[i]['loading'] = false;
      }
    },
    itemClick(event, item, index){
      this.type = 'device';
      this.groupIndex = index;
      this.extraCount = this.groupList[this.groupIndex].extraCount;
      this.deviceItemAllList = JSON.parse(JSON.stringify(item.dd));
      this.deviceList = JSON.parse(JSON.stringify(item.d));
      this.deviceBakList = JSON.parse(JSON.stringify(item.d));
    },
    itemDeviceClick(data, index){
      this.extraCount++;
      this.$set(this.deviceList[this.editIndex], 'extraName', data.name);
      this.$set(this.deviceList[this.editIndex], 'extraSn', data.n);
      this.$set(this.deviceList[this.editIndex], 'extraCount', this.extraCount);

      this.deviceBottomList.splice(index, 1);
      this.drawerDeviceList = false;
    },
    removeDeviceItem(event, item, index){
      this.deviceItemAllList.splice(this.deviceItemAllList.length, 0, {
        label: item.extraName,
        n: item.extraSn,
        name: item.extraName,
      });
      item.label = '';
      item.extraSn = '';
      item.extraName = '';
      item.extraCount--;
    },
    returnGroup(){
      this.type = 'group';
      this.deviceList = [];
      this.deviceItemAllList = [];
      this.deviceBottomList = [];
    },
    handleClose(done) {
      this.$emit('handleClose', done, this.type);
    },
    handleDeviceClose(){
      this.drawerDeviceList = false;
      this.deviceBottomList = [];
      this.deviceBottomBakList = [];
    },
    editName(event, item, index){
      this.inputValue = item.name;
      this.editIndex = index;
      this.dialogInput = true;
    },
    editDevice(event, item, index){
      this.editIndex = index;
      let deviceItemAllList = this.deviceItemAllList;
      let deviceItemAllBakList = this.deviceItemAllList;
      this.deviceBottomList = deviceItemAllList;
      this.deviceBottomBakList = deviceItemAllBakList;
      this.drawerDeviceList = true;
    },
    cancelDialog(){
      this.dialogInput = false;
      this.editIndex = '';
    },
    okDialog(data){
      this.$set(this.deviceList[this.editIndex], 'name', data);
      this.dialogInput = false;
      this.editIndex = '';
    },
    okDevice(){
      this.$set(this.groupList[this.groupIndex], 'd', this.deviceList);
      this.$set(this.groupList[this.groupIndex], 'dd', this.deviceItemAllList);
      this.$set(this.groupList[this.groupIndex], 'extraCount', this.extraCount);

      if (this.groupList[this.groupIndex].extraCount == this.groupList[this.groupIndex].d.length){
        this.type = 'group';
      }else {
        this.$toast(this.$t('有未设置的设备信息！'));
      }
    },
    cancelGroup(){
      this.$emit('cancelGroup');
    },
    okGroup(){
      this.$emit('okGroup');
    }
  }
}
</script>
