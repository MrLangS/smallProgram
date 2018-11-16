const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatDay(that){
  var date=that.data
  return [date.year, date.month, date.day].map(formatNumber).join('-')
}
function formatTimestamp(that,tag){
  var datetime = that.data
  if(tag==0){
    return [datetime.year, datetime.month, datetime.day].map(formatNumber).join('-') + ' ' + datetime.starttime
  }else{
    return [datetime.year, datetime.month, datetime.day].map(formatNumber).join('-') + ' ' + datetime.endtime
  }
}
function tranStamp(timestamp,tag){
  var arr=timestamp.split(" ")
  if(!tag){
    return arr[0].split("-")
  }else{
    var time = arr[1].split(":")
    return time[0]+":"+time[1]
  }
  
}
function login(that){
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = res.code
      if (code) {
        console.log('获取用户登录凭证：' + code);
        var loginUrl = getApp().globalData.server + '/SysWXUserAction/onLogin.do?code=' + code;
        // --------- 发送凭证 ------------------
        wx.request({
          url: loginUrl,
          data: { code: code },
          success: function (res) {
            var openid = res.data.openid //返回openid
            console.log("openid is: " + openid);
            wx.setStorageSync('openid', openid);
            var registed = res.data.registed
            wx.setStorageSync('registed', registed)
            console.log("registed:" + registed)
            that.setData({
              registed: parseInt(registed)
            })
            if (registed == '1') {
              // wx.redirectTo({ url: '/pages/index/index' })
              //获取用户信息的请求
              var userInfoUrl = getApp().globalData.server + '/SysWXUserAction/getUserMsgByOpenId.do?openId='
              wx.request({
                url: userInfoUrl + wx.getStorageSync('openid'),
                method: 'post',
                // dataType: 'json',
                success: function (res) {
                  console.log(res)
                  wx.setStorageSync('wxuserInfo', res.data);
                }
              })
            }
            else {
              // wx.redirectTo({ url: '/pages/invite/invite' })
            }
          },
          fail: function () {
            console.log("fail")
          }
        })

        // ------------------------------------
      } else {
        console.log('获取用户登录态失败：' + res.errMsg);
      }
    }
  })
}
//转发所需要携带的信息
function tran(that, role) {
  var _that = that.data
  var tranJsonData = {
    starttime: _that.starttime,
    endtime: _that.endtime,
    year: _that.year,
    month: _that.month,
    day: _that.day,
    num:0,
    invitor: _that.invitor,
    reason: _that.reason,
    address: _that.address,
    vistorName: _that.vistorName,
    vistorPhone: _that.vistorPhone,
    invitationId: _that.invitationId,//邀请id     
    // invId: invId
  }
  if(role=="vis"){
    tranJsonData.num=_that.num
  }else{
    tranJsonData.num =_that.numArr[_that.index]
  }
  return JSON.stringify(tranJsonData)
  // return JSON.parse(tranJsonData)
}

//设置邀请数据
function inviteInfo(that,initData,tag){
  var data = JSON.parse(initData)
  if(tag==0){
    that.setData({
      reason: data.reason,
      year: data.year,
      month: data.month,
      day: data.day,
      starttime: data.starttime,
      endtime: data.endtime,
      address: data.address,
      num: data.num,
      invitor: data.invitor,
      vistorName: data.vistorName,
      vistorPhone: data.vistorPhone,
      invitationId: data.invitationId
    })
  }
  if(tag==1){
    var invitor={name: '',company: '',phone: ''}
    invitor.name = data.invitationManName
    invitor.company = data.invitationManAddress
    invitor.phone = data.invitationManPhone
    var date = tranStamp(data.visitorDay, 0)
    that.setData({
      status: data.status,
      reason: data.reason,
      year: date[0],
      month: date[1],
      day: date[2],
      starttime: tranStamp(data.startTime, 1),
      endtime: tranStamp(data.endTime, 1),
      address: data.devNames,
      num: data.visitorCount,
      invitor: invitor,
      vistorName: data.visitorLinkmanName,
      vistorPhone: data.visitorLinkmanPhone,
      invitationId: data.id
    })
  }
}

//获取验证码
function getCode(that){
  var endPhone = that.data.phone.substr(7, 4)
  if (checkPhone(that)) {
    that.setData({
      disabled: true
    })
    wx.request({
      url: getApp().globalData.server + "/SysWXUserAction/sendVerificationCode.do?phoneNo=" + that.data.phone,
      data: {},
      method: 'post',
      success(res) {
        console.log(res)
        that.setData({
          iscode: res.data.code
        })
        wx.showToast({
          title: '已向尾号' + endPhone + '的手机成功发送验证码',
          icon: 'none',
          duration: 1500
        })
        var num = 61;
        var timer = setInterval(function () {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            that.setData({
              codename: '发送验证码',
              disabled: false
            })

          } else {
            that.setData({
              codename: "重发 ("+num + "s)"
            })
          }
        }, 1000)
      }
    })
  }
}

