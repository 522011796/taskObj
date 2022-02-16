<template>
  <div class="container">
    <div class="header-item">
      xxx
    </div>
    <div class="padding-left10 padding-right10 padding-top5" :style="contentStyle">
      <div v-for="n in 10" class="block-item bg-333333 marginBottom10 border-radius-5" @click="test">
        <div>
          <el-row>
            <el-col :span="12">
              <div class="padding-lf10">
                <div class="marginTop5">
                  <span class="font-size-14">name</span>
                  <span>(0/0)</span>
                </div>
                <div class="marginTop10">
                  <span>
                    <img src="~/static/img/1.png" class="icon-item"/>
                  </span>
                  <span class="color-666666 subTitle-item">subTitle</span>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="textRight">
                <span class="index-opr-block" @click.stop="createTemp">
                  <a href="javascript:;" class="color-warning">创建模版</a>
                </span>
                <span class="index-opr-block" @click.stop="edit">
                  <a href="javascript:;" class="color-success">修改</a>
                </span>
                <span class="index-opr-block" @click.stop="del">
                  <a href="javascript:;" class="color-error">删除</a>
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <!--场景管理-->
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      size="40%"
      :visible.sync="drawerEdit"
      :direction="directionEdit">
      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" class="color-666666" @click="cancelScene">取消</el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="textCenter">
                <span>场景管理</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="okScene">确定</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <el-form class="custom-form" label-width="90px" ref="formSence" :model="formSence">
          <el-form-item label="场景名称" prop="pass" @click.native="showInput">
            <div class="textRight">
              <label>{{ formSence.name != '' ?  formSence.name : '请设置'}}</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
          <el-form-item label="房间" prop="pass" @click.native="showRoom">
            <div class="textRight">
              <label>{{ formSence.roomId != '' ?  formSence.roomId : '请设置'}}</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
          <el-form-item label="场景类型" prop="pass" @click.native="showType">
            <div class="textRight">
              <div class="textRight">
                <label>{{ formSence.sceneType != '' ?  formSence.sceneType : '请设置'}}</label>
                <label class="fa fa-chevron-right"></label>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="场景开源" prop="pass">
            <div class="textRight">
              <el-switch
                v-model="formSence.openSource"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeOpenSource">
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="内部调用" prop="pass">
            <div class="textRight">
              <el-switch
                v-model="formSence.internal"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeInternal">
              </el-switch>
            </div>
          </el-form-item>
        </el-form>

        <drawer-type-sheet :drawer-sheet="drawerSheet" :append-to-body="true" :data="typeData" @click="typeItemClick" @handleClose="handleClose"></drawer-type-sheet>
      </div>
    </el-drawer>

    <!--模版管理-->
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      size="40%"
      :visible.sync="drawerTemp"
      :direction="directionEdit">
      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" class="color-666666" @click="cancelTemp">取消</el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="textCenter">
                <span>模版管理</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="okTemp">确定</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <el-form class="custom-form" label-width="90px" ref="formTpl" :model="formTpl">
          <el-form-item label="模版名称" prop="pass" @click.native="showInput">
            <div class="textRight">
              <label>{{ formTpl.tplName != '' ?  formTpl.tplName : '请设置'}}</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
          <el-form-item label="模版类型" prop="pass" @click.native="showTempType">
            <div class="textRight">
              <div class="textRight">
                <label>{{ formTpl.tplType != '' ?  formTpl.tplType : '请设置'}}</label>
                <label class="fa fa-chevron-right"></label>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="模版开源" prop="pass">
            <div class="textRight">
              <el-switch
                v-model="formTpl.tplOpen"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeTempOpenSource">
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="设备名称" prop="pass" @click.native="showDeviceList">
            <div class="textRight">
              <div class="textRight">
                <label>
                  <span>0</span>
                  /
                  <span class="color-success">0</span>
                </label>
                <label class="fa fa-chevron-right"></label>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="模版描述" prop="pass">
            <div class="textRight">
              <el-input type="textarea" :rows="3" placeholder="请输入模版描述" v-model="formTpl.tplDesc"></el-input>
            </div>
          </el-form-item>
        </el-form>

        <drawer-temp-type-sheet :drawer-sheet="drawerTempSheet" :append-to-body="true" :data="tempTypeData" @click="tempTypeItemClick" @handleClose="handleClose"></drawer-temp-type-sheet>
      </div>
    </el-drawer>

    <dialog-message :dialog-message="dialogMessage" @cancel="cancelDialog" @okClick="okDeleteDialog"></dialog-message>

    <dialog-input :dialog-input="dialogInput" @cancel="cancelDialog" @okClick="okDialog"></dialog-input>

    <drawer-room :drawer-room="drawerRoom" @click="roomItemClick" @handleClose="handleClose"></drawer-room>

    <drawer-device-group :drawer-device-group="drawerDeviceGroup" @click="groupItemClick" @handleClose="handleClose"></drawer-device-group>
  </div>
</template>

<script>
import DialogInput from "../components/DialogInput";
import DialogMessage from "../components/DialogMessage";
import DrawerTypeSheet from "../components/DrawerTypeSheet";
import DrawerRoom from "../components/DrawerRoom";
import DrawerDeviceGroup from "../components/DrawerDeviceGroup";
export default {
  layout: 'default',
  components: {
    DialogMessage,
    DrawerDeviceGroup,
    DrawerRoom,
    DrawerTypeSheet,
    DialogInput
  },
  data() {
    return {
      tableHeader: {},
      tableData: [],
      typeData: [{name:'原创',value:'1'},{name:'模版',value:'2'}],
      tempTypeData: [{name:'个人',value:'1'},{name:'系统',value:'2'}],
      drawerEdit: false,
      drawerTemp: false,
      dialogInput: false,
      dialogMessage: false,
      drawerSheet: false,
      drawerTempSheet: false,
      drawerRoom: false,
      drawerDeviceGroup: false,
      directionEdit: 'btt',
      contentStyle:{
        'height': '0px',
        'overflow-y': 'auto'
      },
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
        img: ''
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
    this.hh();
  },
  methods: {
    hh(){
      if (process.browser) {
        let screenWidth = window.innerWidth;
        this.contentStyle.height = window.innerHeight - 40 + 'px';
      }
    },
    createTemp(){
      this.drawerTemp = true;
    },
    edit(){
      this.drawerEdit = true;
    },
    del(){
      this.dialogMessage = true;
    },
    showInput(){
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
      this.drawerDeviceGroup = true;
    },
    cancelDialog(){
      this.dialogInput = false;
      this.dialogMessage = false;
    },
    okDialog(data){
      console.log(data);
    },
    okDeleteDialog(data){
      console.log(data);
    },
    typeItemClick(data){
      if (data != 'cancel'){
      }
      this.drawerSheet = false;
    },
    tempTypeItemClick(data){
      if (data != 'cancel'){
      }
      this.drawerTempSheet = false;
    },
    roomItemClick(data){
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
    handleClose(done, type){
      this.drawerSheet = false;
      this.drawerTempSheet = false;
      this.drawerRoom = false;

      if (type == 'device'){
        console.log(111);
      }else{
        this.drawerDeviceGroup= false;
      }
      done();
    },
    cancelScene(){
      this.drawerEdit = false;
    },
    okScene(){
      this.drawerEdit = false;
    },
    cancelTemp(){
      this.drawerTemp = false;
    },
    okTemp(){
      this.drawerTemp = false;
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
</style>
