<template>
  <div>
    <el-drawer
      custom-class="drawer-block drawer-other-block"
      :show-close="false"
      size="70%"
      :append-to-body="appendToBody"
      :visible.sync="drawer_"
      direction="btt"
      :before-close="handleClose">
      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="24">
              <div class="textCenter">
                <span>{{$t('选择信息')}}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="custom-el-drawer-cascader">
        <el-cascader-panel ref="cascaderPanel" :props="{ multiple: true }" :options="data" :style="contentWidthStyle" @change="itemClick"></el-cascader-panel>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
export default {
  mixins: [mixins],
  props:{
    drawerSheet: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: function (){
        return []
      }
    }
  },
  computed: {
    drawer_:{
      get(){
        return this.drawerSheet
      },
      set(v){
        this.$emit("changeDialog",v)
      }
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {
    itemClick(item){
      let data = this.$refs.cascaderPanel.getCheckedNodes();
      this.$emit('change', data);
    },
    handleClose(done) {
      this.$emit('handleClose', done);
    }
  }
}
</script>
