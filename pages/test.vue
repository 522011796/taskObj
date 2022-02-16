<template>
  <div class="container">
    <div v-for="n in 10" style="height: 25px; line-height: 25px" @click="test">
      test
    </div>
  </div>
</template>

<script>
export default {
  layout: 'default',
  components: {

  },
  data() {
    return {
      tableHeader: {},
      tableData: []
    }
  },
  mounted() {

  },
  methods: {
    test(){
      this.$router.push({
        path: '/'
      });
    }
  }
}
</script>

<style scoped>
</style>
