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
        <div v-for="(item, index) in data" :key="index" @click="itemClick($event, item, index)" class="drawer-item-class">
          <span class="color-666666">{{ item.name }}</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props:{
    drawerDeviceList: {
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
        return this.drawerDeviceList
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
    itemClick(event, item, index){
      this.$emit('click', item, index);
    },
    handleClose(done) {
      this.$emit('handleClose', done);
    }
  }
}
</script>
