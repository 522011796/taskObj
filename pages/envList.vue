<template>
  <div class="container">
    <div class="header-item">
      <el-row>
        <el-col :span="4">
          <el-button size="mini" type="text" @click="returnIndex">
            <i class="fa fa-chevron-left color-disabled"></i>
            <span class="color-disabled">返回</span>
          </el-button>
        </el-col>
        <el-col :span="16" class="textCenter">
          <span>场所列表</span>
        </el-col>
        <el-col :span="4">
          <span>&nbsp;</span>
        </el-col>
      </el-row>
    </div>
    <div class="padding-left10 padding-right10 padding-top5" :style="contentStyle">
      <div v-for="(item, index) in 20" :key="index" class="block-item bg-333333 marginBottom10 border-radius-5" @click="selEnv($event, item)">
        <div class="padding-lf10">
          <div class="padding-top5">
            <span class="font-size-14">name</span>
          </div>
          <div class="marginTop5">
            <span class="color-disabled">subTitle</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
export default {
  layout: 'default',
  mixins: [mixins],
  components: {

  },
  data() {
    return {
      tableHeader: {},
      tableData: []
    }
  },
  mounted() {

  },
  methods: {
    selEnv($event, item){
      this.$router.push({
        path: '/'
      });
    },
    returnIndex(){
      this.$router.push({
        path: '/'
      });
    }
  }
}
</script>

<style scoped>
</style>
