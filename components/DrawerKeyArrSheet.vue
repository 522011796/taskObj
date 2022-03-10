<template>
  <div>
    <el-drawer
      custom-class="drawer-block"
      :show-close="false"
      size="30%"
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
          <el-row>
            <el-col :span="12" class="textRight">
              <span class="color-666666">{{$t('继电器')}}{{ item.name }}</span>
            </el-col>
            <el-col :span="12" class="textLeft padding-left10">
              <span v-if="keyArr.indexOf(item.value) > -1"><i class="fa fa-check-circle color-success"></i></span>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
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
      inputValue: '',
      keyArr: []
    }
  },
  methods: {
    itemClick(event, item){
      let dataValue = item.value;
      if (this.keyArr.indexOf(dataValue) == -1){
        this.keyArr.push(dataValue);
      }else{
        let indexItem = this.keyArr.indexOf(dataValue);
        this.keyArr.splice(indexItem, 1);
      }
      this.$emit('click', item);
    },
    handleClose(done) {
      this.$emit('handleClose', done);
    }
  }
}
</script>
