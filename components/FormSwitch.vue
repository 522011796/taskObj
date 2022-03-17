<template>
  <div>
    <el-form-item v-if="_formData.type == 11" :label="$t('按键操作')" @click.native="setKeyArr">
      <div class="textRight color-666666">
          <span>
            <label>{{_formData.keyNoArr.length == 0 ? $t("请选择") : $t("继电器")+_formData.keyNoArr.join()}}</label>
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
    <el-form-item v-if="_formData.type == 11" label="按键操作" @click.native="setKeyType">
      <div class="textRight color-666666">
        <span>
          <label>{{_formData.keyOpr === '' && _formData.keyOpr != 0 ? $t("请选择") : keyTypeInfo(_formData.keyOpr)}}</label>
          <label><i class="fa fa-chevron-right"></i></label>
        </span>
      </div>
    </el-form-item>

    <template v-if="_formData.insertArea != ''">
      <el-form-item :label="$t('插入位置')" @click.native="handleInsert">
        <div class="textRight color-666666">
          <label>{{_formData.insertArea == 'up' ? $t("上一行") : $t("下一行")}}</label>
          <label class="fa fa-chevron-right"></label>
        </div>
      </el-form-item>
    </template>

    <drawer-key-type-sheet :drawer-sheet="drawerKeySheet" :data="globalSwitchKeyTypeData" :append-to-body="true" @click="typeKeyItemClick" @handleClose="handleClose"></drawer-key-type-sheet>
    <drawer-key-arr-sheet :drawer-sheet="drawerKeyArrSheet" :data="drawerKeyArr" :key-no-arr="_formData.keyArr" :append-to-body="true" @click="typeArrKeyItemClick" @handleClose="handleClose"></drawer-key-arr-sheet>
    <drawer-insert-area-type-sheet :data="globalInsertTypeData" :drawer-sheet="drawerInsertAreaSheet" :append-to-body="true" @click="insertAreaItemClick" @handleClose="handleClose"></drawer-insert-area-type-sheet>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import DrawerKeyTypeSheet from "./DrawerKeyTypeSheet";
import DrawerKeyArrSheet from "./DrawerKeyArrSheet";
export default {
  components: {DrawerKeyArrSheet, DrawerKeyTypeSheet},
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
      drawerKeySheet: false,
      drawerKeyArrSheet: false,
      drawerKeyArr: [],
      drawerInsertAreaSheet: false
    }
  },
  methods: {
    handleChange(data, type) {
      this.$emit("handleChange", type, data);
    },
    handleInsert(){
      this.drawerInsertAreaSheet = true;
    },
    typeKeyItemClick(data){
      this._formData.keyOpr = data.value;
      this.drawerKeySheet = false;
    },
    insertAreaItemClick(data){
      this._formData.insertArea = data.value;
      this.drawerInsertAreaSheet = false;
    },
    typeArrKeyItemClick(data){
      let arr = [];
      this._formData.keyArr = data;
      for (let i = 0; i < data.length; i++){
        arr.push(data[i]+1);
      }
      this._formData.keyNoArr = arr;
      console.log(this._formData.keyNoArr);

      //this.drawerKeyArrSheet = false;
    },
    setKeyType(){
      this.drawerKeySheet = true;
    },
    setKeyArr(){
      this.drawerKeyArr = [{name: 1, value:0},{name: 2, value:1},{name: 3, value:2},{name: 4, value:3}];
      this.drawerKeyArrSheet = true;
    },
    handleClose(done, type){
      this.drawerKeySheet = false;
      this.drawerKeyArrSheet = false;
      this.drawerInsertAreaSheet = false;
      done();
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
