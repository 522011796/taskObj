<template>
  <div>
    <el-drawer
      custom-class="drawer-block"
      :modal="false"
      :show-close="false"
      size="90%"
      :visible.sync="drawer_"
      direction="btt"
      :before-close="handleClose">
      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="24">
              <div class="textCenter">
                <span>{{$t('选择房间')}}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="padding-full10">
        <el-row :gutter="8">
          <el-col :span="8" v-for="(item, index) in data" :key="index" @click.native="itemClick($event, item)">
            <div class="textCenter collection-item-block">
              <div>
                <img :src="require(`~/static/img/${item.id}.png`)" class="collection-item-icon"/>
              </div>
              <div>
                <span class="color-666666">{{ item.name }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props:{
    drawerRoom: {
      type: Boolean,
      default: false
    },
    title: {
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
        return this.drawerRoom
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
