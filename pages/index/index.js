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
    })
  },
  logout: function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '下次进入将需要重新注册，确定注销吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.server + '/SysWXUserAction/logoutUser.do?wxUserId=' + wx.getStorageSync('wxuserInfo').id + '&type=' + 2,
            method: 'post',
            success: function (res) {
              console.log(res)
              if (res.data = 'SUCCESS') {
                wx.showToast({
                  title: '注销成功',
                  icon: 'success',
                  duration: 1000,
                })
                wx.reLaunch({
                  url: '../register/register',
                })
              } else {
                wx.showToast({
                  title: '注销失败',
                  icon: 'none',
                  duration: 1000,
                })
              }
            }
          })
        }
      }
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
    var that=this
    console.log("index")
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          util.login(that)
        } else {
          wx.redirectTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
    //登录
    //util.login(this)

  },
  onShow: function(){

  },

})