//邮箱以及手机的正则表达式
function regexConfig() {
  var reg = {
    email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone: /^1(3|4|5|7|8)\d{9}$/
  }
  return reg;
}

//获取日期列表
function getPickerList(tag){
  const years = []
  const months = []
  const days = []
  const nums = []
  for (let i = 2017; i <= 2048; i++) {
    years.push(i)
  }
  for (let i = 1; i <= 12; i++) {
    months.push(i)
  }
  for (let i = 1; i <= 31; i++) {
    days.push(i)
  }
  for (let i = 1; i <= 20; i++) {
    nums.push(i)
  }
  if(tag=='years'){
    return years
  }else if(tag=='months'){
    return months
  }else if(tag=='days'){
    return days
  }else if(tag=='nums'){
    return nums
  }
}
//获取日期
function getPicker(tag){
  const date = new Date()
  if(tag=='year'){
    return date.getFullYear()
  }else if(tag=='month'){
    return date.getMonth() + 1
  }else if(tag=='day'){
    return date.getDate()
  }else if (tag =='arr'){
    return [date.getFullYear()-2017,date.getMonth(),date.getDate()-1]
  }else if(tag=='hour'){
    return date.getHours()
  }else if (tag == 'minute') {
    return date.getMinutes()
  }
}

//比较 接受的时间
function compareTime(that){
  // console.log(getPicker('year')+"" + getPicker('month') + getPicker('day') + getPicker('hour') + getPicker('minute'))
  var year = getPicker('year')
  var month = getPicker('month')
  var day = getPicker('day') 
  var hour = getPicker('hour')
  var minute = getPicker('minute')
  var _that=that.data
  var arr=_that.starttime.split(':')
  var tag=false
  if (year<_that.year){
    tag=true
  } else if (year== _that.year){
    if (month< _that.month) {
      tag = true
    } else if (month == _that.month){
      if(day<_that.day){
        tag=true
      }else if(day==_that.day){
        if(hour<arr[0]){
          tag=true
        }else if(hour==arr[0]){
          if(minute<arr[1]){
            tag=true
          }
        }
      }
    }
  }
  
  return tag
}

//表单验证
function checkForm(that){
  if (checkImage(that)&&checkName(that)&&checkPhone(that)&&checkCode(that)){
  // if (checkImage(that) && checkName(that) && checkPhone(that)) {
    return true
  }else{
    return false
  }
}
function checkInvitation(that){
  if (checkTime(that)&&checkAddress(that) && checkVistorName(that) && checkVistorPhone(that) && checkReason(that)) {
    return true
  } else {
    return false
  }
}
function checkPerInfo(that) {
  if (checkName(that) && checkPhone(that)) {
    if (that.data.codeTag==false){
      return checkCode(that)?true:false
    }else{
      return true
    }   
  } else {
    return false
  }
}
function checkTime(that){
  if (that.data.starttime >= that.data.endtime) {
    wx.showToast({
      title: '开始时间必须小于结束时间',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkImage(that) {
  if (that.data.quality== 1) {
    wx.showToast({
      title: '照片须为本人清晰头像',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkAddress(that){
  if (that.data.address == "") {
    wx.showToast({
      title: '地址不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkVistorName(that) {
  if (that.data.vistorName.trim() == "") {
    wx.showToast({
      title: '姓名不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkName(that) {
  if (that.data.name.trim() == "") {
    wx.showToast({
      title: '姓名不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkReason(that) {
  if (that.data.reason.trim() == "") {
    wx.showToast({
      title: '事由不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkVistorPhone(that) {
  var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
  if (that.data.vistorPhone == "") {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (!myreg.test(that.data.vistorPhone)) {
    wx.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkPhone(that) {
  var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
  if (that.data.phone == "") {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (!myreg.test(that.data.phone)) {
    wx.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkCode(that) {
  if (that.data.code == "") {
    wx.showToast({
      title: '验证码不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (that.data.code != that.data.iscode) {
    wx.showToast({
      title: '验证码错误',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}

module.exports = {
  formatTime: formatTime,
  formatDay: formatDay,
  formatTimestamp: formatTimestamp,
  regexConfig: regexConfig,
  getPicker: getPicker,
  getPickerList: getPickerList,
  tran: tran,
  checkPhone: checkPhone,
  checkForm: checkForm,
  checkInvitation: checkInvitation,
  checkPerInfo: checkPerInfo,
  inviteInfo: inviteInfo,
  tranStamp: tranStamp,
  login: login,
  compareTime: compareTime,
  getCode: getCode
}
