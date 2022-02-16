<template>
    <div>
      <div :style="contentStyle">
        <vue-page-transition name="fade-in-right">
          <nuxt></nuxt>
        </vue-page-transition>
      </div>
    </div>
</template>

<script>
    export default {
      name: "default",
      data(){
        return {
          contentStyle:{
            'height': '0px',
            'overflow-y': 'hiddle'
          }
        }
      },
      mounted() {

      },
      beforeMount() {

      },
      destroyed() {
        //window.removeEventListener('scroll', this.handleScroll) //  离开页面清除（移除）滚轮滚动事件
      },
      created() {
        this.hh();
      },
      methods:{
        hh(){
          if (process.browser) {
            let screenWidth = window.innerWidth;
            this.contentStyle.height = window.innerHeight + 'px';
          }
        }
      }
    }
</script>

<style scoped>

</style>
