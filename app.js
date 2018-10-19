//app.js
var util = require('./utils/util.js')
App({
  onLaunch: function () {
    var that=this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //文件名指定worker的入口文件路径，绝对路径
    var worker=wx.createWorker('workers/request/index.js')
    worker.postMessage({
      msg: 'hello worker'
    })

    //登录
    // util.login()
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openId: null,
    // server: 'http://192.168.0.253:8080/FaceMonitorWeb',
    server: 'https://doorcontrol.faceos.com/FaceMonitorWeb',
    wxuserInfo: null
  }
})