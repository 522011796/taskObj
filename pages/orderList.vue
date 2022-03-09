<template>
  <div class="container">
<!--    <v-gantt-base :gantt-data="dataTest" :gantt-col-data="ganttColData"></v-gantt-base>-->
<!--    <v-gantt-bak></v-gantt-bak>-->
    <v-gantt-pro
      :datas="dataTest"
      :gantt-data="dataTest"
      :gantt-col-data="ganttColData"
      :gantt-time-data="ganttTimeData"
      :scroll-to-postion="position"
      @scrollLeft="scrollLeftA"
      @showBlock="showBlock">

    </v-gantt-pro>

    <!--指令列表-->
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      size="75%"
      :visible.sync="drawerTaskList"
      :direction="directionTaskList"
      direction="btt"
      @closed="closeDrawer">

      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="cancelTask">
                  <span class="color-666666">{{$t('取消')}}</span>
                </el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="textCenter">
                <span>{{$t('指令列表')}}</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="okTask">{{$t('确定')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="padding-full10">
        <div class="block-list-item" v-for="(item, index) in 20">
          <el-row>
            <el-col :span="16">
              <div>
                <el-tag size="mini" type="success">
                  <span class="color-666666">1</span>
                </el-tag>
                <span class="color-666666">xxxxx</span>
                <span class="color-disabled">1000</span>
              </div>
              <div class="font-size-12 color-bbbbbb">
                <i class="fa fa-clock-o"></i>
                <span>00:00:00</span>
              </div>
            </el-col>
            <el-col :span="8" class="textRight marginTop5">
              <el-button size="mini" type="text" @click="updateTask($event, item)">
                <span class="color-warning">{{$t("修改")}}</span>
              </el-button>
              <el-button size="mini" type="text" @click="delTask($event, item)">
                <span class="color-error">{{$t("删除")}}</span>
              </el-button>
              <el-button size="mini" type="text">
                <span class="color-666666">{{$t("插入")}}</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-drawer>

    <!--指令列表-->
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      size="45%"
      :visible.sync="drawerTaskSet"
      :direction="directionTaskSet"
      direction="btt"
      @closed="closeDrawer">

      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="cancelTaskSet">
                  <span class="color-666666">{{$t('取消')}}</span>
                </el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="textCenter">
                <span>{{$t('指令设置')}}</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="okTaskSet">{{$t('确定')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <el-form class="custom-form" label-width="90px" ref="formOrder" :model="formOrder">
        <el-form-item :label="$t('指令类型')">
          <div class="textRight color-666666" @click="showOrderType">
            <label>{{formOrder.type == '' ? $t("请选择") : orderValueInfo(formOrder.type, 'set')}}</label>
            <label class="fa fa-chevron-right"></label>
          </div>
        </el-form-item>
        <el-form-item :label="$t('开/关')">
          <div class="textRight">
            <el-switch
              v-model="formOrder.open"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeLightOpen">
            </el-switch>
          </div>
        </el-form-item>
        <el-form-item :label="$t('渐变时间')">
          <div class="textRight color-666666">
            <el-input-number size="medium" v-model="formOrder.changeTime" @change="handleChange($event, 'changeTime')" :min="0" :step="100" :step-strictly="true"></el-input-number>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>

    <drawer-order-type-sheet :drawer-sheet="drawerOrderTypeSheet" :append-to-body="false" :data="orderTypeData" :device-type="orderDeviceType" @click="orderTypeItemClick" @handleClose="handleClose"></drawer-order-type-sheet>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import VGanttBak from "../components/gantt/VGanttBak";
import VGanttBase from "../components/gantt/VGanttBase";
import VGanttPro from "../components/gantt/VGanttPro";
import DrawerOrderTypeSheet from "../components/DrawerOrderTypeSheet";
export default {
  layout: 'default',
  mixins: [mixins],
  components: {
    DrawerOrderTypeSheet,
    VGanttPro,
    VGanttBase,
    VGanttBak

  },
  data() {
    return {
      dataTest: [],
      ganttColData: [],
      ganttTimeData: [],
      position: 0,
      scrollToY: 0,
      positionA: 0,
      orderDeviceType: '',
      drawerOrderTypeSheet: false,
      drawerTask: false,
      drawerTaskList: false,
      drawerTaskSet: false,
      directionTask: 'btt',
      directionTaskList: 'btt',
      directionTaskSet: 'btt',
      orderTypeData: [],
      formOrder: {
        type: '1',
        light: 0,
        color: '',
        colorInt: '',
        temp: 2000,
        waitTime: 0,
        changeTime: 0,
        sence: '',
        senceText: '',
        senceRoom: '',
        senceName: '',
        open: '关灯',
        startLoop: 0,
        startOrder: '',
        startOrderI: '',
        emptyTime: 0
      }
    }
  },
  computed: {

  },
  mounted() {
    this.height = window.innerHeight // 动态设置高度
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      let data = [];
      let dataCol = [];
      let dataTime = [];
      for (let i = 0; i < 50; i++){
        let testBar = [];
        for (let j = 0; j < i; j++){
          let start = j * 500;
          let end = (j+1) * 500;
          testBar.push({start: start,end: end,time: 500,type: j % 2 == 0 ? 1 : 2});
        }
        data.push({
          time: i,
          menuTitle: i,
          children: testBar
        });
      }
      for (let i = 0; i < 50; i++){
        dataCol.push({
          time: i,
          start: 0,
          end: 1
        });
      }
      for (let i = 0; i < 50; i++){
        dataTime.push({
          time: i
        });
      }
      this.dataTest = data;
      this.ganttColData = dataCol;
      this.ganttTimeData = dataTime;
    },
    dateGanttType(date, item) {
      let start = item.start;
      let end = item.end;
      if (!start || !end){
        return;
      }
      if (start && end) {
        return "wl-item-on wl-item-full"
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
    scrollLeftA(val) {
      this.position = { x: val };
    },
    showBlock(event, data){
      this.orderDeviceType = 'light';
      this.drawerTaskList = true;
    },
    showOrderType(){
      if (this.orderDeviceType == 'light'){
        this.orderTypeData = this.globalLightOrderTypeData;
      }
      this.drawerOrderTypeSheet = true;
    },
    changeLightOpen(data){
      this.formOrder.open = data;
    },
    closeDrawer(event){
      if (!event){

      }
    },
    clearForm(){
      this.formOrder = {
        type: '1',
        light: 0,
        color: '',
        colorInt: '',
        temp: 2000,
        waitTime: 0,
        changeTime: 0,
        sence: '',
        senceText: '',
        senceRoom: '',
        senceName: '',
        open: '关灯',
        startLoop: 0,
        startOrder: '',
        startOrderI: '',
        emptyTime: 0
      }
    },
    cancelTask(){
      this.drawerTaskList = false;
    },
    okTask(){

    },
    cancelTaskSet(){
      this.clearForm();
      this.drawerTaskSet = false;
    },
    okTaskSet(){

    },
    updateTask($event, item){
      this.drawerTaskSet = true;
    },
    delTask($event, item){

    },
    orderTypeItemClick(data){
      this.formOrder.type = data.value;
      this.drawerOrderTypeSheet = false;
    },
    handleClose(done, type){
      this.drawerOrderTypeSheet = false;
      this.clearForm();
      done();
    },
    handleChange(data, type) {
      if (type == 'changeTime') {
        this.formOrder.changeTime = data;
      }
    }
  },
  watch: {
    scrollToY(val) {
      this.position = { x: val };
    }
  }
}
</script>

<style scoped>
.wl-item-on {
  position: absolute;
  top: 16px;
  left: 0;
  right: -1px;
  margin-top: -10px;
  height: 35px;
  background: #00cbed;
  transition: all 0.4s;
  cursor: pointer;
}
.wl-item-full {
  left: 0px;
  right: 0px;
}
.wl-item-full:before {
  position: absolute;
  top: 0;
  left: 0px;
  z-index: 1;
  content: "";
  width: 0px;
  height: 35px;
  border-radius: 0%;
  background: #00cbed;
}
.wl-item-full:after {
  position: absolute;
  top: 0;
  right: 0px;
  z-index: 1;
  content: "";
  width: 0px;
  height: 35px;
  border-radius: 0%;
  background: #00cbed;
}
.wl-item-start {
  left: 0%;
}
.wl-item-start :after {
  position: absolute;
  top: 0;
  left: 0px;
  z-index: 1;
  content: "";
  width: 0px;
  height: 35px;
  border-radius: 50%;
  background: #00cbed;
}

.wl-item-end {
  right: 0%;
}
wl-item-end:after {
  position: absolute;
  top: 0;
  right: 0px;
  z-index: 1;
  content: "";
  width: 0px;
  height: 35px;
  border-radius: 50%;
  background: #00cbed;
}

</style>
