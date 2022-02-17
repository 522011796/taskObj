<template>
  <div>
    <div class="login-title">
      {{ $t("登录") }}
    </div>
    <div class="login-main padding-lf15">
      <el-form ref="form" :model="form" label-width="100px" class="marginTop50">
        <el-form-item label="手机/邮箱">
          <el-autocomplete
            class="inline-input"
            v-model="form.username"
            style="width: 85%"
            :fetch-suggestions="querySearch"
            placeholder=""
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <el-row>
                <el-col :span="18">
                  <span class="name">{{ item.value }}</span>
                </el-col>
                <el-col :span="6" class="textRight">
                  <span class="addr" @click.stop="removeAccount($event, item)">
                    <i class="fa fa-trash"></i>
                  </span>
                </el-col>
              </el-row>
            </template>
          </el-autocomplete>
<!--          <el-input v-model="form.username" style="width: 85%"></el-input>-->
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" style="width: 85%"></el-input>
        </el-form-item>
        <el-form-item label="验证码" v-if="imageCodeAuth == true">
          <el-input v-model="form.imageCode" style="width: 85%">
            <template slot="append">
              <img ref="imageCode" :src="imageCode" style="height: 30px;width: 80px" @click="getImageCode">
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="textCenter marginTop30 marginBottom50">
        <el-button type="success" size="medium" :loading="loading" style="width: 70%" @click="isNeedImageCode">{{$t("登录")}}</el-button>
      </div>
    </div>

    <el-drawer
      title="场景设置"
      custom-class="drawer-block"
      :show-close="false"
      :modal="true"
      :size="dialogSize"
      :wrapperClosable="false"
      :visible.sync="drawerVisible"
      :direction="direction">

      <div slot="title">
        <div class="block-opr-header">
          <el-row>
            <el-col :span="24" class="textCenter">
              <span>{{$t("场所列表")}}</span>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="marginTop10">
        <div class="padding-left10 padding-right10 padding-top5">
          <div v-for="(item, index) in envListData" :key="index" class="block-item bg-EBEEF5 border-radius-5 marginBottom10" @click="selEnv($event, item)">
            <div class="padding-lf10">
              <el-row>
                <el-col :span="16">
                  <div class="textLeft">
                    <div class="marginTop10 fontBold color-666666">{{ item.envName }}</div>
                    <div class="marginTop5 color-disabled">{{ item.envKey }}</div>
                  </div>
                </el-col>
                <el-col :span="8">

                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  MessageSuccess,
  MessageWarning,
  MessageError, MessageCommonTips
} from "../utils/utils";
import {common, commonConfig} from "../utils/api/url";
export default {
  layout: 'defaultFull',
  components: { },
  data(){
    return {
      cb: '',
      restaurants: [],
      restaurantsTemp: [],
      loading: false,
      drawerVisible: false,
      direction: 'btt',
      dialogSize: '60%',
      sessionId: '',
      userKey: '',
      imageCodeAuth: false,
      imageCode: '',
      envListData: [],
      form:{
        username: '',
        password: '',
        imageCode: '',
        url: ''
      }
    }
  },
  created() {
    if (process.client){
      this.restaurantsTemp = [];
      this.restaurants = localStorage.getItem("account") ? JSON.parse(localStorage.getItem("account")) : [];
      for (let i = 0; i < this.restaurants.length; i++){
        this.restaurantsTemp.push(this.restaurants[i].value);
      }
    }
  },
  methods:{
    getImageCode(){
      this.imageCode = commonConfig.baseUrl + common.sendImageCode + "?radom=" + Math.random();
      //return commonConfig.baseUrl + common.sendImageCode + "?radom=" + Math.random();
    },
    isNeedImageCode(){
      if (this.form.username == "" || this.form.password == ""){
        MessageCommonTips(this, this.$t("请输入账号信息！"), 'warning');
        return;
      }
      let params = {
        opType: 5
      };
      this.loading = true;
      this.$axios.get(commonConfig.baseUrl + common.isNeedImageCode, {params: params, loading: false}).then(res => {
        if (res.data.code == 200){
          //console.log(res.data.data.imageCode);
          if (res.data.data.imageCode == false){
            let paramsLogin = {
              username: this.form.username,
              password: this.form.password,
              manufacturer: commonConfig.manufacturer,
              needMqtt: false
            };
            this.login(paramsLogin);
          }else {
            this.imageCodeAuth = res.data.data.imageCode;
            this.getImageCode();
            if (this.form.imageCode != ""){
              let paramsLogin = {
                username: this.form.username,
                password: this.form.password,
                imageCode: this.form.imageCode,
                manufacturer: commonConfig.manufacturer,
                needMqtt: false
              };
              this.login(paramsLogin);
            }
          }
        }else {
          MessageCommonTips(this, res.data.msg, 'error');
        }
        this.loading = false;
      });
    },
    login(params){
      params = this.$qs.stringify(params);
      this.loading = true;
      this.$axios.post(commonConfig.baseUrl + common.login, params, {loading: false}).then(res => {
        if (res.data.code == 200){
          this.sessionId = res.data.data.sessionId;
          this.userKey = res.data.data.userInfo.userKey;
          this.envList();

          //验证权限
          let authorities = res.data.data.userInfo.authorities;
          localStorage.removeItem("accountRole");
          for (let i = 0; i < authorities.length; i++){
            if (authorities[i].authority == 'ROLE_ADMIN'){
              localStorage.setItem("accountRole", 'ROLE_ADMIN');
            }
          }

          if (this.restaurants.length == 0){
            this.restaurants.push({
              value: this.form.username,
              password: this.form.password
            });
            localStorage.setItem("account", JSON.stringify(this.restaurants));
          }else {
            if (this.restaurantsTemp.indexOf(this.form.username) == -1){
              this.restaurants.push({
                value: this.form.username,
                password: this.form.password
              });
            }
            localStorage.setItem("account", JSON.stringify(this.restaurants));
          }
        }else {
          MessageCommonTips(this, res.data.msg, 'error');
          this.getImageCode();
        }
        this.loading = false;
      });
    },
    envList(){
      let params = {

      };
      this.$axios.get(commonConfig.baseUrl + common.envList, {params: params,sessionId: this.sessionId, userKey: this.userKey}).then(res => {
        if (res.data.code == 200){
          this.envListData = res.data.data;
          this.drawerVisible = true;
        }else {
          MessageCommonTips(this, res.data.msg, 'error');
        }
      });
    },
    selEnv(event, item){
      localStorage.setItem("envKey", item.envKey);
      localStorage.setItem("sessionId", this.sessionId);
      localStorage.setItem("userKey", this.userKey);
      this.$router.replace({
        path: '/',
        query: {
          //envKey: item.envKey,
          //sessionId: this.sessionId
        }
      });
    },
    querySearch(queryString, cb) {
      this.cb = cb;
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString) === 0);
      };
    },
    handleSelect(item) {
      this.form.username = item.value;
      this.form.password = item.password;
    },
    removeAccount(event, item){
      for (let i = 0; i < this.restaurants.length; i++){
        //console.log(item.value ,this.restaurants[i].value);
        if (item.value == this.restaurants[i].value){

          this.restaurants.splice(i, 1);
        }
      }
      localStorage.setItem("account", JSON.stringify(this.restaurants));
      this.querySearch('', this.cb);
    }
  }
}
</script>

<style scoped>
.login-title{
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
  margin-top: 5%;
}
.login-main{
  background: #f5f5f5;
  width: 30%;
  min-width: 350px;
  max-width: 400px;
  margin: 0 auto;
  margin-top: 10px;
  border-radius: 10px;
  padding: 10px;
}
.block-list-content-item:hover{
  box-shadow: 1px 1px 2px #000000;
}
</style>
