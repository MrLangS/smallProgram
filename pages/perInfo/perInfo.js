// pages/perInfo/perInfo.js
var util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remind: '加载中',
    angle: 0,
    avatar: '',
    quality: 1,
    picId: 0,
    user: {},
  },
  gotoSet(){
    wx.navigateTo({
      url: '../setting/setting',

    })
  },
  
  //更换头像
  onPicBtn: function () {
    var that = this
    if(this.data.registed==1){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {

          var tempFilePaths = res.tempFilePaths
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0], //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              // console.log('data:image/png;base64,' + res.data)
              console.log(res)
              var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do"
              wx.request({
                url: uploadUserUrl,
                method: 'post',
                data: {
                  photoId: wx.getStorageSync("wxuserInfo").picId,
                  personPhoto: res.data
                },
                success: (res) => {
                  console.log('上传图片请求结果：')
                  console.log(res)
                  if (res.data.quality == 0) {
                    that.setData({
                      avatarUrl: res.data.photoURL,
                    })
                  } else {
                    wx.showToast({
                      title: '上传失败,图片须为本人清晰头像',
                      icon: 'none',
                      duration: 1500
                    })
                  }
                }
              })
            },
            fail: (res) => {
              wx.showToast({
                title: '网络开小差，请稍后再试',
                icon: 'none',
                duration: 1500
              })
            }
          })
        },
      })
    }else{
      wx.showToast({
        title: '请您先注册用户',
        icon: 'none',
        duration: 1500
      })
    }
    
  },
 
  onLoad: function (options) {
    this.setData({
      user: app.globalData.sysWXUser
    })
  },

  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 300);
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
})