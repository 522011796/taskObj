<template>
  <div class="container">
<!--    <v-gantt-base :gantt-data="dataTest" :gantt-col-data="ganttColData"></v-gantt-base>-->
<!--    <v-gantt-bak></v-gantt-bak>-->
    <v-gantt-pro :datas="dataTest" :gantt-data="dataTest" :gantt-col-data="ganttColData" :scroll-to-postion="position" @scrollLeft="scrollLeftA"></v-gantt-pro>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import VGanttBak from "../components/gantt/VGanttBak";
import VGanttBase from "../components/gantt/VGanttBase";
import VGanttPro from "../components/gantt/VGanttPro";
export default {
  layout: 'default',
  mixins: [mixins],
  components: {
    VGanttPro,
    VGanttBase,
    VGanttBak

  },
  data() {
    return {
      dataTest: [],
      ganttColData: [],
      position: 0,
      scrollToY: 0,
      positionA: 0
    }
  },
  computed: {

  },
  mounted() {
    this.height = window.innerHeight // 动态设置高度
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      let data = [];
      let dataCol = [];
      for (let i = 0; i < 50; i++){
        data.push(i);
      }
      for (let i = 0; i < 50; i++){
        dataCol.push(i);
      }
      this.dataTest = data;
      this.ganttColData = dataCol;
    },
    dateGanttType(date, item) {
      let start = item.start;
      let end = item.end;
      if (!start || !end){
        return;
      }
      if (start && end) {
        return "wl-item-on wl-item-full"
      }
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
    scrollLeftA(val) {
      this.position = { x: val };
    }
  },
  watch: {
    scrollToY(val) {
      console.log(111);
      this.position = { x: val };
    }
  }
}
</script>

<style scoped>
.wl-item-on {
  position: absolute;
  top: 16px;
  left: 0;
  right: -1px;
  margin-top: -10px;
  height: 35px;
  background: #00cbed;
  transition: all 0.4s;
  cursor: pointer;
}
.wl-item-full {
  left: 0px;
  right: 0px;
}
.wl-item-full:before {
  position: absolute;
  top: 0;
  left: 0px;
  z-index: 1;
  content: "";
  width: 0px;
  height: 35px;
  border-radius: 0%;
  background: #00cbed;
}
.wl-item-full:after {
  position: absolute;
  top: 0;
  right: 0px;
  z-index: 1;
  content: "";
  width: 0px;
  height: 35px;
  border-radius: 0%;
  background: #00cbed;
}
.wl-item-start {
  left: 0%;
}
.wl-item-start :after {
  position: absolute;
  top: 0;
  left: 0px;
  z-index: 1;
  content: "";
  width: 0px;
  height: 35px;
  border-radius: 50%;
  background: #00cbed;
}

.wl-item-end {
  right: 0%;
}
wl-item-end:after {
  position: absolute;
  top: 0;
  right: 0px;
  z-index: 1;
  content: "";
  width: 0px;
  height: 35px;
  border-radius: 50%;
  background: #00cbed;
}

</style>
