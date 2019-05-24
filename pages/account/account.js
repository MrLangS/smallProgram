var app = getApp()
var util = require("../../utils/util.js")
Page({

  data: {
    staffs: []
  },

  goToStaffLogin(e) {
    var index = e.currentTarget.dataset.index
    var userinfo = this.data.staffs[index]
    var userId = userinfo.id
    wx.setStorageSync('userId', userId)
    wx.request({
      url: getApp().globalData.server + '/SysWXUserAction/checkPersonStatus.do?id=' + userId + '&type=' + 2,
      method: 'post',
      success: res => {
        console.log('User:')
        console.log(res)
        app.globalData.staff = res.data.person
        
        wx.reLaunch({
          url: '../index/index',
        })
        wx.showToast({
          title: '成功绑定该用户',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      staffs: app.globalData.userSet
    })
  },

})