<template>
  <div>
    <el-form-item v-if="_formData.type == 18" label="串行器数据" @click.native="showInput">
      <div class="textRight color-666666">
        <span slot="reference" size="mini">
          <label>{{_formData.source == '' ? $t("请设置") : _formData.source}}</label>
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
      <el-form-item label="循环起始" class="netmoon-form-item-border-dialog" @click.native="setLoop">
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
    <drawer-insert-area-type-sheet :data="globalInsertTypeData" :drawer-sheet="drawerInsertAreaSheet" :append-to-body="true" @click="insertAreaItemClick" @handleClose="handleClose"></drawer-insert-area-type-sheet>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import DialogInput from "./DialogInput";
import DrawerLoopOrderSheet from "./DrawerLoopOrderSheet";
import {MessageCommonTips} from "../utils/utils";
export default {
  components: {DrawerLoopOrderSheet, DialogInput},
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
      drawerInsertAreaSheet: false
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
      let strMatch = /^[A-Fa-f0-9]{1,60}$/;
      let arr = [];
      if (data == ""){
        MessageCommonTips(this.$t("请输入串行器数据！"));
        return;
      }else if (!strMatch.test(data)){
        MessageCommonTips(this.$t("请输入十六进制数据！"));
        return;
      }

      //补齐
      if (data.length % 2 != 0){
        data = data+"0";
      }

      this._formData.source = data;
      this.dialogInput = false;
    },
    showInput(event, item){
      this.title = '';
      this.placeholder = '';
      this.messageInput = this._formData.source;
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
      this.drawerSheet = false;
    },
    handleClose(done, type){
      this.drawerSheet = false;
      this.drawerInsertAreaSheet = false;
      done();
    },
    handleInsert(){
      this.drawerInsertAreaSheet = true;
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
