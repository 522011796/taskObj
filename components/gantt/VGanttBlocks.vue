<template>
  <div class="gantt-blocks">
    <div class="gantt-block gantt-block-top-space" :style="{ height: topSpace + 'px' }"></div>
    <div class="gantt-block" v-for="(item, index) in showDatas" :key="index" :style="{ height: `${cellHeight}px` }" @click="showBlock(item, index)">

      <div v-for="(itemChild, indexChild) in item.children"
           v-if="scrollLeft <= ((itemChild.start) / 100 * (cellWidth / 10)) + cellWidth && getPosition(itemChild) - scrollLeft < blockWidth"
           class="gantt-block-item"
           :style="{left: getPosition(itemChild) + 'px', width: `${ (itemChild.time/100) * (cellWidth/10)}px`,background: orderColorInfo(itemChild.type)}"
           style="height: 35px;top:2px;">

        <div class="moon-ellipsis-class font-size-12 textCenter">
          {{ orderValueInfo(itemChild.type, 'set') }}
        </div>
        <div class="moon-ellipsis-class font-size-10 textCenter">
          <span v-if="(itemChild.type == 3 || itemChild.type == 4) && itemChild.end == 0" class="color-666666">
            <i class="fa fa-refresh fa-spin" style="font-size: 12px"></i>
            {{ $t("无限") }}
          </span>
          <span v-else-if="itemChild.type == 3 && itemChild.end != 0" class="color-666666">
            {{ $t("重复") }}:{{ itemChild.end }}
          </span>
          <span v-else>{{changeTime(itemChild.time)}}</span>
        </div>

        <div v-if="item.children.length - 1 == indexChild" class="block-item-plus" @click="addBlock(item, index)">
          <span class="fa fa-plus" style="font-size: 14px"></span>
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
    showBlock(item, index){
      this.$emit("showBlock", item, index);
    },
    addBlock(item, index){
      this.$emit("addBlock", item, index);
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
.block-item-plus{
  position: absolute;
  top: 8px;
  right: -20px;
}
</style>
