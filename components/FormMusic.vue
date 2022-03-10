<template>
  <div>
    <el-form-item v-if="_formData.type == 13" label="音乐播放" @click.native="showInput($event, 'name')">
      <div class="textRight color-666666">
        <span>
          <label>{{_formData.musicName == '' ? $t("请设置音乐名称") : _formData.musicName}}</label>
          <label><i class="fa fa-chevron-right"></i></label>
        </span>
      </div>
    </el-form-item>
    <el-form-item v-if="_formData.type == 12" label="音乐音量" class="netmoon-form-item-border-dialog">
      <div class="textRight color-666666 padding-left10 padding-right10">
        <el-slider v-model="_formData.musicVoice" :step="0.01" :max="1" :format-tooltip="musicVoiceFormatTooltip" @change="handleChange($event, 'musicVoice')"></el-slider>
      </div>
    </el-form-item>
    <el-form-item v-if="_formData.type == 15" label="音乐进度" @click.native="showInput($event, 'process')">
      <div class="textRight color-666666">
        <span>
          <label>{{_formData.musicProcess == '' ? $t("请设置(0-65535秒)") : _formData.musicProcess}}</label>
          <label><i class="fa fa-chevron-right"></i></label>
        </span>
      </div>
    </el-form-item>
    <el-form-item v-if="_formData.type == 2" label="延时时间" class="netmoon-form-item-border-dialog">
      <div class="textRight color-666666">
        <el-input-number size="medium" v-model="_formData.waitTime" @change="handleChange($event, 'waitTime')" :min="100" :step="100" :step-strictly="true"></el-input-number>
      </div>
    </el-form-item>

    <dialog-input :title="title" :message="messageInput" :placeholder="placeholder" :dialog-input="dialogInput" @cancel="cancelDialog" @okClick="okDialog"></dialog-input>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import {MessageCommonTips} from "../utils/utils";
export default {
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
      inputType: ''
    }
  },
  methods: {
    handleChange(data, type) {
      this.$emit("handleChange", type, data);
    },
    musicVoiceFormatTooltip(val){
      if (val){
        let num = (val * 100).toFixed(0) + "%";
        return num;
      }
    },
    musicProcessFormatTooltip(val){
      if (val){
        return val + "秒";
      }
    },
    cancelDialog(){
      this.messageInput = '';
      this.inputType = '';
      this.dialogInput = false;
    },
    okDialog(data){
      if (this.inputType == 'name'){
        if (data == ""){
          MessageCommonTips(this.$t("请输入信息！"));
          return;
        }
        this._formData.musicName = data;
      }else if (this.inputType == 'process'){
        if (data == ""){
          MessageCommonTips(this.$t("请输入信息！"));
          return;
        }if (data < 0 || data > 65535){
          MessageCommonTips(this.$t("范围:0-65535秒"));
          return;
        }
        this._formData.musicProcess = data;
      }
      this.dialogInput = false;
    },
    showInput(event, type){
      this.title = '';
      this.placeholder = '';
      this.inputType = type;
      if (type == 'name'){
        this.messageInput = this._formData.musicName;
      }else if (type == 'process'){
        this.messageInput = ""+this._formData.musicProcess;
      }
      this.dialogInput = true;
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
