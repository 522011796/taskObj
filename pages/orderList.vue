<template>
  <div class="container">
    <loading :pag-loading="pagLoading"></loading>
<!--    <v-gantt-base :gantt-data="dataTest" :gantt-col-data="ganttColData"></v-gantt-base>-->
<!--    <v-gantt-bak></v-gantt-bak>-->

    <!--操作-->
    <div class="opr-block-block-view">
      <div class="opr-block-other">
        <el-tooltip class="item" effect="dark" content="开启后，分别点击两个指令，显示时间差" placement="left">
          <i class="fa fa-info-circle" style="position: absolute;top: -20px;left: 20px; font-size: 15px"></i>
        </el-tooltip>
        <el-switch
          v-model="otherOprStatus"
          active-color="#13ce66"
          inactive-color="#dddddd"
          @change="changeOtherOprStatus">
        </el-switch>
      </div>
      <div class="opr-block-add">
        <el-button type="text" size="mini" @click="addTask">
          <i class="fa fa-plus"></i>
          {{$t("任务")}}
        </el-button>
      </div>
      <div class="opr-block-scale textCenter">
        <div class="marginBottom10">
          <i class="fa fa-search-plus color-default"></i>
        </div>
        <el-slider class="opr-block-slider-v" vertical :step="0.2" :min="0" :max="5" :show-tooltip="false" height="70px" style="margin:0 auto !important;" v-model="scaleValue" @input="sliderChange"></el-slider>
        <div class="marginTop10">
          <i class="fa fa-search-minus color-default"></i>
        </div>
      </div>
      <div class="opr-block-save">
        <el-button type="text" size="mini" @click="saveTask">
          <i class="fa fa-file"></i>
          {{$t("保存")}}
        </el-button>
      </div>
    </div>
    <!--图标-->
    <v-gantt-pro
      :extra-opr-status="otherOprStatus"
      :scale="globalScal"
      :datas="dataTest"
      :gantt-data="ganttData"
      :gantt-col-data="ganttColData"
      :gantt-time-data="ganttTimeData"
      :scroll-to-postion="position"
      @scrollLeft="scrollLeftA"
      @showBlock="showBlock"
      @addBlock="addBlock"
      @planItemClick="planItemClick"
      @showItemBlock="showItemBlock"
      @showTimeDiff="showTimeDiff">

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
      @closed="closeTaskListDrawer">

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
              <el-row>
                <el-col :span="12">
                  <div class="textCenter">
                    <el-button size="mini" type="text" @click="addOnlyTask">
                      <i class="fa fa-plus color-success"></i>
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="textCenter">
                    <el-button size="mini" type="text" @click="okTask">{{$t('保存')}}</el-button>
                  </div>
                </el-col>
              </el-row>
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
              <el-button size="mini" type="text" @click="insertTask($event, item, index)">
                <span class="color-666666">{{$t("插入")}}</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-drawer>

    <!--指令设置-->
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

        <form-light v-if="orderDeviceType == 'light'" :form-data="formOrder" :data-task-list="dataTaskList" @changeColor="changeColor" @changeLightOpen="changeLightOpen" @handleChange="handleChange"></form-light>
        <form-switch v-if="orderDeviceType == 'switch'" :form-data="formOrder" @handleChange="handleChange"></form-switch>
        <form-music v-if="orderDeviceType == 'music'" :form-data="formOrder" @handleChange="handleChange"></form-music>
        <form-sence v-if="orderDeviceType == 'sence'" :form-data="formOrder" :data-task-list="dataTaskList" @handleChange="handleChange"></form-sence>
        <form-curtains v-if="orderDeviceType == 'curtains'" :form-data="formOrder" :data-task-list="dataTaskList" @handleChange="handleChange"></form-curtains>
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
      @handleClose="handleSheetClose">
    </drawer-order-type-sheet>

    <!--场景管理-->
    <drawer-sence-manage
      :form-data="formSence"
      :dialog-edit="drawerEdit"
      @showInput="showSenceInput"
      @cancelScene="cancelScene"
      @okScene="okIndexScene"
      @typeItemClick="typeItemClick"
      @closeDialog="closeDialog"
      @handleClose="handleClose"
      @changeInternal="changeInternal"
      @showRoom="showRoom"
      @changeOpenSource="changeOpenSource"
    ></drawer-sence-manage>

    <!--指令子项详细数据-->
    <el-dialog
      top="20vh"
      custom-class="dialog-input-block dialog-custom-box"
      :show-close="false"
      :visible.sync="dialogTaskItemDetail"
      @close="closeDialog"
      width="300px"
      v-if="taskDetailItem != ''">

      <div slot="title">
        <div class="padding-full5 color-666666 font-size-12 detail-block-title">
          <div>
            <span>{{$t("类型")}}:</span>
            <span class="padding-left10">{{orderValueInfo(taskDetailItem.item.type, 'set')}}</span>
          </div>
          <div>
            <span>{{$t("时长")}}:</span>
            <span class="padding-left10">{{changeTime(taskDetailItem.item.time)}}</span>
          </div>
        </div>
      </div>
      <div class="padding-full5 color-666666 font-size-12" style="background: #212121;max-height: 200px;overflow-y: auto">
        <task-list-item-detail :item="taskDetailItem.children"></task-list-item-detail>
      </div>
    </el-dialog>

    <!--指令子项时间差详细数据-->
    <el-dialog
      top="20vh"
      custom-class="dialog-input-block dialog-custom-box"
      :show-close="false"
      :visible.sync="drawerTimeDiffDetail"
      @close="closeDialog"
      width="300px"
      v-if="taskStartTimeItem != '' && taskEndTimeItem != ''">

      <div slot="title">
        <div class="padding-full5 color-666666 font-size-12 detail-block-title">
          <div>
            <span>{{orderValueInfo(taskStartTimeItem.item.type, 'set')}}:</span>
            <span class="padding-left10">
              <label>
                {{$t("第")}}{{taskStartTimeItem.index+1}}{{$t("行")}}
                {{$t("第")}}{{taskStartTimeItem.indexChild+1}}{{$t("列")}}
              </label>
            </span>
          </div>
          <div>
            <span>{{orderValueInfo(taskEndTimeItem.item.type, 'set')}}:</span>
            <span class="padding-left10">
              <label>
                {{$t("第")}}{{taskEndTimeItem.index+1}}{{$t("行")}}
                {{$t("第")}}{{taskEndTimeItem.indexChild+1}}{{$t("列")}}
              </label>
            </span>
          </div>
        </div>
      </div>
      <div class="padding-full5 color-666666 font-size-12" style="background: #212121;max-height: 200px;">
        <div style="border-radius: 5px;height: 30px;line-height: 30px; background: #535353;color: #ffffff;padding:0px 10px;">
          <span>{{$t("时间差")}}:</span>
          <span class="padding-left10">{{ changeTime(this.taskTimeDiff) }}</span>
        </div>
      </div>
    </el-dialog>

    <dialog-message :message="message" :dialog-message="dialogMessage" @cancel="cancelDialog" @okClick="okDeleteDialog"></dialog-message>
    <drawer-room :drawer-room="drawerRoom" :data="globalRoomList" @click="roomItemClick" @handleClose="handleClose"></drawer-room>
    <dialog-input :title="title" :message="messageInput" :placeholder="placeholder" :dialog-input="dialogInput" @cancel="cancelInputDialog" @okClick="okInputDialog"></dialog-input>
    <drawer-device-type-sheet :data="globalDeviceTypeData" :drawer-sheet="drawerDeviceTypeSheet" @click="deviceTypeItemClick" @handleClose="handleSheetClose"></drawer-device-type-sheet>
    <drawer-device-list-sheet :data="deviceOptions" :drawer-sheet="drawerDeviceListSheet" @change="deviceListItemClick" @handleClose="handleSheetClose"></drawer-device-list-sheet>
    <drawer-plan-type-sheet :data="globalPlanTypeData" :drawer-sheet="drawerPlanSheet" @click="planListItemClick" @handleClose="handleSheetClose"></drawer-plan-type-sheet>
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
import DrawerInsertAreaTypeSheet from "../components/DrawerInsertAreaTypeSheet";
import mixinsData from "../mixins/mixinsData";
import DrawerPlanTypeSheet from "../components/DrawerPlanTypeSheet";
import TaskListItemDetail from "../components/TaskListItemDetail";
import DialogMessage from "../components/DialogMessage";
export default {
  layout: 'default',
  mixins: [mixins,mixinsData],
  components: {
    DialogMessage,
    TaskListItemDetail,
    DrawerPlanTypeSheet,
    DrawerInsertAreaTypeSheet,
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
      orderListRef: true,
      pagLoading: false,
      dataTest: [],
      ganttData: [],
      ganttBakData: [],
      ganttColData: [],
      ganttTimeData: [],
      dataTaskList: [],
      position: 0,
      scrollToY: 0,
      positionA: 0,
      changeStatus: 0,
      orderDeviceType: '',
      editOrderIndex: '',
      oprTaskType: '',
      taskBlockIndex: '',
      message: '',
      dialogMessage: false,
      drawerDeviceTypeSheet: false,
      drawerOrderTypeSheet: false,
      drawerDeviceListSheet: false,
      drawerInsertAreaSheet: false,
      drawerPlanSheet: false,
      drawerRoom: false,
      drawerTask: false,
      drawerTaskList: false,
      drawerTaskSet: false,
      dialogTaskItemDetail: false,
      otherOprStatus: false,
      drawerTimeDiffDetail: false,
      directionTask: 'btt',
      directionTaskList: 'btt',
      directionTaskSet: 'btt',
      orderTypeData: [],
      scaleValue: 0,
      messageInput: '',
      dialogInput: false,
      drawerEdit: false,
      title: '',
      placeholder: '',
      inputType: '',
      editSceneList: [],
      planItemData: '',
      planItemIndex: '',
      oprType: '',
      taskDetailItem: '',
      taskStartTime: '',
      taskEndTime: '',
      taskStartTimeItem: '',
      taskEndTimeItem: '',
      taskTimeClickNum: 0,
      taskTimeDiff: 0,
      formSence:{
        id: '',
        envKey: '',
        name: '',
        iconId: 1,
        internal: false,
        roomId: '',
        sceneId: '',
        sceneName: '',
        sceneType: 1,
        sourceCode: '',
        openSource: true,
        img: '',
        duration: 0
      },
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
        curtainsOpenClose: 0,
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
        insertArea: ''
      },
      deviceOptions: []
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
    if (this.$route.query.globalEditStatus == "1"){
      this.initTask();
    }
    if (process.client && this.$route.query.type == 'tpl'){
      let taskList = localStorage.getItem('taskTempList');
      this.formatTaskList(JSON.parse(taskList));
    }
  },
  methods: {
    initTask(){
      let sourceUrl = this.$route.query.sourceUrl;
      this.pagLoading = true;
      this.$axios.get(sourceUrl).then(res => {
        this.ganttBakData = JSON.parse(JSON.stringify(res.data.tasks));
        this.formatTaskList(res.data.tasks);
      });
    },
    formatTaskList(data){
      let timeCount = 0;
      let ruleList = [];
      //格式化数据
      let taskList = JSON.parse(JSON.stringify(data));
      for (let i = 0; i < taskList.length; i++){
        taskList[i]['id'] = i;
        timeCount = 0;
        let childBar = [];
        let childTime = 0;
        let childTempTime = 0;
        let taskIndex = 0;
        let intNum = 0;
        for (let j = 0; j < taskList[i]['i'].length; j++){
          let aNumber = 0;
          taskList[i]['i'][j]['vLoop'] = -1;
          if (taskList[i]['i'][j].i == 1 || taskList[i]['i'][j].i == 2){
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
            let loopTimeCount = 0;
            let index = taskList[i]['i'][j].v;

            //匹配起始位置到当前位置的时间
            for (let z = index; z < j; z++){
              if (taskList[i]['i'][z].i == 1 || taskList[i]['i'][z].i == 2){
                loopTimeCount += taskList[i]['i'][z].v;
              }else if(taskList[i]['i'][z].i == 3){//循环和场景去自定义vloop，用于区分v的数据
                loopTimeCount += taskList[i]['i'][z]['vLoop'];
              }else if(taskList[i]['i'][z].i == 4){//循环和场景去自定义vloop，用于区分v的数据
                loopTimeCount += taskList[i]['i'][z]['vLoop'];
              }
            }

            let indexV = loopTimeCount * (taskList[i]['i'][j].t == 0 ? 1 : taskList[i]['i'][j].t);
            aNumber = indexV;
            let start = 0;
            let end = 0;

            taskList[i]['i'][j]['vLoop'] = indexV;
            if(intNum == 0) {
              childTime = 0;
              taskIndex = j;
              intNum++;
            }else {
              childTime = parseInt(loopTimeCount);
              taskIndex = j;
            }
            start = indexV;
            childBar.push({
              time: indexV,
              start: childTime,
              end: taskList[i]['i'][j].t == 0 ? 0 : taskList[i]['i'][j].t,
              type: taskList[i]['i'][j].i,
            });
          }else if(taskList[i]['i'][j].i == 4){
            let senceListData = [];
            if (process.client){
              senceListData = JSON.parse(localStorage.getItem("senceListData"));
            }
            let start = 0;
            let end = 0;
            let scnenDuration = 0;
            for (let l = 0; l < senceListData.length; l++){
              if (senceListData[l].sceneId == taskList[i]['i'][j].v){
                scnenDuration = senceListData[l].duration;
                if (scnenDuration == Number.MAX_SAFE_INTEGER){
                  aNumber = 1000;
                  scnenDuration = 2000;
                }else {
                  aNumber = scnenDuration;
                  end = scnenDuration;
                }
                taskList[i]['i'][j]['vLoop'] = scnenDuration;
                if(intNum == 0) {
                  childTime = 0;
                  taskIndex = j;
                  intNum++;
                }else {
                  childTime += parseInt(taskList[i]['i'][taskIndex].vLoop != -1 ? taskList[i]['i'][taskIndex].vLoop : taskList[i]['i'][taskIndex].v);
                  taskIndex = j;
                }
                start = scnenDuration;
                childBar.push({
                  time: scnenDuration,
                  start: childTime,
                  end: end,
                  type: taskList[i]['i'][j].i,
                });
              }
            }
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
      this.planItemIndex = "";
      this.pagLoading = false;
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
    scrollLeftA(val) {
      this.position = { x: val };
    },
    addBlock(data, index){
      this.showDialogStatus();
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
      this.taskBlockIndex = data.id;
      this.dataTaskList = JSON.parse(JSON.stringify(data.i));
      this.drawerTaskList = true;
    },
    showBlock(data, index){
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
      this.showDialogStatus();
      this.dataTaskList = JSON.parse(JSON.stringify(data.i));
      this.taskBlockIndex = data.id;
      this.drawerTaskList = true;
    },
    planItemClick(data, index){
      this.planItemIndex = index;
      this.planItemData = data;
      this.drawerPlanSheet = true;
    },
    showItemBlock(item, index, itemChild, indexChild){
      let array = [];
      let tempArray = [];
      let objArray = [];
      let num = 0;
      for (let i = 0; i < item.i.length; i++){
        if(item.i[i].i == 1 || item.i[i].i == 3 || item.i[i].i == 4){
          tempArray.push(item.i[i]);
          array.push(tempArray);
          tempArray = [];
        }else if(item.i[i].i != 1 && item.i[i].i != 2 && item.i[i].i != 3 && item.i[i].i != 4){
          tempArray.push(item.i[i]);
        }else if(item.i[i].i == 2){
          array.push(tempArray);
          tempArray = [];
        }
      }
      objArray = {
        item: itemChild,
        children: array[indexChild]
      };
      this.taskDetailItem = objArray;
      this.dialogTaskItemDetail = true;
    },
    showTimeDiff(item, index, itemChild, indexChild){
      let array = [];
      let tempArray = [];
      let objArray = [];
      let timeDiff = 0;
      if (this.taskTimeClickNum == 0){
        this.taskStartTime = itemChild.start + itemChild.time;
        this.taskStartTimeItem = {
          index: index,
          indexChild: indexChild,
          item: itemChild
        };
        this.taskTimeClickNum++;
      }else {
        this.taskEndTime = itemChild.start + itemChild.time;
        this.taskEndTimeItem = {
          index: index,
          indexChild: indexChild,
          item: itemChild
        };;
        this.taskTimeClickNum = 0;
      }
      if (this.taskStartTime !== '' && this.taskEndTime !== '') {
        if (this.taskStartTime > this.taskEndTime) {
          timeDiff = this.taskStartTime - this.taskEndTime;
        } else if (this.taskStartTime < this.taskEndTime) {
          timeDiff = this.taskEndTime - this.taskStartTime;
        } else {
          timeDiff = this.taskEndTime - this.taskStartTime;
        }
        this.taskTimeDiff = timeDiff;
        this.drawerTimeDiffDetail = true;
      }
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
    closeTaskListDrawer(event){
      if (!event){
        this.dismissDialogStatus();
        this.dataTaskList = [];
        this.clearForm();
      }
    },
    closeDrawer(event){
      if (!event){
        this.dismissDialogStatus();
        this.clearForm();
      }
    },
    clearSheet(){

    },
    clearForm(){
      this.editOrderIndex = '';
      this.oprTaskType = '';
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
        curtainsOpenClose: 0,
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
        insertArea: ''
      }
    },
    cancelSetTask(){
      this.drawerTask = false;
    },
    okSetTask(){
      let obj = [];
      if (this.formPlain.type === "" || this.formPlain.name == "" || this.formPlain.deviceSelDevice.length == 0){
        MessageCommonTips(this.$t("请设置信息"));
        return;
      }
      obj = {
        t: parseInt(this.formPlain.type),
        i: [],
        d: this.formPlain.deviceSelDevice,
        n: this.formPlain.name
      };
      if (this.planItemIndex != ""){
        obj['i'] = this.ganttData[this.planItemIndex]['i'];
        this.ganttData[this.planItemIndex] = obj;
      }else {
        this.ganttData.push(obj);
      }
      this.formatTaskList(this.ganttData);
      this.drawerTask = false;
    },
    cancelTask(){
      this.drawerTaskList = false;
    },
    okTask(){
      this.$set(this.ganttData[this.taskBlockIndex],'i',this.dataTaskList);
      this.formatTaskList(this.ganttData);
      this.drawerTaskList = false;
    },
    cancelTaskSet(){
      this.clearForm();
      this.drawerTaskSet = false;
    },
    validateForm(){
      let bool = true;
      let num = 0;
      if (this.formOrder.type == 3){
        if(this.formOrder.startOrderI === ""){
          bool = false;
        }
      }else if (this.formOrder.type == 9){
        if(this.formOrder.colorInt === ""){
          bool = false;
        }
      }else if (this.formOrder.type == 11){
        if(this.formOrder.keyArr.length == 0){
          bool = false;
        }
      }else if (this.formOrder.type == 13){
        if(this.formOrder.musicName === ""){
          bool = false;
        }
      }else if (this.formOrder.type == 15){
        if(this.formOrder.musicProcess === ""){
          bool = false;
        }
      }else if (this.formOrder.type == 18){
        if(this.formOrder.source === ""){
          bool = false;
        }
      }
      if (bool == false){
        MessageCommonTips(this.$t("请设置指令信息"));
      }
      return bool;
    },
    okTaskSet(){
      let obj = {};
      let validateForm = this.validateForm();
      if (!validateForm){
        return;
      }
      if (this.oprTaskType == "modi"){//修改
        this.setModiTaskList(this.editOrderIndex);
      }else if (this.oprTaskType == "insert"){//插入
        obj = this.setAddTaskList();
        if(this.formOrder.insertArea == 'up'){
          this.dataTaskList.splice(this.editOrderIndex, 0, obj);
        }else if(this.formOrder.insertArea == 'down'){
          this.dataTaskList.splice(this.editOrderIndex + 1, 0, obj);
        }
      }else {//单独添加
        obj = this.setAddTaskList();
        this.dataTaskList.splice(this.dataTaskList.length + 1, 0, obj);
      }
      this.drawerTaskSet = false;
    },
    setAddTaskList(){
      let obj = {};
      if (this.formOrder.type == 1){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.emptyTime
        };
      }else if (this.formOrder.type == 2){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.waitTime
        };
      }else if (this.formOrder.type == 3){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.startOrderI,
          t: this.formOrder.startLoop
        };
      }else if (this.formOrder.type == 4){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.sence,
          n: this.formOrder.senceText
        };
      }else if (this.formOrder.type == 6){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.open,
          t: this.formOrder.changeTime
        };
      }else if (this.formOrder.type == 7){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.light,
          t: this.formOrder.changeTime
        };
      }else if (this.formOrder.type == 8){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.temp,
          t: this.formOrder.changeTime
        };
      }else if (this.formOrder.type == 9){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.colorInt,
          t: this.formOrder.changeTime
        };
      }else if (this.formOrder.type == 10){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.curtainsOpenClose
        };
      }else if (this.formOrder.type == 11){
        for (let i = 0; i < this.formOrder.keyNoArr.length; i++){
          this.formOrder.keyNoArr[i] = this.formOrder.keyNoArr[i]-1;
        }
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.keyNoArr,
          s: parseInt(this.formOrder.curtainsOpenClose)
        };
      }else if (this.formOrder.type == 12){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.musicVoice
        };
      }else if (this.formOrder.type == 13){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.musicName
        };
      }else if (this.formOrder.type == 14){
        obj = {
          i: parseInt(this.formOrder.type),
        };
      }else if (this.formOrder.type == 15){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.musicProcess
        };
      }else if (this.formOrder.type == 18){
        obj = {
          i: parseInt(this.formOrder.type),
          v: this.formOrder.source
        };
      }
      return obj;
    },
    setModiTaskList(editIndex){
      this.$set(this.dataTaskList[editIndex],'i', parseInt(this.formOrder.type));
      if (this.formOrder.type == 1){
        this.$set(this.dataTaskList[editIndex],'v', parseInt(this.formOrder.emptyTime));
      }else if (this.formOrder.type == 2){
        this.$set(this.dataTaskList[editIndex],'v', parseInt(this.formOrder.waitTime));
      }else if (this.formOrder.type == 3){
        this.$set(this.dataTaskList[editIndex],'t', parseInt(this.formOrder.startLoop));
        this.$set(this.dataTaskList[editIndex],'v', parseInt(this.formOrder.startOrderI));
      }else if (this.formOrder.type == 4){
        this.$set(this.dataTaskList[editIndex],'v', this.formOrder.sence);
        this.$set(this.dataTaskList[editIndex],'n', this.formOrder.senceText);
      }else if (this.formOrder.type == 6){
        this.$set(this.dataTaskList[editIndex],'t', parseInt(this.formOrder.changeTime));
        this.$set(this.dataTaskList[editIndex],'v', parseInt(this.formOrder.open));
      }else if (this.formOrder.type == 7){
        this.$set(this.dataTaskList[editIndex],'t', parseInt(this.formOrder.changeTime));
        this.$set(this.dataTaskList[editIndex],'v', this.formOrder.light);
      }else if (this.formOrder.type == 8){
        this.$set(this.dataTaskList[editIndex],'t', parseInt(this.formOrder.changeTime));
        this.$set(this.dataTaskList[editIndex],'v', this.formOrder.temp);
      }else if (this.formOrder.type == 9){
        this.$set(this.dataTaskList[editIndex],'t', parseInt(this.formOrder.changeTime));
        this.$set(this.dataTaskList[editIndex],'v', parseInt(this.formOrder.colorInt));
      }else if (this.formOrder.type == 10){
        this.$set(this.dataTaskList[editIndex],'v', this.formOrder.curtainsOpenClose);
      }else if (this.formOrder.type == 11){
        for (let i = 0; i < this.formOrder.keyNoArr.length; i++){
          this.formOrder.keyNoArr[i] = this.formOrder.keyNoArr[i]-1;
        }
        this.$set(this.dataTaskList[editIndex],'v', this.formOrder.keyNoArr);
        this.$set(this.dataTaskList[editIndex],'s', parseInt(this.formOrder.keyOpr));
      }else if (this.formOrder.type == 12){
        this.$set(this.dataTaskList[editIndex],'v', this.formOrder.musicVoice);
      }else if (this.formOrder.type == 13){
        this.$set(this.dataTaskList[editIndex],'v', this.formOrder.musicName);
      }else if (this.formOrder.type == 15){
        this.$set(this.dataTaskList[editIndex],'v', this.formOrder.musicProcess);
      }else if (this.formOrder.type == 18){
        this.$set(this.dataTaskList[editIndex],'v', this.formOrder.source);
      }
    },
    updateTask($event, item, index){
      this.editOrderIndex = index;
      this.formOrder.type = parseInt(item.i);
      this.oprTaskType = 'modi';
      if (item.i == 1){
        this.formOrder.emptyTime = item.v;
      }else if (item.i == 2){
        this.formOrder.waitTime = item.v;
      }else if (item.i == 3){
        this.formOrder.startLoop = item.t;
        this.formOrder.startOrderI = item.v;
        this.formOrder.startOrder = this.dataTaskList[item.v].i
      }else if (item.i == 4){
        this.formOrder.senceText = item.n;
        this.formOrder.sence = item.v;
      }else if (item.i == 6){
        this.formOrder.open = item.v;
        this.formOrder.changeTime = item.t;
      }else if (item.i == 7){
        this.formOrder.light = item.v;
        this.formOrder.changeTime = item.t;
      }else if (item.i == 8){
        this.formOrder.temp = item.v;
        this.formOrder.changeTime = item.t;
      }else if (item.i == 9){
        this.formOrder.changeTime = item.t;
        this.formOrder.color = this.converArgbToRgb(item.v);
      }else if (item.i == 11){
        let arr = [];
        for (let i = 0; i < item.v.length; i++){
          arr.push(item.v[i]+1);
        }
        this.formOrder.keyNoArr = arr;
        this.formOrder.keyArr = JSON.parse(JSON.stringify(item.v));
        this.formOrder.keyOpr = parseInt(item.s);
      }else if (item.i == 10){
        this.formOrder.curtainsOpenClose = item.v;
      }else if (item.i == 12){
        this.formOrder.musicVoice = item.v;
      }else if (item.i == 13){
        this.formOrder.musicName = item.v;
      }else if (item.i == 15){
        this.formOrder.musicProcess = item.v;
      }else if (item.i == 18){
        this.formOrder.source = item.v;
      }

      this.drawerTaskSet = true;
    },
    delTask($event, item, index){
      this.dataTaskList.splice(index, 1);
    },
    insertTask($event, item, index){
      this.formOrder.insertArea = 'down';
      this.editOrderIndex = index;
      this.oprTaskType = 'insert';
      this.drawerTaskSet = true;
    },
    addOnlyTask(){
      this.drawerTaskSet = true;
    },
    orderTypeItemClick(data){
      this.formOrder.type = data.value;
      this.drawerOrderTypeSheet = false;
    },
    deviceTypeItemClick(data){
      this.formPlain.type = data.value;
      this.drawerDeviceTypeSheet = false;
    },
    planListItemClick(data, index){
      if (data.value == 0){

        this.formPlain = {
          type: this.planItemData.t,
          name: this.planItemData.n,
          deviceList: [],
          deviceSelDevice: this.planItemData.d
        };

        this.drawerTask = true;
      }else if (data.value == 1){
        this.ganttData.splice(this.planItemIndex, 1);
      }else if (data.value == 2){
        let data = JSON.parse(JSON.stringify(this.ganttData[this.planItemIndex]));
        this.ganttData.push(data);
      }
      this.drawerPlanSheet = false;
    },
    deviceListItemClick(data){
      let sns = [];
      for (let i = 0; i < data.length; i++){
        if (data[i].data.sn){
          sns.push(data[i].data.sn);
        }
      }
      this.formPlain.deviceSelDevice = sns;
    },
    handleClose(done, type){
      this.drawerOrderTypeSheet = false;
      this.drawerDeviceTypeSheet = false;
      this.drawerEdit = false;
      this.clearSheet();
      done();
    },
    handleSheetClose(done, type){
      this.drawerOrderTypeSheet = false;
      this.drawerDeviceTypeSheet = false;
      this.drawerDeviceListSheet = false;
      this.insertAreaItemClick = false;
      this.drawerPlanSheet = false;
      this.clearSheet();
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
      this.changeStatus = 0;
      let ganttDataJson = JSON.parse(JSON.stringify(this.ganttData));
      for (let i = 0; i < ganttDataJson.length; i++){
        if (ganttDataJson[i]['children']){
          ganttDataJson[i].children = undefined;
        }
        if (ganttDataJson[i]['id'] != undefined){
          ganttDataJson[i].id = undefined;
        }
        for (let j = 0; j < ganttDataJson[i]['i'].length; j++){
          if (ganttDataJson[i]['i'][j].vLoop){
            ganttDataJson[i]['i'][j].vLoop = undefined;
          }
        }
      }
      ganttDataJson = JSON.parse(JSON.stringify(ganttDataJson));
      if (!this.compareArray(ganttDataJson, this.ganttBakData)){
        this.message = this.$t("系统检测到你修改过数据并未保存，返回后将清除已修改的部分");
        this.changeStatus = 1;
        this.dialogMessage = true;
        this.showDialogStatus();
        return;
      }else {
        this.returnMainPath();
      }
    },
    addTask(){
      this.showDialogStatus();
      this.drawerTask = true;
    },
    setTask(){
      this.drawerDeviceTypeSheet = true;
    },
    changeOtherOprStatus(value){
      if (!value){
        this.taskTimeClickNum = 0;
      }
      this.otherOprStatus = value;
    },
    async addDevice(){
      await this.getGroupDeviceList(this.formPlain.type);
      this.deviceOptions = this.globalGroupDeviceList
      this.drawerDeviceListSheet = true;
    },
    showInput(event){
      this.inputType = '';
      this.title = '';
      this.placeholder = '';
      this.messageInput = this.formPlain.name;
      this.dialogInput = true;
    },
    showSenceInput(type){
      this.inputType = 'addScene';
      this.messageInput = this.formSence.name;
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
      if (this.inputType == 'addScene'){
        this.formSence.name = data;
      }else {
        this.formPlain.name = data;
      }
      this.dialogInput = false;
    },
    goBack () {
      // console.log("点击了浏览器的返回按钮");
      history.pushState(null, null, document.URL);
    },
    saveTask(){
      let globalEditStatus = this.$route.query.globalEditStatus;
      let ganttDataJson = JSON.parse(JSON.stringify(this.ganttData));
      let ruleList = [];
      if (globalEditStatus == '1'){
        this.saveLoading = true;
        let sourceUrl = this.$route.query.sourceUrl;
        let editTaskList = [];
        this.$axios.get(sourceUrl).then(res => {
          this.formSence = {
            id: res.data.id,
            envKey: '',
            name: res.data.name,
            iconId:  res.data.icon,
            internal: res.data.internal == 1 ? true : false,
            roomId: res.data.room,
            sceneId: res.data.id,
            sceneName: res.data.name,
            sceneType: 1,
            sourceCode: '',
            openSource: true,
            img: '',
            duration: res.data.duration,
          };
          editTaskList = res.data.tasks;
          for (let i = 0; i < ganttDataJson.length; i++){
            let timeCount = 0;
            if (ganttDataJson[i]['children']){
              ganttDataJson[i].children = undefined;
            }
            if (ganttDataJson[i]['id'] != undefined){
              ganttDataJson[i].id = undefined;
            }
            for (let j = 0; j < ganttDataJson[i]['i'].length; j++){
              if (ganttDataJson[i]['i'][j].i == 1 || ganttDataJson[i]['i'][j].i == 2) {
                let result = Math.floor(ganttDataJson[i]['i'][j].v);
                timeCount += result;
              }else if(ganttDataJson[i]['i'][j].i == 3){
                let result = Math.floor(ganttDataJson[i]['i'][j].vLoop);
                timeCount += result;
              }else if(ganttDataJson[i]['i'][j].i == 4){
                let result = Math.floor(ganttDataJson[i]['i'][j].vLoop);
                timeCount += result;
              }
              if (ganttDataJson[i]['i'][j].vLoop){
                ganttDataJson[i]['i'][j].vLoop = undefined;
              }
            }
            ruleList.push(timeCount);
          }
          let ruleMax = ruleList.length == 0 ? 0 : Math.max(...ruleList);
          this.formSence.duration = ruleMax;
          let bool = this.validateTaskList(ganttDataJson);
          if (!bool){
            MessageCommonTips(this.$t("请设置场景中的任务和指令！"));
            this.saveLoading = false;
            return;
          }

          this.okScene(this.formSence, JSON.parse(JSON.stringify(ganttDataJson)), this.initTask);
        });
      }else{
        this.saveLoading = true;
        let ganttDataJson = JSON.parse(JSON.stringify(this.ganttData));
        for (let i = 0; i < ganttDataJson.length; i++){
          let timeCount = 0;
          if (ganttDataJson[i]['children']){
            ganttDataJson[i].children = undefined;
          }
          if (ganttDataJson[i]['id'] != undefined){
            ganttDataJson[i].id = undefined;
          }
          for (let j = 0; j < ganttDataJson[i]['i'].length; j++){
            if (ganttDataJson[i]['i'][j].i == 1 || ganttDataJson[i]['i'][j].i == 2) {
              let result = Math.floor(ganttDataJson[i]['i'][j].v);
              timeCount += result;
            }else if(ganttDataJson[i]['i'][j].i == 3){
              let result = Math.floor(ganttDataJson[i]['i'][j].vLoop);
              timeCount += result;
            }
            if (ganttDataJson[i]['i'][j].vLoop){
              ganttDataJson[i]['i'][j].vLoop = undefined;
            }
          }
          ruleList.push(timeCount);
        }
        let ruleMax = ruleList.length == 0 ? 0 : Math.max(...ruleList);
        this.formSence.duration = ruleMax;
        let bool = this.validateTaskList(ganttDataJson);
        if (!bool){
          MessageCommonTips(this.$t("请设置场景中的任务和指令！"));
          this.saveLoading = false;
          return;
        }

        this.editSceneList = JSON.parse(JSON.stringify(ganttDataJson));
        this.globalOprType = 'add';
        this.drawerEdit = true;
      }
    },
    validateTaskList(data){
      let errorNum = 0;
      let bool = true;
      for (let i = 0; i < data.length; i++){
        if (data[i]['i'].length == 0){
          errorNum++;
          break;
        }
      }
      if (errorNum > 0 || data.length == 0){
        bool = false;
      }
      return bool;
    },
    cancelScene(){
      this.drawerEdit = false;
    },
    okIndexScene(data){
      this.okScene(this.formSence, this.editSceneList, this.init);
    },
    typeItemClick(data){
      if (data != 'cancel'){
        this.formSence.sceneType = data.value;
      }
      this.drawerSheet = false;
    },
    roomItemClick(data){
      this.formSence.roomId = data.id;
      this.drawerRoom = false;
    },
    changeInternal(data){
      this.formSence.internal = data;
    },
    showRoom(){
      this.drawerRoom = true;
    },
    changeOpenSource(data){
      this.formSence.openSource = data;
    },
    closeDialog(event){
      if (!event){
        this.taskTimeClickNum = 0;
        this.taskDetailItem = '';
        this.taskStartTime = '';
        this.taskEndTime = '';
        this.taskTimeDiff = 0;
        this.taskStartTimeItem = '';
        this.taskEndTimeItem = '';
        this.dismissDialogStatus();
      }
    },
    sliderChange(data){
      this.globalScal = data;
    },
    cancelDialog(){
      this.dismissDialogStatus();
      this.dialogMessage = false;
    },
    okDeleteDialog(data){
      this.setOkConfirm(1);
      this.returnMainPath();
      this.dialogMessage = false;
    },
    returnMainPath(){
      this.globalEditStatus = false;
      this.dismissDialogStatus();
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
.detail-block-title{
  background: #212121;
  color: #F2F6FC;
}
</style>
