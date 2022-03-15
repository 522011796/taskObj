<template>
  <div>
    <div>
      <span class="color-666666">{{ orderValueInfo(item.i, 'set') }}</span>
    </div>
    <div class="font-size-12 color-bbbbbb">
      <div v-if="item.i == 1 || item.i == 2">
        <i class="fa fa-clock-o"></i>
        <span>{{changeTime(item.v)}}</span>
      </div>
      <div v-else>
        <span v-if="item.i == 1 || item.i == 2" class="color-disabled">{{ item.v }}</span>
        <span v-if="item.i == 3" class="color-disabled">
          <label>{{ $t("起始") }} {{ item.v + 1 }}</label>
          |
          <label>{{ $t("重复") }} {{ item.t === 0 ? '∞' : item.t }}</label>
        </span>
        <span v-if="item.i == 4" class="color-disabled">{{ item.n }}</span>
        <span v-if="item.i == 6" class="color-disabled">
          <label>{{ openTypeInfo(item.v) }}</label>
          |
          <label>{{ $t("渐变") }}: {{ item.t }}</label>
        </span>
        <span v-if="item.i == 7" class="font-size-12 color-disabled">
          <label>{{ $t("亮度") }}</label>
          <label>{{ item.v.toFixed(2) * 100 }}%</label>
          |
          <label class="moon-ellipsis-class">{{ $t("渐变") }}: {{ item.t }}</label>
        </span>
        <span v-if="item.i == 8" size="mini" class="font-size-12 color-disabled">
          <label>{{ $t("色温") }}</label>

          <label>{{ item.v }}</label>
          |
          <label>{{ $t("渐变") }}: {{ item.t }}</label>
        </span>
        <span v-if="item.i == 9" class="font-size-12 color-disabled">
          <label>{{ $t("色彩") }}</label>

          <span :style="{background:  converArgbToRgb(item.v) }" style="height: 10px; width: 10px;display: inline-block;position: relative; top: 0px;vertical-align: middle"></span>
          |
          <label>{{ $t("渐变") }}: {{ item.t }}</label>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";

export default {
  mixins: [mixins],
  props:{
    item: Object
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
