var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    invPng: '../resource/images/invcover.png',
    infoPng: '../resource/images/visited01.png',
    bcgImg: '../resource/images/2.jpg',
  },
  go2inv:function(){
    var that = this
    that.setData({
      activeBtn: true
    })
    if(app.globalData.staff){
      wx.navigateTo({
        url: '/pages/invite/invite',
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    
    setTimeout(function () {
      that.setData({
        activeBtn: false
      })
    }, 500)
  },

  onLoad: function () {
    
    var that=this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          util.login(that)
        } else {
          wx.redirectTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },
  onShow: function(){

  },

})
