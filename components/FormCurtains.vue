<template>
  <div>
    <el-form-item v-if="_formData.type == 10" label="开合百分比">
      <div class="textRight color-666666 padding-left10 padding-right10">
        <span slot="reference">
          <el-slider v-model="_formData.light" :step="0.0001" :max="1" :format-tooltip="curtainsFormatTooltip" @change="handleChange($event, 'light')"></el-slider>
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
            <label>{{_formData.startOrderI == '' ? $t("请选择") : orderValueInfo(_formData.startOrderI, 'set')}}</label>
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

    <dialog-input :title="title" :message="messageInput" :placeholder="placeholder" :dialog-input="dialogInput" @cancel="cancelDialog" @okClick="okDialog"></dialog-input>
    <drawer-loop-order-sheet :drawer-sheet="drawerSheet" :data="loopData" :append-to-body="true" @click="typeItemClick" @handleClose="handleClose"></drawer-loop-order-sheet>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import DialogInput from "./DialogInput";
import {MessageCommonTips} from "../utils/utils";
export default {
  components: {DialogInput},
  mixins: [mixins],
  props:{
    formData: {
      type: Object,
      default: function (){
        return {}
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
      loopData: []
    }
  },
  methods: {
    handleChange(data, type) {
      this.$emit("handleChange", type, data);
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
      this.loopData = [{name:1, value: 1},{name:2, value: 2}];
      this.drawerSheet = true;
    },
    typeItemClick(data){
      this._formData.startOrderI = data.value;
      this.drawerSheet = false;
    },
    handleClose(done, type){
      this.drawerSheet = false;
      done();
    },
    curtainsFormatTooltip(val){
      if (val){
        let num = (val * 100).toFixed(0) + "%";
        return num;
      }
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
