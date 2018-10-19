//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    invPng: '../resource/images/invcover.png',
    infoPng: '../resource/images/visited01.png',
    registed: 0,
  },
  registe:function(){
    wx.navigateTo({
      url: '/pages/register/register',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  intoInfo: function(){
    wx.switchTab({
      url: '/pages/dorecord/dorecord',
    })
  },
  intoInv: function () {
    wx.switchTab({
      url: '/pages/invite/invite',
    })
  },
  onLoad: function () {
    console.log("index")
    //登录
    util.login(this)
    // this.setData({
    //   registed: wx.getStorageSync('registed')
    // })
  },
  onShow: function(){
    // console.log(this.data.registed)
    // console.log(wx.getStorageSync('registed'))
  },

})
