var util = require("../../utils/util.js");
var app = getApp()
Page({
  data: {
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    phoneNumber: '',
    isaPhoneNum: true,
    disabled: false
  },
  onLoad: function (options) {
    this.setData({
      phoneNumber: app.globalData.sysWXUser.phonenum
    })
  },

  login(){
    if (util.checkForm(this, 999)){
      //根据手机号获得内部人员信息，type为2即为普通人员
      wx.request({
        url: getApp().globalData.server + '/SysWXUserAction/getUserByPhoneNum.do?phoneNum=' + this.data.phoneNumber + '&type=' + 2,
        method: 'post',
        success: (res) => {
            if (res.data.persons && res.data.persons.length > 0) {
              app.globalData.userSet = res.data.persons
              wx.navigateTo({
                url: '../account/account',
              })
            } else {
              wx.showToast({
                title: '该手机号未绑定内部人员',
                icon: 'none',
                duration: 2000
              })
            }

        }
      })
    }
  },

  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },
  getPhoneValue: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    if (this.bindPhoneChange(e.detail.value)) {
      this.setData({
        isaPhoneNum: true
      })
    } else {
      this.setData({
        isaPhoneNum: false
      })
    }
  },

  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  bindPhoneChange(num) {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (num == "") {
      return false;
    } else if (!myreg.test(num)) {
      return false;
    } else {
      return true
    }
  },

})