<template>
  <div class="container">
    <loading :pag-loading="pagLoading"></loading>
    <div class="header-item">
      <el-row>
        <el-col :span="4">
          <el-button size="mini" type="text" @click="returnIndex" v-if="globalDeviceType != 'ios'">
            <i class="fa fa-chevron-left color-disabled"></i>
            <span class="color-disabled">{{$t("返回")}}</span>
          </el-button>
          <span v-else>&nbsp;</span>
        </el-col>
        <el-col :span="16" class="textCenter">
          <el-button-group>
            <el-button :type="type == 2 ? 'success' : ''" size="mini" @click="selType($event, 2)">{{$t("我的")}}</el-button>
            <el-button :type="type == 1 ? 'success' : ''" size="mini" @click="selType($event, 1)">{{$t("系统")}}</el-button>
            <el-button :type="type == 3 ? 'success' : ''" size="mini" @click="selType($event, 3)">{{$t("待接收")}}</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="4">
          <span>&nbsp;</span>
        </el-col>
      </el-row>
    </div>
    <div class="padding-left10 padding-right10 padding-top5" :style="contentStyle">
      <div v-for="(item, index) in tableData" :key="item.id" class="block-item bg-333333 marginBottom10 border-radius-5" @click="selEnv($event, item)">
        <el-row>
          <el-col :span="12">
            <div class="padding-lf10">
              <div class="padding-top5">
                <span class="font-size-14">{{ item.tplName }}</span>
              </div>
              <div class="marginTop5">
                <span class="color-disabled" v-if="type == 2">{{ item.tplDesc }}</span>
                <span class="color-disabled" v-if="type == 3">{{ item.nickName }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="textRight">
              <span class="item-opr-block" v-if="type == 2" @click.stop="shareTemp($event, item, 'share')">
                <a href="javascript:;" class="color-disabled">{{$t("分享")}}</a>
              </span>
              <span class="item-opr-block" v-if="type == 1 || type == 2" @click.stop="useTemp($event, item, index)">
                <a href="javascript:;" class="color-warning">{{$t("使用")}}</a>
              </span>
              <span class="item-opr-block" v-if="type == 2" @click.stop="editTemp($event, item)">
                <a href="javascript:;" class="color-success">{{$t("修改")}}</a>
              </span>
              <span class="item-opr-block" v-if="type == 2" @click.stop="delTemp($event, item, 'share')">
                <a href="javascript:;" class="color-error">{{$t("删除")}}</a>
              </span>
              <span class="item-opr-block" v-if="type == 3" @click.stop="arrowTemp($event, item, 3)">
                <a href="javascript:;" class="color-success">{{$t("接受")}}</a>
              </span>
              <span class="item-opr-block" v-if="type == 3" @click.stop="arrowTemp($event, item, 2)">
                <a href="javascript:;" class="color-error">{{$t("拒绝")}}</a>
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

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
                <el-button size="mini" type="text" class="color-666666" @click="cancelTemp">{{$t("取消")}}</el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="textCenter">
                <span>{{$t("模版管理")}}</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="okTemp">{{$t("确定")}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <el-form class="custom-form" label-width="90px" ref="formTpl" :model="formTpl">
          <el-form-item :label="$t('模版名称')" prop="pass" @click.native="showInput">
            <div class="textRight">
              <label>{{ formTpl.tplName != '' ?  formTpl.tplName : $t('请设置')}}</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
          <el-form-item :label="$t('模版描述')" prop="pass">
            <div class="textRight">
              <el-input type="textarea" :rows="3" :placeholder="$t('请输入模版描述')" v-model="formTpl.tplDesc"></el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <dialog-message :dialog-message="dialogMessage" @cancel="cancelDialog" @okClick="okDeleteDialog"></dialog-message>

    <dialog-input :title="title" :placeholder="placeholder" :dialog-input="dialogInput" @cancel="cancelDialog" @okClick="okDialog"></dialog-input>

    <drawer-temp-list :drawer-temp-list="drawerTempList" :data="dataList" :data-group="dataGroupList" :index="editIndex" @saveTplDevice="saveTplDevice" @handleClose="handleClose"></drawer-temp-list>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import DialogInput from "../components/DialogInput";
import DrawerTempList from "../components/DrawerTempList";
import {common, commonConfig} from "../utils/api/url";
import {MessageCommonTips} from "../utils/utils";
import Loading from "../components/Loading";
export default {
  layout: 'default',
  mixins: [mixins],
  components: {
    Loading,
    DrawerTempList,
    DialogInput

  },
  data() {
    return {
      title: '',
      placeholder: '',
      tableHeader: {},
      tableData: [],
      dataList: [],
      dataGroupList: [],
      type: 2,
      oprType: '',
      pagLoading: false,
      dialogInput: false,
      dialogMessage: false,
      drawerEdit: false,
      drawerTemp: false,
      drawerTempList: false,
      directionEdit: 'btt',
      tplData: '',
      editIndex: 0,
      formTpl:{
        id: '',
        tplName: '',
        tplOpen: true,
        tplType: 1,
        tplSource: '',
        tplDesc: ''
      }
    }
  },
  mounted() {

  },
  created() {
    this.init(2);
  },
  methods: {
    init(type){
      let url = '';
      let params = {};
      this.data = [];
      if (type == 3){
        params = {
          statusSet: '1'
        };
        url = common.queryReceiveTplShareInfoList;
      }else {
        params = {
          tplType: type
        };
        url = common.queryTplInfoList;
      }
      this.pagLoading = true;
      this.$axios.get(this.baseUrl + url, {params: params, sessionId: this.sessionId, userKey: this.userKey}).then(res => {
        if (res.data.code == 200){
          this.tableData = res.data.data;
        }
        this.pagLoading = false;
      });
    },
    selType(event, type){
      this.type = type;
      this.init(type);
    },
    selEnv($event, item){
      this.$router.push({
        path: '/'
      });
    },
    returnIndex(){
      this.$router.push({
        path: '/',
        query: {
          envKey: this.$route.query.envKey,
          sessionId: this.$route.query.sessionId,
          role: this.$route.query.role,
          userKey: this.$route.query.userKey,
          appType: this.$route.query.appType,
          deviceType: this.$route.query.deviceType,
        }
      });
    },
    shareTemp(event, item){
      this.oprType = 'share';
      this.tplData = item;
      this.title = this.$t('分享模版');
      this.placeholder = this.$t('请填写分享的账号信息');
      this.dialogInput = true;
    },
    showInput(event, item){
      this.title = '';
      this.placeholder = '';
      this.dialogInput = true;
    },
    useTemp(event, item, index){
      let params = {
        tplId: item.id
      };
      let deviceExtra = [];
      let device$ = [];
      let deviceOtherData = [];
      this.$axios.get(this.baseUrl + common.queryTplInfo, {params: params, sessionId: this.sessionId, userKey: this.userKey}).then(res => {
        if (res.data.code == 200){
          let tplSource = JSON.parse(res.data.data.tplSource);
          let tplAbstract = JSON.parse(res.data.data.tplAbstract);
          let data = [];

          for (let item in tplAbstract) {
            for (let itemChild in tplAbstract[item]) {
              deviceOtherData.push({
                key: itemChild,
                value: tplAbstract[item][itemChild]
              })
            }
          }

          for (let i = 0; i < tplSource.length; i++){
            tplSource[i]['dExtra'] = [];
            tplSource[i]['dExtraCount'] = 0;
            let t = tplSource[i].t;

            for (let j = 0; j < tplSource[i].d.length; j++){
              let keyName = "";
              let arr = deviceOtherData.filter((e) => {
                return e.key == tplSource[i].d[j];
              });

              if (t == 1){
                keyName = tplAbstract.light[tplSource[i].d[j]];
              }else if (t == 2){
                keyName = tplAbstract.switch[tplSource[i].d[j]];
              }if (t == 3){
                keyName = tplAbstract.curtains[tplSource[i].d[j]];
              }if (t == 5){
                keyName = tplAbstract.music[tplSource[i].d[j]];
              }

              device$.push({
                key: keyName,
                extraKey: tplSource[i].d[j],
                value: '',
                t: t,
                sn: '',
                visible: false
              });

              tplSource[i]['dExtra'].push({
                key: keyName,
                extraKey: tplSource[i].d[j],
                value: "",
                set: false,
                t: t,
                sn: '',
                visibleMore: false
              });
            }
          }

          let arrId = [];
          for(var item of device$){
            if(arrId.indexOf(item['key']) == -1){
              arrId.push(item['key']);
              deviceExtra.push(item);
            }
          }
          this.dataList = deviceExtra.sort((a, b) => {
            return this.compareValue(a.t, b.t)
          });
          this.dataGroupList = tplSource;
        }else {
          MessageCommonTips(res.data.msg);
        }
      });
      this.showDialogStatus();
      this.editIndex = index;
      this.drawerTempList = true;
    },
    delTemp(event, item, type){
      this.oprType = type;
      this.tplData = item;
      this.dialogMessage = true;
    },
    editTemp(event, item){
      this.formTpl = {
        id: item.id,
        tplName: item.tplName,
        tplDesc: item.tplDesc
      };
      this.showDialogStatus();
      this.drawerTemp = true;
    },
    arrowTemp(event, item, status){
      let params = {
        status: status,
        tplShareId: item.id
      };
      params = this.$qs.stringify(params);
      this.$axios.post(this.baseUrl + common.handleShareTplInfo, params, {sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
        if (res.data.code == 200){
          MessageCommonTips(res.data.msg);
          this.init(this.type);
        }else {
          MessageCommonTips(res.data.msg);
        }
      });
    },
    refectTemp(event, item){

    },
    cancelDialog(){
      this.dialogInput = false;
      this.dialogMessage = false;
    },
    okDialog(data){
      if (data == ''){
        return;
      }
      if (this.oprType == 'share'){
        let params = {
          account: data,
          tplId: this.tplData.id
        };
        params = this.$qs.stringify(params);
        this.$axios.post(this.baseUrl + common.sendShareTplInfo, params, {sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
          if (res.data.code == 200){
            MessageCommonTips(res.data.msg);
            this.dialogInput = false;
          }else {
            MessageCommonTips(res.data.msg);
          }
        });
      }
    },
    okDeleteDialog(data){
      let params = {
        tplId: this.tplData.id
      };
      params = this.$qs.stringify(params);
      this.$axios.post(this.baseUrl + common.deleteTplInfo, params, {sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
        if (res.data.code == 200){
          this.init(this.type);
          this.item = "";
          this.dialogMessage = false;
        }else {
          MessageCommonTips(res.data.msg);
        }
      });
    },
    cancelTemp(){
      this.drawerTemp = false;
    },
    okTemp(){
      let params = {
        tplId: this.formTpl.id,
        tplName: this.formTpl.tplName,
        tplOpen: this.formTpl.tplOpen,
        tplType: this.formTpl.tplType,
        tplDesc: this.formTpl.tplDesc,
        tplSource: ''
      };
      params = this.$qs.stringify(params);
      let url = common.editTplInfo;
      this.$axios.post(this.baseUrl + url, params, {sessionId: this.sessionId, userKey: this.userKey, loading: false}).then(res => {
        if (res.data.code == 200){
          this.drawerTemp = false;
          this.init(this.type);
          MessageCommonTips(res.data.msg);
        }else {
          MessageCommonTips(res.data.msg);
        }
      });
    },
    handleClose(done, type){
      this.oprType = '';
      this.tplData = '';
      if (type == false){
        this.drawerTempList = false;
        this.dismissDialogStatus();
      }
    },
    closeDialog(event){
      if (!event){
        this.dismissDialogStatus();
      }
    },
    saveTplDevice(data){
      this.globalOprType = 'add';
      this.drawerTempList = false;
      if (process.client){
        localStorage.setItem('taskTempList',JSON.stringify(data))
      }
      this.setPageStatus(1);
      this.$router.push({
        path: '/orderList',
        replace: true,
        query: {
          type: 'tpl'
        }
      });
    }
  }
}
</script>

<style scoped>
.item-opr-block{
  display: inline-block;
  height: 55px;
  line-height: 55px;
  padding: 0px 8px;
}
</style>
