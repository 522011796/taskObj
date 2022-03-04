<template>
  <div class="container">
    <ux-grid
      ref="plxTable"
      row-class-name="custom-row-class"
      header-row-class-name="custom-head-row-class"
      cell-class-name="custom-cell-class"
      header-cell-class-name="custom-head-cell-class"
      :height="height"
      :row-height="rowHeight"
      show-header-overflow="ellipsis"
      :highlight-current-row="false"
      @row-click="rowClick">
      <ux-table-column field="plan" width="80" fixed="left"></ux-table-column>
      <ux-table-column
        v-for="(item,index) in columns"
        :key="item.id"
        :resizable="item.resizable"
        :field="item.prop"
        :title="item.label"
        :width="item.width">
        <template v-slot="{row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, _columnIndex}" class="progressCon">
          <div class="progressUpon" v-for="(n,i) in 10" :style="{'width': 8 + 'px','left': i * 8 + 'px'}" style="display: inline-block"></div>
        </template>
      </ux-table-column>
    </ux-grid>

    <el-drawer
      :visible.sync="drawerTest"
      direction="btt">
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>

<script>
import mixins from "../../mixins/mixins";
export default {
  layout: 'default',
  mixins: [mixins],
  components: {

  },
  data() {
    return {
      drawerTest: false,
      tableHeader: {},
      height: 0,
      rowHeight: 55, // 如果你这里给行高为50，那么你表格行会出现错乱，不要问为啥，因为你可以看看控制台看节点的高是多少，是55，而你这里给50就有问题！
      columns: [],
      tableData: [],
      scrollTop: 0,
      radio: 1,
      mergeCells: []
    }
  },
  mounted() {
    this.height = window.innerHeight // 动态设置高度
    setTimeout(() => {
      this.init();
    });
  },
  methods: {
    init(){
      let col = [];
      let data = [];
      let maxTime = 600;
      let maxRow = 50;
      this.mergeCells = [];

      for (let i = 0; i < maxRow; i++){
        this.mergeCells.push({ row: i, col: 1, rowspan: 1, colspan: maxTime })
      }

      for (let i = 0; i < maxRow; i++){
        let children = [];
        data.push({
          id: i,
          plan: 'plan'+i,
          start: 1,
          end: 2,
          type: 1,
          time: i,
          children: [{start: 1, end: 2, time:1 ,type: 1},{start: 5, end: 8, time:3 ,type: 2}]
        });

        for (let j = 0; j < 3; j++){
          //data[i]['date'+j] = this.changeTime(j * 1000);
          children.push({
            start: 1,
            end: 2,
            time: j % 2 == 0 ? 100 : 200,
            type: 1
          });
        }
        data[i]['children'] = children;
      }

      for (let j = 0; j < maxTime; j++){
        col.push('date'+j);
      }
      this.columns = Array.from({ length: col.length }, (_, idx) => ({
        prop: col[idx],
        id: idx,
        label: this.changeTime(idx * 1000),
        width: 80
      }));

      this.datas = data // 知道为啥datas不在 data()方法里面定义吗？嘻嘻
      this.$refs.plxTable.reloadData(this.datas)
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
    rowClick(){
      this.drawerTest = true;
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
