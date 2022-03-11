<template>
  <div class="container">
    <v-gantt-pro
      :datas="dataTest"
      :gantt-data="dataTest"
      :gantt-col-data="ganttColData"
      :gantt-time-data="ganttTimeData"
      :scroll-to-postion="position"
      @scrollLeft="scrollLeftA">

      <div slot="title" class="textCenter">
        <i class="fa fa-chevron-left font-size-12"></i>
        <span class="font-size-12 color-F2F6FC">{{$t("任务")}}</span>
      </div>
    </v-gantt-pro>
  </div>
</template>

<script>
import VGanttPro from "../components/gantt/VGanttPro";
import mixins from "../mixins/mixins";
export default {
  layout: 'default',
  mixins: [mixins],
  components: {
    VGanttPro

  },
  data() {
    return {
      tableHeader: {},
      tableData: [],
      dataTest: [],
      ganttColData: [],
      ganttTimeData: [],
      position: 0,
      scrollToY: 0,
      positionA: 0,
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      let data = [];
      let dataCol = [];
      let dataTime = [];
      for (let i = 0; i < 50; i++){
        let testBar = [];
        for (let j = 0; j < i; j++){
          let start = j * 1000;
          let end = (j+1) * 1000;
          testBar.push({start: start,end: end,time: 1000,type: j % 2 == 0 ? 1 : 2});
        }
        data.push({
          time: i,
          menuTitle: i,
          children: testBar
        });
      }
      for (let i = 0; i < 50; i++){
        dataCol.push({
          time: i,
          start: 0,
          end: 1
        });
      }
      for (let i = 0; i < 50; i++){
        dataTime.push({
          time: i
        });
      }
      this.dataTest = data;
      this.ganttColData = dataCol;
      this.ganttTimeData = dataTime;
    },
    test(){
      this.$router.push({
        path: '/'
      });
    },
    scrollLeftA(val) {
      this.position = { x: val };
    }
  }
}
</script>

<style scoped>
</style>
