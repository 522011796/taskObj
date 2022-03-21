<template>
  <div>
    <div class="gantt-chart" @wheel.passive="wheelHandle" @touchstart.passive="touchStartHandle" @touchmove.passive="touchMoveHandle" @touchend.passive="touchEndHandle">
      <div class="gantt-container" :style="[areaStyleObj, blockStyle]">
        <div class="gantt-header" :style="{ width: `calc(100% + ${scrollYBarWidth}px)` }">
          <div class="gantt-header-title" :style="{ 'line-height': titleHeight + 'px', height: titleHeight + 'px', width: titleWidth + 'px'}">
            <slot name="title"></slot>
          </div>
          <div ref="headerTimeline" class="gantt-header-timeline">
            <div class="gantt-timeline-wrapper" :style="{ width: totalWidth + scrollYBarWidth + 'px' }">
              <v-gantt-time-line
                :datas="ganttTimeData"
                :cell-width="cellWidth + (cellWidth * scale)"
                :scrollLeft="scrollLeft"
                :widthOfBlocksWrapper="widthOfBlocksWrapper"
                :get-positon-offset="getPositonOffset">
              </v-gantt-time-line>
            </div>
          </div>
        </div>
        <div class="gantt-body"
             :style="{ height: `calc(100% - ${actualHeaderHeight}px)` }" >
          <div class="gantt-table">
            <div ref="leftbarWrapper" class="gantt-leftbar-wrapper"
                 :style="{ width: titleWidth + 'px', height: `calc(100% + ${0}px)`}">

              <v-gantt-left-bar
                :datas="ganttData"
                :scrollTop="scrollTop"
                :heightOfBlocksWrapper="heightOfBlocksWrapper"
                :cellHeight="cellHeight"
                @planItemClick="planItemClick">
              </v-gantt-left-bar>
            </div>
            <div ref="blocksWrapper" class="gantt-blocks-wrapper">
              <v-gantt-blocks
                :extra-opr-status="extraOprStatus"
                :style="rightContentStyle"
                :scrollTop="scrollTop"
                :scrollLeft="scrollLeft"
                :cell-width="cellWidth + (cellWidth * scale)"
                :cell-height="cellHeight"
                :block-width="blockWidth"
                :datas="ganttData"
                :heightOfBlocksWrapper="heightOfBlocksWrapper"
                :widthOfBlocksWrapper="widthOfBlocksWrapper"
                :startTimeOfRenderArea="startTimeOfRenderArea"
                :endTimeOfRenderArea="endTimeOfRenderArea"
                @showBlock="showBlock"
                @showItemBlock="showItemBlock"
                @showTimeDiff="showTimeDiff"
                @addBlock="addBlock">

              </v-gantt-blocks>
            </div>
          </div>
        </div>

        <div ref="scrollYBar" class="gantt-scroll-y" :style="{ width: `${scrollYBarWidth}px`, height: `calc(100% - ${actualHeaderHeight}px`,marginTop: `${actualHeaderHeight}px`}" @scroll.passive="syncScrollY">
          <div :style="{ height: totalHeight + 'px' }"></div>
        </div>

        <div ref="scrollXBar" class="gantt-scroll-x" :style="{ height: `${scrollXBarHeight}px`, width: `calc(100% - ${titleWidth}px )`, marginLeft: titleWidth + 'px'}" @scroll.passive="syncScrollX">
          <div :style="{ width: totalWidth + 'px', height: `${scrollXBarHeight}px` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "../../mixins/mixins";
import throttle from "../../utils/throttle";
import {isDef} from "../../utils/utils";
import VGanttBlocks from "./VGanttBlocks";
import VGanttLeftBar from "./VGanttLeftBar";
import VGanttTimeLine from "./VGanttTimeLine";

