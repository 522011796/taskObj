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
                <el-button v-if="type == 'device'" type="text" class="color-666666" @click="returnGroup">返回</el-button>
                <span v-else>&nbsp;</span>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="textCenter">
                <span>设备设置</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="textCenter">
                <el-button v-if="type == 'device'" type="text" class="color-success" @click="okDevice">确定</el-button>
                <span v-else>&nbsp;</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="padding-full10">
        <template>
          <div v-if="type == 'group'" class="item-list-block" v-for="(item, index) in groupList" :key="index" v-loading="item.loading" @click="itemClick($event, item)">
            <el-row>
              <el-col :span="18">
                <label>
                  xxxxxxx
                </label>
              </el-col>
              <el-col :span="6" class="textRight">
                <span>0</span>
                /
                <span class="color-success">0</span>
              </el-col>
            </el-row>
          </div>

          <div v-if="type == 'device'" class="item-list-block" v-for="(item, index) in 10" :key="index">
            <el-row>
              <el-col :span="12">
                <a href="javascript:;" class="color-warning" @click="editName($event, item)">
                  xxxxxxx
                  <i class="fa fa-edit"></i>
                </a>
              </el-col>
              <el-col :span="12" class="textRight">
                <a href="javascript:;" class="color-success" @click="editDevice($event, item)">
                  sn0001
                  <i class="fa fa-edit"></i>
                </a>
              </el-col>
            </el-row>
          </div>
        </template>
      </div>
    </el-drawer>

    <DialogInput :dialog-input="dialogInput" @cancel="cancelDialog" @okClick="okDialog"></DialogInput>

    <DrawerDeviceList :drawer-device-list="drawerDeviceList" @click="itemDeviceClick" @handleClose="handleDeviceClose"></DrawerDeviceList>
  </div>
</template>

<script>
import DialogInput from "./DialogInput";
import DrawerDeviceList from "./DrawerDeviceList";
export default {
  components: {DrawerDeviceList, DialogInput},
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
    }
  },
  data() {
    return {
      inputValue: '',
      type: 'group',
      loading: false,
      dialogInput: false,
      drawerDeviceList: false,
      groupList: [],
      deviceList: []
    }
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      for (let i = 0; i < 10; i++){
        this.groupList.push({
          loading: false
        });
      }
    },
    itemClick(event, item){
      item.loading = true;
      setTimeout(()=>{
        this.type = 'device';
        item.loading = false;
      },2000);
    },
    itemDeviceClick(data){
      console.log(data);
      this.drawerDeviceList = false;
    },
    returnGroup(){
      this.type = 'group';
    },
    handleClose(done) {
      this.$emit('handleClose', done, this.type);
    },
    handleDeviceClose(){
      this.drawerDeviceList = false;
    },
    editName(event, item){
      this.dialogInput = true;
    },
    editDevice(event, item){
      this.drawerDeviceList = true;
    },
    cancelDialog(){
      this.dialogInput = false;
    },
    okDialog(data){
      console.log(data);
    },
    okDevice(){

    }
  }
}
</script>
