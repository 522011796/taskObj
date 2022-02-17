<template>
  <div>
    <div class="wrap" v-if="showWrap" :class="showWrap ?'fadein':'fadeout'">{{text}}</div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.wrap{
  position: fixed;
  left: 50%;
  top:50%;
  background: rgba(0,0,0,.5);
  padding: 10px 15px;
  border-radius: 5px;
  transform: translate(-50%,-50%);
  color:#fff;
  z-index: 9999;
}
.fadein {
  animation: animate_in 0.25s;
}
.fadeout {
  animation: animate_out 0.25s;
  opacity: 0;
}
@keyframes animate_in {
  0% {
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
@keyframes animate_out {
  0% {
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}
</style>
