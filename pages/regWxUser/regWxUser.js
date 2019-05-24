var util = require("../../utils/util.js")
var app = getApp()
Page({

  data: {
    username: '',//姓名
    company: '',
    avatar: '',
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    disabled: false,
    regDisabled: false,
    quality: 1,
    picId: 0,
    progress: true,
    active: false,
    percent: 0,
    progressColor: '#eb4613',
  },

  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },

  getPhoneValue: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    var isaPhoneNum = this.bindPhoneChange(e.detail.value)

    this.setData({
      isaPhoneNum: isaPhoneNum
    })
  },

  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  bindPhoneChange(num) {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (num == "") {
      return false;
    } else if (!myreg.test(num)) {
      return false;
    } else {
      return true
    }
  },

  register(e) {
    var that = this
    
    if (util.checkForm(this, 0)) {
      this.setData({
        regDisabled: true
      })
      console.log('注册微信用户')
      if(that.data.fromInvitate){
        console.log('接受邀请')
        wx.request({
          url: getApp().globalData.server + '/Invitation/addVisitorAndRegisterUser.do',
          method: 'post',
          data: {
            wxOpenId: app.globalData.openid,
            username: that.data.username,
            address: that.data.company,
            phonenum: that.data.phoneNumber,
            photoURL: that.data.avatarUrl,
            picId: that.data.picId,
            invitationId: parseInt(that.data.invitationId),
            formId: e.detail.formId,
            openId: app.globalData.realOpenid,
            company: that.data.company
          },
          success: function (res) {
            console.log(res)
            if (res.data.msg == 'ok') {
              app.globalData.sysWXUser = res.data.sysWXUser
              wx.setStorageSync('wxUserId', res.data.sysWXUser.id)
              wx.showToast({
                title: '接受成功',
                icon: 'success',
                duration: 1500
              })
              wx.reLaunch({
                url: '../dorecord/dorecord',
              })
            } else if (res.data.msg == 'confirmCountIsOverflow') {
              wx.showToast({
                title: '人数已满，接受失败',
                icon: 'none',
                duration: 1500
              })
            } else {
              wx.showToast({
                title: '出现异常，请重试',
                icon: 'none',
                duration: 1500
              })
            }
          }
        })
      }else{
        wx.request({
          url: app.globalData.server + "/SysWXUserAction/registerWXUser.do",
          data: {
            wxOpenId: app.globalData.openid,
            miniproId: app.globalData.realOpenid,
            username: this.data.username,
            company: this.data.company,
            address: this.data.company,
            phonenum: this.data.phoneNumber,
            photoURL: '',
            picId: this.data.picId,
          },
          method: 'post',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res)
            if (res.data.msg == 'ok') {
              app.globalData.sysWXUser = res.data.sysWXUser
              wx.setStorageSync('wxUserId', res.data.sysWXUser.id)
              wx.reLaunch({
                url: '../index/index',
              })
              wx.showToast({
                title: '注册成功',
                icon: 'success',
                duration: 1500
              })
            } else {
              wx.showToast({
                title: '注册失败',
                icon: 'none',
                duration: 1500
              })
            }
          },
        })
      }
      
    }
  },

  onLoad: function (options) {
    if (options.invitationId){
      this.setData({
        invitationId: options.invitationId,
        fromInvitate: true,
      })
      wx.showToast({
        title: '接受邀请前需要注册用户',
        icon: 'none',
        duration: 2000
      })
    }
  },

  getUsername: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  getCompname: function (e) {
    this.setData({
      company: e.detail.value
    })
  },
  chooseImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/TransitPerson/uploadPhotoFromWx.do"
        var tempFilePaths = res.tempFilePaths
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            // console.log('data:image/png;base64,' + res.data)
            console.log(res)
            that.setData({
              percent: 0,
            })
            that.setData({
              percent: 100,
              progressColor: '#eb4613',
              active: true
            })

            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                personPhoto: res.data
              },
              success: (res) => {
                console.log('上传图片请求结果：')
                console.log(res)
                if (res.data.msg == 'ok') {
                  that.setData({
                    avatar: res.data.photoURL,
                    picId: res.data.picId,
                    quality: 0,
                  })
                } else {
                  that.setData({
                    progressColor: 'red',
                  })
                  wx.showToast({
                    title: '上传失败,图片须为本人清晰头像',
                    icon: 'none',
                    duration: 1500
                  })
                }
              },
              fail: (res) => {
                wx.showToast({
                  title: '网络开小差，请稍后再试',
                  icon: 'none',
                  duration: 1500
                })
              },
              complete: (res) => {
                that.setData({
                  active: false,
                })
              }
            })
          }
        })
      },
    })
  },

  progressIsOk: function () {
    console.log('ok')
  },
})