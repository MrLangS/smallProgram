//app.js
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

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code=res.code
        if(code){
          console.log('获取用户登录凭证：' + code);
          var loginUrl = getApp().globalData.server + '/SysWXUserAction/onLogin.do?code=' + code;
          // --------- 发送凭证 ------------------
          wx.request({
            url: loginUrl,
            data: { code: code },
            success: function (res) {
              console.log(res)
              var openid = res.data.openid //返回openid
              console.log("openid is: " + openid);
              that.globalData.openId = openid;
              wx.setStorageSync('openid', openid);
              var registed = res.data.registed
              wx.setStorageSync('registed', registed)
              console.log("registed:"+registed)
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
                    // that.globalData.wxuserInfo = res.data
                  }
                })
              }
              else {
                // wx.redirectTo({ url: '/pages/invite/invite' })
              }
            },
            fail: function(){
              console.log("fail")
            }
          })
          
          // ------------------------------------
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    })
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
    server: 'http://192.168.0.253:8080/FaceMonitorWeb',
    wxuserInfo: null
  }
})