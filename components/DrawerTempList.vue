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
                <el-button size="mini" type="text" @click="saveTplDevice">{{$t('确认')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="padding-left10 padding-right10 padding-top5" :dataGroup_="dataGroup_">
        <template v-if="type == 1">
          <div v-for="(item, index) in data_" :key="index" v-loading="item.loading" @click="itemClick($event, item, index)" class="item-light-block">
            <div>
              <span>{{ item.key }}</span>
              :
              <span>
                <label v-if="item.value">{{ item.value }}</label>
                <i v-if="!item.value" class="fa fa-plus-circle"></i>
              </span>
            </div>
          </div>
        </template>

        <template v-if="type == 2">
          <template v-if="deviceType == false">
            <div v-for="(item, index) in groupList" :key="index" v-loading="item.loading" @click="itemOrderClick($event, item, index)" class="item-light-block">
              <div>
                <el-row>
                  <el-col :span="12">
                    <div class="textLeft">
                      <span>{{ item.n }}</span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="textRight">
                      <span>{{ item.dExtraCount }}</span>
                      /
                      <span class="color-success">{{ item.d.length }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </template>

          <template v-if="deviceType == true">
            <div v-for="(item, index) in groupChildList" :key="index" v-loading="item.loading" @click="itemChildClick($event, item, index)" class="item-light-block">
              <div>
                <span>{{ item.key }}</span>
                :
                <span>
                  <label v-if="item.value">{{ item.value }}</label>
                  <i v-if="!item.value" class="fa fa-plus-circle"></i>
                </span>
              </div>
            </div>
          </template>
        </template>
      </div>
    </el-drawer>

    <drawer-device-list :drawer-device-list="drawerDeviceList" :data="globalDeviceList" @click="itemDeviceClick" @handleClose="handleDeviceClose"></drawer-device-list>
  </div>
</template>

<script>
import DrawerDeviceList from "./DrawerDeviceList";
import mixinsData from "../mixins/mixinsData";
import mixins from "../mixins/mixins";
import {MessageCommonTips} from "../utils/utils";
export default {
  mixins: [mixins,mixinsData],
  components: {DrawerDeviceList},
  props:{
    drawerTempList: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
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
    },
    dataGroup: {
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
    },
    data_:{
      get(){
        this.deviceList = this.data;
        return this.deviceList;
      },
      set(v){

      }
    },
    dataGroup_(){
      this.groupList = this.dataGroup;
      console.log(this.groupList);
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
      groupChildList: [],
      dataDevieList: [],
      itemData: '',
      itemIndex: '',
      editIndex: '',
      groupIndex: '',
      oprType: ''
    }
  },
  created() {

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
    initGroupChild(data){
      console.log(data);
      this.groupChildList = data;
    },
    tabClick(event, type){
      this.type = type;
      if (type == 2){
        this.deviceType = false;
      }else if (type == 1){
        this.deviceType = false;
      }
    },
    itemClick(event, item, index){
      this.itemData = item;
      this.itemIndex = index;
      this.oprType = 'muti';
      this.getDeviceList(item.t);
      this.drawerDeviceList = true;
    },
    itemOrderClick(event, item, index){
      this.deviceType = true;
      this.groupIndex = index;
      this.oprType = 'plan';
      this.initGroupChild(item.dExtra);
    },
    itemChildClick(event, item, index){
      this.itemData = item;
      this.editIndex = index;
      this.getDeviceList(item.t);
      this.drawerDeviceList = true;
    },
    itemDeviceClick(data){
      if (this.oprType == "muti"){
        this.setMutiDevice(data);
      }else if (this.oprType == "plan") {
        this.setOrderDevice(data);
      }
      this.drawerDeviceList = false;
    },
    setOrderDevice(data){
      if(this.groupChildList[this.editIndex].value == ""){
        this.groupList[this.groupIndex].dExtraCount++;
      }
      this.$set(this.groupChildList[this.editIndex], 'value', data.name);
      this.$set(this.groupChildList[this.editIndex], 'sn', data.sn);
    },
    setMutiDevice(data){
      this.$set(this.deviceList[this.itemIndex], 'value', data.name);
      this.$set(this.deviceList[this.itemIndex], 'sn', data.sn);

      for (let i = 0; i < this.groupList.length; i++){
        let dExtra = this.groupList[i].dExtra;
        let dExtraD = this.groupList[i].d;
        for (let j = 0; j < dExtra.length; j++){
          if (dExtra[j].key == this.itemData.key){
            if (!dExtra[j].value || dExtra[j].value == ""){
              this.groupList[i].dExtra[j].value = data.name;
              this.groupList[i].dExtra[j].sn = data.sn;
              this.groupList[i].dExtraCount++;
            }
          }
        }

        for (let k = 0; k < dExtraD.length; k++){
          if(dExtraD[k] == this.itemData.extraKey){
            this.groupList[i].d[k] = data.sn;
          }
        }
      }
    },
    handleDeviceClose(){
      this.editIndex = "";
      this.groupIndex = "";
      this.oprType = "";
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
    },
    saveTplDevice(){
      let num = 0;
      for (let i = 0; i < this.groupList.length; i++){
        for (let j = 0; j < this.groupList[i].dExtra.length; j++){
          if (this.groupList[i].dExtra[j].value == ""){
            num++;
            break;
          }
        }
      }
      this.tplLoading = false;
      if (num > 0){
        MessageCommonTips(this.$t("存在未设置的设备，请检查！"));
        return;
      }
    }
  }
}
</script>
