<template>
  <div>
    <el-form-item v-if="_formData.type == 4" label="场景名称" @click.native="setSence">
      <div class="textRight color-666666">
        <span slot="reference" size="mini">
          <label>{{_formData.senceText == '' ? $t("请选择") : _formData.senceText}}</label>
          <label><i class="fa fa-chevron-right"></i></label>
        </span>
      </div>
    </el-form-item>
    <el-form-item v-if="_formData.type == 2" label="延时时间">
      <div class="textRight color-666666">
        <el-input-number size="medium" v-model="_formData.waitTime" @change="handleChange($event, 'waitTime')" :min="100" :step="100" :step-strictly="true"></el-input-number>
      </div>
    </el-form-item>
    <el-form-item v-if="_formData.type == 1" label="空闲时间">
      <div class="textRight color-666666">
        <el-input-number size="medium" v-model="_formData.emptyTime" @change="handleChange($event, 'emptyTime')" :min="100" :step="100" :step-strictly="true"></el-input-number>
      </div>
    </el-form-item>
    <template v-if="_formData.type == 3">
      <el-form-item label="循环起始" @click.native="setLoop">
        <div class="textRight color-666666">
          <span>
            <label>{{_formData.startOrder == '' ? $t("请选择") : orderValueInfo(_formData.startOrder, 'set')}}</label>
            <label class="fa fa-chevron-right"></label>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="重复次数">
        <div class="textRight color-666666">
          <el-input-number size="medium" v-model="_formData.startLoop" @change="handleChange($event, 'startLoop')" :min="0" :step="1" :step-strictly="true"></el-input-number>
        </div>
      </el-form-item>
    </template>

    <template v-if="_formData.insertArea != ''">
      <el-form-item :label="$t('插入位置')" @click.native="handleInsert">
        <div class="textRight color-666666">
          <label>{{_formData.insertArea == 'up' ? $t("上一行") : $t("下一行")}}</label>
          <label class="fa fa-chevron-right"></label>
        </div>
      </el-form-item>
    </template>

    <dialog-input :title="title" :message="messageInput" :placeholder="placeholder" :dialog-input="dialogInput" @cancel="cancelDialog" @okClick="okDialog"></dialog-input>
    <drawer-loop-order-sheet :drawer-sheet="drawerSheet" :data="loopData" :append-to-body="true" @click="typeItemClick" @handleClose="handleClose"></drawer-loop-order-sheet>
    <drawer-sence-sheet :drawer-sheet="drawerSenceSheet" :data="senceListData" :append-to-body="true" @click="senceItemClick" @handleClose="handleClose"></drawer-sence-sheet>
    <drawer-insert-area-type-sheet :data="globalInsertTypeData" :drawer-sheet="drawerInsertAreaSheet" :append-to-body="true" @click="insertAreaItemClick" @handleClose="handleClose"></drawer-insert-area-type-sheet>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import DialogInput from "./DialogInput";
import {MessageCommonTips} from "../utils/utils";
import DrawerSenceSheet from "./DrawerSenceSheet";
export default {
  components: {DrawerSenceSheet, DialogInput},
  mixins: [mixins],
  props:{
    formData: {
      type: Object,
      default: function (){
        return {}
      }
    },
    dataTaskList: {
      type: Array,
      default: function (){
        return []
      }
    }
  },
  computed: {
    _formData: {
      get(){
        return this.formData
      },
      set(v){

      }
    }
  },
  data() {
    return {
      messageInput: '',
      dialogInput: false,
      title: '',
      placeholder: '',
      drawerSheet: false,
      loopData: [],
      drawerInsertAreaSheet: false,
      drawerSenceSheet: false,
      senceListData: []
    }
  },
  methods: {
    handleChange(data, type) {
      this.$emit("handleChange", type, data);
    },
    handleInsert(){
      this.drawerInsertAreaSheet = true;
    },
    setSence(){
      if (process.client){
        this.senceListData = JSON.parse(localStorage.getItem("senceListData"));
      }
      this.drawerSenceSheet = true;
    },
    cancelDialog(){
      this.messageInput = '';
      this.dialogInput = false;
    },
    okDialog(data){
      if (data == ""){
        MessageCommonTips(this.$t("请输入信息！"));
        return;
      }
      this._formData.senceText = data;
      this.dialogInput = false;
    },
    showInput(event, item){
      this.title = '';
      this.placeholder = '';
      this.messageInput = this._formData.senceText;
      this.dialogInput = true;
    },
    setLoop(){
      this.loopData = [];
      for (let i = 0; i < this.dataTaskList.length; i++){
        this.loopData.push({name:this.orderValueInfo(this.dataTaskList[i].i, 'set'), type: this.dataTaskList[i].i, value: i});
      }
      this.drawerSheet = true;
    },
    typeItemClick(data){
      this._formData.startOrderI = data.value;
      this._formData.startOrder = data.type;
      this.drawerSheet = false;
    },
    senceItemClick(data){
      this._formData.senceText = data.name;
      this._formData.sence = data.value;
      this.drawerSenceSheet = false;
    },
    handleClose(done, type){
      this.drawerSheet = false;
      this.drawerInsertAreaSheet = false;
      this.drawerSenceSheet = false;
      done();
    },
    insertAreaItemClick(data){
      this._formData.insertArea = data.value;
      this.drawerInsertAreaSheet = false;
    }
  }
}
</script>

<style scoped>
.colorBlock{
  border: 1px solid #dddddd;
  height: 25px;
  width: 25px;
  border-radius: 5px;
  display: inline-block;
}
</style>
