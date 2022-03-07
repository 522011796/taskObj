<template>
  <div class="gantt-blocks">
    <div class="gantt-block gantt-block-top-space" :style="{ height: topSpace + 'px' }"></div>
    <div class="gantt-block" v-for="(item, index) in showDatas" :style="{ height: `${cellHeight}px` }" @click="test">
      {{item}}
      <!--                  <div v-for="n in ganttColData" class="gantt-block-item" style="height: 20px;width: 10px;background: #ddd;"></div>-->
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
    itemKey: String,
    arrayKeys: {
      type: Array
    },
    scrollLeft: Number,
    cellWidth: {
      type: Number,
      required: true
    },
    scale: {
      type: Number,
      required: false
    },
    widthOfBlocksWrapper: {
      type: Number,
      required: true
    },
    endTimeOfRenderArea: [Number, null],
    startTimeOfRenderArea: [Number, null],
    getPositonOffset: Function,
    getWidthAbout2Times: Function,
    customGenerateBlocks: Boolean
  },
  components: {

  },
  computed: {

  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    test(){
      this.$emit("click");
    }
  }
}
</script>

<style scoped>
.gantt-blocks-wrapper {
  overflow: hidden;
}
.gantt-blocks {
  background-image: linear-gradient(#505050 1px, transparent 0), linear-gradient(90deg, #505050 1px, transparent 0);
}
.gantt-block {
  position: relative;
}
.gantt-block-item {
  position: absolute;
  height: 100%;
}
.gantt-scroll-y{
  overflow-y: scroll;
  position: absolute;
  z-index: 100;
  top: 0;
  right: 0;
}
.gantt-scroll-x{
  overflow-x: scroll;
  position: absolute;
  z-index: 1000;
  bottom: 0;
  left: 0;
}
</style>
