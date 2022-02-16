<script>
    export default {
      name: "mixins",
      data(){
        return {
          globalTest: '0',
          minxinsScroll: false,
          baseUrl: '',
          envKey: '',
          sessionId: '',
          appType: '',
          userKey: '',
          contentDefaultStyle:{
            'height': '0px',
            'overflow-y': 'hiddle'
          },
          contentStyle:{
            'height': '0px',
            'overflow-y': 'auto'
          }
        }
      },
      mounted() {

      },
      created() {
        this.mainStyle();
        this.defaultStyle();
      },
      methods: {
        defaultStyle(){
          if (process.browser) {
            let screenWidth = window.innerWidth;
            this.contentDefaultStyle.height = window.innerHeight + 'px';
          }
        },
        mainStyle(){
          if (process.browser) {
            let screenWidth = window.innerWidth;
            this.contentStyle.height = window.innerHeight - 40 + 'px';
          }
        }
      }
    }
</script>

<style scoped>

</style>
