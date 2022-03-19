<template>
  <div class="gantt-leftbar">
    <div class="gantt-leftbar-item gantt-block-top-space" :style="{ height: topSpace + 'px' }" ></div>
    <div class="gantt-leftbar-item padding-left10 moon-ellipsis-class" :style="cellHeightStyle" v-for="(item, index) in showDatas" @click="planItemClick(item, index)">
      <span>
        <img v-if="item.t == 1" src="~/static/img/light.png" class="layout-menu-icon"/>
        <img v-if="item.t == 2" src="~/static/img/switch.png" class="layout-menu-icon"/>
        <img v-if="item.t == 3" src="~/static/img/curtains.png" class="layout-menu-icon"/>
        <img v-if="item.t == 5" src="~/static/img/music.png" class="layout-menu-icon"/>
        <img v-if="item.t == 6" src="~/static/img/changedevice.png" class="layout-menu-icon"/>
        <img v-if="item.t == 0" src="~/static/img/sence.png" class="layout-menu-icon"/>
      </span>
      <span>
        {{item.n}}
      </span>
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
        height: `${this.cellHeight}px`,
        lineHeight: `${this.cellHeight}px`
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
    planItemClick(data, index){
      this.$emit("planItemClick", data, index);
    }
  }
}
</script>

<style scoped>
.gantt-leftbar{
  width: 100%;
}
</style>
