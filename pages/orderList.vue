<template>
  <div class="container">
<!--    <v-gantt-base :gantt-data="dataTest" :gantt-col-data="ganttColData"></v-gantt-base>-->
<!--    <v-gantt-bak></v-gantt-bak>-->

    <!--操作-->
    <div class="opr-block-block-view">
      <div class="opr-block-add" v-if="globalDeviceType != 'ios'">
        <el-button type="text" size="mini" @click="addTask">
          <i class="fa fa-plus"></i>
          {{$t("任务")}}
        </el-button>
      </div>
      <div class="opr-block-scale textCenter">
        <div class="marginBottom10">
          <i class="fa fa-search-plus color-default"></i>
        </div>
        <el-slider disabled class="opr-block-slider-v" vertical :show-tooltip="false" height="120px" style="margin:0 auto !important;" v-model="scaleValue"></el-slider>
        <div class="marginTop10">
          <i class="fa fa-search-minus color-default"></i>
        </div>
      </div>
      <div class="opr-block-save" v-if="globalDeviceType != 'ios'">
        <el-button type="text" size="mini">
          <i class="fa fa-file"></i>
          {{$t("保存")}}
        </el-button>
      </div>
    </div>
    <!--图标-->
    <v-gantt-pro
      :datas="dataTest"
      :gantt-data="ganttData"
      :gantt-col-data="ganttColData"
      :gantt-time-data="ganttTimeData"
      :scroll-to-postion="position"
      @scrollLeft="scrollLeftA"
      @showBlock="showBlock">

      <div slot="title" class="textCenter" @click="globalDeviceType != 'ios' ? returnMain() : ''">
        <i v-if="globalDeviceType != 'ios'" class="fa fa-chevron-left font-size-12"></i>
        <span class="font-size-12 color-F2F6FC">{{$t("任务")}}</span>
      </div>
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
        <div class="block-list-item" v-for="(item, index) in dataTaskList">
          <el-row>
            <el-col :span="16">
              <div>
                <div class="floatLeft">
                  <el-tag size="mini" type="success">
                    <span class="color-666666">{{index + 1}}</span>
                  </el-tag>
                </div>
                <div class="floatLeft marginLeft5">
                  <div>
                    <task-list-item :item="item"></task-list-item>
                  </div>
                </div>
                <div class="clearfix"></div>
              </div>
            </el-col>
            <el-col :span="8" class="textRight marginTop5">
              <el-button size="mini" type="text" @click="updateTask($event, item, index)">
                <span class="color-warning">{{$t("修改")}}</span>
              </el-button>
              <el-button size="mini" type="text" @click="delTask($event, item, index)">
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
      :size="globalDrawerBottomHeight"
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

        <form-light v-if="orderDeviceType == 'light'" :form-data="formOrder" @changeLightOpen="changeLightOpen" @handleChange="handleChange"></form-light>
        <form-switch v-if="orderDeviceType == 'switch'" :form-data="formOrder" @handleChange="handleChange"></form-switch>
        <form-music v-if="orderDeviceType == 'music'" :form-data="formOrder" @handleChange="handleChange"></form-music>
        <form-sence v-if="orderDeviceType == 'sence'" :form-data="formOrder" @handleChange="handleChange"></form-sence>
        <form-curtains v-if="orderDeviceType == 'curtains'" :form-data="formOrder" @handleChange="handleChange"></form-curtains>
        <form-change-device v-if="orderDeviceType == 'changeDevice'" :form-data="formOrder" @handleChange="handleChange"></form-change-device>
      </el-form>
    </el-drawer>

    <!--添加任务-->
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      :size="globalDrawerHeight"
      :visible.sync="drawerTask"
      :direction="directionTask"
      direction="btt"
      @closed="closeDrawer">

      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="cancelSetTask">
                  <span class="color-666666">{{$t('取消')}}</span>
                </el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="textCenter">
                <span>{{$t('任务设置')}}</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="okSetTask">{{$t('确定')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <div>
        <el-form class="custom-form" label-width="90px" ref="formPlain" :model="formPlain">
          <el-form-item :label="$t('任务类型')" @click.native="setTask">
            <div class="textRight color-666666">
              <label>{{formPlain.type === '' ? $t("请选择") : planTypeInfo(formPlain.type)}}</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
          <el-form-item :label="$t('任务名称')" @click.native="showInput($event)">
            <div class="textRight color-666666">
              <label>{{formPlain.name === '' ? $t("请选择") : formPlain.name}}</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
          <el-form-item :label="$t('添加设备')" @click.native="addDevice($event)">
            <div class="textRight color-666666">
              <label>({{$t("已选择")}}{{formPlain.deviceSelDevice.length}}{{$t("台设备")}})</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <!--指令类型-->
    <drawer-order-type-sheet
      :drawer-sheet="drawerOrderTypeSheet"
      :append-to-body="false"
      :data="orderTypeData"
      :device-type="orderDeviceType"
      @click="orderTypeItemClick"
      @handleClose="handleSheetClose"
      @inputColor="inputColor"
      @changeColor="changeColor">
    </drawer-order-type-sheet>

    <dialog-input :title="title" :message="messageInput" :placeholder="placeholder" :dialog-input="dialogInput" @cancel="cancelInputDialog" @okClick="okInputDialog"></dialog-input>
    <drawer-device-type-sheet :data="globalDeviceTypeData" :drawer-sheet="drawerDeviceTypeSheet" @click="deviceTypeItemClick" @handleClose="handleSheetClose"></drawer-device-type-sheet>
    <drawer-device-list-sheet :data="deviceOptions" :drawer-sheet="drawerDeviceListSheet" @click="deviceListItemClick" @handleClose="handleSheetClose"></drawer-device-list-sheet>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import VGanttBak from "../components/gantt/VGanttBak";
import VGanttBase from "../components/gantt/VGanttBase";
import VGanttPro from "../components/gantt/VGanttPro";
import DrawerOrderTypeSheet from "../components/DrawerOrderTypeSheet";
import FormSwitch from "../components/FormSwitch";
import FormSence from "../components/FormSence";
import FormChangeDevice from "../components/FormChangeDevice";
import {MessageCommonTips} from "../utils/utils";
import DrawerDeviceTypeSheet from "../components/DrawerDeviceTypeSheet";
import DrawerDeviceList from "../components/DrawerDeviceList";
import DrawerDeviceListSheet from "../components/DrawerDeviceListSheet";
import TaskListItem from "../components/TaskListItem";
import FormCurtains from "../components/FormCurtains";
export default {
  layout: 'default',
  mixins: [mixins],
  components: {
    FormCurtains,
    TaskListItem,
    DrawerDeviceListSheet,
    DrawerDeviceList,
    DrawerDeviceTypeSheet,
    FormChangeDevice,
    FormSence,
    FormSwitch,
    DrawerOrderTypeSheet,
    VGanttPro,
    VGanttBase,
    VGanttBak

  },
  data() {
    return {
      dataTest: [],
      ganttData: [],
      ganttColData: [],
      ganttTimeData: [],
      dataTaskList: [],
      position: 0,
      scrollToY: 0,
      positionA: 0,
      orderDeviceType: '',
      drawerDeviceTypeSheet: false,
      drawerOrderTypeSheet: false,
      drawerDeviceListSheet: false,
      drawerTask: false,
      drawerTaskList: false,
      drawerTaskSet: false,
      directionTask: 'btt',
      directionTaskList: 'btt',
      directionTaskSet: 'btt',
      orderTypeData: [],
      scaleValue: 0,
      messageInput: '',
      dialogInput: false,
      title: '',
      placeholder: '',
      inputType: '',
      formPlain: {
        type: '',
        name: '',
        deviceList: [],
        deviceSelDevice: []
      },
      formOrder: {
        type: '2',
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
        open: 0,
        startLoop: 0,
        startOrder: '',
        startOrderI: '',
        emptyTime: 0,
        colors: '',
        keyArr: [],
        keyNoArr: [],
        key: '',
        keyOpr: '1',
        musicName: '',
        musicProcess: 0,
        musicVoice: 0,
        source: '',
      },
      deviceOptions: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }]
    }
  },
  computed: {

  },
  mounted() {
    this.height = window.innerHeight // 动态设置高度

    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false);
  },
  created() {
    this.init();
    this.initTask();
  },
  methods: {
    initTask(){
      let sourceUrl = this.$route.query.sourceUrl;
      let timeCount = 0;
      let ruleList = [];
      this.$axios.get(sourceUrl).then(res => {
        //格式化数据
        let taskList = JSON.parse(JSON.stringify(res.data.tasks));
        for (let i = 0; i < taskList.length; i++){
          timeCount = 0;
          let childBar = [];
          let childTime = 0;
          let childTempTime = 0;
          let taskIndex = 0;
          let intNum = 0;
          for (let j = 0; j < taskList[i]['i'].length; j++){
            let aNumber = 0;
            taskList[i]['i'][j]['vLoop'] = -1;
            if (taskList[i]['i'][j].i == 1 || taskList[i]['i'][j].i == 2 || taskList[i]['i'][j].i == 0){
              aNumber = taskList[i]['i'][j].v;
              let start = 0;
              let end = 0;

              if(intNum == 0) {
                childTime = 0;
                taskIndex = j;
                intNum++;
              }else {
                childTime += parseInt(taskList[i]['i'][taskIndex].vLoop != -1 ? taskList[i]['i'][taskIndex].vLoop : taskList[i]['i'][taskIndex].v);
                taskIndex = j;
              }
              start = taskList[i]['i'][j].v;
              childBar.push({
                time: taskList[i]['i'][j].v,
                start: childTime,
                end: end,
                type: taskList[i]['i'][j].i,
              });
            }else if (taskList[i]['i'][j].i == 3){
              let index = taskList[i]['i'][j].v;
              let indexV = taskList[i]['i'][index].v * (taskList[i]['i'][j].t == 0 ? 1 : taskList[i]['i'][j].t);
              taskList[i]['i'][j]['vLoop'] = indexV;
              aNumber = indexV;
              let start = 0;
              let end = 0;

              if(intNum == 0) {
                childTime = 0;
                taskIndex = j;
                intNum++;
              }else {
                childTime += parseInt(indexV);
                taskIndex = j;
              }
              start = indexV;
              childBar.push({
                time: indexV,
                start: childTime,
                end: taskList[i]['i'][j].t == 0 ? 0 : taskList[i]['i'][j].t,
                type: taskList[i]['i'][j].i,
              });
            }
            let result = Math.floor(aNumber);
            timeCount += result;
          }
          taskList[i]['children'] = childBar;
          ruleList.push(timeCount);
        }
        let ruleMax = ruleList.length == 0 ? 0 : Math.max(...ruleList);
        let ruleTime = ruleMax / 1000;

        this.ganttData = taskList;
        this.ganttTimeData = this.dateGanttTime(ruleTime < 30 ? 30 : ruleTime);
        this.ganttColData = this.dateGanttTime(ruleTime < 30 ? 30 : ruleTime);
      });
    },
    init(){
      let data = [];
      let dataCol = [];
      let dataTime = [];
      for (let i = 0; i < 50; i++){
        let testBar = [];
        for (let j = 0; j < i; j++){
          let start = j * 1000;
          let end = (j+1) * 1000;
          testBar.push({start: start,end: end,time: 1000,type: j % 2 == 0 ? 1 : 2});
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
      //this.dataTest = data;
      //this.ganttColData = dataCol;
      //this.ganttTimeData = dataTime;
    },
    dateGanttTime(data) {
      let dataTime = [];
      for (let i = 0; i < data; i++){
        dataTime.push({
          time: i
        });
      }
      return dataTime;
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
      console.log(data);
      if (data.t == 1){
        this.orderDeviceType = 'light';
      }else if (data.t == 2){
        this.orderDeviceType = 'switch';
      }else if (data.t == 3){
        this.orderDeviceType = 'curtains';
      }else if (data.t == 5){
        this.orderDeviceType = 'music';
      }else if (data.t == 6){
        this.orderDeviceType = 'changeDevice';
      }else if (data.t == 0){
        this.orderDeviceType = 'sence';
      }
      this.dataTaskList = data.i;
      this.drawerTaskList = true;
    },
    showOrderType(){
      if (this.orderDeviceType == 'light'){
        this.orderTypeData = this.globalLightOrderTypeData;
      }else if (this.orderDeviceType == 'switch'){
        this.orderTypeData = this.globalSwitchOrderTypeData;
      }else if (this.orderDeviceType == 'music'){
        this.orderTypeData = this.globalMusicOrderTypeData;
      }else if (this.orderDeviceType == 'sence'){
        this.orderTypeData = this.globalSenceOrderTypeData;
      }else if (this.orderDeviceType == 'changeDevice'){
        this.orderTypeData = this.globalChangeDeviceOrderTypeData;
      }else if (this.orderDeviceType == 'curtains'){
        this.orderTypeData = this.globalCurtainsDeviceOrderTypeData;
      }
      this.drawerOrderTypeSheet = true;
    },
    changeLightOpen(data){
      this.formOrder.open = data;
    },
    closeDrawer(event){
      if (!event){
        this.clearForm();
      }
    },
    clearForm(){
      this.formPlain = {
        type: '',
        name: '',
        deviceList: [],
        deviceSelDevice: []
      };
      this.formOrder = {
        type: '2',
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
        open: 0,
        startLoop: 0,
        startOrder: '',
        startOrderI: '',
        emptyTime: 0,
        colors: '',
        keyArr: [],
        keyNoArr: [],
        key: '',
        keyOpr: '1',
        musicName: '',
        musicProcess: 0,
        musicVoice: 0,
        source: '',
      }
    },
    cancelSetTask(){
      this.drawerTask = false;
    },
    okSetTask(){

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
    updateTask($event, item, index){
      console.log(item);
      this.formOrder.type = item.i;
      if (this.orderDeviceType == 'light'){
        if (item.i == 1){
          this.formOrder.emptyTime = item.v;
        }else if (item.i == 2){
          this.formOrder.waitTime = item.v;
        }else if (item.i == 3){
          this.formOrder.startLoop = item.t;
          this.formOrder.startOrderI = this.dataTaskList[item.v].i;
        }else if (item.i == 6){
          this.formOrder.open = item.v;
          this.formOrder.changeTime = item.t;
        }else if (item.i == 7){
          this.formOrder.light = item.v;
        }else if (item.i == 8){
          this.formOrder.temp = item.v;
        }else if (item.i == 9){
          this.formOrder.color = this.converArgbToRgb(item.v);
        }
      }
      this.drawerTaskSet = true;
    },
    delTask($event, item, index){

    },
    orderTypeItemClick(data){
      this.formOrder.type = data.value;
      this.drawerOrderTypeSheet = false;
    },
    deviceTypeItemClick(data){
      this.formPlain.type = data.value;
      this.drawerDeviceTypeSheet = false;
    },
    deviceListItemClick(data){

    },
    handleClose(done, type){
      this.drawerOrderTypeSheet = false;
      this.drawerDeviceTypeSheet = false;
      this.clearForm();
      done();
    },
    handleSheetClose(done, type){
      this.drawerOrderTypeSheet = false;
      this.drawerDeviceTypeSheet = false;
      this.drawerDeviceListSheet = false;
      this.clearForm();
      done();
    },
    inputColor(data){
      this.formOrder.color = data;
    },
    changeColor(data){
      let rgb = this.hsltorgb(data, this.colors.saturation, this.colors.luminosity);
      let color = this.colorRGBtoHex(rgb[0],rgb[1],rgb[2]);
      this.formOrder.color = "#"+color;
      this.formOrder.colorInt = Math.abs(this.converRgbToArgb(rgb[0],rgb[1],rgb[2]));
    },
    handleChange(type, data) {
      if (type == 'changeTime') {
        this.formOrder.changeTime = data;
      }else if (type == 'temp') {
        this.formOrder.temp = data;
      }else if (type == 'light') {
        this.formOrder.light = data;
      }else if (type == 'waitTime') {
        this.formOrder.waitTime = data;
      }else if (type == 'emptyTime') {
        this.formOrder.emptyTime = data;
      }else if (type == 'startLoop') {
        this.formOrder.startLoop = data;
      }else if (type == 'musicVoice') {
        this.formOrder.musicVoice = data;
      }
    },
    returnMain(){
      this.$router.push({
        path: '/',
        replace: true,
        query: {
          envKey: this.$route.query.envKey
        }
      });
    },
    addTask(){
      this.drawerTask = true;
    },
    setTask(){
      this.drawerDeviceTypeSheet = true;
    },
    addDevice(){
      this.drawerDeviceListSheet = true;
    },
    showInput(event){
      this.title = '';
      this.placeholder = '';
      this.messageInput = this.formPlain.name;
      this.dialogInput = true;
    },
    cancelInputDialog(){
      this.messageInput = '';
      this.inputType = '';
      this.dialogInput = false;
    },
    okInputDialog(data){
      if (data == ""){
        MessageCommonTips(this.$t("请输入信息！"));
        return;
      }
      this.formPlain.name = data;
      this.dialogInput = false;
    },
    goBack () {
      // console.log("点击了浏览器的返回按钮");
      history.pushState(null, null, document.URL);
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
