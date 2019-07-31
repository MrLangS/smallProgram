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
    let wxUser = app.globalData.sysWXUser
    if (wxUser){
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
              var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do"
              wx.request({
                url: uploadUserUrl,
                method: 'post',
                data: {
                  photoId: wxUser.picId,
                  personPhoto: res.data
                },
                success: (res) => {
                  if (res.data.quality == 0) {
                    wxUser.photoURL = res.data.photoURL
                    app.globalData.sysWXUser = wxUser
                    that.setData({
                      wxUser: wxUser
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
        title: '请您先绑定用户',
        icon: 'none',
        duration: 1500
      })
    }
    
  },
 
  onLoad: function (options) {
    var that = this
    let staff = app.globalData.staff
    this.setData({
      user: staff,
      wxUser: app.globalData.sysWXUser
    })
    if (staff){
      //获取人员头像
      wx.request({
        url: app.globalData.server + '/CompareListAction!getById.do?id=' + staff.picId,
        method: 'post',
        success: res => {
          that.setData({
            photoUrl: res.data.photoURL
          })
        }
      })
    }
    
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