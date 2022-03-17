<template>
  <div>
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      size="50%"
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
      <div>
        <div v-for="(item, index) in data" :key="index" @click="itemClick($event, item)" class="drawer-item-class">
          <span class="color-666666">{{ item.name }}</span>
        </div>
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
    deviceType: {
      type: String,
      default: ''
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
    itemClick(event, item){
      this.$emit('click', item);
    },
    handleClose(done) {
      this.$emit('handleClose', done);
    }
  }
}
</script>
