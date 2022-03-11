<template>
    <div>
      <div :style="contentDefaultStyle">
        <vue-page-transition name="fade-in-right">
          <nuxt></nuxt>
        </vue-page-transition>
      </div>
    </div>
</template>

<script>
    import mixins from "../mixins/mixins";
    export default {
      name: "default",
      mixins: [mixins],
      data(){
        return {

        }
      },
      mounted() {
        document.addEventListener('touchstart', function(e) {
          if (e.touches.length > 1) {
            e.preventDefault()
          }
        });
        document.addEventListener('gesturestart', function(e) {
          e.preventDefault()
        });
      },
      beforeMount() {

      },
      destroyed() {
        //window.removeEventListener('scroll', this.handleScroll) //  离开页面清除（移除）滚轮滚动事件
      },
      created() {

      },
      methods:{

      }
    }
</script>

<style scoped>

</style>
