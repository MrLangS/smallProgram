// pages/authorize/authorize.js
var app = getApp();
Page({

  data: {
    tag: false,
    remind: '加载中',
    angle: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      if(this.data.tag){
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          authorizeTAG: true
        })
        wx.navigateBack()
      }else{
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      
    } else {
      //用户按了拒绝按钮
    }
  },

  onLoad: function (options) {
    if(options.tag=='1'){
      this.setData({
        tag: true
      })
    }
  },

  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },

  onShow: function () {

  },

  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
})