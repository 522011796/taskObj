export default function({store, redirect, req, router, $axios }) {
  // request interceptor
  let jsonData = {
    code: '',
    data: ''
  };
  $axios.interceptors.request.use(
    config => {
      // do something before request is sent
      config.withCredentials = true; // 允许携带token ,这个是解决跨域产生的相关问题
      config.timeout = 30000;
      if (config.sessionId){
        let session = config.sessionId + ";" + config.userKey;
        //console.log(session);
        config.headers['IOT-SESS'] = session;
      }

      if (config.method == "post"){
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      }
      if (config.dataType == 'stringfy'){
        config.headers['Content-Type'] = 'application/json; charset=UTF-8';
      }
      return config;
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
  );
  $axios.onRequest(config => {
    //console.log(config)
  });

  // response interceptor
  $axios.interceptors.response.use(
    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      const res = response;
      if (res.data.code === 200) {
        return res;
      } else if (res.data.code === 3022) {
        return res;
      } else if (res.data.code === 401) {
        redirect('/login');
        return res;
      } else if (res.data.code === 403) {
        //redirect('/noPermission');
        return res;
      } else if (res.data.code === 404) {
        //redirect('/404');
        return res;
      }else {
        return res;
      }
      //return Promise.reject(new Error(res.msg || 'Error'))
      return response;
    },
    error => {
      //console.log('err' + error) // for debug

      return Promise.reject(error)
    }
  )
}
