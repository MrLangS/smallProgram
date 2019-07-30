
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getTimeAfter(n){
  var date = new Date();     //1. js获取当前时间
  var min = date.getMinutes();  //2. 获取当前分钟
  date.setMinutes(min + n);  //3. 设置当前时间+n分钟：把当前分钟数+10后的值重新设置为date对象的分钟数
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = 0
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getLastTime(){
  var date = new Date();     //1. js获取当前时间
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = 23
  const minute = 0
  const second = 0
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDay(that){
  var date=that.data
  return [date.year, date.month, date.day].map(formatNumber).join('-')
}
function formatTimestamp(that,tag){
  if(tag==0){
    return that.data.startTimeArr.join('\ ')
  }else{
    return that.data.endTime.join('\ ')
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
//登录
function login(that){
  var encryptedData = null
  var iv = null
  var app = getApp()
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = res.code

      if (code) {
        console.log('获取用户登录凭证：' + code);
        wx.getUserInfo({
          success: function (res) {
            encryptedData = res.encryptedData
            iv = res.iv
            var loginUrl = getApp().globalData.server + '/SysWXUserAction/onLogin.do';
            // --------- 发送凭证 ------------------
            wx.request({
              url: loginUrl,
              data: { 
                code: code,
                encryptedData: encryptedData,
                iv: iv,
                userType: '2'
              },
              method: 'post',
              success: function (res) {
                var openid = res.data.openid //返回openid
                console.log("openid is: " + openid);
                console.log("realopenid is: " + res.data.miniproId);
                app.globalData.openid = openid
                app.globalData.realOpenid = res.data.miniproId
                var wxUser = res.data.sysWXUser
                if(wxUser){
                  console.log('wxUser:')
                  console.log(wxUser)
                  app.globalData.sysWXUser = wxUser
                  wx.setStorageSync('wxUserId', wxUser.id)
                  var userId = wx.getStorageSync('userId')
                  if (userId) {
                    wx.request({
                      url: getApp().globalData.server + '/SysWXUserAction/checkPersonStatus.do?id=' + userId + '&type=' + 2,
                      method: 'post',
                      success: res => {
                        console.log('User:')
                        console.log(res)
                        app.globalData.staff = res.data.person
                      }
                    })
                  }

                } else{
                  console.log('未拥有微信用户')
                  if(that){
                    wx.reLaunch({
                      url: '../regWxUser/regWxUser',
                    })
                  }
                  
                }

                // console.log(res)
                // var openid = res.data.openid //返回openid
                // getApp().globalData.realOpenid = res.data.miniproId
                // wx.setStorageSync('openid', openid);
                // var registed = res.data.registed
                // wx.setStorageSync('registed', registed)

                // if (registed == '1') {
                //   // wx.redirectTo({ url: '/pages/index/index' })
                //   //获取用户信息的请求
                //   var userInfoUrl = getApp().globalData.server + '/SysWXUserAction/getUserMsgByOpenId.do?openId='
                //   wx.request({
                //     url: userInfoUrl + wx.getStorageSync('openid'),
                //     method: 'post',
                //     // dataType: 'json',
                //     success: function (res) {
                //       console.log(res)
                //       wx.setStorageSync('wxuserInfo', res.data);
                //     }
                //   })
                // }
              },
              fail: function () {
                console.log("fail")
              }
            })
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
    startTimeArr: _that.startTimeArr,
    endTimeArr: _that.endTimeArr,
    num:0,
    invitor: _that.invitor,
    reason: _that.reason,
    address: _that.address,
    vistorName: _that.vistorName,
    vistorPhone: _that.vistorPhone,
    invitationId: _that.invitationId,//邀请id     
  }
  if(role=="vis"){
    tranJsonData.num=_that.num
  }else{
    tranJsonData.num =_that.numArr[_that.index]
  }
  return JSON.stringify(tranJsonData)
}

//设置邀请数据
function inviteInfo(that,initData,tag){
  var data = JSON.parse(initData)
  if(tag==0){
    that.setData({
      reason: data.reason,
      startTimeArr: data.startTimeArr,
      endTimeArr: data.endTimeArr,
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
    that.setData({
      status: data.status,
      reason: data.reason,
      startTimeArr: data.startTime.split(' '),
      endTimeArr: data.endTime.split(' '),
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
  var endPhone = that.data.phoneNumber.substr(7, 4)
  if (checkPhone(that)) {
    that.setData({
      disabled: true
    })
    wx.request({
      url: getApp().globalData.server + "/SysWXUserAction/sendVerificationCode.do?phoneNo=" + that.data.phoneNumber,
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
  return that.data.startTimeArr.join('\ ') > formatTime(new Date())
}

//验证邀请时间是否过期
function checkIsOver(that){
  if (formatTimestamp(that, 0) > formatTime(new Date())) {
    return true
  } else {
    wx.showToast({
      title: '邀请时间不能早于当前时间',
      icon: 'none',
      duration: 2000
    })
  }
}

//表单验证
function checkForm(that,tag){
  var checked = false
  switch (tag) {
    case 0:
      checked = checkImage(that) && checkUsername(that) && checkCompname(that)  && checkPhone(that) && checkCode(that);
      break;
    case 1:
      checked = checkPhone(that) && checkCode(that);
      break;
    case 999:
      checked = true;
      break;
    default:
      checked = checkImage(that) && checkName(that) && checkPhone(that) && checkCode(that);
      break;
  }
  return checked
}
function checkInvitation(that){
  return checkIsOver(that) && checkTime(that) && checkAddress(that) && checkVistorName(that) && checkVistorPhone(that) && checkReason(that)
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
      title: '设备不能为空',
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
function checkUsername(that) {
  if (that.data.username.trim() == "") {
    wx.showToast({
      title: '用户名不能为空',
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
  var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/;
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
function checkCompname(that) {
  if (that.data.company.trim() == "" || that.data.company == "选择单位") {
    wx.showToast({
      title: '单位名称不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkPhone(that) {
  var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/;
  if (that.data.phoneNumber == "") {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (!myreg.test(that.data.phoneNumber)) {
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
  getTimeAfter: getTimeAfter,
  getLastTime: getLastTime,
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
