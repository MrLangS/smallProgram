// pages/dorecord/visDetail/visDetail.js
var util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    authorizeTAG: false,
    invitationId: '',//邀请id
    invitor: { name: '', company: '', phone: '' },
    vistorName: '',
    vistorPhone: '',
    reason: '',
    // starttime: '',
    // endtime: '',
    address: '',
    num: 1,
    status:1,
    callIcon: '../../resource/images/call.png',
    invPNG: '../../resource/images/invited.png',
    downPNG: '../../resource/images/down.png',
    winWidth: '',
    winHeight: '',
    registed: 0,//1代表用户已注册
    // 访客部分信息
    picId: 0,
    name: '',//姓名
    phone: '',//手机号
    visCompany: '',
    code: '',//验证码
    picManage: '添加头像',
    disabled: false,
    disAccept: false,
    iscode: '',//用于存放验证码接口里获取到的code
    avatarUrl: "../../resource/images/default.png", //默认头像图片
    logIcon: "../../resource/images/logIcon.png",
    phoneIcon: "../../resource/images/phone.png",
    pwdIcon: "../../resource/images/pwdIcon.png",
    verifiIcon: "../../resource/images/verifiIcon.png",
    companyIcon: "../../resource/images/company.png",
    imgArr: ['D:/627wx1/wx_app/pages/resource/images/default.png'],
    quality: 1,//图片质量
    codename: '获取验证码',
    isPost: 0,//判断页面是否由转发进入
    ddl: false,//判断邀请是否过期
  },
  makecall: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.invitor.phone,
    })
  },
  back: function(){
    wx.switchTab({
      url: '../../index/index',
    })
  },
  scrollDown: function () {
    wx.pageScrollTo({
      scrollTop: this.data.winHeight,
      duration: 500
    })
  },
  scrollUp: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  },
  scrBotm:function(){
    wx.pageScrollTo({
      scrollTop: 2000,
      duration: 500
    })
  },
  //接受邀请
  //已注册的接受
  accept01: function(e){
    console.log(e.detail.formId)
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认接受邀请吗？',
      success: function (res) {
        if (res.confirm){
          that.setData({
            disAccept: true
          })
          wx.request({
            url: getApp().globalData.server + '/Invitation/changeVisitorStatus.do',
            data: {
              invitationId: that.data.invitationId,
              userId: getApp().globalData.sysWXUser.id,
              formId: e.detail.formId,
              openId: getApp().globalData.realOpenid,
              status: 2
            },
            method: 'get',
            success: function (res) {
              console.log("确认邀请结果信息:")
              console.log(res.data)
              if (res.data = 'SUCCESS') {
                that.setData({
                  status: 2
                })
                wx.showToast({
                  title: '接受成功',
                  icon: 'success',
                  duration: 1500
                })
              } else if (res.data = 'confirmCountIsOverflow') {
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
        }
      }
    })
  },
  //未注册的接受   (不再使用)
  accept02: function (e) {
    var that=this
    if (util.checkForm(that)){
      wx.showModal({
        title: '提示',
        content: '确认接受邀请吗？',
        success: function (res) {
          console.log(res.confirm)
          if (res.confirm) {
            that.setData({
              disAccept: true
            })
            wx.request({
              url: getApp().globalData.server + '/Invitation/addVisitorAndRegisterUser.do',
              method: 'post',
              data: {
                wxOpenId: getApp().globalData.openid,
                username: that.data.name,
                address: that.data.visCompany,
                phonenum: that.data.phone,
                photoURL: that.data.avatarUrl,
                picId: that.data.picId,
                invitationId: that.data.invitationId,
                formId: e.detail.formId,
                openId: getApp().globalData.realOpenid,
              },
              success: function (res) {
                console.log(res)
                if (res.data.msg == 'ok') {
                  wx.setStorageSync('wxuserInfo', res.data.sysWXUser);
                  wx.setStorageSync('registed', 1)
                  that.setData({
                    status: 2
                  })
                  wx.showToast({
                    title: '接受成功',
                    icon: 'success',
                    duration: 1500
                  })
                } else if (res.data.msg = 'confirmCountIsOverflow') {
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
          }
        }
      }) 
    }
  },

  onLoad: function (options) {
    var that = this

    //获得手机屏幕信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    //初始化页面的数据
    if (typeof (options.dataset) != 'undefined') {
      
      util.inviteInfo(that, options.dataset, 0)
      that.setData({
        status: 1,
        isPost: 1
      })

      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            //登录
            util.login(that)

          } else {
            wx.navigateTo({
              url: '/pages/authorize/authorize?tag=1',
            })
          }
        }
      })

    } else {
      console.log(options.detail)
      util.inviteInfo(that, options.detail, 1)
      that.setData({
        registed: wx.getStorageSync('registed')
      })
    }

    if (util.compareTime(that)) {
      console.log("该邀请未过期")
    } else {
      console.log("该邀请已过期")
      that.setData({
        status: 4
      })
    }
    
  },

  onShow: function () {
    var that=this
    if(this.data.authorizeTAG){
      //登录
      util.login(that)
    }
  },

  onReady: function () {
    //为邀请函添加访客
    if (this.data.isPost == 1 && getApp().globalData.sysWXUser.id){
      wx.request({
        url: getApp().globalData.server + '/Invitation/addVisitor.do',
        method: 'get',
        data: {
          invitationId: this.data.invitationId,
          userId: getApp().globalData.sysWXUser.id
        },
        success: function (res) {

        }
      })
    }
  },
  /**
   * 转发
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '邀请函',
      path: 'pages/dorecord/visDetail/visDetail?dataset=' + util.tran(this,"vis"),
      imageUrl: '../../resource/images/inv.jpg',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  //添加头像
  onPicBtn: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do"
        var tempFilePaths = res.tempFilePaths
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            // console.log('data:image/png;base64,' + res.data)
            console.log(res)
            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                personPhoto: res.data
              },
              success: (res) => {
                console.log('上传图片请求结果：')
                console.log(res)
                if (res.data.quality == 0) {
                  that.setData({
                    avatarUrl: res.data.photoURL,
                    picId: res.data.picId,
                    quality: 0,
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
  },
  //自动获取微信绑定手机号，需要微信认证可使用
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedDate)
    if (e.detail.errMsg == 'getPhoneNumber:fail 该 appid 没有权限') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) { }
      })
    }
  },
  //获取input输入框的值
  getNameValue: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCompany: function (e) {
    this.setData({
      visCompany: e.detail.value
    })
  },
  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },

})