<template>
  <div class="gantt-leftbar">
    <div class="gantt-leftbar-item gantt-block-top-space" :style="{ height: topSpace + 'px' }" ></div>
    <div class="gantt-leftbar-item" :style="cellHeightStyle" v-for="(item, index) in showDatas">
      {{item.menuTitle}}
    </div>
  </div>
</template>

<script>
import mixins from "../../mixins/mixins";
import dr from "../../utils/dynamic-render";
export default {
  layout: 'default',
  mixins: [mixins,dr],
  props: {
    dataKey: String,
    datas: {
      type: Array,
      required: true
    }
  },
  components: {

  },
  computed: {
    cellHeightStyle() {
      return {
        height: `${this.cellHeight}px`
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
