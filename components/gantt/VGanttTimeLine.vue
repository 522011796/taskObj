<template>
  <div class="gantt-timeline">
    <div class="gantt-block gantt-block-top-space" :style="{ width: topSpace + 'px' }"></div>
    <div :style="[cellWidthStyle,{'line-height': titleHeight + 'px', height: titleHeight + 'px'}]"  v-for="(item, index) in showDatas">
      {{changeTime(item.time * 1000)}}
    </div>
  </div>
</template>

<script>
import mixins from "../../mixins/mixins";
import dr from "../../utils/dynamic-time-render";
export default {
  layout: 'default',
  mixins: [mixins,dr],
  props: {
    dataKey: String,
    datas: {
      type: Array,
      required: true
    },
    cellWidth: {
      type: Number,
      default: 60
    },
    cellHeight: {
      type: Number,
      default: 40
    },
    titleHeight: {
      type: Number,
      default: 40
    },
    getPositonOffset: Function,
  },
  components: {

  },
  computed: {
    cellHeightStyle() {
      return {
        height: `${this.cellHeight}px`
      };
    },
    cellWidthStyle() {
      return {
        width: `${this.cellWidth}px`
      };
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped>
.gantt-leftbar{
  width: 100%;
}
</style>
