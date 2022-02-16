<template>
  <div class="container">
    <div class="header-item">
      <el-row>
        <el-col :span="4">
          <el-button size="mini" type="text" @click="returnIndex">
            <i class="fa fa-chevron-left color-disabled"></i>
            <span class="color-disabled">返回</span>
          </el-button>
        </el-col>
        <el-col :span="16" class="textCenter">
          <el-button-group>
            <el-button :type="type == 1 ? 'success' : ''" size="mini" @click="selType($event, 1)">我的</el-button>
            <el-button :type="type == 2 ? 'success' : ''" size="mini" @click="selType($event, 2)">系统</el-button>
            <el-button :type="type == 3 ? 'success' : ''" size="mini" @click="selType($event, 3)">待接收</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="4">
          <span>&nbsp;</span>
        </el-col>
      </el-row>
    </div>
    <div class="padding-left10 padding-right10 padding-top5" :style="contentStyle">
      <div v-for="(item, index) in 10" :key="index" class="block-item bg-333333 marginBottom10 border-radius-5" @click="selEnv($event, item)">
        <el-row>
          <el-col :span="12">
            <div class="padding-lf10">
              <div class="padding-top5">
                <span class="font-size-14">name</span>
              </div>
              <div class="marginTop5">
                <span class="color-disabled">subTitle</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="textRight">
              <span class="item-opr-block" v-if="type == 1" @click.stop="shareTemp($event, item)">
                <a href="javascript:;" class="color-disabled">分享</a>
              </span>
              <span class="item-opr-block" v-if="type == 1 || type == 2" @click.stop="useTemp($event, item)">
                <a href="javascript:;" class="color-warning">使用</a>
              </span>
              <span class="item-opr-block" v-if="type == 1" @click.stop="editTemp($event, item)">
                <a href="javascript:;" class="color-success">修改</a>
              </span>
              <span class="item-opr-block" v-if="type == 1" @click.stop="delTemp($event, item)">
                <a href="javascript:;" class="color-error">删除</a>
              </span>
              <span class="item-opr-block" v-if="type == 3" @click.stop="arrowTemp($event, item)">
                <a href="javascript:;" class="color-success">接受</a>
              </span>
              <span class="item-opr-block" v-if="type == 3" @click.stop="refectTemp($event, item)">
                <a href="javascript:;" class="color-error">拒绝</a>
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
      size="35%"
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
          <el-form-item label="模版描述" prop="pass">
            <div class="textRight">
              <el-input type="textarea" :rows="3" placeholder="请输入模版描述" v-model="formTpl.tplDesc"></el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <dialog-message :dialog-message="dialogMessage" @cancel="cancelDialog" @okClick="okDeleteDialog"></dialog-message>

    <dialog-input :title="title" :placeholder="placeholder" :dialog-input="dialogInput" @cancel="cancelDialog" @okClick="okDialog"></dialog-input>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import DialogInput from "../components/DialogInput";
export default {
  layout: 'default',
  mixins: [mixins],
  components: {
    DialogInput

  },
  data() {
    return {
      title: '',
      placeholder: '',
      tableHeader: {},
      tableData: [],
      type: 1,
      dialogInput: false,
      dialogMessage: false,
      drawerEdit: false,
      drawerTemp: false,
      directionEdit: 'btt',
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

  },
  methods: {
    selType(event, type){
      this.type = type;
    },
    selEnv($event, item){
      this.$router.push({
        path: '/'
      });
    },
    returnIndex(){
      this.$router.push({
        path: '/'
      });
    },
    shareTemp(event, item){
      this.title = '分享模版';
      this.placeholder = '请填写分享的账号信息';
      this.dialogInput = true;
    },
    showInput(event, item){
      this.title = '';
      this.placeholder = '';
      this.dialogInput = true;
    },
    useTemp(event, item){

    },
    delTemp(event, item){
      this.dialogMessage = true;
    },
    editTemp(event, item){
      this.drawerTemp = true;
    },
    arrowTemp(event, item){

    },
    refectTemp(event, item){

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
    cancelTemp(){
      this.drawerTemp = false;
    },
    okTemp(){
      this.drawerTemp = false;
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
