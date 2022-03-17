<template>
  <div>
    <el-form-item v-if="_formData.type == 6" :label="$t('开/关')">
      <div class="textRight">
        <el-switch
          v-model="_formData.open"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
          @change="changeLightOpen">
        </el-switch>
      </div>
    </el-form-item>
    <el-form-item v-if="_formData.type == 7" label="亮度">
      <div class="textRight color-666666 padding-left10 padding-right10">
        <el-slider v-model="_formData.light" :step="0.0001" :max="1" :format-tooltip="lightFormatTooltip" @change="handleChange($event, 'light')"></el-slider>
      </div>
    </el-form-item>
    <el-form-item v-if="_formData.type == 8" label="色温">
      <div class="textRight color-666666 padding-left10 padding-right10">
        <el-slider v-model="_formData.temp" :min="2700" :max="6500" @change="handleChange($event, 'temp')"></el-slider>
      </div>
    </el-form-item>
    <el-form-item v-if="_formData.type == 6 || _formData.type == 7 || _formData.type == 8 || _formData.type == 9" :label="$t('渐变时间')">
      <div class="textRight color-666666">
        <el-input-number size="medium" v-model="_formData.changeTime" @change="handleChange($event, 'changeTime')" :min="0" :step="100" :step-strictly="true"></el-input-number>
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


    <template v-if="_formData.insertArea != ''">
      <el-form-item :label="$t('插入位置')" @click.native="handleInsert">
        <div class="textRight color-666666">
          <label>{{_formData.insertArea == 'up' ? $t("上一行") : $t("下一行")}}</label>
          <label class="fa fa-chevron-right"></label>
        </div>
      </el-form-item>
    </template>
    <template v-if="_formData.type == 9">
      <el-form-item label="色彩">
        <div class="textRight color-666666">
          <label class="colorBlock" :style="{'background': _formData.color}"></label>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="textCenter">
          <color-picker v-bind="colors" style="height: 130px; width: 130px;margin: 0 auto;" @input="inputColor" @change="changeColor"></color-picker>
        </div>
      </el-form-item>
    </template>
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

    <drawer-loop-order-sheet :drawer-sheet="drawerSheet" :data="loopData" :append-to-body="true" @click="typeItemClick" @handleClose="handleClose"></drawer-loop-order-sheet>
    <drawer-insert-area-type-sheet :data="globalInsertTypeData" :drawer-sheet="drawerInsertAreaSheet" :append-to-body="true" @click="insertAreaItemClick" @handleClose="handleClose"></drawer-insert-area-type-sheet>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
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
      drawerSheet: false,
      loopData: [],
      drawerInsertAreaSheet: false
    }
  },
  methods: {
    changeLightOpen(data){
      this.$emit("changeLightOpen", data);
    },
    handleChange(data, type) {
      this.$emit("handleChange", type, data);
    },
    handleInsert(){
      this.drawerInsertAreaSheet = true;
    },
    inputColor(data){
      //this.$emit("inputColor", data);
    },
    changeColor(data){
      let rgb = this.hsltorgb(data, this.colors.saturation, this.colors.luminosity);
      let color = this.colorRGBtoHex(rgb[0],rgb[1],rgb[2]);
      this._formData.color = "#"+color;
      this.$emit("changeColor", data);
    },
    lightFormatTooltip(val){
      if (val){
        let num = (val * 100).toFixed(2) + "%";
        return num;
      }
    },
    setLoop(){
      this.loopData = [{name:1, value: 1},{name:2, value: 2}];
      this.drawerSheet = true;
    },
    typeItemClick(data){
      this._formData.startOrderI = data.value;
      this.drawerSheet = false;
    },
    insertAreaItemClick(data){
      this._formData.insertArea = data.value;
      this.drawerInsertAreaSheet = false;
    },
    handleClose(done, type){
      this._formData.insertArea = 'down';
      this.drawerSheet = false;
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
  margin-top: 10px;
}
</style>
