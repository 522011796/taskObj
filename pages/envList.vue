<template>
  <div class="container">
    <loading :pag-loading="pagLoading"></loading>
    <div class="header-item">
      <el-row>
        <el-col :span="4">
          <el-button size="mini" type="text" @click="returnIndex">
            <i class="fa fa-chevron-left color-disabled"></i>
            <span class="color-disabled">{{$t("返回")}}</span>
          </el-button>
        </el-col>
        <el-col :span="16" class="textCenter">
          <span>{{$t("场所列表")}}</span>
        </el-col>
        <el-col :span="4">
          <span>&nbsp;</span>
        </el-col>
      </el-row>
    </div>
    <div class="padding-left10 padding-right10 padding-top5" :style="contentStyle">
      <div v-for="(item, index) in tableData" :key="item.id" class="block-item bg-333333 marginBottom10 border-radius-5" @click="selEnv($event, item)">
        <div class="padding-lf10">
          <div class="padding-top5">
            <span class="font-size-14">{{ item.envName }}</span>
          </div>
          <div class="marginTop5">
            <span class="color-disabled">{{ item.envKey }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import {common, commonConfig} from "../utils/api/url";
import {MessageCommonTips} from "../utils/utils";
import Loading from "../components/Loading";
export default {
  layout: 'default',
  mixins: [mixins],
  components: {
    Loading
  },
  data() {
    return {
      pagLoading: false,
      tableHeader: {},
      tableData: []
    }
  },
  mounted() {

  },
  created() {
    this.init();
  },
  methods: {
    selEnv($event, item){
      this.$router.push({
        path: '/',
        query: {
          envKey: item.envKey
        }
      });
    },
    returnIndex(){
      this.$router.push({
        path: '/'
      });
    },
    init(){
      let params = {

      };
      this.pagLoading = true;
      this.$axios.get(commonConfig.baseUrl + common.envList, {params: params,sessionId: this.sessionId, userKey: this.userKey}).then(res => {
        if (res.data.code == 200){
          this.tableData = res.data.data;
        }else {
          MessageCommonTips(this, res.data.msg, 'error');
        }
        this.pagLoading = false;
      });
    }
  }
}
</script>

<style scoped>
</style>
