/**
 * 公共接口地址
 * @type {{session_url: string}}
 */
export const common = {
  login_url: 'proxy/user/login', //登录
  senceList: '/scene/querySceneList',//场所列表
  deviceList: '/device/getDevicePageByEnvKey',//设备列表
  roomList: '/device/getRoomInfoList',//房间列表
  lightGrouplist: '/device/getLightSubgroupInfoList',//灯组列表
  curtainsGrouplist: '/device/getCurtainSubgroupInfoList',//窗帘组列表
  createSence: '/scene/createScene',//创建场景
  installSence: '/scene/installScene',//安装场景
  removeSence: '/scene/uninstallScene',//卸载场景
  senceInfo: '/scene/querySceneInfo',//查询场景详细
  editSence: '/scene/editScene',//编辑场景
  login: '/loginPassword',//登录
  envList: '/env/queryEnvList',//环境列表
  isNeedImageCode: '/isNeedImageCode',//是否需要图片验证码
  sendImageCode: '/sendImageCode',//图片验证码
  logout: '/logout',//退出
  createTplInfo: '/tpl/createTplInfo',//创建模版
  deleteTplInfo: '/tpl/deleteTplInfo',//删除模版
  editTplInfo: '/tpl/editTplInfo',//编辑模版
  queryTplInfoList: '/tpl/queryTplInfoList',//查询模版列表
  queryTplInfo: '/tpl/queryTplInfo',//查询模版列表
  sendShareTplInfo: '/tpl/sendShareTplInfo',//模版分享
  queryReceiveTplShareInfoList: '/tpl/queryReceiveTplShareInfoList',//查询接收模版列表
  handleShareTplInfo: '/tpl/handleShareTplInfo',//模版处理
  querySceneActionList: '/scene/querySceneActionList',//查询场景详细信息
};

export const commonConfig = {
  manufacturer: 'Netmoon',
  baseUrl: 'https://api.iot.9451.com.cn',
};
