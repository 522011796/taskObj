<template>
  <div class="gantt__layout">
    <div>
      <div class="gantt__area container-header-block">
        <div class="header-left">
          title
        </div>
        <div class="header-right-block">
          <div ref="header" :style="[blockStyle]">
            <template>
              <div v-for="(item,index) in visibleWidthData" class="barHeader">
                <span class="color-333333">{{changeTime(item * 1000)}}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="gantt__area">
        <div class="side">
          <div ref="side" :style="areaStyleObj">
            <div v-for="(item, index) in visibleData" class="sideBar" style="height: 40px; line-height: 40px">
              <span>{{item}}</span>
            </div>
          </div>
        </div>
        <div class="container-block">
          <div ref="content" :style="[areaStyleObj,blockStyle]">
            <div class="block" v-for="(item,index) in visibleData">
              <template>
                <div v-for="(itemChild,indexChild) in visibleWidthData" class="bar" @click="test">
<!--                  <div v-for="(n, i) in 10" class="list-item-block" style="display: inline-block"></div>-->
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  props:{
    // 甘特图表头配置
    showHeader: { // 甘特图表头显示
      type: Boolean,
      default: true
    },
    headerData: { // 甘特图表头自定义
      type: Array,
      default: () => ['日期', '时间']
    },
    timeSection: { // 甘特图时间区间
      type: Array,
      required: false
    },
    // 甘特图内容配置
    firstLineStick: { // 首行粘性
      type: Boolean,
      default: true
    },
    chartMaxHeight: { // 甘特图内容最大高度
      type: Number,
      default: 500
    },
    ganttCurrentTime: { // 甘特图时间轴时间
      type: Number,
      default: new Date().getTime()
    },
    ganttData: { // 甘特图数据
      type: Array,
      required: true
    },
    ganttColData:{ // 甘特图数据
      type: Array,
      required: true
    },
    // 额外配置
    floatViewRenderFn: { // renderTemplate
      type: Function,
      default: () => { return (info) => info }
    }
  },
  data() {
    return {
      baseHour: 50, // 基准小时
      baseBlock: 40, // 基准高度
      baseWidth: 60, // 基准宽度
      floatState: true,
      drawerTest: false,
      visibleData: [],
      visibleWidthData: [],
      contentTopDistance: 0,
      scrollTopTest: 0
    }
  },
  computed: {
    areaStyleObj() { // 自适应高度限制
      //const realHeight = this.ganttData.length * this.baseBlock;
      if (process.client){
        const realHeight = window.innerHeight;
        return {height: `${realHeight - 25}px`};
      }
    },
    blockStyle () {
      //return { width: `${this.baseHour * this.baseWidth}px` }
      if (process.client){
        const realWidth = window.innerWidth;
        return {width: `${realWidth - 70}px`};
      }
    }
  },
  mounted() {
    this.updateVisibleData();

    const header = document.querySelector('.gantt__layout .header-right-block')
    const side = document.querySelector('.gantt__layout .side')
    const container = document.querySelector('.gantt__layout .container-block')
    const area = document.querySelector('.gantt__layout')
    let flag = ''
    area.addEventListener('mouseenter', (event) => {
      const className = event.target.className;
      if (className.includes('container-block')) flag = 'container-block'
      if (className.includes('side')) flag = 'side'
    }, true);
    area.addEventListener('touchstart', (event) => {
      const className = event.target.className
      if (className.includes('bar')) flag = 'bar'
      if (className.includes('sideBar')) flag = 'sideBar'
    }, true);
    area.addEventListener('scroll', (event) => {
      if ((flag === 'container-block' || flag === 'bar') && event.target.className === 'container-block') {
        side.scrollTop = event.target.scrollTop;
        header.scrollLeft = event.target.scrollLeft;

        const scrollTop = event.target.scrollTop;
        const scrollLeft = event.target.scrollLeft;

        if (scrollTop >= 0 && scrollLeft >= 0){
          this.updateVisibleData(scrollTop,scrollLeft);
        }
      }
      if (flag === 'side' || flag === 'sideBar') {
        container.scrollTop = event.target.scrollTop;
        const scrollTop = event.target.scrollTop;
        const scrollLeft = event.target.scrollLeft;
        this.updateVisibleData(scrollTop,scrollLeft);
      }
    }, true);
  },
  methods: {
    init(){
      let col = [];
      let data = [];
      let maxTime = 20;
      let maxRow = 5;
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
      //this.$refs.plxTable.reloadData(this.datas)
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
    updateVisibleData(scrollTop = 0,scrollLeft = 0) {
      const visibleCount = Math.ceil((this.$el.clientHeight - 25) / this.baseBlock);
      const start = Math.floor(scrollTop / this.baseBlock);
      const end = start + visibleCount + 6;
      this.visibleData = this.ganttData.slice(start, end);

      scrollLeft = scrollLeft % 5 >= 0 ? scrollLeft : 0;
      const visibleWidthCount = Math.ceil((this.$el.clientWidth - 70) / this.baseWidth);
      const widthStart = Math.floor(scrollLeft / this.baseWidth);
      const widthEnd = widthStart + visibleWidthCount + 6;
      this.visibleWidthData = this.ganttColData.slice(widthStart, widthEnd);

      this.$refs.content.style.webkitTransform = `translate3d(${ widthStart * this.baseWidth }px, ${ start * this.baseBlock }px, 0)`;
      this.$refs.side.style.webkitTransform = `translate3d(0, ${ start * this.baseBlock }px, 0)`;
      this.$refs.header.style.webkitTransform = `translate3d(${ widthStart * this.baseWidth }px, 0, 0)`;
      //console.log(widthStart,this.visibleWidthData,this.ganttColData);
    },
    test(){
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
.block {
  height: 40px;
  position: relative;
  /*display: flex;*/
  /*flex-direction: row;*/
  /*align-items: center;*/
}
.barHeader{
  color: #303133;
  /*position: absolute;*/
  height: 25px;
  width: 60px;
  user-select: none;
  display: inline-block;
}
.bar{
  color: #303133;
  /*position: absolute;*/
  height: 39px;
  width: 59px;
  user-select: none;
  border: 0.5px solid #666666;
  display: inline-block;
}
.container-header-block{
  height: 25px;
  line-height: 25px;
}
.list-view-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
.list-item-block{
  height: 10px;
  width: 6px;
  background: #00f;
  top:5px;
}
</style>