export default {
  layout: 'default',
  mixins: [mixins],
  components: {
    VGanttTimeLine,
    VGanttLeftBar,
    VGanttBlocks

  },
  props:{
    ganttData: { // 甘特图数据
      type: Array,
      required: true
    },
    ganttColData:{ // 甘特图数据
      type: Array,
      required: true
    },
    ganttTimeData:{ // 甘特图数据
      type: Array
    },
    hideHeader: {
      type: Boolean,
      default: true
    },
    extraOprStatus: {
      type: Boolean,
      default: false
    },
    hideXScrollBar: {
      type: Boolean,
      default: false
    },
    hideYScrollBar: {
      type: Boolean,
      default: false
    },
    scale: Number,
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
    titleWidth: {
      type: Number,
      default: 70
    },
    scrollToTime: {
      validator(date) {
        return true;
      }
    },
    scrollToPostion: {
      validator(obj) {
        const validX = isDef(obj.x) ? !Number.isNaN(obj.x) : true;
        const validY = isDef(obj.y) ? !Number.isNaN(obj.y) : true;
        if (!validX && !validY) {
          console.log("scrollToPostion x或y 有值为非Number类型");
          return false;
        }
        return true;
      }
    }
  },
  data() {
    return {
      realHeight: 0,
      realWidth: 0,
      screenOrientation: '',
      drawerTest: false,
      //缓存节点
      selector: {
        gantt_leftbar: {},
        gantt_table: {},
        gantt_scroll_y: {},
        gantt_timeline: {},
        gantt_scroll_x: {},
        gantt_markArea: {}
      },
      scrollTop: 0,
      scrollLeft: 0,
      //block 区域需要渲染的范围
      //先渲染出空框架，在mounted后再得到真实的渲染范围，然后在根据范围渲染数据，比之前设置一个默认高度宽度，额外的渲染浪费更少了
      heightOfBlocksWrapper: 0,
      widthOfBlocksWrapper: 0,
      scrollBarWitdh: 17,
      preTouchPosition: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    areaStyleObj() { // 自适应高度限制
      //const realHeight = this.ganttData.length * this.baseBlock;
      if (process.client){
        const realHeight = this.realHeight;
        return {height: `${realHeight}px`};
      }
    },
    blockStyle () {
      //return { width: `${this.baseHour * this.baseWidth}px` }
      if (process.client){
        const realWidth = this.realWidth;
        return {width: `${realWidth}px`};
      }
    },
    blockWidth () {
      if (process.client){
        const realWidth = this.realWidth - 70;
        return realWidth;
      }
    },
    rightContentStyle() {
      if (process.client){
        const { ganttData, ganttColData, cellHeight, cellWidth, scale } = this;
        const realHeight = ganttData.length * cellHeight;
        const realWidth = window.innerWidth;
        return {
          backgroundSize: `${cellWidth + (cellWidth * scale)}px ${cellHeight}px`,
          height: `${realHeight }px`,
          width: `${(cellWidth + (cellWidth * scale)) * ganttColData.length}px`,
        };
      }
    },
    cellWidthStyle() {
      return {
        width: `${this.cellWidth}px`
      };
    },
    totalHeight() {
      const { ganttData, cellHeight } = this;
      return ganttData.length * cellHeight;
    },
    totalWidth() {
      const { cellWidth, scale } = this;
      return (cellWidth + (cellWidth * scale)) * this.ganttColData.length;
    },
    scrollXBarHeight() {
      return this.hideXScrollBar ? 0 : this.scrollBarWitdh;
    },
    scrollYBarWidth() {
      return this.hideYScrollBar ? 0 : this.scrollBarWitdh;
    },
    actualHeaderHeight() {
      return this.titleHeight;
    },
    availableScrollLeft() {
      // 不减这个1，滚动到时间轴尽头后继续滚动会慢慢的溢出
      const { totalWidth, widthOfBlocksWrapper } = this;
      return totalWidth - widthOfBlocksWrapper - 1;
    },
    availableScrollTop() {
      const { totalHeight, heightOfBlocksWrapper } = this;
      return totalHeight - heightOfBlocksWrapper - 1;
    },
    startTimeOfRenderArea(){
      if (this.heightOfBlocksWrapper === 0) {
        return;
      }
      const { scrollLeft, cellWidth } = this;
      return (scrollLeft / cellWidth);
    },
    endTimeOfRenderArea(){
      if (this.heightOfBlocksWrapper === 0) {
        return;
      }
      const { scrollLeft, cellWidth, widthOfBlocksWrapper, totalWidth } = this;
      const renderWidth = totalWidth < widthOfBlocksWrapper ? totalWidth : widthOfBlocksWrapper;
      return ((scrollLeft + renderWidth) / cellWidth);
    }
  },
  mounted() {
    let _self = this;
    this.cacheSelector();

    this.realHeight = window.innerHeight;
    this.realWidth = window.innerWidth;
    // 监听窗口大小
    window.onresize = () => {
      _self.realHeight = window.innerHeight;
      _self.realWidth = window.innerWidth;
    };

    window.addEventListener('orientationchange', (e) => {
      this.checkOrient();
    });

    const element = document.querySelector('.gantt-blocks');
    element.addEventListener('mousewheel', function(event) {//禁止mac浏览器触摸板左滑动返回
      // 滚动到右边的最大宽度
      var maxX = this.scrollWidth - this.offsetWidth;
      // 如果这个事件看起来要滚动到元素的边界之外，要阻止它
      // 其中一个是滚动到最左边，一个是滚动到最右边
      if (this.scrollLeft + event.deltaX < 0 || this.scrollLeft + event.deltaX > maxX) {
        // 阻止事件
        event.preventDefault();
        this.scrollLeft = Math.max(0, Math.min(maxX, this.scrollLeft + event.deltaX));
      }
    }, false);

    // 计算准确的渲染区域范围
    const observeContainer = throttle((entries) => {
      entries.forEach((entry) => {
        const cr = entry.contentRect;
        this.heightOfBlocksWrapper = cr.height;
        this.widthOfBlocksWrapper = cr.width;
      });
    });

    const observer = new ResizeObserver(observeContainer);
    observer.observe(this.$refs.blocksWrapper);
    this.$once("hook:beforeDestroy", () => {
      observer.disconnect();
      this.releaseSelector();
    });
  },
  methods: {
    init(){

    },
    changeTime(time, num) {
      let hour = 0
      let minute = 0
      let second = 0
      second = time / 1000
      if (second >= 3600) {
        minute = (second - (second % 60)) / 60
        hour = parseInt((minute / 60).toString())
        minute = minute % 60
        /* eslint-disable */
        hour >= 10 ? hour : hour = '0' + hour
        minute >= 10 ? minute : minute = '0' + minute
        second = second % 60
        second >= 10 ? second : second = '0' + second
        /* eslint-enable */
        return hour + ':' + minute + ':' + second
      }
      if (second < 3600 && second >= 60) {
        hour = '00'
        minute = parseInt((second / 60).toString())
        /* eslint-disable */
        minute >= 10 ? minute : minute = '0' + minute
        second = second % 60
        second >= 10 ? second : second = '0' + second
        /* eslint-enable */
        return hour + ':' + minute + ':' + second
      }
      if (second < 60) {
        hour = '00'
        minute = '00'
        second = parseInt(second)
        /* eslint-disable */
        second >= 10 ? second : second = '0' + second
        /* eslint-enable */
        return hour + ':' + minute + ':' + second
      }
    },
    wheelHandle(event) {
      const { deltaX, deltaY } = event;
      const { scrollTop, scrollLeft, availableScrollLeft, availableScrollTop } = this;
      if (deltaY !== 0) {
        if ( scrollTop + deltaY >= availableScrollTop && scrollTop !== availableScrollTop ) {
          this.manualScroll(undefined, availableScrollTop);
        } else if (scrollTop + deltaY < 0 && scrollTop !== 0 /*滚动为0限制*/) {
          this.manualScroll(undefined, 0);
        } else {
          this.manualScroll(undefined, scrollTop + deltaY);
        }
      }
      if (deltaX !== 0) {
        if ( scrollLeft + deltaX >= availableScrollLeft && scrollLeft !== availableScrollLeft ) {
          this.manualScroll(availableScrollLeft);
        } else if ( scrollLeft + deltaX < 0 && scrollLeft !== 0 /*滚动为0限制*/ ) {
          this.manualScroll(0);
        } else {
          this.manualScroll(scrollLeft + deltaX);
        }
      }
    },
    manualScroll(x, y) {
      if (x != undefined) {
        this.selector.gantt_scroll_x.scrollLeft = x;
      }
      if (y != undefined) {
        this.selector.gantt_scroll_y.scrollTop = y;
      }
    },
    //缓存节点
    cacheSelector() {
      this.selector.gantt_leftbar = this.$refs.leftbarWrapper;
      this.selector.gantt_table = this.$refs.blocksWrapper;
      this.selector.gantt_scroll_y = this.$refs.scrollYBar;
      this.selector.gantt_timeline = this.$refs.headerTimeline;
      this.selector.gantt_scroll_x = this.$refs.scrollXBar;
      this.selector.gantt_markArea = this.$refs.marklineArea;
    },
    releaseSelector() {
      let key;
      for (key in this.selector) {
        this.selector[key] = null;
      }
    },
    //同步fixleft和block的滚动
    syncScrollY(event) {
      const { gantt_leftbar, gantt_table } = this.selector;
      const topValue = event.target.scrollTop;
      this.scrollTop = gantt_table.scrollTop = gantt_leftbar.scrollTop = topValue;
      this.$emit("scrollTop", topValue);
    },
    syncScrollX(event) {
      const { gantt_table, gantt_timeline, gantt_markArea } = this.selector;
      const leftValue = event.target.scrollLeft;
      this.scrollLeft = gantt_timeline.scrollLeft = gantt_table.scrollLeft = leftValue;
      //this.scrollLeft = gantt_table.scrollLeft = leftValue;
      //gantt_markArea.style.left = -leftValue + "px";
      this.$emit("scrollLeft", leftValue);
    },
    touchMoveHandle(e) {
      const finger = e.touches[0];
      this.wheelHandle({
        deltaX: this.preTouchPosition.x - finger.screenX,
        deltaY: this.preTouchPosition.y - finger.screenY
      });
      this.preTouchPosition.x = finger.screenX;
      this.preTouchPosition.y = finger.screenY;
    },
    touchStartHandle(e) {
      const finger = e.touches[0];
      this.preTouchPosition.x = finger.screenX;
      this.preTouchPosition.y = finger.screenY;
    },
    touchEndHandle() {
      this.preTouchPosition.x = 0;
      this.preTouchPosition.y = 0;
    },
    scrollToPositionHandle(newV) {
      if (!newV) {
        return;
      }
      const x = Number.parseFloat(newV.x);
      const y = Number.parseFloat(newV.y);
      if (!Number.isNaN(x) && x !== this.scrollLeft) {
        this.$nextTick(() => {
          this.manualScroll(x);
        });
      }
      if (!Number.isNaN(y) && y !== this.scrollTop) {
        this.$nextTick(() => {
          this.manualScroll(undefined, y);
        });
      }
    },
    scrollToPostionHandle(newV) {
      return this.scrollToPositionHandle(newV);
    },
    scrollToTimehandle(newV) {
      if (!newV) {
        return;
      }

      const offset = this.getPositonOffset(newV);
      this.$nextTick(() => {
        this.manualScroll(offset);
      });
    },
    getPositonOffset(block) {

    },
    showBlock(event, data){
      this.$emit("showBlock", event, data);
    },
    showItemBlock(item, index, itemChild, indexChild){
      this.$emit("showItemBlock", item, index, itemChild, indexChild);
    },
    planItemClick(data, index){
      this.$emit("planItemClick", data, index);
    },
    showTimeDiff(item, index, itemChild, indexChild){
      this.$emit('showTimeDiff', item, index, itemChild, indexChild);
    },
    addBlock(item, index){
      this.$emit("addBlock", item, index);
    },
    checkOrient() {
      if (process.browser) {
        if (window.orientation == 0 || window.orientation == 180){
          this.realHeight = window.innerHeight;
          this.realWidth = window.innerWidth;
        }
        else if (window.orientation == 90 || window.orientation == -90){
          this.realHeight = window.innerHeight;
          this.realWidth = window.innerWidth;
        }
      }
    }
  },
  watch: {
    scrollToTime: {
      handler(newV) {
        this.scrollToTimehandle(newV);
      },
      immediate: true
    },
    scrollToPostion: {
      handler(newV) {
        this.scrollToPositionHandle(newV);
      },
      immediate: true
    }
  },
}
</script>

<style scoped>
.gantt-chart {
  will-change: transform;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  /*outline: 1px solid #f0f0f0;*/
}
.gantt-header{
  display: flex;
  border-bottom: 1px solid #505050;
}
.gantt-header-timeline{
  overflow: hidden;
}
.gantt-header-title{
  flex: none;
}
.gantt-timeline{
  display:flex;
  position: relative;
}
.gantt-timeline-scale{
  display: flex;
}
.gantt-body {
  position: relative;
}
.gantt-table {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  height: 100%;
}
.gantt-leftbar-wrapper {
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  position: relative;
  overflow: hidden;
  outline: 1px solid #505050;
  z-index: 100;
}
.gantt-blocks-wrapper {
  overflow: hidden;
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
