<template>
  <div class="container">
    <loading :pag-loading="pagLoading"></loading>

    <div class="refalsh-block-item" @click.stop="refresh">
      <i class="fa fa-refresh" :class="refreshStatus == true ? 'fa-spin' : ''" style="font-size: 30px; position: relative; top: 10px"></i>
    </div>

    <div class="header-item" v-if="globalDeviceType != 'ios'">
      <el-row>
        <el-col :span="8">
          <el-button size="mini" @click="logout" v-if="appType != 'app'">{{$t('退出')}}</el-button>
          <span v-else>&nbsp;</span>
        </el-col>
        <el-col :span="16" class="textRight">
          <el-dropdown trigger="click">
            <el-button type="success" size="mini">
              {{ oprTitle }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="oprItem($event, 1, '创建场景')">
                  {{$t('创建场景')}}
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="appType != 'app'">
                <div @click="oprItem($event, 2, '场所列表')">
                  {{$t('场所列表')}}
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="oprItem($event, 3, '模版列表')">
                  {{$t('模版列表')}}
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <div class="padding-left10 padding-right10 padding-top5" :style="contentStyle">
      <div v-for="(item, index) in tableData" :key="index" class="block-item bg-333333 marginBottom10 border-radius-5" @click="showTaskList($event, item)">
        <div>
          <el-row>
            <el-col :span="12">
              <div class="padding-lf10">
                <div class="marginTop5">
                  <span class="font-size-14" @click.stop="deviceItemList(item)">{{ item.sceneName }}</span>
                  <span @click.stop="deviceItemList(item)">({{item.successCount}}/{{item.totalCount}})</span>
                </div>
                <div class="marginTop10">
                  <span>
                    <img v-if="item.roomId" :src="require(`~/static/img/${item.roomId}.png`)" class="icon-item"/>
                  </span>
                  <span class="color-666666 subTitle-item">{{ globalRoomObj[item.roomId] }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="textRight">
                <span class="index-opr-block" @click.stop="createTemp($event, item)">
                  <a href="javascript:;" class="color-warning">{{$t('创建模版')}}</a>
                </span>
                <span class="index-opr-block" @click.stop="edit($event, item)">
                  <a href="javascript:;" class="color-success">{{$t('修改')}}</a>
                </span>
                <span class="index-opr-block" @click.stop="del($event, item)">
                  <a href="javascript:;" class="color-error">{{$t('删除')}}</a>
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <!--场景管理-->
    <drawer-sence-manage
      :form-data="formSence"
      :dialog-edit="drawerEdit"
      @showInput="showInput"
      @cancelScene="cancelScene"
      @okScene="okIndexScene"
      @typeItemClick="typeItemClick"
      @closeDialog="closeDialog"
      @handleClose="handleClose"
      @changeInternal="changeInternal"
      @showRoom="showRoom"
      @changeOpenSource="changeOpenSource"
    ></drawer-sence-manage>

    <!--模版管理-->
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      :size="globalDrawerHeight"
      :visible.sync="drawerTemp"
      :direction="directionEdit"
      @close="closeDialog">
      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" class="color-666666" @click="cancelTemp">
                  <span class="font-size-14">{{$t('取消')}}</span>
                </el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="textCenter">
                <span>{{$t('模版管理')}}</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="okTemp">
                  <span class="font-size-14">{{$t('确定')}}</span>
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-loading="templateLoading">
        <el-form class="custom-form" label-width="90px" ref="formTpl" :model="formTpl">
          <el-form-item :label="$t('模版名称')" prop="pass" @click.native="showInput('template')">
            <div class="textRight color-666666">
              <label>{{ formTpl.tplName != '' ?  formTpl.tplName : $t('请设置')}}</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
          <el-form-item :label="$t('模版类型')" prop="pass" @click.native="role == 'ROLE_ADMIN' ? showTempType : ''">
            <div class="textRight" :class="role == 'ROLE_ADMIN' ? 'color-666666' : 'color-disabled'">
              <div class="textRight">
                <label>{{ formTpl.tplType != '' ?  templateTypeInfo(formTpl.tplType) : $t('请设置')}}</label>
                <label class="fa fa-chevron-right"></label>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('模版开源')" prop="pass">
            <div class="textRight">
              <el-switch
                disabled
                v-model="formTpl.tplOpen"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeTempOpenSource">
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item :label="$t('设备名称')" prop="pass" @click.native="showDeviceList">
            <div class="textRight">
              <div class="textRight color-666666">
                <label>
                  <span>{{deviceSetCount}}</span>
                  /
                  <span class="color-success">{{deviceListCount}}</span>
                </label>
                <label class="fa fa-chevron-right"></label>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('模版描述')" prop="pass">
            <div class="textRight">
              <el-input type="textarea" :rows="3" :placeholder="$t('请输入模版描述')" v-model="formTpl.tplDesc"></el-input>
            </div>
          </el-form-item>
        </el-form>

        <drawer-temp-type-sheet :drawer-sheet="drawerTempSheet" :append-to-body="true" :data="tempTypeData" @click="tempTypeItemClick" @handleClose="handleClose"></drawer-temp-type-sheet>
      </div>
    </el-drawer>

    <!--设备列表-->
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      size="70%"
      :visible.sync="drawerDeviceAsyn"
      :direction="directionEdit"
      @close="closeDialog">
      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="3">
              <div class="textCenter">
                &nbsp
              </div>
            </el-col>
            <el-col :span="18">
              <div class="textCenter">
                <span>{{$t('设备列表')}}</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="textCenter">
                &nbsp
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="color-666666 padding-full10">
        <div v-if="deviceStatusData.length == 0" class="textCenter">
          <div style="margin-top: 25%">
            <i class="fa fa-spinner fa-spin" style="font-size: 40px"></i>
          </div>
        </div>
        <div v-else class="device-item-block padding-full5" v-for="(itemDevice, index) in deviceStatusData" :key="index">
          <el-row>
            <el-col :span="12">
              <div class="padding-full5">
                <span>{{itemDevice.deviceInfo.name}}</span>
                <span>({{itemDevice.sn}})</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="padding-full5 textRight">
                <span v-if="itemDevice.actionStatus == 1" class="color-success">
                  已安装
                </span>
                <span v-if="itemDevice.actionStatus == 2" class="color-warning">
                  安装中
                </span>
                <span v-if="itemDevice.actionStatus == 3" class="color-success">
                  安装成功
                </span>
                <span v-if="itemDevice.actionStatus == 4" class="color-error">
                  安装失败
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-drawer>

    <dialog-message :dialog-message="dialogMessage" @cancel="cancelDialog" @okClick="okDeleteDialog"></dialog-message>

    <dialog-input :dialog-input="dialogInput" :message="inputValue" @cancel="cancelDialog" @okClick="okDialog"></dialog-input>

    <drawer-room :drawer-room="drawerRoom" :data="globalRoomList" @click="roomItemClick" @handleClose="handleClose"></drawer-room>

    <drawer-device-group :drawer-device-group="drawerDeviceGroup" :data="deviceTplData" @click="groupItemClick" @cancelGroup="cancelGroup"  @okGroup="okGroup" @handleClose="handleClose"></drawer-device-group>
  </div>
</template>

<script>
import DialogInput from "../components/DialogInput";
import DialogMessage from "../components/DialogMessage";
import DrawerTypeSheet from "../components/DrawerTypeSheet";
import DrawerRoom from "../components/DrawerRoom";
import DrawerDeviceGroup from "../components/DrawerDeviceGroup";
import mixins from "../mixins/mixins";
import {common} from "../utils/api/url";
import {inArray, MessageCommonTips, templateType} from "../utils/utils";
import mixinsData from "../mixins/mixinsData";
import DrawerSenceManage from "../components/DrawerSenceManage";
export default {
  layout: 'default',
  mixins: [mixins,mixinsData],
  components: {
    DrawerSenceManage,
    DialogMessage,
    DrawerDeviceGroup,
    DrawerRoom,
    DrawerTypeSheet,
    DialogInput
  },
  data() {
    return {
      pagLoading: false,
      oprTitle: this.$t('请设置'),
      inputValue: '',
      tableHeader: {},
      tableData: [],
      typeData: [{name:this.$t('原创'),value:'1'},{name:this.$t('模版'),value:'2'}],
      tempTypeData: [{name:this.$t('个人'),value:'2'},{name:this.$t('系统'),value:'1'}],
      templateLoading: false,
      drawerEdit: false,
      drawerTemp: false,
      dialogInput: false,
      dialogMessage: false,
      drawerSheet: false,
      drawerTempSheet: false,
      drawerRoom: false,
      drawerDeviceGroup: false,
      drawerDeviceAsyn: false,
      refreshStatus: false,
      directionEdit: 'btt',
      removeSenceItem: '',
      timer: null,
      timerScene: null,
      editSceneList: [],
      deviceStatusData: [],
      loopTime: 60,
      inputType: '',
      role: '',
      deviceSetCount: 0,
      deviceListCount: 0,
      deviceTplBakData: [],
      deviceTplData: [],
      deviceAsyncList: [],
      formSence:{
        id: '',
        envKey: '',
        name: '',
        iconId: 1,
        internal: true,
        roomId: '',
        sceneId: '',
        sceneName: '',
        sceneType: 1,
        sourceCode: '',
        openSource: true,
        img: '',
        duration: 0
      },
      formTpl:{
        id: '',
        tplName: '',
        tplOpen: true,
        tplType: 2,
        tplSource: '',
        tplDesc: ''
      }
    }
  },
  mounted() {
    this.init();
    this.role = localStorage.getItem("accountRole");
  },
  created() {
  },
  methods: {
    async init(){
      let params = {
        envKey: this.$route.query.envKey != "" && this.$route.query.envKey != undefined ? this.$route.query.envKey : localStorage.getItem("envKey")
      };
      this.pagLoading = true;
      await this.$axios.get(this.baseUrl + common.senceList, {params: params, sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
        if (res.data.code == 200){
          this.tableData = res.data.data;

          this.initJson(res.data.data);
        }
      });
    },
    async initJson(data){
      let jsonData = [];
      for (let i = 0; i < data.length; i++){
        await this.getAsyncSourceUrl(data[i].sourceUrl);
        jsonData.push({
          sceneId: data[i].sceneId,
          duration: this.scnenDuration,
          name: data[i].sceneName,
          value: data[i].sceneId
        });
      }
      if (process.client){
        localStorage.setItem("senceListData", JSON.stringify(jsonData));
      }
      this.pagLoading = false;
    },
    senceInfo(senceId){
      let params = {
        envKey: this.$route.query.envKey != "" && this.$route.query.envKey != undefined ? this.$route.query.envKey : localStorage.getItem("envKey"),
        sceneId: senceId
      };
      this.$axios.get(this.baseUrl + common.senceInfo, {params: params,sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
        if (res.data.code == 201){
          clearInterval(this.timer);
          this.timer = null;
          this.dialogMessage = false;
          this.init();
        }
      });
    },
    createTemp(event, item){
      this.deviceSetCount = 0;
      this.deviceListCount = 0;
      this.deviceTplBakData =  [];
      this.deviceTplData = [];
      this.drawerTemp = true;
      this.templateLoading = true;

      this.showDialogStatus();
      setTimeout(() => {
        this.getSourceUrl(item.sourceUrl);
      },500);
    },
    edit(event, item){
      this.$axios.get(item.sourceUrl).then(res => {
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
        this.editSceneList = res.data.tasks;
      });
      this.showDialogStatus();
      this.drawerEdit = true;
    },
    del(event, item){
      this.removeSenceItem = item;
      this.dialogMessage = true;
    },
    showInput(type){
      this.inputType = type;
      if (type == 'scene'){
        this.inputValue = this.formSence.name;
      }else if (type == 'template'){
        this.inputValue = this.formTpl.tplName;
      }
      this.dialogInput = true;
    },
    showType(){
      this.drawerSheet = true;
    },
    showTempType(){
      this.drawerTempSheet = true;
    },
    showRoom(){
      this.drawerRoom = true;
    },
    showDeviceList(){
      this.deviceTplData = JSON.parse(JSON.stringify(this.deviceTplBakData));
      this.drawerDeviceGroup = true;
    },
    cancelDialog(){
      this.removeSenceItem = '';
      this.inputType = '';
      this.dialogInput = false;
      this.dialogMessage = false;
    },
    okDialog(data){
      if (this.inputType == 'scene'){
        this.formSence.name = data;
      }else if (this.inputType == 'template'){
        this.formTpl.tplName = data;
      }
      this.dialogInput = false;
    },
    okDeleteDialog(data){
      let _self = this;
      let params = {
        envKey: this.$route.query.envKey != "" && this.$route.query.envKey != undefined ? this.$route.query.envKey : localStorage.getItem("envKey"),
        sceneId: this.removeSenceItem.sceneId
      };
      params = this.$qs.stringify(params);
      this.$axios.post(this.baseUrl + common.removeSence, params, {sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
        if (res.data.code == 200){
          clearInterval(this.timer);
          this.dialogMessage = false;
          this.pagLoading = true;
          this.timer = setInterval(function (){
            _self.senceInfo(_self.removeSenceItem.sceneId);
          },1000);
        }else {
          MessageCommonTips(res.data.msg);
        }
      });
    },
    typeItemClick(data){
      if (data != 'cancel'){
        this.formSence.sceneType = data.value;
      }
      this.drawerSheet = false;
    },
    tempTypeItemClick(data){
      if (data != 'cancel'){
        this.formTpl.tplType = data.value;
      }
      this.drawerTempSheet = false;
    },
    roomItemClick(data){
      this.formSence.roomId = data.id;
      this.drawerRoom = false;
    },
    groupItemClick(data){
      this.drawerDeviceGroup = false;
    },
    changeOpenSource(data){
      this.formSence.openSource = data;
    },
    changeTempOpenSource(data){
      this.formTpl.tplOpen = data;
    },
    changeInternal(data){
      this.formSence.internal = data;
    },
    oprItem(event, type, value){
      this.oprTitle = value;
      if (type == 1){
        this.setPageStatus(1);
        this.$router.push({
          path: '/orderList',
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
      }else if (type == 2){
        this.$router.push({
          path: '/envList',
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
      }else if (type == 3){
        this.setPageStatus(2);
        this.$router.push({
          path: '/templateList',
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
    handleClose(done, type){
      this.drawerSheet = false;
      this.drawerTempSheet = false;
      this.drawerRoom = false;

      if (type == 'device'){
        console.log(111);
      }else{
        //this.drawerDeviceGroup= false;
      }


      done();
    },
    closeDialog(event){
      if (!event){
        this.deviceStatusData = [];
        clearTimeout(this.timer);
        this.dismissDialogStatus();
      }
    },
    cancelScene(){
      this.drawerEdit = false;
    },
    okIndexScene(data){
      this.okScene(this.formSence, this.editSceneList, this.init);
      //源码用
      // let dataObj = {
      //   id:this.formSence.id,
      //   room: this.formSence.roomId,
      //   name: this.formSence.name,
      //   icon: 1,
      //   enable: 1,
      //   internal: this.formSence.internal == false ? 0 : 1,
      //   duration: this.formSence.duration,
      //   tasks: this.editSceneList
      // };
      // //云端用
      // let codeData = {
      //   envKey: this.$route.query.envKey != "" && this.$route.query.envKey != undefined ? this.$route.query.envKey : localStorage.getItem("envKey"),
      //   iconId: 1,
      //   internal: this.formSence.internal,
      //   openSource: false,
      //   roomId: this.formSence.roomId,
      //   sceneName: this.formSence.name,
      //   sceneType: 1,
      //   sourceCode: JSON.stringify(dataObj)
      // };
      // if (this.formSence.id != ""){
      //   codeData['sceneId'] = this.formSence.id;
      // }
      // codeData = this.$qs.stringify(codeData);
      //
      // let url = common.editSence;
      //
      // this.$axios.post(this.baseUrl + url, codeData, {sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
      //   if (res.data.code == 200){
      //     this.installSence(res.data.data.sceneId, dataObj.tasks);
      //     this.drawerEdit = false;
      //   }else {
      //     MessageCommonTips(res.data.msg);
      //   }
      //   this.drawerEdit = false;
      // });
    },
    // installSence(senceId, tasks){
    //   let params = {
    //     envKey: this.$route.query.envKey != "" && this.$route.query.envKey != undefined ? this.$route.query.envKey : localStorage.getItem("envKey"),
    //     sceneId: senceId
    //   };
    //   params = this.$qs.stringify(params);
    //   this.$axios.post(this.baseUrl + common.installSence, params, {sessionId: this.sessionId, userKey: this.userKey}).then(res => {
    //     if (res.data.code == 200){
    //       MessageCommonTips(res.data.msg);
    //       this.init();
    //     }else {
    //       MessageCommonTips(res.data.msg);
    //     }
    //   });
    // },
    cancelTemp(){
      this.drawerTemp = false;
    },
    okTemp(){
      let dataExtraJSon = [];
      let dataIndex = 0;
      let errorCount = 0;
      let params = {
        tplName: this.formTpl.tplName,
        tplOpen: this.formTpl.tplOpen,
        tplType: this.formTpl.tplType,
        tplDesc: this.formTpl.tplDesc
      };

      let sourceData = this.formTpl.tplSource.tasks;
      let dArr = [];
      let sourceDataExtra = [];
      let dataJSon = {};

      if (this.formTpl.tplName == ""){
        MessageCommonTips(this.$t("请输入模版名称"));
        return;
      }
      if (this.deviceSetCount != this.deviceListCount){
        MessageCommonTips(this.$t("请编辑设备名称"));
        return;
      }

      //console.log(this.deviceTplData);
      for (let i = 0; i < this.deviceTplData.length; i++){
        let extraT = this.deviceTplData[i]['t'];
        let extraD = this.deviceTplData[i]['d'];
        let dataObj = {};
        let dataArr = [];

        if (errorCount > 0){
          break;
        }

        for (let j = 0; j < extraD.length; j++){
          if (extraD[j]['extraSn'] == "" || extraD[j]['extraSn'] == undefined){
            errorCount++;
            break;
          }
          dataIndex++;
          let key = '$'+dataIndex;
          dataObj[key] = extraD[j]['name'];
          dataArr.push(dataObj);

          dataExtraJSon.push({
            key: key,
            sn: extraD[j]['extraSn']
          });
        }

        if (extraT == 1){
          dataJSon['light'] = dataObj;
        }else if (extraT == 2){
          dataJSon['switch'] = dataObj;
        }else if (extraT == 3){
          dataJSon['curtains'] = dataObj;
        }else if (extraT == 5){
          dataJSon['music'] = dataObj;
        }
      }

      params['tplAbstract'] = JSON.stringify(dataJSon);

      for (let i = 0; i < sourceData.length; i++){
        let d = sourceData[i].d;
        let extraT = sourceData[i].t;
        sourceDataExtra.push({
          i: sourceData[i].i,
          n: sourceData[i].n,
          t: sourceData[i].t,
          d: []
        });
        for (let j = 0; j < d.length; j++){
          if (dArr.indexOf(d[j]) == -1){
            dArr.push(d[j]);
          }
        }
        //console.log(dArr);
        for (let j = 0; j < d.length; j++){
          let key = "";
          for (let k = 0; k < dataExtraJSon.length; k++){
            if (d[j] == dataExtraJSon[k].sn){
              key = dataExtraJSon[k].key;
            }
          }
          sourceDataExtra[i]['d'].push(key);
        }
      }
      params['tplSource'] = JSON.stringify(sourceDataExtra);

      if (errorCount > 0){
        MessageCommonTips(this.$t("有未设置的设备位置,请设置！"));
        return;
      }

      params = this.$qs.stringify(params);
      let url = common.createTplInfo;
      this.configLoading = true;
      this.$axios.post(this.baseUrl + url, params, {sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
        if (res.data.code == 200){
          this.drawerCreateTplVisible = false;
          this.tplSetDeviceVisible = false;
          MessageCommonTips(res.data.msg);
        }else {
          MessageCommonTips(res.data.msg);
        }
        this.drawerTemp = false;
      });
    },
    cancelGroup(){
      this.drawerDeviceGroup = false;
    },
    okGroup(){
      let num = 0;
      let deviceSetCount = 0;
      let deviceListCount = 0;
      this.deviceSetCount = 0;
      for (let i = 0; i < this.deviceTplData.length; i++){
        if (this.deviceTplData[i].extraCount <= 0){
          num++;
          break;
        }
        deviceListCount += this.deviceTplData[i].d.length;
        deviceSetCount += this.deviceTplData[i].extraCount;
      }
      if (num > 0){
        MessageCommonTips(this.$t("有未设置的设备,请设置！"));
        return;
      }
      this.deviceSetCount = deviceSetCount;
      this.deviceListCount = deviceListCount;
      this.deviceTplBakData = JSON.parse(JSON.stringify(this.deviceTplData));
      this.drawerDeviceGroup = false;
    },
    logout(){
      this.$axios.get(this.baseUrl + common.logout, {sessionId: this.sessionId, userKey: this.userKey}).then(res => {
        if (res.data.code == 200) {
          localStorage.removeItem("envKey");
          localStorage.removeItem("sessionId");
          localStorage.removeItem("accountRole");
          this.$router.push("/login");
        }
      });
    },
    getSourceUrl(sourceUrl){
      this.$axios.get(sourceUrl).then(res => {
        this.formTpl.tplSource = res.data;
        this.initTplConfig(res.data);
      });
    },
    initTplConfig(data){
      let taskType = [];
      let taskDevice = [];
      let deviceSetCount = 0;
      let deviceListCount = 0;
      let deviceCountIndex = 0;
      //缓存场景中的设备列表，用于后期选择
      let task = data.tasks;
      task.map((e) => {
        taskType.push(e['t']);
      });
      //数组去重
      taskType = taskType.filter((e, i, self) => {
        return self.indexOf(e) == i
      });
      for (let j = 0; j < taskType.length; j++){
        let device = [];
        let deviceIndex = 0;
        let deviceList = [];

        taskDevice.push({
          t: taskType[j]
        });
        let arr = task.filter((e) => {
          return e['t'] == taskType[j];
        });
        for(let k = 0; k < arr.length; k++) {
          let taskD = arr[k].d;
          for(let i = 0; i < taskD.length; i++) {
            let child = {
              sn: taskD[i],
            };
            let sel = inArray(child, device, 'sn');
            if (sel == -1){
              deviceIndex++;
              deviceCountIndex++;
              deviceList.push({
                n: taskD[i],
                name: this.getDeviceName(taskD[i]),
                label: this.getDeviceName(taskD[i]),
              });
              device.push({
                extra: "$" + deviceIndex,
                name: this.deviceTypeInfo(taskType[j]) + deviceIndex,
                nickname: this.deviceTypeInfo(taskType[j]) + deviceIndex,
                sn: taskD[i],
                extraSn: '',
                extraName: '',
                editVisible: false,
                visible: false
              });
            }
          }
          taskDevice[j]['dd'] = deviceList;
          taskDevice[j]['d'] = device;
          taskDevice[j]['extraCount'] = 0;
          deviceSetCount = 0;
          deviceListCount = deviceCountIndex;
          this.deviceTplBakData = taskDevice;
        }
      }
      this.deviceSetCount = deviceSetCount;
      this.deviceListCount = deviceListCount;
      this.templateLoading = false;
    },
    showTaskList(event, item){
      this.setPageStatus(1);
      this.$router.push({
        path: '/orderList',
        replace: true,
        query: {
          globalEditStatus: 1,
          envKey: this.$route.query.envKey,
          sessionId: this.$route.query.sessionId,
          role: this.$route.query.role,
          userKey: this.$route.query.userKey,
          appType: this.$route.query.appType,
          deviceType: this.$route.query.deviceType,
          sourceUrl: item.sourceUrl,
          sceneId: item.sceneId
        }
      });
    },
    deviceItemList(item){
      setTimeout(()=>{
        this.installSenceDeviceStauts(item);
      },800);
      this.showDialogStatus();
      this.drawerDeviceAsyn = true;
    },
    refresh(){
      this.refreshStatus = true;
      this.init();
      setTimeout(()=>{
        this.refreshStatus = false;
      },1000);
    },
    installSenceDeviceStauts(item){
      let params = {
        envKey: this.$route.query.envKey != "" && this.$route.query.envKey != undefined ? this.$route.query.envKey : localStorage.getItem("envKey"),
        sceneId: item.sceneId
      };
      clearTimeout(this.timer);
      this.$axios.get(this.baseUrl + common.querySceneActionList, {params: params, sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
        if (res.data.code == 200){
          let flag = false;
          this.deviceStatusData = res.data.data;
          if (res.data.data.length == 0){
            if (this.loopTime > 0){
              this.timer = setTimeout(() => {
                this.installSenceDeviceStauts(item);
              }, 3000);
              this.loopTime = this.loopTime - 3;
            }else {
              this.loopTime = 60;
              clearTimeout(this.timer);
            }
          }else {
            this.loopTime = 60;
            for (let i = 0; i < res.data.data.length; i++){
              if (res.data.data[i].actionStatus != 1){
                if (res.data.data[i].systemTime / 1000 - res.data.data[i].lastTime / 1000 < 60){
                  flag = true;
                  break;
                }
              }
            }
            if (flag == false){
              clearTimeout(this.timer);
            }else {
              this.timer = setTimeout(() => {
                this.installSenceDeviceStauts(item);
              }, 3000);
            }
          }
        }
      });
    },
    test(){
      this.$router.push({
        path: '/test'
      });
    }
  }
}
</script>

<style scoped>
.index-opr-block{
  display: inline-block;
  height: 55px;
  line-height: 55px;
  padding: 0px 5px;
}
.subTitle-item{
  position: relative;
  top: -3px;
}
.device-item-block{
  border-bottom: 1px dashed #dddddd;
}
</style>
