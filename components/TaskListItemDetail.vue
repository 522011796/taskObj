<template>
  <div>
    <div class="detail-block-list-title" v-for="(item, index) in item" :key="index">
      <span>{{ orderValueInfo(item.i, 'set') }}:</span>
      <span v-if="item.i == 1 || item.i == 2" class="padding-left10">
        <label>{{$t("时长")}}:</label>
        <label>{{ item.v }}</label>
      </span>
      <span v-if="item.i == 3" class="padding-left10">
        <label>{{$t("重复")}}:</label>
        <label v-if="item.t != 0">{{ item.t }}</label>
        <label v-if="item.t == 0">{{$t("无限")}}</label>
      </span>
      <span v-if="item.i == 4" class="padding-left10">{{ item.n }}</span>
      <span v-if="item.i == 6" class="padding-left10">
        <label>{{openTypeInfo(item.v) }}</label>
        |
        <label>{{$t("渐变")}}: {{item.t}}</label>
      </span>
      <span v-if="item.i == 7" class="padding-left10">
        <label>{{ item.v.toFixed(4) * 100 }}%</label>
        |
        <label>{{$t("渐变")}}: {{item.t}}</label>
      </span>
      <span v-if="item.i == 8" class="padding-left10">
        <label>{{ item.v }}</label>
        |
        <label>{{$t("渐变")}}: {{item.t}}</label>
      </span>
      <span v-if="item.i == 9" class="padding-left10">
        <label :style="{background:  converArgbToRgb(item.v) }" style="height: 10px; width: 10px;display: inline-block;position: relative; top: 0px;vertical-align: middle"></label>
        |
        <label>{{$t("渐变")}}: {{item.t}}</label>
      </span>
      <span v-if="item.i == 10" class="padding-left10">
        <label>{{ $t("行程") }}</label>
        |
        <label>{{ (item.v * 100).toFixed(0) }}%</label>
      </span>
      <span v-if="item.i == 11" class="padding-left10">
        <label>{{ $t("继电器") }}</label>
        |
        <label v-for="(itemKey, indexKey) in item.v" :key="indexKey">{{ itemKey + 1 }}
          <template v-if="indexKey != item.v.length-1">,</template>
        </label>
        |
        <label>{{ keyTypeInfo(item.s) }}</label>
      </span>
      <span v-if="item.i == 12" class="padding-left10">
        <label>{{ $t("音量") }}</label>
        |
        <label>{{ item.v.toFixed(2) * 100 }}%</label>
      </span>
      <span v-if="item.i == 13" class="padding-left10">
        <label>{{ $t("名称") }}</label>
        |
        <label>{{ item.v}}</label>
      </span>
      <span v-if="item.i == 14" class="padding-left10">
        <label>{{ $t("暂停") }}</label>
      </span>
      <span v-if="item.i == 15" class="padding-left10">
        <label>{{ $t("进度") }}</label>
        |
        <label>{{ item.v}}秒</label>
      </span>
      <span v-if="item.i == 18" class="padding-left10">
        <label>{{ $t("串行器数据") }}</label>
        |
        <label>{{ item.v}}</label>
      </span>
    </div>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";

export default {
  mixins: [mixins],
  props:{
    item: Array
  },
  computed: {

  },
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {

  }
}
</script>
<style scoped>
.detail-block-list-title{
  background: #434343;
  color: #F2F6FC;
  padding: 6px 5px;
  border-radius: 5px;
  margin-bottom: 5px;
}
</style>
