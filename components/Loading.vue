<template>
  <div>
    <div class="loading-mask"
         v-if="drawer_">
      <div class="loading-main-block">
        <div class="loading-content-block">
          <div>
            <i class="fa fa-spinner fa-spin" style="font-size: 30px"></i>
          </div>
          <div class="marginTop10">
            <span>加载中...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    pagLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    drawer_:{
      get(){
        return this.pagLoading
      },
      set(v){

      }
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {

  }
}
</script>
