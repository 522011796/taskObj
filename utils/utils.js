import { Message } from 'element-ui';

export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

export function MessageError(text = '失败',) {
  Message({
    message: text,
    type: 'error',
    duration: 3 * 1000
  })
}
export function MessageInfo(text = '消息') {
  Message({
    message: text,
    type: 'info',
    duration: 3 * 1000
  })
}
export function MessageSuccess(text = '成功') {
  Message({
    message: text,
    type: 'success',
    duration: 3 * 1000
  })
}

export function MessageWarning(text = '警告') {
  Message({
    message: text,
    type: 'warning',
    duration: 3 * 1000
  })
}

export function MessageCommonTips(_self, value, type) {
  if (_self.appType == 'app'){
    _self.$toast(value);
  }else {
    if (type == 'success'){
      MessageSuccess(value);
    }else if (type == 'warning'){
      MessageWarning(value);
    }else if (type == 'error'){
      MessageError(value);
    }else {
      MessageWarning(value);
    }
  }
}

export function getLength (str) {
  var realLength = 0, len = str.length, charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128)
      realLength += 1;
    else
      realLength += 2;
  }
  return realLength;
}

export function clearData (data, isSerialize) {
  if (data) {
    if (isSerialize) {
      var newData = {};
      for (var i = 0, length = data.length; i < length; i++) {
        if (trim(data[i].value) != '' && trim(data[i].value) != 'null') {
          newData[data[i].name] = $.trim(data[i].value);
        }
      }
      return newData;
    } else {
      for (var key in data) {
        if (data[key] === '' || data[key] == 'null' || data[key] == null) {
          delete data[key];
        }
      };
      return data;
    }
  }
}

export function trim (str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

export function outTypeObj(type){
  //外部指令类型type对比
  let typeOutObj = {
    1 : 6,
    2 : 7,
    3 : 8,
    4 : 9,
    5 : 4,
    6 : 2,
    7 : 3,
    8 : 5,
    9 : 1,
    10 : 10,
    11 : 11,
    12 : 12,
    13 : 13,
    14 : 14,
    15 : 15,
    16 : 16,
    17 : 17,
    18 : 18,
  };
  return typeOutObj[type];
}

export function outEditTypeObj(type){
  //外部指令类型type对比
  let outEditTypeObj = {
    1 : 9,
    2 : 6,
    3 : 7,
    4 : 5,
    5 : 8,
    6 : 1,
    7 : 2,
    8 : 3,
    9 : 4,
    10 : 10,
    11 : 11,
    12 : 12,
    13 : 13,
    14 : 14,
    15 : 15,
    16 : 16,
    17 : 17,
    18 : 18,
  };
  return outEditTypeObj[type];
}

export function orderValue(type, str){
  let orderValue = {
    "1": "空闲指令",
    "2": "延时指令",
    "3": "循环指令",
    "4": "场景嵌套调⽤",
    "5": "电源控制",
    "6": "开/关灯控制",
    "7": "亮度控制",
    "8": "色温控制",
    "9": "色彩控制",
    "10": "行程控制",
    "11": "按键控制",
    "12":"音量量控制",
    "13":"播放控制",
    "14":"暂停控制",
    "15":"音乐进度控制",
    "16":"点状灯效",
    "17":"线状灯效",
    "18":"发送串行数据"
  };
  if (str && type == 'set') {
    return orderValue[str];
  }
  if (!str && type == 'get'){
    return orderValue;
  }
}

export function orderColor(type){
  let orderColor = {
    "1": "rgba(255, 255, 255, 0.1)",
    "2": "#E6A23C",
    "3": "#67C23A",
    "4": "#409EFF",
    "5": "#CCFF33",
    "6": "#CCCCFF",
    "7": "#CC99FF",
    "8": "#CC66FF",
    "9": "#CC6666",
    "10": "#FF9900",
    "11": "#FFCC66",
    "12":"#FF00CC",
    "13":"#6699FF",
    "14":"#336699",
    "15":"#0000CC",
    "16":"#660066",
    "17":"#006633",
    "18":"#006633"
  };
  return orderColor[type];
}

export function planType(type, str){
  let planType = {
    "0": "场景",
    "1": "灯",
    "2": "开关",
    "3": "窗帘",
    "5": "音乐",
    "6": "串行器"
  };
  if (type == 'set') {
    return planType[str];
  }
  if (!str && type == 'get'){
    return planType;
  }
}

export function keyType(type){
  let keyType = {
    "1": "按下",
    "0": "释放"
  };
  return keyType[type];
}

export function openType(type){
  let openType = {
    "1": "开灯",
    "0": "关灯"
  };
  return openType[type];
}

export function deviceType(type){
  let deviceType = {
    "1": "灯",
    "2": "开关",
    "3": "窗帘",
    "5": "音乐",
    "6": "串行器"
  };
  return deviceType[type];
}

export function inArray(search,array,tag){
  for(var i in array){
    if (tag){
      if(array[i][tag] == search[tag]){
        return i;
      }
    }else {
      if(array[i] == search){
        return i;
      }
    }
  }
  return -1;
}

export function paddingChecked(src,des,tag,desTag){
  for (let j = 0; j < src.length; j++){
    if (src[j] == des[tag]){
      des[desTag] = true;
    }
  }
}

export function secondsFormat(min) {
  if(min || min == 0){
    var seconds = min * 60;
    var day = Math.floor( seconds/ (24*3600) ); // Math.floor()向下取整
    var hour = Math.floor( (seconds - day*24*3600) / 3600);
    var minute = Math.floor( (seconds - day*24*3600 - hour*3600) /60 );
    var second = seconds - day*24*3600 - hour*3600 - minute*60;
    return day + "天"  + hour + "时" + minute + "分" + second + "秒";
  }else{
    return '--';
  }
}

export function decodeUTF8(str){
  if(str){
    return decodeURIComponent(str);
  }else {
    return '';
  }
}
