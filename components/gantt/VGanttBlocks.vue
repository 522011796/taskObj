<template>
  <div class="gantt-blocks">
    <div class="gantt-block gantt-block-top-space" :style="{ height: topSpace + 'px' }"></div>
    <div class="gantt-block" v-for="(item, index) in showDatas" :style="{ height: `${cellHeight}px` }" @click="showBlock($event, item)">

      <div v-for="(itemChild, indexChild) in item.children"
           v-if="scrollLeft <= ((itemChild.start) / 100 * (cellWidth / 10)) + cellWidth && getPosition(itemChild) - scrollLeft < blockWidth"
           class="gantt-block-item"
           :style="{left: getPosition(itemChild) + 'px', width: `${ (itemChild.time/100) * (cellWidth/10)}px`,background: orderColorInfo(itemChild.type)}"
           style="height: 35px;top:2px;">

        <div class="moon-ellipsis-class font-size-12 textCenter">
          {{ orderValueInfo(itemChild.type, 'set') }}
        </div>
        <div class="moon-ellipsis-class font-size-12 textCenter">
          {{changeTime(itemChild.time)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "../../mixins/mixins";
import dr from "../../utils/dynamic-render";
import {isUndef} from "../../utils/utils";
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
    blockWidth: {
      type: Number,
      required: false
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
    /**
     * 计算时间块偏移
     *
     * @param {{start:string}} block
     * @returns {number}
     */
    getPosition(block) {
      if (isUndef(block.start)) {
        return 0;
      }
      return block.start / 100 * this.cellWidth / 10;
    },
    showBlock(event, item){
      this.$emit("showBlock", event, item);
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
  outline: 1px solid #606060;
}
.gantt-block-item {
  position: absolute;
  height: 100%;
  box-shadow: #808080 0px 0px 0px 1px;
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
