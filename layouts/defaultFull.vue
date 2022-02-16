<template>
    <div>
      <nuxt></nuxt>
    </div>
</template>

<script>
    export default {
      data(){
        return {
          contentStyle:{
            'height': '0px',
            'overflow-y': 'auto',
            'margin-left': '100px'
          },
          mainStyle: {
            'width': '100px'
          },
          menuStyle: {
            'height': '0px',
            'overflow-y': 'auto',
          },
          footerLeftStyle:{
            'height': '0px',
            'width': '100px',
          },
          footerRightStyle:{
            'height': '0px',
            'margin-left': '100px'
          },
          dialogRightTabStyle:{
            'height': '0px',
            'overflow-y': 'auto',
          },
          drawerTreeStyle: {
            'height': '0px',
            'overflow-y': 'auto',
          }
        }
      },
      created() {

      },
      methods:{
        hh(){
          if (process.browser) {
            let screenWidth = window.innerWidth;
            this.contentStyle.height = window.innerHeight-60 + 'px';
            this.appType = this.$route.query.appType;
            if (this.appType == 'app'){
              if (screenWidth < 550){
                this.mainStyle.width = this.isCollapse == false ? '30px' : '100px';
                this.footerLeftStyle.width = '100px';
                this.contentStyle["margin-left"] = this.isCollapse == false ? '30px' : '105px';
                this.footerRightStyle["margin-left"] = '105px';
              }else{
                this.mainStyle.width = this.isCollapse == false ? '8%' : '15%';
                this.footerLeftStyle.width = '15%';
                this.contentStyle["margin-left"] = this.isCollapse == false ? '8.5%' :'15.5%';
                this.footerRightStyle["margin-left"] = '15.5%';
              }
            }else {
              if (screenWidth < 550){
                this.mainStyle.width = this.isCollapse == false ? '30px' : '100px';
                this.footerLeftStyle.width = '100px';
                this.contentStyle["margin-left"] = this.isCollapse == false ? '30px' : '105px';
                this.footerRightStyle["margin-left"] = '105px';
              }else{
                this.mainStyle.width = this.isCollapse == false ? '8%' : '15%';
                this.footerLeftStyle.width = '15%';
                this.contentStyle["margin-left"] = this.isCollapse == false ? '8.5%' :'15.5%';
                this.footerRightStyle["margin-left"] = '15.5%';
              }
            }
            this.menuStyle.height = window.innerHeight-40-60 + 'px';
            this.drawerTreeStyle.height = window.innerHeight-40-160 + 'px';
            this.$set(this.dialogRightTabStyle,'height', window.innerHeight-45-60-30 + 'px');
            this.test = window.innerHeight;
          }
        }
      }
    }
</script>

<style scoped>

</style>
