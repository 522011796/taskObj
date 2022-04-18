<template>
  <div>
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      :size="globalDrawerHeight"
      :visible.sync="drawer_"
      direction="btt"
      @close="closeDialog">
      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" class="color-666666" @click="cancelScene">
                  <span class="font-size-14">{{$t('取消')}}</span>
                </el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="textCenter">
                <span class="font-size-14">{{$t('场景管理')}}</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="textCenter">
                <el-button size="mini" type="text" @click="okScene">{{$t('确定')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <el-form class="custom-form" label-width="90px" ref="_formData" :model="_formData">
          <el-form-item :label="$t('场景名称')" prop="pass" @click.native="showInput('scene')">
            <div class="textRight color-666666">
              <label>{{ _formData.name != '' ?  _formData.name : $t('请设置')}}</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
          <el-form-item :label="$t('房间')" prop="pass" @click.native="showRoom">
            <div class="textRight color-666666">
              <label>{{ _formData.roomId != '' ?  globalRoomObj[_formData.roomId] : $t('请设置')}}</label>
              <label class="fa fa-chevron-right"></label>
            </div>
          </el-form-item>
          <el-form-item :label="$t('场景类型')" prop="pass">
            <div class="textRight">
              <div class="textRight">
                <label>{{ _formData.sceneType != '' ?  sceneTypeInfo(_formData.sceneType) : $t('请设置')}}</label>
                <label class="fa fa-chevron-right"></label>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('场景开源')" prop="pass">
            <div class="textRight">
              <el-switch
                disabled
                v-model="_formData.openSource"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeOpenSource">
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item :label="$t('内部调用')" prop="pass">
            <div class="textRight">
              <el-switch
                v-model="_formData.internal"
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
  </div>
</template>

<script>
import DrawerTypeSheet from "./DrawerTypeSheet";
import mixins from "../mixins/mixins";
import mixinsData from "../mixins/mixinsData";
export default {
  mixins: [mixins,mixinsData],
  components: {DrawerTypeSheet},
  props:{
    formData: {
      type: Object,
      default: function (){
        return {}
      }
    },
    dialogEdit: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  },
  computed: {
    drawer_:{
      get(){
        return this.dialogEdit
      },
      set(v){
        this.$emit("changeDialog",v)
      }
    },
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
      inputValue: '',
      drawerSheet: false,
      typeData: [{name:this.$t('原创'),value:'1'},{name:this.$t('模版'),value:'2'}],
    }
  },
  methods: {
    cancelScene() {
      this.$emit("cancelScene");
    },
    okScene() {
      this.$emit("okScene", this._formData);
    },
    closeDialog(){
      this.$emit("closeDialog");
    },
    typeItemClick(event, item){
      this.$emit('click', item);
    },
    handleClose(done) {
      this.$emit('handleClose', done);
    },
    showInput(data){
      this.$emit('showInput', data);
    },
    changeInternal(){
      this.$emit('changeInternal', this._formData.internal);
    },
    showRoom(){
      this.$emit('showRoom');
    },
    changeOpenSource(){
      this.$emit('showRoom', this._formData.openSource);
    }
  }
}
</script>
