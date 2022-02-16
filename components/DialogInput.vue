<template>
  <div>
    <el-dialog
      top="25vh"
      custom-class="dialog-input-block"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="drawer_"
      @close="closeDialog"
      width="280px">
      <div slot="title">
        <div class="dialog-header-block">
          <span class="color-666666 font-size-14 fontBold">{{ title ? title : '填写信息' }}</span>
        </div>
      </div>
      <div class="dialog-content-block">
        <el-input v-model="inputValue" placeholder="请填写信息"></el-input>
      </div>
      <div class="dialog-bottom-block">
        <el-row>
          <el-col :span="11">
            <div class="textCenter" @click="cancelDialog">
              <span>取消</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="textCenter v-line">

            </div>
          </el-col>
          <el-col :span="11">
            <div class="textCenter color-success" @click="okDialog">
              <span>确定</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    dialogInput: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    drawer_:{
      get(){
        return this.dialogInput
      },
      set(v){
        this.$emit("changeDialog",v)
      }
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {
    okDialog(){
      this.$emit('okClick', this.inputValue);
    },
    cancelDialog(){
      this.inputValue = '';
      this.$emit('cancel');
    },
    closeDialog(){
      this.$emit('close');
    }
  }
}
</script>
