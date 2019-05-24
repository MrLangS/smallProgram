//app.js
var util = require('./utils/util.js')
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    openid: null,
    realOpenid: null,
    sysWXUser: null,
    staff: null,
    userSet: [],
    // server: 'http://192.168.0.251:8080/FaceMonitorWeb',
    // server: 'http://192.168.0.161:8080/ebank',
    server: 'http://doortest.faceos.com',
    // server: 'https://doorcontrol.faceos.com',
    wxuserInfo: null
  }
})