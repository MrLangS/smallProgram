//app.js
var util = require('./utils/util.js')
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    openId: null,
    // server: 'http://192.168.0.251:8080/FaceMonitorWeb',
    // server: 'http://58.87.121.103:8081/FaceMonitorWeb',
    server: 'https://doorcontrol.faceos.com/FaceMonitorWeb',
    wxuserInfo: null
  }
})