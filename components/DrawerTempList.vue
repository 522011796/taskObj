<template>
  <div>
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      size="90%"
      :append-to-body="appendToBody"
      :visible.sync="drawer_"
      direction="btt"
      :before-close="handleClose">
      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="4">
              <div class="textLeft">
                <el-button size="mini" v-if="deviceType == true" type="text" class="color-666666" @click="returnGroup">{{$t('返回')}}</el-button>
                <span v-else>&nbsp;</span>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="textCenter">
                <el-button-group>
                  <el-button size="mini" :disabled="deviceType" :type="type == 1 ? 'success' : ''" @click="tabClick($event, 1)">{{$t('批量')}}</el-button>
                  <el-button size="mini" :type="type == 2 ? 'success' : ''" @click="tabClick($event, 2)">{{$t('任务')}}</el-button>
                </el-button-group>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="textRight">
                <el-button size="mini" type="text">{{$t('确认')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="padding-left10 padding-right10 padding-top5">
        <template v-if="type == 1">
          <div v-for="(item, index) in deviceList" :key="index" v-loading="item.loading" @click="itemClick($event, item)" class="item-light-block">
            <div>
              <span>灯1</span>
              :
              <span><i class="fa fa-plus-circle"></i></span>
            </div>
          </div>
        </template>

        <template v-if="type == 2">
          <template v-if="deviceType == false">
            <div v-for="(item, index) in groupList" :key="index" v-loading="item.loading" @click="itemOrderClick($event, item)" class="item-light-block">
              <div>
                <el-row>
                  <el-col :span="12">
                    <div class="textLeft">
                      <span>任务1</span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="textRight">
                      <span>0</span>
                      /
                      <span class="color-success">0</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </template>

          <template v-if="deviceType == true">
            <div v-for="(item, index) in groupChildList" :key="index" v-loading="item.loading" @click="itemClick($event, item)" class="item-light-block">
              <div>
                <span>灯1</span>
                :
                <span><i class="fa fa-plus-circle"></i></span>
              </div>
            </div>
          </template>
        </template>
      </div>
    </el-drawer>

    <DrawerDeviceList :drawer-device-list="drawerDeviceList" @click="itemDeviceClick" @handleClose="handleDeviceClose"></DrawerDeviceList>
  </div>
</template>

<script>
export default {
  props:{
    drawerTempList: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
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
        return this.drawerTempList
      },
      set(v){
        this.$emit("changeDialog",v)
      }
    }
  },
  data() {
    return {
      inputValue: '',
      type: 1,
      deviceType: false,
      drawerDeviceList: false,
      groupList: [],
      deviceList: [],
      groupChildList: []
    }
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      for (let i = 0; i < 10; i++){
        this.deviceList.push({
          loading: false
        });
      }
    },
    initGroup(){
      for (let i = 0; i < 10; i++){
        this.groupList.push({
          loading: false
        });
      }
    },
    initGroupChild(){
      for (let i = 0; i < 10; i++){
        this.groupChildList.push({
          loading: false
        });
      }
    },
    tabClick(event, type){
      this.type = type;
      if (type == 2){
        this.deviceType = false;
        this.initGroup();
      }else if (type == 1){
        this.deviceType = false;
        this.init();
      }
    },
    itemClick(event, item){
      item.loading = true;
      setTimeout(()=>{
        item.loading = false;
        this.drawerDeviceList = true;
      },2000);
    },
    itemOrderClick(event, item){
      item.loading = true;
      setTimeout(()=>{
        this.deviceType = true;
        item.loading = false;
        this.initGroupChild();
      },2000);
    },
    itemDeviceClick(data){
      console.log(data);
      this.drawerDeviceList = false;
    },
    handleDeviceClose(){
      this.drawerDeviceList = false;
    },
    handleClose(done) {
      if (this.deviceType == false){
        this.type = 1;
      }
      this.$emit('handleClose', done, this.deviceType);
    },
    returnGroup(){
      this.deviceType = false;
    }
  }
}
</script>
